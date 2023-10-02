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

export type RoomOwners = {
	id: number,
    roomId: number,
    userId: number,   
};
export type TenantOwners = {
	id: number,
    tenantId: number,
    userId: number,   
};

export type TenantAdmins = {
	id: number,
    tenantId: number,
    userId: number,   
};

export type Permissions = {
	id: number,
    name: string,   
    description: string,
};

export type Roles = {
	id: number,
    name: string,   
    description: string,
    permissions: Array<Permissions>
    tenantId: number
};

export type RolePermissions = {
	id: number,
    permission: Permissions
    permissionId: number,   
    roleId: number,
};

export default User;