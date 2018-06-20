<template>
  <div :class="['chat-message', isSelf ? 'self' : '']">
    <img class="avatar" :src="isSelf ? 'https://cdn.suisuijiang.com/fiora/avatar/2.jpg' : 'https://cdn.suisuijiang.com/fiora/./avatar/10.jpg'" alt="sdf">
    <div class="right">
      <div class="nickname-time">
        <!-- <span class="tag"></span> -->
        <span class="nickname">{{data.fromAccountNick}}</span>
        <span class="time">{{data.time}}</span>
      </div>
      <div class="content">
        <div class="text">{{text}}</div>
      </div>
      <div class="arrow"></div>
    </div>
  </div>
</template>

<script>
import { getProp, formatTime } from '@/utils';

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    isSelf: {
      type: Boolean
    }
  },
  computed: {
    text: function() {
      return JSON.stringify(this.data.msgContent);
    }
  },
  methods: {
    formatTime: formatTime
  }
};
</script>

<style lang='scss'>
$purple: #8b80f9;
$orange: #ed9153;
$yellow: #fbd157;
$font-color: #606c76;
.chat-message {
  display: flex;
  margin-right: 54px;
  margin-bottom: 10px;
  position: relative;

  .avatar {
    min-width: 44px;
    width: 44px;
    height: 44px;
    border-radius: 22px;
  }
  .right {
    margin-left: 12px;
  }
  .nickname-time {
  }
  .tag {
    height: 18px;
    line-height: 18px;
    border-radius: 8px;
    padding: 0 6px;
    display: inline-block;
    font-size: 10px;
    background-color: $purple;
    color: $font-color;
    transform: translateY(-1px);
  }
  .nickname {
    color: #333;
    font-size: 13px;
    margin-left: 6px;
    user-select: text;
  }
  .time {
    color: #666;
    font-size: 12px;
    margin-left: 8px;
  }
  .content {
    display: inline-block;
    color: #555;
    font-size: 14px;
    background-color: $orange;
    padding: 6px 8px;
    border-radius: 8px;
    border-top-left-radius: 0px;
    min-height: 28px;
    margin-top: 3px;
  }
  .arrow {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0px 7px 15px 0;
    border-color: transparent $orange transparent transparent;
    position: absolute;
    top: 28px;
    left: 49px;
  }
  &.self {
    flex-direction: row-reverse;
    margin-right: 0px;
    margin-left: 54px;

    .right {
      margin-left: 0px;
      margin-right: 12px;
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
      transform: translateY(2px);
    }
    .content {
      color: rgba(255, 255, 255, 0.9);
      background-color: $purple;
      border-top-left-radius: 8px;
      border-top-right-radius: 0px;
    }
    .arrow {
      border-width: 0 0 15px 7px;
      border-color: transparent transparent transparent $purple;
      left: initial;
      right: 49px;
      top: 20px;
    }
    .text {
      color: $font-color;
    }
  }
  .text {
    user-select: text;
    word-break: break-word;
    & > img {
      user-select: text;
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
      width: 80px;
      height: 80px;
    }
    .progress-number {
      color: $font-color;
      text-align: center;
      line-height: 80px;
      font-size: 18px;
    }
    .img {
      max-width: 500px;
      max-height: 400px;
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
