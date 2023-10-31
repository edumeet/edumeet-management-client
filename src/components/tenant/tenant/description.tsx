import { Link } from 'react-router-dom';

function Desc() {

	return (
		<div className="align-items-center">
			<div>
				<h2>Tenants are...</h2>
                        Tenants are like organization units, they have <strong>3</strong> main attributes.<br/>
                        There is an <strong>ID</strong> that identifies it.<br/>
                        There is one or more <strong>domain</strong> that is linked to a Tenant.<br/>
                        And there is <strong>authentication</strong> that can be configured with keycloak. <br/>
				<br/>
						On edumeet-docker instance this is https://example.com/kc [<Link to={'https://github.com/edumeet/edumeet-management-server/wiki/Keycloak-setup-(OAuth-openid-connect)'} >Install/Configuration guide</Link>]<br/>
			</div>

		</div>
	);
}
export default Desc;