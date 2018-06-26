<template>
<div class="wim-msg-list">
  <scroll-view
    class="msg-list-scroller"
    scroll-y
    scroll-with-animation
    :scroll-into-view="toItem"
    @scrolltoupper="loadMore"
    :style="{background: scrollStyle.background, height: scrollStyle.height, top: scrollStyle.top, bottom: scrollStyle.bottom}"
  >
    <msg-item
      :key="item.time"
      v-for="item in list"
      :data="item"
      :ui-config="uiConfig"
      :wechat-avatar="wechatAvatar"
      :is-self='item.fromAccount == selfId'>
    </msg-item>
    <!--<msg-item-->
      <!--v-if="!list || list.length < 1"-->
      <!--:data="defaultMsg"-->
      <!--:ui-config="uiConfig"-->
    <!--&gt;-->
    </msg-item>
  </scroll-view>
</div>
</template>

<script>
import MsgItem from './msgItem.vue';

export default {
  components: {
    MsgItem
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    uiConfig: {
      type: Object,
      required: true
    },
    selfId: {
      type: String
    },
    hasMore: {
      type: Boolean,
      default: false
    },
    toItem: {
      type: String
    },
    wechatAvatar: {
      type: String
    }
  },
  data() {
    return {
      windowHeight: 0,
      top: 0,
      bottom: 100,
      defaultMsg: {
        msgContent: {
          type: 'groupTip',
          content: '已进入聊天室'
        }
      }
    };
  },
  created() {
    const sysInfo = wx.getSystemInfoSync();
    // 可用高度转化成rpx
    this.ratio = 750 / sysInfo.screenWidth;
    this.windowHeight = this.ratio * sysInfo.windowHeight;
  },
  computed: {
    scrollHeight: function() {
      return this.windowHeight - this.bottom - this.top;
    },
    top: function() {
      const { msgBox } = this.uiConfig;
      if (msgBox.top) this.top = ~~msgBox.top;
    },
    bottom: function() {
      const { msgBox } = this.uiConfig;
      if (msgBox.bottom) this.bottom = ~~msgBox.bottom;
    },
    scrollStyle: function() {
      const background = '#ffffff';
      return {
        background: this.uiConfig.background || background,
        bottom: `${this.bottom}rpx`,
        top: `${this.top}rpx`,
        height: `${this.scrollHeight}rpx`
      };
    }
  },

  methods: {
    loadMore() {
      if (this.hasMore) {
        this.$emit('loadMore');
      }
    }
  }
};
</script>

<style lang='scss'>
.wim-msg-list {
  width: 100%;
  height: 100%;
  .msg-list-scroller {
    position: absolute;
    background: #f5f5f5;
  }
}
</style>
