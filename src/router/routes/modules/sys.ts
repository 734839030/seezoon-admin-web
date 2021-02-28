import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const sys: AppRouteModule = {
  path: '/sys',
  name: 'sys',
  component: LAYOUT,
  meta: {
    icon: 'grommet-icons:system',
    title: '系统管理',
  },
  children: [
    {
      path: 'param',
      name: 'param',
      component: () => import('/@/views/sys/param/index.vue'),
      meta: {
        icon: 'ls:paramater',
        title: '系统参数',
      },
    },
  ],
};

export default sys;
