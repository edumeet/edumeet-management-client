import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line camelcase
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
import BasicModal from './tenantFQDNEdit';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

type TenantFQDN = {

	id: number,
	tenantId: number,
	description: string,
	fqdn: string
};

// nested data is ok, see accessorKeys in ColumnDef below

const TenantFQDNTable = () => {

	// const { data } = props;

	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<TenantFQDN>[]>(
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
				accessorKey: 'description',
				header: 'description'
			},
			{
				accessorKey: 'fqdn',
				header: 'fqdn'
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
			const tenantFQDN = await client.service('tenantFQDNs').find();

			// eslint-disable-next-line no-console
			console.log(tenantFQDN);

			if (tenantFQDN.data.length !== 0) {
				setData(tenantFQDN.data);
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

export default TenantFQDNTable;
