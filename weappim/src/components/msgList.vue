<template>
<div class="msg-list">
  <scroll-view
    class="msg-list-scroller"
    scroll-y
    scroll-with-animation
    :scroll-into-view='toItem'
    @scrolltoupper="loadMore"
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
  created() {},
  computed: {},

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
}
.msg-list-scroller {
  height: 600rpx;
  margin: 60rpx 0;
}
</style>
