<template>
<div class="wim-msg-list">
  <scroll-view
    class="msg-list-scroller"
    scroll-y
    scroll-with-animation
    :scroll-into-view='toItem'
    @scrolltoupper="loadMore"
    :style="{height: scrollHeight+'rpx', top: top+'rpx', bottom: bottom+'rpx' }"
  >
    <msg-item
      :key='item.time'
      v-for='item in list'
      :data='item'
      :is-self='item.fromAccount == selfId'>
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
    // 单位是 rpx
    top: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      windowHeight: 0
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
