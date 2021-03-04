import type { AppRouteRecordRaw, Menu } from '/@/router/types';
import store from '/@/store/index';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';

import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';

import { asyncRoutes } from '/@/router/routes';
import { filter } from '/@/utils/helper/treeHelper';

import { transformObjToRoute } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';

import { useMessage } from '/@/hooks/web/useMessage';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/constant';
import { getUserResources } from '/@/api/sys/user';
import { RoleEnum } from '/@/enums/roleEnum';

const { createMessage } = useMessage();
const NAME = 'app-permission';
hotModuleUnregisterModule(NAME);

@Module({ dynamic: true, namespaced: true, store, name: NAME })
class Permission extends VuexModule {
  // Permission code list
  private permCodeListState: string[] = [];

  // Whether the route has been dynamically added
  private isDynamicAddedRouteState = false;

  // To trigger a menu update
  private lastBuildMenuTimeState = 0;

  // Backstage menu list
  private backMenuListState: Menu[] = [];

  get getPermCodeListState() {
    return this.permCodeListState;
  }

  get getBackMenuListState() {
    return this.backMenuListState;
  }

  get getLastBuildMenuTimeState() {
    return this.lastBuildMenuTimeState;
  }

  get getIsDynamicAddedRouteState() {
    return this.isDynamicAddedRouteState;
  }

  @Mutation
  commitPermCodeListState(codeList: string[]): void {
    this.permCodeListState = codeList;
  }

  @Mutation
  commitBackMenuListState(list: Menu[]): void {
    this.backMenuListState = list;
  }

  @Mutation
  commitLastBuildMenuTimeState(): void {
    this.lastBuildMenuTimeState = new Date().getTime();
  }

  @Mutation
  commitDynamicAddedRouteState(added: boolean): void {
    this.isDynamicAddedRouteState = added;
  }

  @Mutation
  commitResetState(): void {
    this.isDynamicAddedRouteState = false;
    this.permCodeListState = [];
    this.backMenuListState = [];
    this.lastBuildMenuTimeState = 0;
  }

  @Action
  async buildRoutesAction(id?: number | string): Promise<AppRouteRecordRaw[]> {
    //const { t } = useI18n();
    let routes: AppRouteRecordRaw[] = [];
    const { roles, permissions, routes: backRoutes } = await getUserResources();
    const roleList = roles as RoleEnum[];
    userStore.commitRoleListState(roleList);
    this.commitPermCodeListState(permissions);

    //const roleList = toRaw(userStore.getRoleListState);

    const { permissionMode = PermissionModeEnum.ROLE } = appStore.getProjectConfig;

    // role permissions
    if (permissionMode === PermissionModeEnum.ROLE) {
      routes = filter(asyncRoutes, (route) => {
        const { meta } = route as AppRouteRecordRaw;
        const { roles } = meta || {};
        if (!roles) return true;
        return roleList.some((role) => roles.includes(role));
      });
      //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
    } else if (permissionMode === PermissionModeEnum.BACK) {
      createMessage.loading({
        // content: t('sys.app.menuLoading'),
        content: '菜单加载中...',
        duration: 1,
      });
      // Here to get the background routing menu logic to modify by yourself
      const paramId = id || userStore.getUserInfoState.userId;
      if (!paramId) {
        throw new Error('paramId is undefined!');
      }
      let routeList = backRoutes as AppRouteRecordRaw[];

      // Dynamically introduce components
      routeList = transformObjToRoute(routeList);
      //  Background routing to menu structure
      const backMenuList = transformRouteToMenu(routeList);

      this.commitBackMenuListState(backMenuList);

      routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
    }
    routes.push(ERROR_LOG_ROUTE);
    return routes;
  }
}

export const permissionStore = getModule<Permission>(Permission);
