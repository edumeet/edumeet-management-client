import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControlLabel, Checkbox } from '@mui/material';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from '../../utils/edumeetConfig';
const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

export default function FormDialog() {
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const addTenant = async () => {

		try {
			const log = await client.service('rooms').create(
				{ name: 'test2', description: 'testdesc3', maxActiveVideos: 4 }
			);

			// eslint-disable-next-line no-console
			console.log(log);
		} catch (error) {
			// Show login page (potentially with `e.message`)
			// eslint-disable-next-line no-console
			console.log(error);
			// if data already exists we cant add it TODO
		} 
		setOpen(false);
	};

	return (
		<div>
			<Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add/Edit</DialogTitle>
				<DialogContent>
					<DialogContentText>
            These are the parameters that you can change. 
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Name"
						type="text"
						required
						fullWidth
						variant="standard"
					/>
					<TextField
						required
						margin="dense"
						id="desc"
						label="Desc"
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						required
						margin="dense"
						id="logo"
						label="logo"
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						required
						margin="dense"
						id="background"
						label="background"
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						required
						margin="dense"
						id="maxActiveVideos"
						label="maxActiveVideos"
						type="number"
						fullWidth
						variant="standard"
					/>

					<FormControlLabel control={<Checkbox /* defaultChecked */ />} label="locked" />
					<FormControlLabel control={<Checkbox /* defaultChecked */ />} label="chatEnabled" />
					<FormControlLabel control={<Checkbox /* defaultChecked */ />} label="raiseHandEnabled" />
					<FormControlLabel control={<Checkbox /* defaultChecked */ />} label="filesharingEnabled" />
					<FormControlLabel control={<Checkbox /* defaultChecked */ />} label="localRecordingEnabled" />

				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={addTenant}>OK</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
