<template>
  <div class="container" @click="clickHandle('test click', $event)">

    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <msg-list
      :list='msgList'
      :self-id='cfg.Identifier'
    >
    </msg-list>
  </div>
</template>

<script>
import card from '@/components/card';
import IM from '@/utils/im';
import { config } from '@/config/index';

import MsgList from '@/components/msgList';

const cfg = {
  accountMode: config.accountMode,
  accountType: config.accountType,
  sdkappid: config.sdkappid,
  group: config.group,
  UserSig: config.user2.sig,
  Identifier: config.user2.id
};

function formatMsgList(msgList) {
  return (
    msgList &&
    msgList.map(item => {
      // 防止自引用
      delete item.sess._impl.msgs;
      return item;
    })
  );
}

function logSome(env, style) {
  env = env || 'dev';
  var logCount = 0;
  return function(info, force) {
    var type = {}.toString.call(info).slice(8, -1);
    var logStyle = style || 'color: #8b80f9;font-weight:bold;';

    if (force || env === 'development' || env === 'dev') {
      logCount++;
      if (type !== 'Object') {
        console.log('%c' + info, logStyle);
      } else {
        console.log('%c====== log ' + logCount + ' ======', logStyle);
        console.log(info);
      }
      return new Date() + ' => log:' + logCount;
    }
  };
}

const ilog = logSome('dev');

export default {
  components: {
    MsgList,
    card
  },
  data() {
    return {
      motto: 'Hello World--',
      userInfo: {},
      cfg: cfg,
      connMsg: '',
      msgList: [],
      im: null
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
    onLogin() {
      this.im.loadMsgHistory(
        15,
        resp => {
          ilog('加载历史消息成功~');
          console.log(resp);
          this.msgList = this.msgList.concat(formatMsgList(resp.MsgList) || []);
        },
        err => {
          ilog('错误~');
          console.log(err);
        }
      );
    },
    sendMsg(msg) {
      const { im } = this;
      if (!im) return;
      im.sendMsg(msg, resp => {
        ilog('发送消息成功');
        ilog(resp);
      });
    }
  }
};
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
</style>
