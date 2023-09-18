/* 

get permissions -> create roles ->assign roles to gourps/users/rooms

in room add user to roomOwners
in tenants add user to tenantOwners

roles
permissions
gourps/users/rooms

*/

import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line camelcase
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import React from 'react';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
import { GroupRoles, Roles } from './roleTypes';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

// nested data is ok, see accessorKeys in ColumnDef below

const UserTable = () => {
	const serviceName='roomGroupRoles';

	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<GroupRoles>[]>(
		() => [
			{
				accessorKey: 'id',
				header: 'id'
			},
			{
				accessorKey: 'groupId',
				header: 'groupId'
			},
			{
				accessorKey: 'roleId',
				header: 'roleId'
			},
			{
				accessorKey: 'roomId',
				header: 'roomId'
			},
			{
				accessorKey: 'role',
				header: 'role',
				Cell: ({ cell }) =>
					(	
						cell.getValue<Roles>().name
					),
			},
		],
		[],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ groupId, setGroupId ] = useState(0);
	const [ roleId, setRoleId ] = useState(0);
	const [ roomId, setRoomId ] = useState(0);

	const [ cantPatch, setCantPatch] = useState(true);
	const [ cantDelete ] = useState(false);

	async function fetchProduct() {
		await client.reAuthenticate();
		// Find all users
		const user = await client.service(serviceName).find(
			{
				query: {
					$sort: {
						id: 1
					}
				}
			}
		);

		// eslint-disable-next-line no-console
		console.log(user);

		if (user.length !== 0) {
			setData(user);
		}
		setIsLoading(false);

	}

	useEffect(() => {
		// By moving this function inside the effect, we can clearly see the values it uses.
		setIsLoading(true);
		fetchProduct();
	}, []);

	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setId(0);
		setGroupId(0);
		setRoleId(0);
		setRoomId(0);
		setCantPatch(false);
		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		setCantPatch(true);
		setOpen(true);
	};

	const handleGroupIdChange = (event: { target: { value: string; }; }) => {
		setGroupId(parseInt(event.target.value));
	};
	const handleRoleIdChange = (event: { target: { value: string; }; }) => {
		setRoleId(parseInt(event.target.value));
	};
	const handleRoomIdChange = (event: { target: { value: string; }; }) => {
		setRoomId(parseInt(event.target.value));
	};

	const handleClose = () => {
		setOpen(false);
	};

	const delTenant = async () => {

		// add new data / mod data / error
		// eslint-disable-next-line no-alert
		if (id != 0 && confirm('Are you sure?')) {
			try {
				await client.reAuthenticate();
				const log = await client.service(serviceName).remove(
					id
				);

				// eslint-disable-next-line no-console
				console.log(log);
				fetchProduct();
				setOpen(false);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error);
				// if data already exists we cant add it TODO
			}
		}
	};

	const addTenant = async () => {

		// add new data / mod data / error
		if (id === 0) {
			try {
				await client.reAuthenticate();
				const log = await client.service(serviceName).create(
					{ 
						groupId: groupId,
						roleId: roleId,
						roomId: roomId
					}
				);

				fetchProduct();
				setOpen(false);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error);
				// if data already exists we cant add it TODO
			}
		} else if (id != 0) {
			try {
				await client.reAuthenticate();
				const log = await client.service(serviceName).patch(
					id,
					{ 
						groupId: groupId,
						roleId: roleId,
						roomId: roomId
					}
				);

				// eslint-disable-next-line no-console
				console.log(log);
				fetchProduct();
				setOpen(false);

			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error);
				// if data already exists we cant add it TODO
			}
		}

	};

	return <>
		<div>
			<Button variant="outlined" onClick={() => handleClickOpen()}>
				Add new
			</Button>
			<hr/>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add/Edit</DialogTitle>
				<DialogContent>
					<DialogContentText>
						These are the parameters that you can change.
					</DialogContentText>
					<input type="hidden" name="id" value={id} />
					<TextField
						autoFocus
						margin="dense"
						id="groupId"
						label="groupId"
						type="number"
						required
						fullWidth
						onChange={handleGroupIdChange}
						value={groupId}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="roleId"
						label="roleId"
						type="number"
						required
						fullWidth
						onChange={handleRoleIdChange}
						value={roleId}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="roomId"
						label="roomId"
						type="number"
						required
						fullWidth
						onChange={handleRoomIdChange}
						value={roomId}
					/>
					
				</DialogContent>
				<DialogActions>
					<Button onClick={delTenant} disabled={cantDelete} color='warning'>Delete</Button>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={addTenant} disabled={cantPatch}>OK</Button>
				</DialogActions>
			</Dialog>
		</div>
		<MaterialReactTable
			muiTableBodyRowProps={({ row }) => ({
				onClick: () => {

					const r = row.getAllCells();

					const tid = r[0].getValue();
					const tgroupId=r[1].getValue();
					const troleId=r[2].getValue();
					const troomId=r[3].getValue();

					if (typeof tid === 'number') {
						setId(tid);
					}
					if (typeof tgroupId === 'string') {
						setGroupId(parseInt(tgroupId));
					} else {
						setGroupId(0);
					}
					if (typeof troleId === 'string') {
						setRoleId(parseInt(troleId));
					} else {
						setRoleId(0);
					}
					if (typeof troomId === 'string') {
						setRoomId(parseInt(troomId));
					} else {
						setRoomId(0);
					}

					handleClickOpenNoreset();

				}
			})}
			columns={columns}
			data={data} // fallback to array if data is undefined
			initialState={{
				columnVisibility: {
				}
			}}
			state={{ isLoading }}
		/>
	</>;
};

export default UserTable;
