import { Permissions } from '../permission_stuff/permissionTypes';

export type Roles = {
	id: number,
    name: string,   
    description: string,
    tenantId: number
    permissions: Array<Permissions>
};

export type GroupRoles = {
	id: number,
    groupId: number,
    role:Array<Roles>,
    roleId:number,
    roomId:number
};

export type UsersRoles = {
	id: number,
    userId: number,
    role:Array<Roles>,
    roleId:number,
    roomId:number
};

export default Roles;