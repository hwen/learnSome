<template>
  <div class="container">
    <msg-list
      :list="msgList"
      :self-id="cfg.Identifier"
      :has-more="hasMore"
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
  UserSig: config.user2.sig,
  Identifier: config.user2.id
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
          selType: 'C2C',
          selToID: config.user3.id
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
    bindViewTap() {
      const url = '../logs/main';
      // wx.navigateTo({ url });
      this.sendMsg(`[${new Date().toLocaleString()}]: hallo sxxx~~`);
    },
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
    clickHandle(msg, ev) {
      console.log('clickHandle:', msg, ev);
    },
    onConnNotify(msg) {
      ilog('连接状态：' + msg);
      this.connMsg = msg;
    },
    onMsgNotify(msgList) {
      ilog('收到新信息：');
      console.log(msgList);
      this.msgList = this.msgList.concat(msgList || []);
    },
    loadHistory() {
      this.im.loadMsgHistory(
        5,
        resp => {
          ilog('加载历史消息成功~');
          console.log(resp);
          this.hasMore = resp.Complete === 0;
          this.msgList = (resp.msgList || []).concat(this.msgList);
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
      this.msgList.push(msg);
    }
  }
};
</script>

<style scoped lang='scss'>
</style>
