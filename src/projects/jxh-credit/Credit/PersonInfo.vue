<template>
    <PersonInfoPage @onActivePersonInfo="handlePersonInfo" customJump />
</template>

<script>
  import PersonInfoPage from '@/components/jxh/jxh-credit/PersonInfo' // 组件名字不能和路由组件名一致，否则报错
  export default {
    name: "PersonInfo",
    components: {
      PersonInfoPage
    },
    methods: {
      handlePersonInfo(data) {
        this.$router.replace({path: '/creditResult'})
      }
    }
  }
</script>
