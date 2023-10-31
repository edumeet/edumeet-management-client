/* 

get permissions -> create roles ->assign roles to gourps/users/rooms

in room add user to roomOwners
in tenants add user to tenantOwners

roles
permissions
gourps/users/rooms

*/

import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line camelcase
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Autocomplete } from '@mui/material';
import React from 'react';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
import { UsersRoles, Roles } from './roleTypes';
import User from '../user/userTypes';
import { Room } from '../room/roomTypes';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

// nested data is ok, see accessorKeys in ColumnDef below

const UserTable = () => {
	const serviceName='roomUserRoles';

	type RoomOptionTypes = Array<Room>

	// nested data is ok, see accessorKeys in ColumnDef below
	const [ rooms, setRooms ] = useState<RoomOptionTypes>([ {
		'id': 1,
		'name': '',
		'description': '',
		'createdAt': '',
		'updatedAt': '',
		'creatorId': '',
		'defaultRoleId': '',
		'tenantId': 1,
		'logo': null,
		'background': null,
		'maxActiveVideos': 0,
		'locked': true,
		'chatEnabled': true,
		'raiseHandEnabled': true,
		'filesharingEnabled': true,
		'groupRoles': [],
		'localRecordingEnabled': true,
		'owners': [],
		'breakoutsEnabled': true,
	}
	]);
	
	type RolesOptionTypes = Array<Roles>

	// nested data is ok, see accessorKeys in ColumnDef below
	const [ roles, setRoles ] = useState<RolesOptionTypes>([ {
		'id': 0,
		'name': '',   
		'description': '',
		'tenantId': 0,
		'permissions': []
	}
	]);

	const getRoleName = (id: string): string => {
		const t = roles.find((type) => type.id === parseInt(id));
	
		if (t && t.name) {
			return t.name;
		} else {
			return 'undefined role';
		}
	};

	type UsersOptionTypes = Array<User>

	// nested data is ok, see accessorKeys in ColumnDef below
	const [ users, setUsers ] = useState<UsersOptionTypes>([ {
		'id': 0,
		'ssoId': '',
		'tenantId': 0,
		'email': '',
		'name': '',
		'avatar': '',
		'roles': [],
		'tenantAdmin': false,
		'tenantOwner': false
	}
	]);

	const getUserName = (id: string): string => {
		const t = users.find((type) => type.id === parseInt(id));
	
		if (t && t.email) {
			return t.email;
		} else {
			return 'undefined user';
		}
	};

	// nested data is ok, see accessorKeys in ColumnDef below
	
	const getRoomName = (id: string): string => {
		const t = rooms.find((type) => type.id === parseInt(id));
	
		if (t && t.name) {
			return t.name;
		} else {
			return 'undefined room';
		}
	};

	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<UsersRoles>[]>(
		() => [
			{
				accessorKey: 'id',
				header: 'id'
			},
			{
				accessorKey: 'userId',
				header: 'userId',
				Cell: ({ cell }) => getUserName(cell.getValue<string>())

			},
			{
				accessorKey: 'roleId',
				header: 'roleId',
				Cell: ({ cell }) => getRoleName(cell.getValue<string>())

			},
			{
				accessorKey: 'roomId',
				header: 'roomId',
				Cell: ({ cell }) => getRoomName(cell.getValue<string>())

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
		[ rooms, roles, users ],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ userId, setUserId ] = useState(0);
	const [ roleId, setRoleId ] = useState(0);
	const [ roomId, setRoomId ] = useState(0);

	const [ cantPatch, setCantPatch ] = useState(true);
	const [ cantDelete ] = useState(false);
	const [ userIdOption, setUserIdOption ] = useState<User | undefined>();
	const [ roleIdOption, setRoleIdOption ] = useState<Roles | undefined>();
	const [ roomIdOption, setRoomIdOption ] = useState<Room | undefined>();
	const [ userIdOptionDisabled, setUserIdOptionDisabled ] = useState(true);
	const [ roleIdOptionDisabled, setRoleIdOptionDisabled ] = useState(true);
	const [ roomIdOptionDisabled, setRoomIdOptionDisabled ] = useState(true);

	async function fetchProduct() {
		await client.reAuthenticate();
		
		const u = await client.service('users').find(
			{
				query: {
					$sort: {
						id: 1
					}
				}
			}
		);

		// eslint-disable-next-line no-console
		console.log('u');
		// eslint-disable-next-line no-console
		console.log(u);
		setUsers(u.data);
		
		const r = await client.service('rooms').find(
			{
				query: {
					$sort: {
						id: 1
					}
				}
			}
		);

		// eslint-disable-next-line no-console
		console.log('r');
		// eslint-disable-next-line no-console
		console.log(r);
		setRooms(r.data);
		const ro = await client.service('roles').find(
			{
				query: {
					$sort: {
						id: 1
					}
				}
			}
		);

		// eslint-disable-next-line no-console
		console.log('ro');
		// eslint-disable-next-line no-console
		console.log(ro);
		setRoles(ro.data);
		
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

		if (user.data.length !== 0) {
			setData(user.data);
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
		setUserId(0);
		setRoleId(0);
		setRoomId(0);
		setUserIdOption(undefined);
		setRoleIdOption(undefined);
		setRoomIdOption(undefined);
		setUserIdOptionDisabled(false);
		setRoleIdOptionDisabled(false);
		setRoomIdOptionDisabled(false);
		setCantPatch(false);
		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		setCantPatch(true);
		setUserIdOptionDisabled(true);
		setRoleIdOptionDisabled(true);
		setRoomIdOptionDisabled(true);
		setOpen(true);
	};

	const handleUserIdChange = (event: SyntheticEvent<Element, Event>, newValue: User) => {
		if (newValue) {
			setUserId(newValue.id);
			setUserIdOption(newValue);
		}
	};
	const handleRoleIdChange = (event: SyntheticEvent<Element, Event>, newValue: Roles) => {
		if (newValue) {
			setRoleId(newValue.id);
			setRoleIdOption(newValue);
		}
	};
	const handleRoomIdChange = (event: SyntheticEvent<Element, Event>, newValue: Room) => {
		if (newValue) {
			setRoomId(newValue.id);
			setRoomIdOption(newValue);
		}
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
						userId: userId,
						roleId: roleId,
						roomId: roomId
					}
				);

				fetchProduct();
				setOpen(false);
				// eslint-disable-next-line no-console
				console.log(log);

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
						userId: userId,
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
					<Autocomplete
						options={users}
						getOptionLabel={(option) => option.email}
						fullWidth
						disableClearable
						readOnly={userIdOptionDisabled}
						onChange={handleUserIdChange}
						value={userIdOption}
						sx={{ marginTop: '8px' }}
						renderInput={(params) => <TextField {...params} label="User" />}
					/>
					<Autocomplete
						options={roles}
						getOptionLabel={(option) => option.name}
						fullWidth
						disableClearable
						readOnly={roleIdOptionDisabled}
						onChange={handleRoleIdChange}
						value={roleIdOption}
						sx={{ marginTop: '8px' }}
						renderInput={(params) => <TextField {...params} label="Role" />}
					/>
					<Autocomplete
						options={rooms}
						getOptionLabel={(option) => option.name}
						fullWidth
						disableClearable
						readOnly={roomIdOptionDisabled}
						onChange={handleRoomIdChange}
						value={roomIdOption}
						sx={{ marginTop: '8px' }}
						renderInput={(params) => <TextField {...params} label="Room" />}
					/>
					{/* <TextField
						autoFocus
						margin="dense"
						id="userId"
						label="userId"
						type="number"
						required
						fullWidth
						onChange={handleUserIdChange}
						value={userId}
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
					/> */}
					
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
					const tuserId=r[1].getValue();
					const troleId=r[2].getValue();
					const troomId=r[3].getValue();

					if (typeof tid === 'number') {
						setId(tid);
					}
					if (typeof tuserId === 'string') {
						const tuser = users.find((x) => x.id === parseInt(tuserId));

						if (tuser) {
							setUserIdOption(tuser);
						}
						setUserId(parseInt(tuserId));
					} else {
						setUserId(0);
						setUserIdOption(undefined);
					}
					
					if (typeof troleId === 'string') {
						const troles = roles.find((x) => x.id === parseInt(troleId));

						if (troles) {
							setRoleIdOption(troles);
						}
						setRoleId(parseInt(troleId));
					} else {
						setUserId(0);
						setUserIdOption(undefined);
					}
					if (typeof troomId === 'string') {
						const troom = rooms.find((x) => x.id === parseInt(troomId));

						if (troom) {
							setRoomIdOption(troom);
						}
						setRoomId(parseInt(troomId));
					} else {
						setRoomId(0);
						setRoomIdOption(undefined);
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
