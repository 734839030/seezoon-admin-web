import type { MenuModule } from '/@/router/types';

// 系统管理
const menu: MenuModule = {
  orderNo: -1,
  menu: {
    path: '/sys',
    name: '系统管理',
    children: [
      {
        path: 'param',
        name: '系统参数',
      },
      {
        path: 'dict',
        name: '系统字典',
      },
    ],
  },
};
export default menu;
