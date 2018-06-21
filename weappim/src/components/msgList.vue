<template>
<div class="msg-list">
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
import { getProp } from '@/utils';
import MsgItem from './msgItem';

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
    }
  },
  data() {
    return {
      windowHeight: 0,
      // rpx
      bottom: 100,
      top: 0
    };
  },
  created() {
    const sysInfo = wx.getSystemInfoSync();
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
      ilog('滚动到顶部了。。。。');
      if (this.hasMore) {
        ilog('加载更多历史信息。。。');
        this.$emit('loadMore');
      }
    }
  }
};
</script>

<style lang='scss'>
.msg-list {
  width: 100%;
  height: 100%;
}
.msg-list-scroller {
  position: absolute;
  background: #f5f5f5;
}
</style>
