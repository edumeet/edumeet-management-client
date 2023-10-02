import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Desc() {

	return (
		<div className="app flex-row align-items-center">
			<div>
				<Typography>
					<h2>Rooms are...</h2>
                        Rooms in edumeet are the way to create a conference.<br/>
						In the new edumeet by default rooms are not open to anyone, and there is new ways to customize.<br/>
                        Rooms are under a tenant and can be created by users from that tenant.<br/>
						Users are autocreated when they log in to edumeet.<br/>
						Users can gain permissions for the room from roles or by being room owners.<br/>
						A room can have default roles to users without login, so they can enter it, send chat, share video ... or just listen.<br/>
					<br/>
						By default on edumeet-docker instances authentication can be configured at :  https://example.com/kc [<Link to={'https://github.com/edumeet/edumeet-management-server/wiki/Keycloak-setup-(OAuth-openid-connect)'} >Install/Configuration guide</Link>]<br/>
				</Typography>
			</div>

		</div>
	);
}
export default Desc;