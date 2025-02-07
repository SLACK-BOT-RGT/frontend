export interface IUser {
    createdAt: string;
    email: string;
    id: string;
    name: string;
    timeZone: string;
    is_admin: boolean;
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
    due_time: string;
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



export interface StandupResponse {
    member: string;
    team: string;
    team_id: string;
    date: string;
    status: string;
    standup: {
        question: string;
        response: string;
    }[],
    submittedAt: string;
}















// export interface UserOrganizationInfo {
//     active: boolean;
//     role: string
// }

// export interface OrganizationInfo {
//     id: number;
//     name: string;
//     UserOrganization?: UserOrganizationInfo;
// }

// export interface InvitesInfo {
//     Organizations: OrganizationInfo[];
//     createdAt: string;
//     email: string;
//     id: number;
//     name: string;
//     phone_number: string | null;
//     role: string;
//     updatedAt: string;
// }


export interface Channel {
    id: string;
    name: string;
    description: string;
    archived: string;
    created_at: Date;
    updated_at: Date;
}

// export interface Post {
//     id: number;
//     title: string;
//     description: string;
// }

// export interface PostState {
//     posts: Post[];
//     loading: boolean;
//     error: string | null | Error | object;
// }

export interface IPoll {
    id: number;
    team_id: string;
    creator_id: string;
    question: string;
    options: IPollOption[];
    is_anonymous: boolean;
    start_time: Date;
    end_time: Date;
    // status: 'draft' | 'active' | 'closed';
    total_votes: number;
    createdAt: string;
}
export interface IPollOption {
    id: string;
    text: string;
    votes: number;
    voters?: { id: string, name: string }[];
}


export interface IStatus {
    name: string;
    status: string;
    time: string;
}

export interface IDataProps {
    trendData: {
        week: string;
        mood: number;
        kudos: number;
        pollParticipation: number;
    }[];
    kudosCategories: {
        name: string;
        value: number;
    }[];
    quickestResponder: {
        userId: string;
        name: string;
        avgResponseTime: number;
    };
    topPerformer: {
        id: string;
        name: string;
        kudosReceived: number;
        kudosGiven: number;
        topCategory: string;
        highlights: string[];
    };
    collaboration: {
        id: string;
        name: string;
        kudosReceived: number;
        avgKudosGiven: number;
        kudosGiven: number;
        topCategory: string;
        highlights: string[];
    };
    moods: {
        mood: string;
        count: number;
    }[];
}