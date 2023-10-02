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
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, FormControlLabel, Checkbox } from '@mui/material';
import React from 'react';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
import { RoomOwners } from '../permission_stuff/permissionTypes';
import { GroupRoles } from '../roles/roleTypes';
import { Room } from './roomTypes';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

// nested data is ok, see accessorKeys in ColumnDef below

const UserTable = () => {
	const serviceName='rooms';

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
				header: 'Max Active Videos',
			},
			{
				accessorKey: 'locked',
				header: 'Locked',
				Cell: ({ cell }) =>
					(cell.getValue() === true ? 'yes' : 'no'),
				filterVariant: 'checkbox'
			},
			{
				accessorKey: 'chatEnabled',
				header: 'Chat Enabled',
				Cell: ({ cell }) =>
					(cell.getValue() === true ? 'yes' : 'no'),
				filterVariant: 'checkbox'
			},
			{
				accessorKey: 'raiseHandEnabled',
				header: 'Raise Hand Enabled',
				Cell: ({ cell }) =>
					(cell.getValue() === true ? 'yes' : 'no'),
				filterVariant: 'checkbox'
			},
			{
				accessorKey: 'filesharingEnabled',
				header: 'Filesharing Enabled',
				Cell: ({ cell }) =>
					(cell.getValue() === true ? 'yes' : 'no'),
				filterVariant: 'checkbox'
			},
			{
				accessorKey: 'localRecordingEnabled',
				header: 'Local Recording Enabled',
				Cell: ({ cell }) =>
					(cell.getValue() === true ? 'yes' : 'no'),
				filterVariant: 'checkbox'
				
			},

			{
				accessorKey: 'owners',
				header: 'owners',
				Cell: ({ cell }) =>
					(	
						cell.getValue<Array<RoomOwners>>().map((single:RoomOwners) => single.userId)
							.join(', ')
					),
			},
			{
				accessorKey: 'groupRoles',
				header: 'groupRoles',
				Cell: ({ cell }) =>
					(	
						cell.getValue<Array<GroupRoles>>().map((single:GroupRoles) => single.role.description)
							.join(', ')
					),
			},
			
		],
		[],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ name, setName ] = useState('');
	const [ nameDisabled, setNameDisabled ] = useState(false);
	const [ description, setDescription ] = useState('');
	const [ tenantId, setTenantId ] = useState(0);
	const [ logo, setLogo ] = useState('');
	const [ background, setBackground ] = useState('');
	const [ maxActiveVideos, setMaxActiveVideos ] = useState(0);
	const [ locked, setLocked ] = useState(false);
	const [ chatEnabled, setChatEnabled ] = useState(false);
	const [ raiseHandEnabled, setRaiseHandEnabled ] = useState(false);
	const [ filesharingEnabled, setFilesharingEnabled ] = useState(false);
	const [ localRecordingEnabled, setLocalRecordingEnabled ] = useState(false);
	
	const [ cantPatch ] = useState(false);
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
		setNameDisabled(false);
		setName('');
		setDescription('');
		setTenantId(0);
		setLogo('');
		setBackground('');
		setMaxActiveVideos(0);
		setLocked(true);
		setChatEnabled(true);
		setRaiseHandEnabled(true);
		setFilesharingEnabled(true);
		setLocalRecordingEnabled(true);

		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		setNameDisabled(true);
		setOpen(true);
	};

	const handleNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setName(event.target.value);
	};
	const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setDescription(event.target.value);
	};
	const handleTenantIdChange = (event: { target: { value: string; }; }) => {
		setTenantId(parseInt(event.target.value));
	};

	const handleLogoChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setLogo(event.target.value);
	};
	const handleBackgroundChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setBackground(event.target.value);
	};
	const handleMaxActiveVideosChange = (event: { target: { value: string; }; }) => {
		setMaxActiveVideos(parseInt(event.target.value));
	};
	const handleLockedChange = (event: { target: { checked: React.SetStateAction<boolean>; }; }) => {
		setLocked(event.target.checked);
	};
	const handleChatEnabledChange = (event: { target: { checked: React.SetStateAction<boolean>; }; }) => {
		setChatEnabled(event.target.checked);
	};
	const handleRaiseHandEnabledChange = (event: { target: { checked: React.SetStateAction<boolean>; }; }) => {
		setRaiseHandEnabled(event.target.checked);
	};
	const handleFilesharingEnabledChange = (event: { target: { checked: React.SetStateAction<boolean>; }; }) => {
		setFilesharingEnabled(event.target.checked);
	};
	const handleLocalRecordingEnabledChange = (event: { target: { checked: React.SetStateAction<boolean>; }; }) => {
		setLocalRecordingEnabled(event.target.checked);
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
				const user = await client.reAuthenticate();
				const log = await client.service(serviceName).create(
					{ 
						name: name,
						description: description,
						logo: logo,
						background: background,
						maxActiveVideos: maxActiveVideos,
						locked: locked,
						chatEnabled: chatEnabled,
						raiseHandEnabled: raiseHandEnabled,
						filesharingEnabled: filesharingEnabled,
						localRecordingEnabled: localRecordingEnabled,

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
						description: description,
						logo: logo,
						background: background,
						maxActiveVideos: maxActiveVideos,
						locked: locked,
						chatEnabled: chatEnabled,
						raiseHandEnabled: raiseHandEnabled,
						filesharingEnabled: filesharingEnabled,
						localRecordingEnabled: localRecordingEnabled,

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
						id="name"
						label="name"
						type="text"
						required
						fullWidth
						onChange={handleNameChange}
						value={name}
						disabled={nameDisabled}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="description"
						label="description"
						type="text"
						required
						fullWidth
						onChange={handleDescriptionChange}
						value={description}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="tenantId"
						label="tenantId"
						type="number"
						disabled
						required
						fullWidth
						onChange={handleTenantIdChange}
						value={tenantId}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="logo"
						label="logo"
						type="text"
						required
						fullWidth
						onChange={handleLogoChange}
						value={logo}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="background"
						label="background"
						type="text"
						required
						fullWidth
						onChange={handleBackgroundChange}
						value={background}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="maxActiveVideos"
						label="maxActiveVideos"
						type="number"
						required
						fullWidth
						onChange={handleMaxActiveVideosChange}
						value={maxActiveVideos}
					/>
					<FormControlLabel control={<Checkbox checked={locked} onChange={handleLockedChange} />} label="locked" />
					<FormControlLabel control={<Checkbox checked={chatEnabled} onChange={handleChatEnabledChange} />} label="chatEnabled" />
					<FormControlLabel control={<Checkbox checked={raiseHandEnabled} onChange={handleRaiseHandEnabledChange} />} label="raiseHandEnabled" />
					<FormControlLabel control={<Checkbox checked={filesharingEnabled} onChange={handleFilesharingEnabledChange} />} label="filesharingEnabled" />
					<FormControlLabel control={<Checkbox checked={localRecordingEnabled} onChange={handleLocalRecordingEnabledChange} />} label="localRecordingEnabled" />
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
					const tname=r[1].getValue();
					const tdescription=r[2].getValue();
					const ttenantId=r[6].getValue();
					const tlogo=r[7].getValue();
					const tbackground=r[8].getValue();
					const tmaxActiveVideos=r[9].getValue();
					const tlocked=r[10].getValue();
					const tchatEnabled=r[11].getValue();
					const traiseHandEnabled=r[12].getValue();
					const tfilesharingEnabled=r[13].getValue();
					const tlocalRecordingEnabled=r[14].getValue();

					if (typeof tid === 'number') {
						setId(tid);
					}
					if (typeof tname === 'string') {
						setName(tname);
					} else {
						setName('');
					}
					if (typeof tdescription === 'string') {
						setDescription(tdescription);
					} else {
						setDescription('');
					}
					if (typeof ttenantId === 'string') {
						setTenantId(parseInt(ttenantId));
					} else {
						setTenantId(0);
					}

					if (typeof tlogo === 'string') {
						setLogo(tlogo);
					} else {
						setLogo('');
					}
					if (typeof tbackground === 'string') {
						setBackground(tbackground);
					} else {
						setBackground('');
					}
					if (typeof tmaxActiveVideos === 'number') {
						setMaxActiveVideos(tmaxActiveVideos);
					} else {
						setMaxActiveVideos(0);
					}

					if (tlocked === true) {
						setLocked(true);
					} else {
						setLocked(false);
					}
					if (tchatEnabled === true) {
						setChatEnabled(true);
					} else {
						setChatEnabled(false);
					}
					if (traiseHandEnabled === true) {
						setRaiseHandEnabled(true);
					} else {
						setRaiseHandEnabled(false);
					}
					if (tfilesharingEnabled === true) {
						setFilesharingEnabled(true);
					} else {
						setFilesharingEnabled(false);
					}
					if (tlocalRecordingEnabled === true) {
						setLocalRecordingEnabled(true);
					} else {
						setLocalRecordingEnabled(false);
					}

					handleClickOpenNoreset();

				}
			})}
			columns={columns}
			data={data} // fallback to array if data is undefined
			initialState={{
				columnVisibility: {
					updatedAt: false,
					creatorId: false,
					// tenantId: false,
					logo: false,
					background: false,
					maxActiveVideos: false,
					locked: false,
					chatEnabled: false,
					raiseHandEnabled: false,
					filesharingEnabled: false,
					localRecordingEnabled: false,
				}
			}}
			state={{ isLoading }}
		/>
	</>;
};

export default UserTable;
