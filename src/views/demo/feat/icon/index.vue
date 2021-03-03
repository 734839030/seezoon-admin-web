<template>
  <PageWrapper title="Icon组件示例">
    <CollapseContainer title="Antv Icon使用 (直接按需引入相应组件即可)">
      <div class="flex justify-around">
        <GithubFilled :style="{ fontSize: '30px' }" />
        <QqCircleFilled :style="{ fontSize: '30px' }" />
        <WechatFilled :style="{ fontSize: '30px' }" />
        <AlipayCircleFilled :style="{ fontSize: '30px' }" />
        <IeCircleFilled :style="{ fontSize: '30px' }" />
        <TaobaoCircleFilled :style="{ fontSize: '30px' }" />
        <CodepenCircleFilled :style="{ fontSize: '30px' }" />
      </div>
    </CollapseContainer>

    <CollapseContainer class="my-5" title="IconIfy 组件使用">
      <div class="flex justify-around flex-wrap">
        <Icon :size="30" icon="ion:layers-outline" />
        <Icon :size="30" icon="ion:bar-chart-outline" />
        <Icon :size="30" icon="ion:tv-outline" />
        <Icon :size="30" icon="ion:settings-outline" />
      </div>
    </CollapseContainer>

    <CollapseContainer class="my-5" title="图标选择器">
      <div class="flex justify-around flex-wrap">
        <IconPicker />
      </div>
    </CollapseContainer>

    <Alert
      description="Icon组件基本包含所有的图标,在下面网址内你可以查询到你想要的任何图标。并且打包只会打包所用到的图标。"
      message="推荐使用Iconify组件"
      show-icon
    />
    <a-button type="link" @click="toIconify"> Iconify 图标大全</a-button>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { Alert } from 'ant-design-vue';
  import {
    AlipayCircleFilled,
    CodepenCircleFilled,
    GithubFilled,
    IeCircleFilled,
    QqCircleFilled,
    TaobaoCircleFilled,
    WechatFilled,
  } from '@ant-design/icons-vue';

  import { Icon, IconPicker } from '/@/components/Icon/index';

  import { openWindow } from '/@/utils';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: {
      PageWrapper,
      CollapseContainer,
      GithubFilled,
      QqCircleFilled,
      WechatFilled,
      AlipayCircleFilled,
      IeCircleFilled,
      TaobaoCircleFilled,
      CodepenCircleFilled,
      Icon,
      Alert,
      IconPicker,
    },
    setup() {
      return {
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
      };
    },
  });
</script>
