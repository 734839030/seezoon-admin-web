import { defHttp } from '/@/utils/http/axios';
import { GetUserInfoModel, LoginParams, LoginResultModel } from './model/userModel';
import { UserResources } from '/@/api/sys/model/menuModel';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/sys/user/getInfo',
  GetUserResources = '/sys/user/getResources',
  GetPermCodeByUserId = '/getPermCodeByUserId',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
  return defHttp.postForm<LoginResultModel>(Api.Login, params);
}

/**
 * @description: user logout
 */
export function logout() {
  return defHttp.post<any>({ url: Api.Logout });
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo });
}

export const getUserResources = () => {
  return defHttp.get<UserResources>({ url: Api.GetUserResources });
};
