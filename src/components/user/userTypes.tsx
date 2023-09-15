export type User = {

	id: number,
    ssoId: string,
    tenantId: number,
    email: string,
    name: string,
    avatar: string,
    roles: [],
    tenantAdmin: boolean,
    tenantOwner: boolean
    
};
export default User;