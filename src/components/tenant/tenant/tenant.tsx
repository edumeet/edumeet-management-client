import TenantDesc from './tenantDesc';
import TenantTable from './tenantList';
import TenantTable2 from './tenantFQDNList';
import TenantTable3 from './tenantOauthList';

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

	</>;
};

export default TenantPage;
