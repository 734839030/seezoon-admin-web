<template>
  <!-- 查询表单 -->
  <a-form
    ref="searchForm"
    :labelCol="this.labelCol"
    :model="searchForm"
    :wrapperCol="this.wrapperCol"
    layout="inline"
  >
    <a-form-item label="表名" name="tableName">
      <a-select
        v-model:value="searchForm.tableName"
        style="width: 125px"
        :allowClear="true"
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
          @click="this.$refs.dataFormModal.open('添加')"
          >添加
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
    class="mt-4"
    size="small"
    @change="handleTableChange"
  >
    <template #action="{ record }">
      <a v-auth="'sys:gen:update'" @click="this.$refs.dataFormModal.open('编辑', record.id)"
        >编辑</a
      >
      <a-divider type="vertical" />
      <a-popconfirm
        placement="left"
        title="确定删除？"
        @confirm="handleDelete('/sys/demo/delete', record.id)"
      >
        <a v-auth="'sys:gen:delete'">删除</a>
      </a-popconfirm>
    </template>
  </a-table>
  <!-- <data-form-modal ref="dataFormModal" @refreshQuery="handleQuery" /> -->
</template>
<script>
  // import DataFormModal from './DataFormModal.vue';
  import { queryTableMixin } from '../../../mixins/common/query-table-mixin';
  import { getTables } from './data';

  export default {
    name: 'MainTable',
    // components: { DataFormModal },
    mixins: [queryTableMixin],
    setup() {
      const tables = getTables();
      return { tables };
    },
    data() {
      return {
        url: '/sys/gen/query',
        columns: [
          {
            title: '文本',
            dataIndex: 'inputText',
          },
          {
            title: '下拉',
            dataIndex: 'inputSelect',
            ellipsis: true,
            customRender: function ({ text }) {
              return inputSelectDictsMap.get(text);
            },
          },
          {
            title: '单选',
            dataIndex: 'inputRadio',
            ellipsis: true,
            customRender: function ({ text }) {
              return inputRadioDictsMap.get(text);
            },
          },
          {
            title: '文本域',
            dataIndex: 'inputTextarea',
            ellipsis: true,
          },
          {
            title: '日期',
            dataIndex: 'inputDate',
            ellipsis: true,
          },
          {
            title: '整数',
            dataIndex: 'inputZhengshu',
            ellipsis: true,
          },
          {
            title: '小数',
            dataIndex: 'inputXiaoshu',
            ellipsis: true,
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            ellipsis: true,
            sorter: true,
          },
          {
            title: '修改时间',
            dataIndex: 'updateTime',
            ellipsis: true,
          },
          {
            title: '操作',
            fixed: 'right',
            width: 120,
            slots: { customRender: 'action' },
          },
        ],
      };
    },
    mounted() {
      this.handleQuery();
    },
  };
</script>
