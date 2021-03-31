<template>
  <Bank @BankInfoPageHandle="handleBankInfo"></Bank>
</template>

<script>
  import BankInfo from '@/components/NewCredit/BankInfo/BankInfo'
  export default {
    name: "BankInfo",
    components: {
      Bank: BankInfo
    },
    methods: {
      handleBankInfo(data) {
        this.$router.replace({path: '/creditResult'})
      }
    }
  }
</script>

<style scoped>

</style>
