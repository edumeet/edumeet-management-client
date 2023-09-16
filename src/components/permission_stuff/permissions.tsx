import TenantTable from './permissionsListRoomOwners';
import TenantTable2 from './permissionsListTenantOwners';

const TenantPage = () => {
	
	return 	<>
		<h1>RoomOwners</h1>
		<TenantTable />
		<hr/>
		<h1>TenantOwners</h1>
		<TenantTable2 />
	</>;
};

export default TenantPage;
