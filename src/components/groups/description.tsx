import { Link } from 'react-router-dom';

function Desc() {

	return (
		<div className="app flex-row align-items-center">
			<div>
				<h2>Group(s) are...</h2>
						Groups are a way to configure role(s) to rooms .<br/>
						Users can gain permissions for the room from roles or by being room owners.<br/>
						A room can have default roles to users without login, so they can enter it, send chat, share video ... or just listen.<br/>
				<br/>
						By default on edumeet-docker instances authentication can be configured at :  https://example.com/kc [<Link to={'https://github.com/edumeet/edumeet-management-server/wiki/Keycloak-setup-(OAuth-openid-connect)'} >Install/Configuration guide</Link>]<br/>

			</div>

		</div>
	);
}
export default Desc;