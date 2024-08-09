interface BaseResponse<D> {
  code: number;
  data?: D;
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

interface AccountInfo {
  avatar: string;
  level: number;
  name: string;
  reg_country: string;
  roleId: number;
  zoneId: number;
}
