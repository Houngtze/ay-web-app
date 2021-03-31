<template>
  <SalePageLayout>
    <IdentityAcPage />
  </SalePageLayout>
</template>

<script>
  import SalePageLayout from '@/components/SalePageLayout'
  import IdentityAcPage from '@component/jxh/jxh-credit/IdentityAc' // 组件名字不能和路由组件名一致，否则报错
  export default {
    name: "IdentityAc",
    components:{
      SalePageLayout,
      IdentityAcPage
    }
  }
</script>

<style scoped>

</style>
