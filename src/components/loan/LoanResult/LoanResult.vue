<template>
  <div class="result">
    <div class="result-progress">
      <ul>
        <li :class="STATUS_CLASS[resultData.firstStep.status]">
          <div class="progress-dot">
            <div class="point"></div>
            <div class="line"></div>
          </div>
          <div class="progress-text">
            <p>{{resultData.firstStep.text}}</p>
          </div>
        </li>
        <li :class="STATUS_CLASS[resultData.lastStep.status]">
          <div class="progress-dot">
            <div class="line"></div>
            <div class="point"></div>
          </div>
          <div class="progress-text">
            <p>{{resultData.lastStep.text}}</p>
            <span>{{resultData.lastStep.desc}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="page-bottom-btn">
      <button @click="handleBtn">返回</button>
    </div>
  </div>
</template>

<script>
  const STATUS_CLASS = {
    0: '',
    1: 'fail'
  }
  export default {
    name: "LoanResult",
    props: ['resultData'],
    data() {
      return {
        STATUS_CLASS
      }
    },
    methods: {
      handleBtn() {
        this.$emit('onActivateBtn')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../style/common.scss';
  /* 状态：on 放款中，fail 失败，没有class默认成功 */
  .result-progress{
    padding: .6rem .3rem;
    & > ul > li{
      display: flex;
      align-items: flex-start;
      &:last-child{
        align-items: flex-end;
        & .progress-text{
          margin-bottom: -0.35rem;
        }
        &.on{
          & .progress-text  p{
            color: #363636;
          }
          & .progress-dot{
            & .point{
              background-color: #fff;
              border: 0.03rem solid rgba(229,229,229,1);
              &:after{
                background-color: rgba(229,229,229,1);
                left: 0.06rem;
                top: 0.06rem;
              }
            }
            & .line {
              background-color: #e5e5e5;
            }
          }
        }
        &.fail{
          & .progress-dot{
            & .line {
              background-color: #e5e5e5;
            }
            & .point{
              border: 0.03rem solid #FF5858;
              background-color: #fff;
              &:after{
                background-color: #FF5858;
                left: 0.06rem;
                top: 0.06rem;
              }
            }
          }
        }
      }
      &.fail{
        & .progress-text  p{
          color: #FF5858;
        }
        & .progress-dot{
          & .line{
            background-color: #e5e5e5;
          }
          & .point{
            border: 0.03rem solid #FF5858;
            background-color: #fff;
            &:after{
              background-color: #FF5858;
              left: 0.06rem;
              top: 0.06rem;
            }
          }
        }
      }
      & .progress-text{
        & > p {
          font-size: .3rem;
          color: #D19F55;
        }
        & > span{
          color: #A8A8A8;
        }
      }
      & .progress-dot{
        width: .46rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-right: .31rem;
        .line{
          width: 0.04rem;
          height: .71rem;
          background-color: #E0BA75;
          display: inline-block;
          &.on{
            background-color: #e5e5e5;
          }
        }
        .point{
          width: .46rem;
          height: .46rem;
          display: inline-block;
          background-color: #F1E2CB;
          border-radius: 50%;
          position: relative;
          &:after{
            content: '';
            position: absolute;
            left: 0.08rem;
            top: 0.08rem;
            width: .3rem;
            height: .3rem;
            background-color: #E0BA75;
            border-radius: 50%;
          }
        }
      }
    }
  }
  .page-bottom-btn{
    position: fixed;
    bottom: .98rem;
    width: 100%;
  }

</style>
