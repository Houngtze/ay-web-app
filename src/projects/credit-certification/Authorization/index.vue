<template>
  <ren-hang-authorization @onActiveResult="handleResult" />
</template>

<script>
  import RenHangAuthorization from '@component/RenHangAuthorization/Authorization'
  export default {
    name: "index",
    components: {
      RenHangAuthorization
    },
    methods: {
      handleResult(res) {
        this.$router.push('/index');
      }
    }
  }
</script>

<style scoped>

</style>
