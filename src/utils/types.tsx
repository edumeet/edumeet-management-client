import { ThemeOptions } from '@mui/material';

export const defaultEdumeetConfig: EdumeetConfig = {
	serverApiUrl: 'http://localhost:3030',
	hostname: 'localhost',
	path: '/mgmt/socket.io',
	clipath: '/cli/',
	theme: {
		background: 'linear-gradient(135deg, rgba(1,42,74,1) 0%, rgba(1,58,99,1) 50%, rgba(1,73,124,1) 100%)',
		appBarColor: '#313131',
		logo: 'images/logo.edumeet.svg',
		activeSpeakerBorder: '1px solid rgba(255, 255, 255, 1.0)',
		videoBackroundColor: 'rgba(49, 49, 49, 0.9)',
		videoShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px',
		videoAvatarImage: 'images/buddy.svg',
		videoRoundedCorners: true,
		chatColor: 'rgba(224, 224, 224, 0.52)'
	}
};

export interface EdumeetConfig {
	serverApiUrl: string;
	hostname: string;
	path: string;
	clipath: string;
	theme: ThemeOptions;
}
