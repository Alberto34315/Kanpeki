
export interface ResponseUserDTO {
    id: number;
    email: string;
    password: string;
    fullName: string;
    nickname: string;
    urlImage: string;
    birthday: Date;
    city: string;
    roles: string[];
    createdAt: Date;
    lastPasswordChangeAt: Date;
}
