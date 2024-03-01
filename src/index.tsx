import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Drawer from './components/drawer';

import LoginPage from './components/login/loginPage';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from './utils/edumeetConfig';

// const hostname = edumeetConfig.server_hostname || window.location.hostname;
// edumeetConfig.hostname = edumeetConfig.hostname || window.location.hostname;
// edumeetConfig.path = window.config?.path || edumeetConfig.path;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const socket = io(edumeetConfig.hostname, { path: edumeetConfig.path });

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

async function main(): Promise<void> {
	try {
		const { user } = await client.reAuthenticate();

		// const { user } = await client.reAuthenticate();

		// console.log('showDashboard()');
    
		// eslint-disable-next-line no-console
		console.log(user);
		// eslint-disable-next-line no-console
		// console.log('user.email2');

		root.render(
			<React.StrictMode>
				<Drawer username={user.email} />
			</React.StrictMode>
		);
    
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error);
		// console.log('showLoginPage()');
		root.render(
			<React.StrictMode>
				{/* <RegisterPage /> */}
				<LoginPage />
			</React.StrictMode>
		);
  
	}
}

// eslint-disable-next-line no-console
main().catch(console.error);
