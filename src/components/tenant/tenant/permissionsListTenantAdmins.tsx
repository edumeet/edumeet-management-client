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
import edumeetConfig from '../../../utils/edumeetConfig';
import { TenantOwners } from '../../permission_stuff/permissionTypes';
import Tenant from './tenantTypes';
import User from '../../user/userTypes';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

// nested data is ok, see accessorKeys in ColumnDef below

const UserTable = () => {
	const serviceName='tenantAdmins';

	type TenantOptionTypes = Array<Tenant>

	const [ tenants, setTenants ] = useState<TenantOptionTypes>([ { 'id': 0, 'name': '', 'description': '' } ]);

	const getTenantName = (id: string): string => {
		const t = tenants.find((type) => type.id === parseInt(id));

		if (t && t.name) {
			return t.name;
		} else {
			return 'undefined tenant';
		}
	};

	type UserTypes = Array<User>

	const [ users, setUsers ] = useState<UserTypes>([ {
		'id': 0,
		'ssoId': '',
		'tenantId': 0,
		'email': '',
		'name': '',
		'avatar': '',
		'roles': [],
		'tenantAdmin': false,
		'tenantOwner': false
	} ]);
	// nested data is ok, see accessorKeys in ColumnDef below
	const getUserEmail = (id: string): string => {
		const t = users.find((type) => type.id === parseInt(id));
	
		if (t && t.email) {
			return t.email;
		} else {
			return 'no such email';
		}
	};
	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<TenantOwners>[]>(
		() => [

			{
				accessorKey: 'id',
				header: 'id'
			},
			{
				accessorKey: 'tenantId',
				header: 'tenantId',
				Cell: ({ cell }) => getTenantName(cell.getValue<string>())

			},
			{
				accessorKey: 'userId',
				header: 'userId',
				Cell: ({ cell }) => getUserEmail(cell.getValue<string>())

			},
		],
		[ tenants, users ],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ cantPatch, setcantPatch ] = useState(false);
	
	const [ tenantId, setTenantId ] = useState(0);
	const [ userId, setUserId ] = useState(0);
	const [ tenantIdOption, setTenantIdOption ] = useState<Tenant | undefined>();
	const [ userIdOption, setUserIdOption ] = useState<User | undefined>();
	const [ tenantIdOptionDisabled, settenantIdOptionDisabled ] = useState(false);
	const [ userIdOptionDisabled, setUserIdOptionDisabled ] = useState(false);

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
		console.log(u);

		setUsers(u.data);
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

		const t = await client.service('tenants').find(
			{
				query: {
					$sort: {
						id: 1
					}
				}
			}
		);

		// eslint-disable-next-line no-console
		console.log('t');
		// eslint-disable-next-line no-console
		console.log(t);
		setTenants(t.data);
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
		setTenantId(0);
		setUserId(0);
		setTenantIdOption(undefined);
		setUserIdOption(undefined);
		settenantIdOptionDisabled(false);
		setUserIdOptionDisabled(false);
		setcantPatch(false);
		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		settenantIdOptionDisabled(true);
		setUserIdOptionDisabled(true);
		setcantPatch(true);
		setOpen(true);
	};

	const handleTenantIdChange = (event: SyntheticEvent<Element, Event>, newValue: Tenant) => {
		if (newValue) {
			setTenantId(newValue.id);
			setTenantIdOption(newValue);
		}
	};
	const handleUserIdChange = (event: SyntheticEvent<Element, Event>, newValue: User) => {
		if (newValue) {
			setUserId(newValue.id);
			setUserIdOption(newValue);
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
						tenantId: tenantId,
						userId: userId
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
		} else if (id != 0) {
			try {
				await client.reAuthenticate();
				const log = await client.service(serviceName).patch(
					id,
					{ 
						tenantId: tenantId,
						userId: userId
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
						options={tenants}
						getOptionLabel={(option) => option.name}
						fullWidth
						disableClearable
						readOnly={tenantIdOptionDisabled}
						onChange={handleTenantIdChange}
						value={tenantIdOption}
						sx={{ marginTop: '8px' }}
						renderInput={(params) => <TextField {...params} label="Tenant" />}
					/>
					{/* <TextField
						autoFocus
						margin="dense"
						id="tenantId"
						label="tenantId"
						type="number"
						required
						fullWidth
						onChange={handleTenantIdChange}
						value={tenantId}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="userId"
						label="userId"
						type="number"
						required
						fullWidth
						onChange={handleUserIdChange}
						value={userId}
					/> */}

				</DialogContent>
				<DialogActions>
					<Button onClick={delTenant} color='warning'>Delete</Button>
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
					const ttenantId=r[1].getValue();
					const tuserId=r[2].getValue();
					
					if (typeof tid === 'number') {
						setId(tid);
					}
					if (typeof ttenantId === 'string') {
						const ttenant = tenants.find((x) => x.id === parseInt(ttenantId));

						if (ttenant) {
							setTenantIdOption(ttenant);
						}
						setTenantId(parseInt(ttenantId));
					} else {
						setTenantId(0);
					}
					if (typeof tuserId === 'string') {
						const tuser = users.find((x) => x.id === parseInt(tuserId));

						if (tuser) {
							setUserIdOption(tuser);
						}
						setUserId(parseInt(tuserId));
					} else {
						setUserId(0);
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
