<template>
<div class="chat-input">
  <input
    type="text"
    v-model="inputValue"
    placeholder="请输入内容"
    @confirm="sendMsg"
  >
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
        ilog('发送消息成功');
        ilog(resp);
        this.$emit('sendMsg', resp);
        this.inputValue = '';
      });
    }
  }
};
</script>
<style lang='scss'>
.chat-input {
  height: 48rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  background: #dcdcdc;
  input {
    width: 100%;
  }
}
</style>
