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
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Snackbar } from '@mui/material';
import React from 'react';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
import Groups, { GroupUsers } from './groupTypes';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

// nested data is ok, see accessorKeys in ColumnDef below

const UserTable = () => {
	const serviceName='groupUsers';

	const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
		props,
		ref,
	) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

	const [ alertOpen, setAlertOpen ] = React.useState(false);
	const [ alertMessage, setAlertMessage ] = React.useState('');
	const [ alertSeverity, setAlertSeverity ] = React.useState<AlertColor>('success');

	type GroupsTypes = Array<Groups>

	const [ groups, setGroups ] = useState<GroupsTypes>([ {
		id: 0,
		name: 'string',   
		description: 'string',
		tenantId: 0 
	} ]);

	const getGroupName = (id: string): string => {
		const t = groups.find((type) => type.id === parseInt(id));

		if (t && t.name) {
			return t.name;
		} else {
			return 'undefined group';
		}
	};

	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<GroupUsers>[]>(
		() => [

			{
				accessorKey: 'id',
				header: 'id'
			},
			{
				accessorKey: 'groupId',
				header: 'groupId',
				Cell: ({ cell }) => getGroupName(cell.getValue<string>())
			},
			{
				accessorKey: 'userId',
				header: 'userId'
			}
		],
		[ groups ],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ groupId, setGroupId ] = useState(0);
	const [ cantPatch, setCantPatch ] = useState(false);
	const [ cantDelete ] = useState(false);
	const [ userId, setUserId ] = useState(0);
	const [ groupIdDisabled, setGroupIdDisabled ] = useState(false);
	const [ userIdDisabled, setUserIdDisabled ] = useState(false);

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

		setGroups(g.data);

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
		setGroupId(0);
		setGroupIdDisabled(false);
		setUserId(0);
		setUserIdDisabled(false);
		setCantPatch(false);
		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		setGroupIdDisabled(false);
		setUserIdDisabled(false);
		setCantPatch(true);
		setOpen(true);
	};

	const handleGroupIdChange = (event: { target: { value: string; }; }) => {
		setGroupId(parseInt(event.target.value));
	};

	const handleUserIdChange = (event: { target: { value: string; }; }) => {
		setUserId(parseInt(event.target.value));
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
				setAlertMessage('Successfull delete!');
				setAlertSeverity('success');
				setAlertOpen(true);
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
						userId: userId
					}
				);

				// eslint-disable-next-line no-console
				console.log(log);

				fetchProduct();
				setOpen(false);
				setAlertMessage('Successfull add!');
				setAlertSeverity('success');
				setAlertOpen(true);
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
						userId: userId
					}
				);

				// eslint-disable-next-line no-console
				console.log(log);
				fetchProduct();
				setOpen(false);

				setAlertMessage('Successfull modify!');
				setAlertSeverity('success');
				setAlertOpen(true);
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
					<TextField
						autoFocus
						margin="dense"
						id="groupId"
						label="groupId"
						type="number"
						required
						fullWidth
						disabled={groupIdDisabled}
						onChange={handleGroupIdChange}
						value={groupId}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="userId"
						label="userId"
						type="number"
						required
						fullWidth
						disabled={userIdDisabled}
						onChange={handleUserIdChange}
						value={userId}
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
					const tuserId=r[2].getValue();

					if (typeof tid === 'number') {
						setId(tid);
					}
					if (typeof tgroupId === 'string') {
						setGroupId(parseInt(tgroupId));
					} else {
						setGroupId(0);
					}
					if (typeof tuserId === 'string') {
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
