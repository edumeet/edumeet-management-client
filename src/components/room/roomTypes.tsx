import { RoomOwners } from '../permission_stuff/permissionTypes';

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
	localRecordingEnabled: boolean,
	owners: Array<RoomOwners>
};
export default Room;