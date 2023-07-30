import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line camelcase
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

type User = {

	id: number,
    ssoId: string,
    tenantId: number,
    email: string,
    name: string,
    avatar: string,
    roles: [],
    tenantAdmin: boolean,
    tenantOwner: boolean
    
};

// nested data is ok, see accessorKeys in ColumnDef below

const UserTable = () => {

	// const { data } = props;

	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<User>[]>(
		() => [

			{
				accessorKey: 'id',
				header: 'id'
			},
			{
				accessorKey: 'ssoId',
				header: 'ssoId'
			},
			{
				accessorKey: 'tenantId',
				header: 'tenantId'
			},
			{
				accessorKey: 'email',
				header: 'email'
			},
			{
				accessorKey: 'name',
				header: 'name'
			},
			{
				accessorKey: 'avatar',
				header: 'avatar'
			},
			{
				accessorKey: 'roles',
				header: 'roles'
			},
			{
				accessorKey: 'tenantAdmin',
				header: 'tenantAdmin'
			},
			{
				accessorKey: 'tenantOwner',
				header: 'tenantOwner'
			},
		],
		[],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);

	useEffect(() => {
		// By moving this function inside the effect, we can clearly see the values it uses.
		setIsLoading(true);
		async function fetchProduct() {

			await client.reAuthenticate();

			// Find all users
			const user = await client.service('users').find();

			// eslint-disable-next-line no-console
			console.log(user);

			if (user.data.length !== 0) {
				setData(user.data);
			}
			setIsLoading(false);

		}

		fetchProduct();
	}, []);

	return <MaterialReactTable
		columns={columns}
		data={data} // fallback to array if data is undefined
		initialState={{
			columnVisibility: {
			}
		}}
		state={{ isLoading }}
	/>;
};

export default UserTable;
