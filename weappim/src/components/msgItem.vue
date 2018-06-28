<template>
<div class="wim-msg-box" :id='data.sessType + data.seq'>
  <div
    :class="['wim-chat-message', isSelf ? 'self' : '']"
    v-if="!data.msgContent || (data.msgContent.type !== 'groupTip')"
  >
    <img class="avatar" v-if="!isSelf" :src="avatarUrl" alt="avatar">
    <div
      class="right"
    >
      <div class="nickname-time">
        <!-- <span class="tag"></span> -->
        <!--<span class="nickname">{{data.fromAccountNick}}</span>-->
        <!-- <span class="time">{{formatedTime}}</span> -->
      </div>
      <div class="content" :style="{background: styl.msgColor, color: styl.fontColor}">
        <div class="text" v-if="data.msgContent.type!=='image'" v-html="contentHTML"></div>
        <div class="text" v-else>
          <image mode="widthFix" class="image" :src="data.msgContent.smallImg"></image>
        </div>
      </div>
      <!-- <div class="arrow"></div> -->
    </div>
  </div>
  <div v-if="data.msgContent.type === 'groupTip'" class="wim-tip">
    <p>{{data.msgContent.content}}</p>
  </div>
</div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    isSelf: {
      type: Boolean,
      default: false
    },
    uiConfig: {
      type: Object
    },
    wechatAvatar: {
      type: String
    }
  },
  created() {},
  computed: {
    avatarUrl: function() {
      return this.isSelf
        ? this.data.fromAccountHead || this.wechatAvatar
        : this.data.fromAccountHead;
    },
    contentHTML: function() {
      const msgContent = this.data.msgContent;
      if (typeof msgContent === 'string') {
        return msgContent;
      } else {
        switch (msgContent.type) {
          case 'image':
            let html = `<img class='image' src='${msgContent.smallImg}'>`;
            return html;
          case 'audio':
            return JSON.stringify(this.data.msgContent);
          default:
            return JSON.stringify(this.data.msgContent);
        }
      }
    },
    styl: function() {
      let defaultStyl = {
        msgColor: '#fbd157',
        fontColor: '#606c76'
      };
      const { to, self } = this.uiConfig;
      return this.isSelf ? self || defaultStyl : to || defaultStyl;
    }
  },
  methods: {}
};
</script>

<style lang='scss'>
$purple: #8b80f9;
$orange: #ed9153;
$yellow: #fbd157;
$chat: $yellow;
$font-color: #606c76;
$tip-color: #a7a7a9;
.wim-tip {
  color: $tip-color;
  width: 80%;
  margin: 36rpx auto;
  text-align: center;
  font-size: 28rpx;
}
.wim-chat-message {
  display: flex;
  margin-right: 108rpx;
  margin-left: 32rpx;
  margin-bottom: 10rpx;
  padding: 20rpx 0 10rpx;
  position: relative;

  .avatar {
    min-width: 88rpx;
    width: 88rpx;
    height: 88rpx;
    border-radius: 44rpx;
    background-color: #dcdcdc;
  }
  .right {
    margin-left: 24rpx;
  }
  .nickname-time {
  }
  .tag {
    height: 36rpx;
    line-height: 36rpx;
    border-radius: 16rpx;
    padding: 0 12rpx;
    display: inline-block;
    font-size: 20rpx;
    background: $purple;
    color: $font-color;
    transform: translateY(-1px);
  }
  .nickname {
    color: $font-color;
    font-size: 26rpx;
    margin-left: 12rpx;
    user-select: text;
  }
  .time {
    color: #666;
    font-size: 24rpx;
    margin-left: 16rpx;
  }
  .content {
    display: flex;
    align-items: center;
    color: $font-color;
    font-size: 28rpx;
    background: white;
    padding: 12rpx 16rpx;
    border-radius: 16rpx;
    border-top-left-radius: 0;
    min-height: 56rpx;
    margin-top: 6rpx;
  }
  .arrow {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 14rpx 30rpx 0;
    border-color: transparent $chat transparent transparent;
    position: absolute;
    top: 68rpx;
    left: 100rpx;
  }
  &.self {
    flex-direction: row-reverse;
    margin-right: 32rpx;
    margin-left: 108rpx;

    .right {
      margin-left: 0;
      /*margin-right: 24rpx;*/
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .nickname-time {
      display: flex;
      flex-direction: row-reverse;
    }
    .tag {
      display: none;
    }
    .time {
      transform: translateY(4rpx);
    }
    .content {
      color: rgba(255, 255, 255, 0.9);
      background: white;
      border-top-left-radius: 16rpx;
      border-top-right-radius: 0px;
    }
    .arrow {
      border-width: 0 0 30rpx 14rpx;
      border-color: transparent transparent transparent $chat;
      left: initial;
      right: 100rpx;
      top: 40rpx;
    }
    .text {
      color: $font-color;
    }
  }
  .text {
    user-select: text;
    word-break: break-word;
    .image {
      width: 540rpx;
    }
  }
  .image {
    position: relative;
    .progress,
    .progress-number {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 160rpx;
      height: 160rpx;
    }
    .progress-number {
      color: $font-color;
      text-align: center;
      line-height: 160rpx;
      font-size: 36rpx;
    }
    .img {
      max-width: 320rpx;
      max-height: 320rpx;
    }

    &.loading {
      .img {
        filter: blur(5px);
      }
      .progress {
        display: block;
      }
      .progress-number {
        display: block;
      }
    }
  }
}
</style>
