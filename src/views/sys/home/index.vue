<template>
  <div class="p-4">
    <GrowCard :loading="loading" class="enter-y" />

    <div id="adsgoeshere" v-html="adsenseContent"></div>

    <SiteAnalysis :loading="loading" class="!my-4 enter-y" />

    <div class="md:flex enter-y">
      <VisitRadar :loading="loading" class="md:w-1/3 w-full" />

      <VisitSource :loading="loading" class="md:w-1/3 !md:mx-4 !md:my-0 !my-4 w-full" />
      <SalesProductPie :loading="loading" class="md:w-1/3 w-full" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import SiteAnalysis from './components/SiteAnalysis.vue';
  import VisitSource from './components/VisitSource.vue';
  import VisitRadar from './components/VisitRadar.vue';
  import SalesProductPie from './components/SalesProductPie.vue';

  export default defineComponent({
    components: {
      GrowCard,
      SiteAnalysis,
      VisitRadar,
      VisitSource,
      SalesProductPie,
    },
    setup() {
      const loading = ref(true);

      setTimeout(() => {
        loading.value = false;
      }, 1500);
      return { loading };
    },
    data() {
      return {
        adsenseContent: '',
      };
    },
    mounted() {
      this.adsenseContent = document.getElementById('divadsensedisplaynone')?.innerHTML as string;
    },
  });
</script>
