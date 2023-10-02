import TenantDesc from './description';
import TenantTable from './groupsList';
import TenantTable2 from './groupsListUsers';

const TenantPage = () => {
	
	return 	<>
		<TenantDesc />
		<h1>Groups</h1>
		<TenantTable />
		<hr/>
		<h1>GroupsUsers</h1>
		<TenantTable2 />
	</>;
};

export default TenantPage;
