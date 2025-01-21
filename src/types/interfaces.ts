export interface IUser {
    createdAt: string;
    email: string;
    id: string;
    name: string;
    timeZone: string;
}
export interface ITeamMember {
    createdAt: string;
    id: number;
    role: string;
    team_id: string;
    updatedAt: string;
    user_id: string;
    User: IUser
}

export interface IStandupConfig {
    id?: number;
    team_id: string;
    questions: string[];
    reminder_time: string;
    reminder_days: string[];
    is_active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IStandup {
    id: number;
    user_id: string;
    config_id: number;
    responses: string[];
    submitted_at: string;
    createdAt?: string;
    updatedAt?: string;
    StandupConfig: {
        id: number;
        team_id: string;
        questions: string[];
        reminder_time: string;
        reminder_days: string[];
        is_active: boolean;
        createdAt?: string;
        updatedAt?: string;
        Team: {
            id: string;
            name: string;
            description: string;
            archived: boolean;
            createdAt?: string;
            updatedAt?: string;
        };
    };
}


















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


// interface UserOrganization {
//     id: number;
//     user_id: number;
//     organization_id: number;
//     role: string;
//     active: boolean;
//     joined_at: string;
// }


// export interface IUser {
//     id: number;
//     email: string;
//     name: string;
//     passCode: number;
//     accesstoken: string;
//     refreshtoken: string;
//     phone_number: string;
//     role: string;
//     createdAt: Date;
//     updatedAt: Date;
//     userOrg: UserOrganization[]
// }