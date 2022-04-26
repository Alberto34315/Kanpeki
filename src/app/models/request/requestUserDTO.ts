
export interface RequestUserDTO {
    roles: string[];
    email: string;
    password: string;
    fullName: string;
    nickname: string;
    birthday: string;
    city: string;
    urlImage: File | null
}
