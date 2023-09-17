import TenantTable from './permissionsListRoomOwners';
import TenantTable2 from './permissionsListTenantOwners';
import TenantTable3 from './permissionsListTenantAdmins';
import TenantTable4 from './permissionsList';
import TenantTable5 from './rolesList';
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
		<hr/>
		<h1>permissions</h1>
		<TenantTable4 />
		<h1>Roles</h1>
		<TenantTable5 />
	</>;
};

export default TenantPage;
