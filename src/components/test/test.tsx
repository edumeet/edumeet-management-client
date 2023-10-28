import { Container } from '@mui/material';
function LoginLayout() {

	return (
		<div className="app flex-row align-items-center">
			<Container>
                
				<div style={{ justifyContent: 'center', textAlign: 'center' }} >
					<div>
						<h1>Edumeet 4.x layout</h1>
					</div>
					<img src='https://user-images.githubusercontent.com/920922/167305152-c66366c0-e921-4b74-ac39-20bce9fa20ee.png' />
					<hr/>
					<img src='https://user-images.githubusercontent.com/920922/167305096-17f62975-cbb9-4d4d-bdeb-af35882c9953.png' />
					<hr/>
					<div>
						<h1>Edumeet 4.x room server</h1>
					</div>
					<img src='https://raw.githubusercontent.com/edumeet/edumeet-room-server/main/img/edumeet-room-server.drawio.png' />
					<div>
						<h1>Edumeet 4.x room client</h1>
					</div>
					<hr/>
					<img src='https://raw.githubusercontent.com/edumeet/edumeet-client/main/img/edumeet-client.drawio.png' />
				</div>                
			</Container>
		</div>
	);
}
export default LoginLayout;