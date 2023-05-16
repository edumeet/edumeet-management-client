import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Drawer from './components/drawer';

import LoginPage from './components/loginPage';

import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import edumeetConfig from './utils/edumeetConfig';

const serverApiUrl = edumeetConfig.serverApiUrl;
// const hostname = edumeetConfig.server_hostname || window.location.hostname;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const socket = io(serverApiUrl);
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(authentication());

async function main(): Promise<void> {
	try {
		const { user } = await client.reAuthenticate();

		// console.log('showDashboard()');
    
		// console.log(user.email);

		root.render(
			<React.StrictMode>
				<Drawer username={user.email} />
			</React.StrictMode>
		);
    
	} catch (error) {
		// console.log('showLoginPage()');
		root.render(
			<React.StrictMode>
				<LoginPage />
			</React.StrictMode>
		);
  
	}
}

// eslint-disable-next-line no-console
main().catch(console.error);
