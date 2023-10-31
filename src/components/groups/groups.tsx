import TenantDesc from './description';
import TenantTable from './groupsList';
import TenantTable2 from './groupsListUsers';
import TenantTable3 from '../groups/rolesListGroups';

const TenantPage = () => {
	
	return 	<>
		<TenantDesc />
		<h1>Groups</h1>
		<TenantTable />
		<hr/>
		<h1>GroupsUsers</h1>
		<TenantTable2 />
		<hr/>
		<h1>GroupRoles</h1>
		<TenantTable3 />
		<hr/>
	</>;
};

export default TenantPage;
