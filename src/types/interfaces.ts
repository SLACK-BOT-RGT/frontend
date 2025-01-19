export interface UserOrganizationInfo {
    active: boolean;
    role: string
}

export interface OrganizationInfo {
    id: number;
    name: string;
    UserOrganization?: UserOrganizationInfo;
}

export interface InvitesInfo {
    Organizations: OrganizationInfo[];
    createdAt: string;
    email: string;
    id: number;
    name: string;
    phone_number: string | null;
    role: string;
    updatedAt: string;
}


export interface Channel {
    id: string;
    name: string;
    description: string;
    archived: string;
    created_at: Date;
    updated_at: Date;
}

export interface Post {
    id: number;
    title: string;
    description: string;
}

export interface PostState {
    posts: Post[];
    loading: boolean;
    error: string | null | Error | object;
}

export interface UserState {
    user: IUser | null;
}

interface UserOrganization {
    id: number;
    user_id: number;
    organization_id: number;
    role: string;
    active: boolean;
    joined_at: string;
}


export interface IUser {
    id: number;
    email: string;
    name: string;
    passCode: number;
    accesstoken: string;
    refreshtoken: string;
    phone_number: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    userOrg: UserOrganization[]
}