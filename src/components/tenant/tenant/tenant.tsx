import TenantDesc from './description';
import TenantTable from './tenantList';
import TenantTable2 from './tenantFQDNList';
import TenantTable3 from './tenantOauthList';
import TenantTable4 from './permissionsListTenantOwners';
import TenantTable5 from './permissionsListTenantAdmins';

const TenantPage = () => {
	
	return 	<>
		<TenantDesc />
		<h1>Tenant(s)</h1>
		<TenantTable />
		<hr/>
		<h1>Tenant domain(s)</h1>
		<TenantTable2 />
		<hr/>
		<h1>Tenant auth(s)</h1>
		<TenantTable3 />
		<h1>TenantOwners</h1>
		<TenantTable4 />
		<hr/>
		<h1>TenantAdmins</h1>
		<TenantTable5 />
		<hr/>

	</>;
};

export default TenantPage;
