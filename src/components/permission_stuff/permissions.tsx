import TenantTable4 from './permissionsList';
import TenantTable5 from './rolesList';

const TenantPage = () => {
	
	return 	<>
		
		<h1>permissions</h1>
		<TenantTable4 />
		<h1>Roles</h1>
		<TenantTable5 />

	</>;
};

export default TenantPage;
