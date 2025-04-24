export interface User {
    id: string
    userName: string
    email: string,
    roles:string[]
  }
  
  export interface UpdateUserDto {
    userName: string
    email: string
  }
  
  