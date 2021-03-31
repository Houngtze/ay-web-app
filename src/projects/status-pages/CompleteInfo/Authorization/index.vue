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
        this.$router.back();
      }
    }
  }
</script>

<style scoped>

</style>
