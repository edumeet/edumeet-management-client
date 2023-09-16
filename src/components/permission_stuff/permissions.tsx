import TenantTable from './permissionsListRoomOwners';
import TenantTable2 from './permissionsListTenantOwners';
import TenantTable3 from './permissionsListTenantAdmins';

const TenantPage = () => {
	
	return 	<>
		<h1>RoomOwners</h1>
		<TenantTable />
		<hr/>
		<h1>TenantOwners</h1>
		<TenantTable2 />
		<hr/>
		<h1>TenantAdmins</h1>
		<TenantTable3 />
	</>;
};

export default TenantPage;
