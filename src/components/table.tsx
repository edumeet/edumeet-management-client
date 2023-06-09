import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line camelcase
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../utils/edumeetConfig';

const serverApiUrl = edumeetConfig.serverApiUrl;
const socket = io(serverApiUrl);
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

export type Room = {
	id: number,
	name: string,
	description: string,
	createdAt: string,
	updatedAt: string,
	creatorId: string,
	tenantId?: number | null,
	logo: string | null,
	background: string | null,
	maxActiveVideos: number,
	locked: boolean,
	chatEnabled: boolean,
	raiseHandEnabled: boolean,
	filesharingEnabled: boolean,
	localRecordingEnabled: boolean,
	owners: []
};

// nested data is ok, see accessorKeys in ColumnDef below

interface Props {
	data: Room[];
}

const Table = (props: Props) => {

	// const { data } = props;

	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<Room>[]>(
		() => [

			{
				accessorKey: 'id',
				header: 'id'
			},
			{
				accessorKey: 'name',
				header: 'Name'
			},
			{
				accessorKey: 'description',
				header: 'Desc'
			},
			{
				accessorKey: 'createdAt',
				header: 'Created at'
			},
			{
				accessorKey: 'updatedAt',
				header: 'Updated at'
			},
			{
				accessorKey: 'creatorId',
				header: 'Creator id'
			},
			{
				accessorKey: 'tenantId',
				header: 'Tenant id'
			},
			{
				accessorKey: 'logo',
				header: 'Logo'
			},
			{
				accessorKey: 'background',
				header: 'Background'
			},
			{
				accessorKey: 'maxActiveVideos',
				header: 'Max Active Videos'
			},
			{
				accessorKey: 'locked',
				header: 'Locked'
			},
			{
				accessorKey: 'chatEnabled',
				header: 'Chat Enabled'
			},
			{
				accessorKey: 'raiseHandEnabled',
				header: 'Raise Hand Enabled'
			},
			{
				accessorKey: 'filesharingEnabled',
				header: 'Filesharing Enabled'
			},
			{
				accessorKey: 'localRecordingEnabled',
				header: 'Local Recording Enabled'
			},
			{
				accessorKey: 'owners',
				header: 'Owners'
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
			const room = await client.service('rooms').find();

			setData(room.data);
			setIsLoading(false);
	
		}
	
		fetchProduct();
	}, []);

	return <MaterialReactTable
		columns={columns}
		data={data} // fallback to array if data is undefined
		state={{ isLoading }}
	/>;
};

export default Table;
