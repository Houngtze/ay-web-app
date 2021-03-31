<template>
	<div class="pdf-box">
        <div class="pdf" id="pdf"></div>
	</div>
</template>


<script>
  import Pdfh5 from "pdfh5";
  export default {
    components: {
        Pdfh5,
    },
    data() {
      return {
        numPages: 0,
        pdfUrl: '', 
        currentPage: 1,
        pageCount: 0,
        scale: 100, //放大系数
        idx: -1,
        clauseTitle: "",
        loadedRatio: 0,
        Pdfh5Obj:null,
      };
    },
    mounted() {
        this.pdfUrl = this.$route.query.fileName
        if(this.pdfUrl){
            this.Pdfh5Obj = new Pdfh5("#pdf", {
                pdfurl: this.pdfUrl,
                lazy: false,
            });
        }else{
            this.$toast('合同加载失败');
        }
    },
    methods: {
        // 改变页码,0上一页,1下一页
        changePdfPage(val) {
            if(val === 0 && this.currentPage > 1) {
                this.currentPage--;
            }
            if(val === 1 && this.currentPage < this.pageCount) {
                this.currentPage++;
            }
        },
        // pdf加载时
        loadPdfHandler(e) {
            this.currentPage = 1; // 加载的时候先加载第一页
        },
        //放大
        scaleD() {
            if(this.scale == 250) {
                return;
            }
            this.scale += 50;
            this.$refs.wrapper.$el.style.width = parseInt(this.scale) + "%";
        },
        //缩小
        scaleX() {
            if(this.scale == 100) {
                return;
            }
            this.scale += -50;
            this.$refs.wrapper.$el.style.width = parseInt(this.scale) + "%";
        },
    }
  };
</script>
<style lang="scss" scoped>
@import "./pdfh5.css";
.pdf-box{
    width: 100%;
    height: 100%;
    .pdf{
        height: 100vh;
    }
}

</style>
