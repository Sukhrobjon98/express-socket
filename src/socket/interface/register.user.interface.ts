export interface IUserRegister {
  user_socket_id?: string;
  username: string;
  password: string;
  file: {
    fileName: string;
    file: string;
    type: string;
  };
}
