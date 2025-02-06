export interface MechData{
    _id: string;
    name: string;
    email: string;
    role: string;
    cover_image?: string;
    profile_picture?: string;
    isVerified:boolean;
    isBlocked: boolean;
    isDeleted:boolean;
}