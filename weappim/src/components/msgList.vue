<template>
<div class="msg-list">
  <msg-item
    :key='item.time'
    v-for='item in list'
    :data='item'
    :is-self='item.fromAccount == selfId'>
  </msg-item>
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
    }
  },
  computed: {}
};
</script>

<style lang='scss'>
</style>
