export interface User {
    id: string;       
    email: string;      
    password: string;   
    status: string;   
    isBlocked: boolean;
}

export interface AuthError {
    message: string;
}

export interface Credentials {
    email: string;
    password: string;
}