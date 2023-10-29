import TenantDesc from './description';
import TenantTable from './roomList';
import TenantTable2 from './permissionsListRoomOwners';

const TenantPage = () => {
	
	return 	<>
		<TenantDesc />
		<TenantTable />
		<h1>RoomOwners</h1>
		<TenantTable2 />
		<hr/>
	</>;
};

export default TenantPage;
