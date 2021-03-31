<template>
  <SalePageLayout :isFullScreen="true">
    <PageLayout></PageLayout>
  </SalePageLayout>
</template>

<script>

  import SalePageLayout from '@/components/SalePageLayout';
  import PageLayout from './components/PageLayout';

  export default {
    components: {
      SalePageLayout,
      PageLayout,
    },
  };
</script>

<style scoped lang="scss">
</style>
