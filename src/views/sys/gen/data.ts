import { Dict } from '/@/api/sys/model/dictModel';
import { defHttp } from '/@/utils/http/axios';
import { ref } from 'vue';

export function getTables() {
  const tableDicts = ref<Dict[]>([]);
  defHttp.get({ url: '/sys/gen/tables' }).then((data) => {
    tableDicts.value = data.map(function (item) {
      return { label: item, value: item };
    });
  });
  return tableDicts;
}
