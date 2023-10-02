import { RoomOwners } from '../permission_stuff/permissionTypes';
import Roles from '../roles/roleTypes';

export type Room = {

	id: number,
	name: string,
	description: string,
	createdAt: string,
	updatedAt: string,
	creatorId: string,
	tenantId?: number | null,
	logo: string | null,
	background: string | null,
	maxActiveVideos: number,
	locked: boolean,
	chatEnabled: boolean,
	raiseHandEnabled: boolean,
	filesharingEnabled: boolean,
	groupRoles: Array<Roles>,
	localRecordingEnabled: boolean,
	owners: Array<RoomOwners>
};
export default Room;