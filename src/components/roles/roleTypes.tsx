import { Permissions } from '../permission_stuff/permissionTypes';

export type Roles = {
	id: number,
    name: string,   
    description: string,
    tenantId: number
    permissions: Array<Permissions>
};

export default Roles;