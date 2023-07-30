import React from 'react';
import Box from '@mui/material/Box';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';
import edumeetConfig from '../utils/edumeetConfig';

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

const drawerWidth = 20;

function RegisterPage() {
	return (
		<Box
			component="main"
			sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
		>

			<form
				// ref={formRef}
				onSubmit={async (e: React.SyntheticEvent) => {
					e.preventDefault();
					const target = e.target as typeof e.target & {
						email: { value: string };
						password: { value: string };
					};
					const email = target.email.value; // typechecks!
					const password = target.password.value; // typechecks!

					try {
						const credentials = {
							email: email,
							password: password
						};

						// Authenticate with the local email/password strategy

						await client.service('users').create(credentials);

						// If successful log them in
						if (!credentials) {
							// Try to authenticate using an existing token
							await client.reAuthenticate();
						} else {
							// Otherwise log in with the `local` strategy using the credentials we got
							await client.authenticate({
								strategy: 'local',
								...credentials
							});
						}

						// Show e.g. logged in dashboard page
						window.location.reload();
					} catch (error) {
						// Show login page (potentially with `e.message`)
					}
				}}
			>

				<FormControl>
					<h3>Register page</h3>
					<FormLabel>Enter Email</FormLabel>
					<TextField name='email' type="email"></TextField>
					<FormLabel>Password</FormLabel>
					<TextField name='password' type="password"></TextField>
					<Button type='submit' >Submit</Button>
				</FormControl>
			</form>
		</Box>
	);
}
export default RegisterPage;
