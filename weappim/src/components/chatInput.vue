<template>
<div class="wim-chat-input">
  <input
    class="input-field"
    type="text"
    v-model="inputValue"
    placeholder=" 请在这里输入信息..."
    @confirm="sendMsg"
  >
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
      inputValue: ''
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
    width: 75%;
    margin: 16rpx 40rpx 16rpx 40rpx;
    border: 1px solid #dcdcdc;
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
