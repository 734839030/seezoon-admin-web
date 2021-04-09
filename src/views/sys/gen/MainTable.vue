<template>
  <!-- 查询表单 -->
  <a-form
    ref="searchForm"
    :labelCol="{ span: 6 }"
    :model="searchForm"
    :wrapperCol="{ span: 18 }"
    layout="inline"
  >
    <a-form-item label="表名" name="tableName">
      <a-select
        v-model:value="searchForm.tableName"
        style="width: 140px"
        :allowClear="true"
        :showSearch="true"
        :options="tables"
        placeholder="请选择表"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button v-auth="'sys:gen:query'" type="primary" @click="handleQuery()">查询</a-button>
        <a-button type="default" @click="this.$refs.searchForm.resetFields()">重置</a-button>
        <a-button
          v-auth="'sys:gen:save'"
          type="default"
          @click="this.$refs.dataFormModal.gen('添加', searchForm.tableName)"
          >添加
        </a-button>
        <a-button
          v-auth="'sys:gen:generate'"
          :disabled="selectedRowKeys.length == 0"
          type="default"
          @click="generate(selectedRowKeys)"
          >批量生成
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
  <a-table
    :columns="columns"
    :data-source="data"
    :loading="loading"
    :pagination="pagination"
    :row-key="(record) => record.id"
    bordered
    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    class="mt-4"
    size="small"
    @change="handleTableChange"
  >
    <template #action="{ record }">
      <a v-auth="'sys:gen:update'" @click="this.$refs.dataFormModal.edit('编辑', record.id)"
        >编辑</a
      >
      <a-divider type="vertical" />
      <a-popconfirm
        placement="left"
        title="确定删除？"
        @confirm="handleDelete('/sys/gen/delete', record.id)"
      >
        <a v-auth="'sys:gen:delete'">删除</a>
      </a-popconfirm>
      <a-divider type="vertical" />
      <a v-auth="'sys:gen:generate'" @click="generate([record.id])">生成</a>
    </template>
  </a-table>
  <data-form-modal ref="dataFormModal" @refreshQuery="handleQuery" />
</template>
<script>
  import DataFormModal from './DataFormModal.vue';
  import { queryTableMixin } from '../../../mixins/common/query-table-mixin.js';
  import { getTables, templateTypesMap } from './data';
  import { defHttp } from '../../../utils/http/axios';
  import { message } from 'ant-design-vue';

  export default {
    name: 'MainTable',
    components: { DataFormModal },
    mixins: [queryTableMixin],
    setup() {
      const tables = getTables();
      return { tables };
    },
    data() {
      return {
        url: '/sys/gen/query',
        selectedRowKeys: [],
        columns: [
          {
            title: '编号',
            dataIndex: 'id',
          },
          {
            title: '表名',
            dataIndex: 'tableName',
          },
          {
            title: '菜单名',
            dataIndex: 'menuName',
          },
          {
            title: '模块名',
            dataIndex: 'moduleName',
          },
          {
            title: '类名',
            dataIndex: 'className',
          },
          {
            title: '模板',
            dataIndex: 'template',
            customRender: function ({ text }) {
              return templateTypesMap.get(text);
            },
          },
          {
            title: '修改时间',
            dataIndex: 'updateTime',
            ellipsis: true,
          },
          {
            title: '操作',
            fixed: 'right',
            width: 140,
            slots: { customRender: 'action' },
          },
        ],
      };
    },
    mounted() {
      this.handleQuery();
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      generate(ids) {
        defHttp
          .post(
            { url: '/sys/gen/generate', params: ids, responseType: 'blob' },
            { isTransformResponse: false }
          )
          .then((res) => {
            //var blob = new Blob([res.data], { type: res.headers['content-type'] });
            var blob = res.data;
            if (blob.type == 'application/json') {
              const reader = new FileReader();
              reader.readAsText(blob, 'utf-8');
              reader.onload = function () {
                const err = JSON.parse(reader.result);
                message.error(err.msg);
              };
              return;
            }
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = decodeURI(
              res.headers['content-disposition'].substring('attachment;filename='.length)
            ); //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
          });
      },
    },
  };
</script>
