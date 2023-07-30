import { Container, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
function LoginLayout() {

	const navigate = useNavigate();
	
	const routeChange = () => {
		const path = 'products/1';

		navigate(path);
	}; 

	return (
		<div className="app flex-row align-items-center">
			<Container>
                
				{/* <Button color="primary" className="px-4"
					onClick={routeChange}
				>
                    Login
				</Button> */}
				<div>
					<Link to="/cli/" >home</Link>
					<Link to="/cli/room" >room</Link>
					<Link to="/cli/tenant" >tenant</Link>
					<Link to="/cli/tenantOAuth" >tenantOAuth</Link>
					<Link to="/cli/tenantFQDNsTable" >tenantFQDNsTable</Link>
					<Link to="/cli/products/:id" >products</Link>
				</div>                
			</Container>
		</div>
	);
}
export default LoginLayout;