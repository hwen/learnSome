<template>
<div class="wim-chat-input">
  <div class="record-btn" @click="toggleRecord">
    {{ recordFlag ? '输入' : '录音' }}
  </div>
  <input
    v-show="!recordFlag"
    class="input-field"
    type="text"
    v-model="inputValue"
    placeholder=" 请在这里输入信息..."
    @confirm="sendMsg"
  >
  <button
    v-show="recordFlag"
    open-type="openSetting"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    :class="['start-record-btn', holdingRecord && 'holding']"
  >
    按住 说话
  </button>
  <div class="more-btn" @click="chooseImg">
    更多
  </div>
</div>
</template>

<script>
export default {
  props: {
    im: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      inputValue: '',
      recordFlag: false,
      holdingRecord: false
    };
  },
  computed: {},
  methods: {
    sendMsg(event) {
      const msg = event.target.value;
      const { im } = this;
      if (!im || !msg) return;
      im.sendMsg(msg, resp => {
        console.log('发送消息成功');
        console.log(resp);
        this.$emit('sendMsg', resp);
        this.inputValue = '';
      });
    },
    chooseImg() {
      this.$emit('chooseImg');
    },
    toggleRecord() {
      this.recordFlag = !this.recordFlag;
    },
    recordSound() {
      this.$emit('recordSound');
    },
    onTouchStart() {
      console.log('on touch start');
      this.$emit('recordStart');
      this.holdingRecord = true;
    },
    onTouchEnd() {
      console.log('on touch end');
      this.holdingRecord = false;
      this.$emit('recordEnd');
    }
  }
};
</script>
<style lang='scss'>
.wim-chat-input {
  height: 100rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #dcdcdc;
  z-index: 100;
  background: white;
  .input-field {
    width: 65%;
    margin: 16rpx auto 16rpx;
    border: 1px solid #dcdcdc;
  }
  .record-btn {
    position: absolute;
    left: 32rpx;
    top: 16rpx;
    padding: 8rpx 12rpx;
    border-radius: 16rpx;
    font-size: 28rpx;
    border: 1px solid #dcdcdc;
  }
  .start-record-btn {
    width: 65%;
    margin: 16rpx auto 16rpx;
    border: 1rpx solid #dcdcdc;
    text-align: center;
    border-radius: 8rpx;
    font-weight: bold;
    height: 57rpx;
    line-height: 57rpx;
    &.holding {
      background-color: #dcdcdc;
    }
  }
  .more-btn {
    position: absolute;
    right: 32rpx;
    top: 16rpx;
    padding: 8rpx 12rpx;
    border-radius: 16rpx;
    font-size: 28rpx;
    border: 1px solid #dcdcdc;
  }
}
</style>
