<template>
<div :class="['wim-chat-input', showDesk && 'desk-active']">
  <div class="input-container">
    <input
      class="input-field"
      type="text"
      v-model="inputValue"
      placeholder=" 请在这里输入信息..."
      confirm-type="发送"
      @confirm="sendMsg"
    >
    <div class="more-btn" @click="toggleDesk">
      <image :src="plusSvg"></image>
    </div>
  </div>
  <div class="chat-method-desk" v-show="showDesk">
    <ul>
      <li>
        <div class="method-item" @click="chooseImg">
          <image :src="imgSvg"></image>
        </div>
        <div class="desk-text">发送图片</div>
      </li>
      <!--<li>-->
        <!--<div class="method-item">-->
          <!--<image :src="plusSvg"></image>-->
        <!--</div>-->
        <!--<div class="desk-text"></div>-->
      <!--</li>-->
    </ul>
  </div>
</div>
</template>

<script>
import imgSvg from '../assets/img.svg';
import plusSvg from '../assets/plus.svg';

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
      showDesk: false,
      imgSvg: imgSvg,
      plusSvg: plusSvg
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
    toggleDesk() {
      this.showDesk = !this.showDesk;
    },
    chooseImg() {
      this.showDesk = false;
      this.$emit('chooseImg');
    }
  }
};
</script>
<style lang='scss'>
$tip-color: #a7a7a9;
.wim-chat-input {
  height: 120rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #dcdcdc;
  z-index: 100;
  background: white;
  &.desk-active {
    height: 440rpx;
  }
  .chat-method-desk {
    padding: 0 32rpx;
    ul {
      list-style: none;
      color: $tip-color;
    }
    li {
      margin: 50rpx 25rpx;
      display: inline-block;
      font-size: 30rpx;
    }
    .method-item {
      border-radius: 8rpx;
      height: 110rpx;
      line-height: 110rpx;
      width: 110rpx;
      border: 1px solid #dcdcdc;
      display: inline-block;
      text-align: center;
    }
    image {
      width: 66rpx;
      height: 66rpx;
      display: inline-block;
      vertical-align: middle;
    }
    .desk-text {
      margin-top: 24rpx;
    }
  }
  .input-container {
    height: 120rpx;
    background: #fcfcfc;
  }
  .input-field {
    width: 75%;
    height: 80rpx;
    padding-top: 20rpx;
    padding-left: 40rpx;
    background: transparent;
  }
  .more-btn {
    position: absolute;
    right: 32rpx;
    top: 24rpx;
    height: 60rpx;
    line-height: 60rpx;
    width: 60rpx;
    border-radius: 60rpx;
    text-align: center;
    border: 1rpx solid #6e6e76;
    image {
      height: 54rpx;
      width: 54rpx;
      display: inline;
    }
  }
}
</style>
