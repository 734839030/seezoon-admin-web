import { defHttp } from '/@/utils/http/axios';
import { Dict } from '/@/api/sys/model/dictModel';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { Persistent } from '/@/utils/cache/persistent';
import { DICT_KEY } from '/@/enums/cacheEnum';

/**
 * 部门树
 * @param parentId
 * @param includeChild
 */
export function deptTree(parentId: number, includeChild?: boolean) {
  return defHttp.postForm('/sys/dept/tree', { parentId: parentId, includeChild: includeChild });
}

/**
 * menu树
 * @param parentId
 * @param includeChild
 */
export function menuTree(parentId, includeChild) {
  return defHttp.postForm('/sys/menu/tree', { parentId: parentId, includeChild: includeChild });
}

/**
 * 获取全部字典类型
 * @returns {Promise<[]>}
 */
export async function getTypes() {
  const data = await defHttp.get({ url: '/sys/dict/query_types' });
  const dictTypes: Dict[] = [];
  for (const type of data.values()) {
    dictTypes.push({ label: type, value: type });
  }
  return dictTypes;
}

/**
 * 获取指定字典数据
 */
export function getDict(type: string) {
  const dicts = ref([]);
  defHttp.get({ url: '/sys/dict/query_by_type', params: { type: type } }).then((data) => {
    dicts.value = data;
  });
  return dicts;
}

export function getAllDict() {
  const dictSession = Persistent.getSession(DICT_KEY);
  if (null != dictSession) {
    debugger;
    return dictSession;
  }
  defHttp
    .get({ url: '/sys/dict/query_by_type' })
    .then((data) => {
      const dictMap = new Map<string, Dict[]>();
      for (const dict of data.values()) {
        const type = dict.type;
        if (dictMap.has(type)) {
          dictMap
            .get(type)
            ?.push({ label: dict.name, value: dict.value, disabled: type.status === 0 });
        } else {
          dictMap.set(dict.type, [
            { label: dict.name, value: dict.value, disabled: type.status === 0 },
          ]);
        }
      }
      debugger;
      Persistent.setSession(DICT_KEY, dictMap);
    })
    .catch((e) => {
      message.error('字典加载失败请刷新网页:' + e);
    });
}

/**
 * 获取全部角色
 */
export async function getRoles() {
  const data = await defHttp.get({ url: '/sys/role/query' });
  const roles: Dict[] = [];
  for (const role of data.values()) {
    roles.push({ label: role.name, value: role.id, disabled: role.status === 0 });
  }
  return roles;
}

/**
 * 字段数组转map
 */
export function dictArray2Map(dictArray: Dict[]) {
  return new Map(dictArray.map((dict) => [dict.value, dict.label]));
}
