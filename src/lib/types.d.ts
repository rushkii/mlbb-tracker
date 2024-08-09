interface LoginResponse {
  code: number;
  data?: LoginData;
  msg: string;
}

interface LoginData {
  email: string;
  jwt: string;
  mobile: string;
  module: string;
  name: string;
  open_id: string;
  roleid: number;
  time: number;
  token: string;
  zoneid: number;
}
