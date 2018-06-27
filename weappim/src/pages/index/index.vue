<template>
  <weapp-im
    :im-config="imConfig"
    :ui-config="uiConfig"
    :user-info="userInfo"
  ></weapp-im>
</template>

<script>
import WeappIm from '@/components/weappIm';
import { config } from '@/config';
const imConfig = {
  accountMode: config.accountMode, // 后台账号模式
  accountType: config.accountType, // 后台账号类型
  sdkappid: config.sdkappid, // sdkid
  group: '@TGS#32LDNEJFF', // 群组id
  userSig: config.user2.sig, // 用户 sig
  id: config.user2.id, // 用户 id
  selType: 'GROUP', // 会话类型
  toId: 'newman' // 聊天对象ID
};

const uiConfig = {
  to: {
    msgColor: '#EAEBF0',
    fontColor: '#46474B'
  },
  self: {
    msgColor: '#C2DAFE',
    fontColor: '#100'
  },
  msgBox: {
    top: 0,
    bottom: 100
  },
  background: '',
  isShowChatInput: true
};

export default {
  components: {
    WeappIm
  },
  data() {
    return {
      motto: 'Hello World--',
      userInfo: {},
      imConfig: imConfig,
      uiConfig: uiConfig
    };
  },

  created() {
    const userInfo = {
      nickName: 'hwencc'
    };
    console.log('程序启动成功');
    let flag = true;
    setTimeout(() => {
      if (flag) this.userInfo = userInfo;
    }, 3 * 1000);
    // 调用应用实例的方法获取全局数据
    this.getUserInfo(userInfo => {
      flag = false;
      ilog('登陆成功');
      ilog(userInfo);
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
              cb && cb(res.userInfo);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang='scss'>
$font-color: #606c76;
.container {
  color: $font-color;
  font-size: 32rpx;
}
</style>
