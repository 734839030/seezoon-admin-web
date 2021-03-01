import Icon from './Icon/index';
import { Button } from './Button';
import {
  //Need
  Button as AntButton,
} from 'ant-design-vue';

import { App } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const compList = [Icon, Button, AntButton.Group];

export function registerGlobComp(app: App) {
  compList.forEach((comp: any) => {
    app.component(comp.name || comp.displayName, comp);
  });
  app.use(Antd);
}
