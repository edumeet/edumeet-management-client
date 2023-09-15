export type TenantOAuth = {

	id: number,
	tenantId: number,
	access_url: string,
	authorize_url: string,
	profile_url: string,
	redirect_uri: string,
	scope: string,
	scope_delimiter: string,
};

export default TenantOAuth;