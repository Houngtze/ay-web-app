<template>
  <div class="economizer-home">
    <img :src="defaultImg">
  </div>
</template>
<script>
  import {mapState} from "vuex";

  export default {
    components: {
    },
    data() {
      return {
        defaultImg: decodeURI(this.$route.query.url),
      };
    },
    filters: {},
    computed: {
      ...mapState({
        isSign: state => state.global.userInfo.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state => state.global.userInfo.idPerson,
        identity: state => state.global.userInfo.identity,
        mobile: state => state.global.userInfo.mobile,
        name: state => state.global.userInfo.name
      })
    },
    created() {
    },
    mounted() {
    },
    methods: {
    }
  };
</script>
<style lang="scss" scoped>
  @import "src/style/index.scss";
</style>
<style lang="scss">
  .economizer-home {
  }
</style>

