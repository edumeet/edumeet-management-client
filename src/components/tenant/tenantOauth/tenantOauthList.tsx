import { useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line camelcase
import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../../utils/edumeetConfig';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import React from 'react';
import TenantOAuth from './tenantOauthTypes';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

// nested data is ok, see accessorKeys in ColumnDef below

const TenantTable = () => {

	const serviceName='tenantOAuths';

	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<TenantOAuth>[]>(
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
				accessorKey: 'access_url',
				header: 'access_url'
			},
			{
				accessorKey: 'authorize_url',
				header: 'authorize_url'
			},
			{
				accessorKey: 'profile_url',
				header: 'profile_url'
			},
			{
				accessorKey: 'redirect_uri',
				header: 'redirect_uri'
			},
			{
				accessorKey: 'scope',
				header: 'scope'
			},
			{
				accessorKey: 'scope_delimiter',
				header: 'scope_delimiter'
			},
			
		],
		[],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ tenantId, setTenantId ] = useState(0);
	const [ profileUrl, setProfileUrl ] = useState('');
	const [ key, setKey ] = useState('');
	const [ secret, setSecret ] = useState('');
	const [ authorizeUrl, setAuthorizeUrl ] = useState('');
	const [ accessUrl, setAccessUrl ] = useState('');
	const [ scope, setScope ] = useState('');
	const [ scopeDelimeter, setScopeDelimeter ] = useState('');
	const [ redirect, setRedirect ] = useState('');

	async function fetchProduct() {
		setIsLoading(true);

		await client.reAuthenticate();

		// Find all users
		const tenant = await client.service(serviceName).find(
			{
				query: {
					$sort: {
						id: 1
					}
				}
			}
		);

		// eslint-disable-next-line no-console
		console.log(tenant);
		if (tenant.data.length !== 0) {
			setData(tenant.data);
		}
		setIsLoading(false);

	}

	useEffect(() => {
		fetchProduct();
	}, []);

	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setId(0);
		setTenantId(0);
		setProfileUrl('');
		setKey('');
		setSecret('');
		setAuthorizeUrl('');
		setAccessUrl('');
		setScope('');
		setScopeDelimeter('');
		setRedirect('');
		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		setOpen(true);
	};

	const handleTenantIdChange = (event: { target: { value: string; }; }) => {
		setTenantId(parseInt(event.target.value));
	};

	const handleProfileUrlChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setProfileUrl(event.target.value);
	};

	const handleKeyChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setKey(event.target.value);
	};

	const handleSecretChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setSecret(event.target.value);
	};

	const handleAuthorizeUrlChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setAuthorizeUrl(event.target.value);
	};

	const handleAccessUrlChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setAccessUrl(event.target.value);
	};

	const handleScopeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setScope(event.target.value);
	};

	const handleScopeDelimeterChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setScopeDelimeter(event.target.value);
	};

	const handleRedirectChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setRedirect(event.target.value);
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
						'key': key,
						'secret': secret,
						'tenantId': tenantId,
						'access_url': accessUrl,
						'authorize_url': authorizeUrl,
						'profile_url': profileUrl,
						'redirect_uri': redirect,
						'scope': scope,
						'scope_delimiter': scopeDelimeter
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
						'tenantId': tenantId,
						'access_url': accessUrl,
						'authorize_url': authorizeUrl,
						'profile_url': profileUrl,
						'redirect_uri': redirect,
						'scope': scope,
						'scope_delimiter': scopeDelimeter }
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

						/* 						style={tenantIdHidden ? { display: 'none' } : {}} */
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
						margin="dense"
						required
						id="key"
						label="key"
						type="text"
						fullWidth
						value={key}
						onChange={handleKeyChange}
					/>
					<TextField
						required
						margin="dense"

						id="secret"
						label="secret"
						type="text"
						fullWidth
						value={secret}
						onChange={handleSecretChange}
					/>
					<TextField
						required
						margin="dense"
						id="access_url"
						label="access_url"
						type="text"
						fullWidth
						value={accessUrl}
						onChange={handleAccessUrlChange}
					/>
					<TextField
						required
						margin="dense"

						id="authorize_url"
						label="authorize_url"
						type="text"
						fullWidth
						value={authorizeUrl}
						onChange={handleAuthorizeUrlChange}
					/>
					<TextField
						margin="dense"
						id="profile_url"
						label="profile_url"
						type="text"
						fullWidth
						onChange={handleProfileUrlChange}
						value={profileUrl}
					/>
					<TextField
						required
						margin="dense"

						id="scope"
						label="scope"
						type="text"
						fullWidth
						value={scope}
						onChange={handleScopeChange}
					/>
					<TextField
						margin="dense"
						required

						id="scope_delimiter"
						label="scope_delimiter"
						type="text"
						fullWidth
						value={scopeDelimeter}
						onChange={handleScopeDelimeterChange}
					/>
					<TextField
						required
						margin="dense"
						id="redirect_url"
						label="redirect_url"
						type="text"
						fullWidth
						value={redirect}
						onChange={handleRedirectChange}
					/>
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
					const ttenantId= r[1].getValue();
					const taccess= r[2].getValue();
					const tauthorize= r[3].getValue();
					const tprofile= r[4].getValue();
					const tredirect= r[5].getValue();
					const tscope= r[6].getValue();
					const tscopeDelimiter= r[7].getValue();

					if (typeof tid === 'number') {
						setId(tid);
					}
					if (typeof ttenantId === 'string') { setTenantId(parseInt(ttenantId)); } else {
						setTenantId(0);
					}
					if (typeof tprofile === 'string') { setProfileUrl(tprofile); } else {
						setProfileUrl('');
					}
					if (typeof tauthorize === 'string') { setAuthorizeUrl(tauthorize); } else {
						setAuthorizeUrl('');
					}
					if (typeof taccess === 'string') { setAccessUrl(taccess); } else {
						setAccessUrl('');
					}
					if (typeof tscope === 'string') { setScope(tscope); } else {
						setScope('');
					}
					if (typeof tscopeDelimiter === 'string') { setScopeDelimeter(tscopeDelimiter); } else {
						setScopeDelimeter('');
					}
					if (typeof tredirect === 'string') { setRedirect(tredirect); } else {
						setRedirect('');
					}

					handleClickOpenNoreset();

				}
			})}
			columns={columns}
			data={data} // fallback to array if data is undefined
			initialState={{
				columnVisibility: {}
			}}
			state={{ isLoading }} /></>;
};

export default TenantTable;
