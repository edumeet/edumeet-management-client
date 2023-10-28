import TenantTable from './rolesList';
import TenantTable2 from './rolesListGroups';
import TenantTable3 from './rolesListUsers';

const TenantPage = () => {
	
	return 	<>
		<h1>Roles</h1>
		<TenantTable />
		<hr/>
		<h1>GroupRoles</h1>
		<TenantTable2 />
		<hr/>
		<h1>UserRoles</h1>
		<TenantTable3 />
		<hr/>
	</>;
};

export default TenantPage;
