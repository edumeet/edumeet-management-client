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
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Autocomplete, Snackbar } from '@mui/material';
import React from 'react';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
import { GroupRoles, Roles } from '../roles/roleTypes';
import { Room } from '../room/roomTypes';
import Groups from './groupTypes';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

const UserTable = () => {
	const serviceName='roomGroupRoles';
	const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
		props,
		ref,
	) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

	const [ alertOpen, setAlertOpen ] = React.useState(false);
	const [ alertMessage, setAlertMessage ] = React.useState('');
	const [ alertSeverity, setAlertSeverity ] = React.useState<AlertColor>('success');

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

	type GroupsOptionTypes = Array<Groups>

	// nested data is ok, see accessorKeys in ColumnDef below
	const [ groups, setGroups ] = useState<GroupsOptionTypes>([ {
		'id': 0,
		'name': '',   
		'description': '',
		'tenantId': 0
	}
	]);

	const getGroupsName = (id: string): string => {
		const t = groups.find((type) => type.id === parseInt(id));
	
		if (t && t.name) {
			return t.name;
		} else {
			return 'undefined role';
		}
	};

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
	const columns = useMemo<MRT_ColumnDef<GroupRoles>[]>(
		() => [
			{
				accessorKey: 'id',
				header: '#'
			},
			{
				accessorKey: 'groupId',
				header: 'Group',
				Cell: ({ cell }) => getGroupsName(cell.getValue<string>())

			},
			{
				accessorKey: 'roleId',
				header: 'Role',
				Cell: ({ cell }) => getRoleName(cell.getValue<string>())

			},
			{
				accessorKey: 'roomId',
				header: 'Room',
				Cell: ({ cell }) => getRoomName(cell.getValue<string>())

			},

			/* {
				accessorKey: 'role',
				header: 'role',
				Cell: ({ cell }) =>
					(	
						cell.getValue<Roles>().name
					),
			}, */
		],
		[ rooms, roles, groups ],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ groupId, setGroupId ] = useState(0);
	const [ roleId, setRoleId ] = useState(0);
	const [ roomId, setRoomId ] = useState(0);

	const [ groupIdOption, setGroupIdOption ] = useState<Groups | undefined>();
	const [ roleIdOption, setRoleIdOption ] = useState<Roles | undefined>();
	const [ roomIdOption, setRoomIdOption ] = useState<Room | undefined>();
	const [ groupIdOptionDisabled, setGroupIdOptionDisabled ] = useState(true);
	const [ roleIdOptionDisabled, setRoleIdOptionDisabled ] = useState(true);
	const [ roomIdOptionDisabled, setRoomIdOptionDisabled ] = useState(true);

	const [ cantPatch, setCantPatch ] = useState(true);
	const [ cantDelete ] = useState(false);

	async function fetchProduct() {
		await client.reAuthenticate();

		const g = await client.service('groups').find(
			{
				query: {
					$sort: {
						id: 1
					}
				}
			}
		);

		// eslint-disable-next-line no-console
		console.log('g');
		// eslint-disable-next-line no-console
		console.log(g);
		setGroups(g.data);

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
		setGroupIdOption(undefined);
		setRoleIdOption(undefined);
		setRoomIdOption(undefined);
		setGroupIdOptionDisabled(false);
		setRoleIdOptionDisabled(false);
		setRoomIdOptionDisabled(false);
		setCantPatch(false);
		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		setGroupIdOptionDisabled(true);
		setRoleIdOptionDisabled(true);
		setRoomIdOptionDisabled(true);
		setCantPatch(true);
		setOpen(true);
	};

	const handleGroupIdChange = (event: SyntheticEvent<Element, Event>, newValue: Groups) => {
		if (newValue) {
			setGroupId(newValue.id);
			setGroupIdOption(newValue);
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
				setAlertMessage('Successfull delete!');
				setAlertSeverity('success');
				setAlertOpen(true);
				fetchProduct();
				setOpen(false);
			} catch (error) {
				if (error instanceof Error) {
					setAlertMessage(error.toString());
					setAlertSeverity('error');
					setAlertOpen(true);
				}
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

				// eslint-disable-next-line no-console
				console.log(log);
				setAlertMessage('Successfull add!');
				setAlertSeverity('success');
				setAlertOpen(true);
				fetchProduct();
				setOpen(false);
			} catch (error) {
				if (error instanceof Error) {
					setAlertMessage(error.toString());
					setAlertSeverity('error');
					setAlertOpen(true);
				}
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
				setAlertMessage('Successfull modify!');
				setAlertSeverity('success');
				setAlertOpen(true);
				fetchProduct();
				setOpen(false);

			} catch (error) {
				if (error instanceof Error) {
					setAlertMessage(error.toString());
					setAlertSeverity('error');
					setAlertOpen(true);
				}
			}
		}

	};

	const handleAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setAlertOpen(false);
	};

	return <>
		<div>
			<Button variant="outlined" onClick={() => handleClickOpen()}>
				Add new
			</Button>
			<hr/>
			<Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
				<Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
					{alertMessage}
				</Alert>
			</Snackbar>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add/Edit</DialogTitle>
				<DialogContent>
					<DialogContentText>
						These are the parameters that you can change.
					</DialogContentText>
					<input type="hidden" name="id" value={id} />
					<Autocomplete
						options={groups}
						getOptionLabel={(option) => option.name}
						fullWidth
						disableClearable
						readOnly={groupIdOptionDisabled}
						onChange={handleGroupIdChange}
						value={groupIdOption}
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

					if (typeof tgroupId === 'string') {
						const tgroup = groups.find((x) => x.id === parseInt(tgroupId));

						if (tgroup) {
							setGroupIdOption(tgroup);
						}
						setGroupId(parseInt(tgroupId));
					} else {
						setGroupId(0);
						setGroupIdOption(undefined);
					}

					if (typeof troleId === 'string') {
						const troles = roles.find((x) => x.id === parseInt(troleId));

						if (troles) {
							setRoleIdOption(troles);
						}
						setRoleId(parseInt(troleId));
					} else {
						setRoleId(0);
						setRoleIdOption(undefined);
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
