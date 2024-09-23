export interface User {
    id: string;       
    email: string;      
    password: string;   
    status?: string;     
}

export interface AuthError {
    message: string;
}
