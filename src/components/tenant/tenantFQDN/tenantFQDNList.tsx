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
import TenantFQDN from './tenantFQDNTypes';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

// nested data is ok, see accessorKeys in ColumnDef below

const TenantTable = () => {

	const serviceName='tenantFQDNs';

	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<TenantFQDN>[]>(
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
				accessorKey: 'description',
				header: 'description'
			},
			{
				accessorKey: 'fqdn',
				header: 'fqdn'
			},
			
		],
		[],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ tenantId, setTenantId ] = useState(0);
	const [ tenantIdHidden, setTenantIdHidden ] = useState(false);

	const [ fqdn, setFQDN ] = useState('');

	const [ description, setDescription ] = useState('');

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
		setTenantIdHidden(true);
		setDescription('');
		setFQDN('');
		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		setOpen(true);
	};

	const handleTenantIdChange = (event: { target: { value: string; }; }) => {
		setTenantId(parseInt(event.target.value));
	};
	const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setDescription(event.target.value);
	};
	const handleFQDNChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setFQDN(event.target.value);
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
					{ tenantId: tenantId, description: description, fqdn: fqdn }
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
				// eslint-disable-next-line no-console
				console.log(id,
					{ tenantId: tenantId, description: description, fqdn: fqdn });
				const log = await client.service(serviceName).patch(
					id,
					{ tenantId: tenantId, description: description, fqdn: fqdn }
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
						id="description"
						label="description"
						type="text"
						fullWidth
						onChange={handleDescriptionChange}
						value={description}
					/>
					<TextField
						margin="dense"
						id="fqdn"
						label="fqdn"
						type="text"
						fullWidth
						onChange={handleFQDNChange}
						value={fqdn}
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
					const ttenantId = r[1].getValue();
					const tdescription = r[2].getValue();
					const tfqdn = r[3].getValue();

					if (typeof tid === 'number') {
						setId(tid);
					}
					setTenantIdHidden(false);

					if (typeof ttenantId === 'string') {
						setTenantId(parseInt(ttenantId));
					}

					if (typeof tdescription === 'string') {
						setDescription(tdescription);
					} else {
						setDescription('');
					}
					if (typeof tfqdn === 'string') {
						setFQDN(tfqdn);
					} else {
						setFQDN('');
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
