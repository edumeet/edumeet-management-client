import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line camelcase
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
import BasicModal from './tenantOAuthEdit';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

type TenantOAuth = {

	id: number,
	tenantId: number,
	access_url: string,
	authorize_url: string,
	profile_url: string,
	redirect_uri: string,
	scope: string,
	scope_delimiter: string,
};

// nested data is ok, see accessorKeys in ColumnDef below

const TenantOAuthTable = () => {

	// const { data } = props;

	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<TenantOAuth>[]>(
		() => [

			{
				accessorKey: 'id',
				header: 'id'
			},
			{
				accessorKey: 'tenantId',
				header: 'tenantId'
			},
			{
				accessorKey: 'access_url',
				header: 'access_url'
			},
			{
				accessorKey: 'authorize_url',
				header: 'authorize_url'
			},
			{
				accessorKey: 'profile_url',
				header: 'profile_url'
			},
			{
				accessorKey: 'redirect_uri',
				header: 'redirect_uri'
			},
			{
				accessorKey: 'scope',
				header: 'scope'
			},
			{
				accessorKey: 'scope_delimiter',
				header: 'scope_delimiter'
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
			const tenantOAuth = await client.service('tenantOAuths').find();

			// eslint-disable-next-line no-console
			console.log(tenantOAuth);

			if (tenantOAuth.data.length !== 0) {
				setData(tenantOAuth.data);
			}
			setIsLoading(false);

		}

		fetchProduct();
	}, []);

	return <><BasicModal /><MaterialReactTable
		columns={columns}
		data={data} // fallback to array if data is undefined
		initialState={{
			columnVisibility: {
			}
		}}
		state={{ isLoading }}
	/></>;
};

export default TenantOAuthTable;
