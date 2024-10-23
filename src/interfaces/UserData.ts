export interface UserData{
    _id?: string;
    name?: string;
    email?: string;
    isBlocked?: boolean;
    isDeleted?:boolean,
    aboutInfo?: string;
    headLine?: string;
    location?: string;
    image?:string;
}