import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line camelcase
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
import User from './userTypes';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

// nested data is ok, see accessorKeys in ColumnDef below

const UserTable = () => {
	const serviceName='users';

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
				header: 'tenantAdmin',
				filterVariant: 'checkbox',
				Cell: ({ cell }) =>
					(cell.getValue() === true ? 'yes' : 'no'),
                
			},
			{
				accessorKey: 'tenantOwner',
				Cell: ({ cell }) =>
					(cell.getValue() === true ? 'yes' : 'no'),
				header: 'tenantOwner',
				filterVariant: 'checkbox'
			},
		],
		[],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ ssoId, setSsoId ] = useState('');
	const [ tenantId, setTenantId ] = useState(0);
	const [ email, setEmail ] = useState('');
	const [ name, setName ] = useState('');
	const [ avatar, setAvatar ] = useState('');
	const [ tenantAdmin, setTenantAdmin ] = useState(false);
	const [ tenantOwner, setTenantOwner ] = useState(false);

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
		setName('');
		setSsoId('');
		setTenantId(0);
		setEmail('');
		setName('');
		setAvatar('');
		setTenantAdmin(false);
		setTenantOwner(false);
		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		setOpen(true);
	};
	const handleSsoIdChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setSsoId(event.target.value);
	};
	const handleTenantIdChange = (event: { target: { value: string; }; }) => {
		setTenantId(parseInt(event.target.value));
	};
	const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setEmail(event.target.value);
	};
	const handleNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setName(event.target.value);
	};
	const handleAvatarChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setAvatar(event.target.value);
	};
	const handleTenantAdminChange = (event: { target: { checked: React.SetStateAction<boolean>; }; }) => {
		setTenantAdmin(event.target.checked);
	};
	const handleTenantOwnerChange = (event: { target: { checked: React.SetStateAction<boolean>; }; }) => {
		setTenantOwner(event.target.checked);
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
		if (name != '' && id === 0) {
			try {
				await client.reAuthenticate();
				const log = await client.service(serviceName).create(
					{ 
						ssoId: ssoId,
						tenantId: tenantId,
						email: email,
						name: name,
						avatar: avatar
					}
				);

				fetchProduct();
				setOpen(false);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error);
				// if data already exists we cant add it TODO
			}
		} else if (name != '' && id != 0) {
			try {
				await client.reAuthenticate();
				const log = await client.service(serviceName).patch(
					id,
					{ 
						ssoId: ssoId,
						tenantId: tenantId,
						email: email,
						name: name,
						avatar: avatar
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
						id="ssoId"
						label="ssoId"
						type="text"
						required
						fullWidth
						onChange={handleSsoIdChange}
						value={ssoId}
					/>
					<TextField
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
						id="email"
						label="Email"
						type="email"
						required
						fullWidth
						onChange={handleEmailChange}
						value={email}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Name"
						type="text"
						required
						fullWidth
						onChange={handleNameChange}
						value={name}
					/>
					<TextField
						margin="dense"
						id="avatar"
						label="avatar"
						type="text"
						fullWidth
						onChange={handleAvatarChange}
						value={avatar}
					/>
					{/* roles */}
					<FormControlLabel control={<Checkbox disabled checked={tenantAdmin} onChange={handleTenantAdminChange} />} label="tenantAdmin" />
					<FormControlLabel control={<Checkbox disabled checked={tenantOwner} onChange={handleTenantOwnerChange} />} label="tenantOwner" />

				</DialogContent>
				<DialogActions>
					<Button onClick={delTenant} color='warning'>Delete</Button>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={addTenant}>OK</Button>
				</DialogActions>
			</Dialog>
		</div>
		<MaterialReactTable
			muiTableBodyRowProps={({ row }) => ({
				onClick: () => {

					const r = row.getAllCells();

					const tid = r[0].getValue();
					const tssoId=r[1].getValue();
					const ttenantId=r[2].getValue();
					const temail=r[3].getValue();
					const tname=r[4].getValue();
					const tavatar=r[5].getValue();
					// const troles=r[6].getValue();
					const ttenantAdmin=r[7].getValue();
					const ttenantOwner=r[8].getValue();
	
					if (typeof tid === 'number') {
						setId(tid);
					}
					if (typeof tssoId === 'string') {
						setSsoId(ssoId);
					} else {
						setSsoId('');
					}
					if (typeof ttenantId === 'string') {
						setTenantId(parseInt(ttenantId));
					} else {
						setTenantId(0);
					}
					if (typeof temail === 'string') {
						setEmail(temail);
					} else {
						setEmail('');
					}
					if (typeof tname === 'string') {
						setName(tname);
					} else {
						setName('');
					}
					if (typeof tavatar === 'string') {
						setAvatar(tavatar);
					} else {
						setAvatar('');
					}
					// todo roles
					/* if (ttenantAdmin === true) {
						setTenantAdmin(true);
					} else {
						setTenantAdmin(false);
					}
					if (ttenantOwner === true) {
						setTenantOwner(true);
					} else {
						setTenantOwner(false);
					} */

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
