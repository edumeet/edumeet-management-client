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

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
import { RolePermissions, Permissions } from './permissionTypes';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

// nested data is ok, see accessorKeys in ColumnDef below

const UserTable = () => {
	const serviceName='rolePermissions';

	const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
		props,
		ref,
	) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

	const [ alertOpen, setAlertOpen ] = React.useState(false);
	const [ alertMessage, setAlertMessage ] = React.useState('');
	const [ alertSeverity, setAlertSeverity ] = React.useState<AlertColor>('success');

	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<RolePermissions>[]>(
		() => [

			{
				accessorKey: 'id',
				header: 'id'
			},
			{
				accessorKey: 'permission',
				header: 'permission',
				Cell: ({ cell }) =>
					(	
						cell.getValue<Permissions>()['name']
					)
			},
			{
				accessorKey: 'permissionId',
				header: 'permissionId'
			},
			{
				accessorKey: 'roleId',
				header: 'roleId'
			},

		],
		[],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ permissionId, setPermissionId ] = useState(0);
	const [ roleId, setRoleId ] = useState(0);
	const [ cantPatch, setCantPatch ] = useState(true);
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
		setPermissionId(0);
		setRoleId(0);
		setCantPatch(false);
		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		setCantPatch(true);
		setOpen(true);
	};

	const handlePermissionIdChange = (event: { target: { value: string; }; }) => {
		setPermissionId(parseInt(event.target.value));
	};
	const handleRoleIdChange = (event: { target: { value: string; }}) => {
		setRoleId(parseInt(event.target.value));
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
						roleId: roleId,
						permissionId: permissionId
					}
				);

				// eslint-disable-next-line no-console
				console.log(log);

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
						roleId: roleId,
						permissionId: permissionId
					}
				);

				// eslint-disable-next-line no-console
				console.log(log);
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
					<TextField
						autoFocus
						margin="dense"
						id="permissionId"
						label="permissionId"
						type="number"
						required
						fullWidth
						onChange={handlePermissionIdChange}
						value={permissionId}
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
					const tpermissionId=r[2].getValue();
					const troleId=r[3].getValue();
					
					if (typeof tid === 'number') {
						setId(tid);
					}
					if (typeof tpermissionId === 'string') {
						setPermissionId(parseInt(tpermissionId));
					} else {
						setPermissionId(0);
					}
					if (typeof troleId === 'string') {
						setRoleId(parseInt(troleId));
					} else {
						setRoleId(0);
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
