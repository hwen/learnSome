<template>
  <div class="container">
    <msg-list
      :list="msgList"
      :self-id="cfg.identifier"
      :has-more="hasMore"
      :to-item="toItem"
      @loadMore="loadHistory"
    >
    </msg-list>
    <chat-input
      :im="im"
      @sendMsg="onSendMsg"
    ></chat-input>
  </div>
</template>

<script>
import IM from '@/utils/im';
import { omit } from '@/utils/index';
import { config } from '@/config/index';

import MsgList from '@/components/msgList';
import ChatInput from '@/components/chatInput';

const cfg = {
  accountMode: config.accountMode,
  accountType: config.accountType,
  sdkappid: config.sdkappid,
  group: config.group,
  userSig: config.user2.sig,
  identifier: config.user2.id
};

export default {
  components: {
    MsgList,
    ChatInput
  },
  data() {
    return {
      motto: 'Hello World--',
      userInfo: {},
      cfg: cfg,
      connMsg: '',
      // 有新消息时，滚动到新消息处
      toItem: '',
      msgList: [],
      im: null,
      hasMore: false
    };
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo(userInfo => {
      const imConfig = Object.assign(
        {
          ...userInfo,
          selType: 'GROUP',
          selToID: config.group
        },
        cfg
      );
      ilog(`type: ${imConfig.selType}, selToID: ${imConfig.selToID}`);
      this.im = new IM(imConfig, {
        onConnNotify: this.onConnNotify.bind(this),
        onMsgNotify: this.onMsgNotify.bind(this),
        onLogin: this.onLogin.bind(this)
      });
    });
  },

  methods: {
    getUserInfo(cb) {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              this.userInfo = res.userInfo;
              cb(res.userInfo);
            }
          });
        }
      });
    },
    initIM(userInfo, selType, selToID) {
      const imConfig = Object.assign(
        {
          ...userInfo,
          selType: selType,
          selToID: selToID
        },
        cfg
      );
      ilog(`type: ${imConfig.selType}, selToID: ${imConfig.selToID}`);
      this.im = new IM(imConfig, {
        onConnNotify: this.onConnNotify.bind(this),
        onMsgNotify: this.onMsgNotify.bind(this),
        onLogin: this.onLogin.bind(this)
      });
    },
    onConnNotify(msg) {
      ilog('连接状态：' + msg);
      this.connMsg = msg;
    },
    scrollToLastMsg() {
      const lastItem = this.msgList[this.msgList.length - 1];
      this.toItem = lastItem.sessType + lastItem.seq;
    },
    clearScrollFlag() {
      this.toItem = '';
    },
    onMsgNotify(msgList) {
      ilog('收到新信息：');
      console.log(msgList);
      this.msgList = this.msgList.concat(msgList || []);
      this.scrollToLastMsg();
    },
    loadHistory() {
      this.clearScrollFlag();
      this.im.loadMsgHistory(
        5,
        resp => {
          ilog('加载历史消息成功~');
          console.log(resp);
          this.hasMore = resp.Complete === 0;
          let firstPull = this.msgList.length === 0;
          this.msgList = (resp.msgList || []).concat(this.msgList);
          if (firstPull) {
            ilog('第一次拉取');
            this.scrollToLastMsg();
          }
        },
        err => {
          ilog('错误~');
          console.log(err);
        }
      );
    },
    onLogin() {
      this.loadHistory();
    },
    onSendMsg(msg) {
      if (config.selType === 'C2C') {
        this.msgList.push(msg);
      }
    }
  }
};
</script>

<style scoped lang='scss'>
</style>
