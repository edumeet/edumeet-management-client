export type Groups = {
	id: number,
    name: string,   
    description: string,
    tenantId: number
};

export type GroupUsers = {
	id: number,
    groupId: number,   
    userId: number
};

export default Groups;