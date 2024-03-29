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
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Autocomplete, Snackbar, FormControlLabel, Checkbox, Box } from '@mui/material';
import React from 'react';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
import { Permissions, RolePermissions } from '../permission_stuff/permissionTypes';
import { Roles } from './roleTypes';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import Tenant from '../tenant/tenant/tenantTypes';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

// nested data is ok, see accessorKeys in ColumnDef below

const UserTable = () => {
	const serviceName = 'roles';

	const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
		props,
		ref,
	) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

	type TenantOptionTypes = Array<Tenant>

	const [ tenants, setTenants ] = useState<TenantOptionTypes>([ { 'id': 0, 'name': '', 'description': '' } ]);

	const [ alertOpen, setAlertOpen ] = React.useState(false);
	const [ alertMessage, setAlertMessage ] = React.useState('');
	const [ alertSeverity, setAlertSeverity ] = React.useState<AlertColor>('success');

	const getTenantName = (id: string): string => {
		const t = tenants.find((type) => type.id === parseInt(id));

		if (t && t.name) {
			return t.name;
		} else {
			return 'undefined tenant';
		}
	};
	// should be memoized or stable
	// eslint-disable-next-line camelcase
	const columns = useMemo<MRT_ColumnDef<Roles>[]>(
		() => [

			{
				accessorKey: 'id',
				header: '#'
			},
			{
				accessorKey: 'name',
				header: 'Name'
			},
			{
				accessorKey: 'description',
				header: 'description'
			},
			{
				accessorKey: 'tenantId',
				header: 'Tenant',
				Cell: ({ cell }) => getTenantName(cell.getValue<string>())

			},
			{
				accessorKey: 'permissions',
				header: 'Permission(s)',
				Cell: ({ cell }) =>
					(
						cell.getValue<Array<Permissions>>().map((single: Permissions) => single.name)
							.join(', ')
					),
			},

		],
		[ tenants ],
	);

	const [ data, setData ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ id, setId ] = useState(0);
	const [ name, setName ] = useState('');
	const [ description, setDescription ] = useState('');
	const [ tenantId, setTenantId ] = useState(0);

	const [ cantPatch ] = useState(false);
	const [ cantDelete ] = useState(false);
	const [ tenantIdOption, setTenantIdOption ] = useState<Tenant | undefined>();

	async function fetchProduct() {
		await client.reAuthenticate();

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

		async function getPermissions() {
			await client.reAuthenticate();
			const p = await client.service('permissions').find(
				{
					query: {
						$sort: {
							id: 1
						}
					}
				}
			);

			setPermissions(p.data);

			setChecked(new Array(p.data.length).fill(true));

		}
		getPermissions();

		// By moving this function inside the effect, we can clearly see the values it uses.
		setIsLoading(true);
		fetchProduct();
	}, []);

	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setId(0);
		setName('');
		setDescription('');
		setTenantId(0);
		setChecked(new Array(permissions.length).fill(false));

		setOpen(true);
	};

	const handleClickOpenNoreset = () => {
		setOpen(true);
	};

	const handleNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setName(event.target.value);
	};
	const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setDescription(event.target.value);
	};
	const handleTenantIdChange = (event: SyntheticEvent<Element, Event>, newValue: Tenant) => {
		if (newValue) {
			setTenantId(newValue.id);
			setTenantIdOption(newValue);
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
		if (name != '' && id === 0) {
			try {
				await client.reAuthenticate();
				const log = await client.service(serviceName).create(
					{
						name: name,
						description: description,
						tenantId: tenantId
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
		} else if (name != '' && id != 0) {
			try {
				await client.reAuthenticate();
				const log = await client.service(serviceName).patch(
					id,
					{
						name: name,
						description: description,
						tenantId: tenantId
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

			const rp = await client.service('rolePermissions').find(
				{
					query: {
						roleId: id,
						$sort: {
							id: 1
						}
					}
				}
			);

			checked.forEach(async (element, index) => {
				// eslint-disable-next-line no-console
				console.log(element, index, id);

				const c = rp.data.filter((x: RolePermissions) => x.permissionId == index+1);

				if ((c.length === 0) === element) {
					// eslint-disable-next-line no-console
					console.log('should update this');

					if (element) {
						// add permissionrole
						try {
							await client.reAuthenticate();
					
							const log = await client.service('rolePermissions').create(
								{ 
									roleId: id,
									permissionId: index+1
								}
							);

							// eslint-disable-next-line no-console
							console.log(log);
						} catch (error) {
							if (error instanceof Error) {
								setAlertMessage(error.toString());
								setAlertSeverity('error');
								setAlertOpen(true);
							}
						}
					} else {
						// remove role
						// eslint-disable-next-line no-console
						console.log('should remove', c[0].id);
						try {
							await client.reAuthenticate();

							const log = await client.service('rolePermissions').remove(
								c[0].id
							);
							
							// eslint-disable-next-line no-console
							console.log(log);
						} catch (error) {
							if (error instanceof Error) {
								setAlertMessage(error.toString());
								setAlertSeverity('error');
								setAlertOpen(true);
							}
						}
						
					}

				}
				// eslint-disable-next-line no-console
				console.log(c);

			});
			fetchProduct();

		}

	};

	const handleAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setAlertOpen(false);
	};
	const [ permissions, setPermissions ] = React.useState(Array<Permissions>);

	const [ checked, setChecked ] = React.useState(new Array(0).fill(true));

	const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(new Array(permissions.length).fill(event.target.checked));
	};

	const handleChangeMod = (event: React.ChangeEvent<HTMLInputElement>, i: number) => {
		setChecked(checked.map(function(currentelement, index) {
			if (index === i) { return event.target.checked; }

			return currentelement;
		}));
	};

	const children = (
		<Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
			{Object.entries(permissions).map(([ key, value ]) =>
				<FormControlLabel
					key={`${key}uniqe`}
					control={<Checkbox checked={checked[parseInt(key)]}
						onChange={(event) => handleChangeMod(event, parseInt(key))
						}
						name={`${key}uniq`} />}

					label={value.name}
				/>
			)}
		</Box>
	);

	return <>
		<div>
			<Button variant="outlined" onClick={() => handleClickOpen()}>
				Add new
			</Button>
			<hr />
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
						id="name"
						label="name"
						type="text"
						required
						fullWidth
						onChange={handleNameChange}
						value={name}
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
					<Autocomplete
						options={tenants}
						getOptionLabel={(option) => option.name}
						fullWidth
						disableClearable
						id="combo-box-demo"
						onChange={handleTenantIdChange}
						value={tenantIdOption}
						sx={{ marginTop: '8px' }}
						renderInput={(params) => <TextField {...params} label="Tenant" />}
					/>
					<div>
						<FormControlLabel
							label="All permissions"
							control={
								<Checkbox
									checked={checked.every((num) => num === true)}
									indeterminate={checked.some((num) => num === true) && checked.some((num) => num === false)}
									onChange={handleChange1}
								/>
							}
						/>
						{children}
					</div>
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
				onClick: async () => {

					const r = row.getAllCells();

					const tid = r[0].getValue();
					const tname = r[1].getValue();
					const tdescription = r[2].getValue();
					const ttenantId = r[3].getValue();

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
						const ttenant = tenants.find((x) => x.id === parseInt(ttenantId));

						if (ttenant) {
							setTenantIdOption(ttenant);
						}
						setTenantId(parseInt(ttenantId));
					} else {
						setTenantId(0);
					}

					await client.reAuthenticate();
					const rp = await client.service('rolePermissions').find(
						{
							query: {
								roleId: tid,
								$sort: {
									id: 1
								}
							}
						}
					);
					const a = new Array(permissions.length).fill(false);

					rp.data.forEach((element: RolePermissions) => {
						a[element.permissionId-1] = true;
					});
					setChecked(a);

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
