
<template>
  <div class="wim-container">
    <msg-list
      :list="msgList"
      :self-id="imConfig.identifier"
      :has-more="hasMore"
      :to-item="toItem"
      :ui-config="uiConfig"
      @loadMore="loadHistory"
    >
    </msg-list>
    <chat-input
      v-show="uiConfig.isShowChatInput"
      :im="im"
      @sendMsg="onSendMsg"
      @chooseImg="onChooseImg"
    ></chat-input>
  </div>
</template>

<script>
import IM from '../utils/im.js';
import MsgList from './msgList.vue';
import ChatInput from './chatInput.vue';

export default {
  components: {
    MsgList,
    ChatInput
  },
  props: {
    imConfig: {
      type: Object,
      required: true
    },
    userInfo: {
      type: Object,
      required: true
    },
    uiConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      connMsg: '',
      // 有新消息时，滚动到新消息处
      toItem: '',
      msgList: [],
      im: null,
      hasMore: false
    };
  },

  created() {
    this.initIM(this.userInfo);
  },

  watch: {
    userInfo: function(newUserInfo) {
      this.initIM(newUserInfo);
    }
  },

  methods: {
    initIM(userInfo) {
      if (userInfo && userInfo.nickName && !this.im) {
        console.log(
          `initIm => type: ${this.imConfig.selType}, selToID: ${
            this.imConfig.selToID
          }`
        );
        const listeners = {
          onConnNotify: this.onConnNotify.bind(this),
          onMsgNotify: this.onMsgNotify.bind(this),
          onLogin: this.onLogin.bind(this)
        };
        this.im = new IM(
          Object.assign(
            {
              ...this.userInfo
            },
            this.imConfig
          ),
          listeners
        );
      }
    },
    onConnNotify(errMsg) {
      this.connMsg = errMsg;
      if (errMsg) {
        console.log('连接错误：' + errMsg);
        wx.showModal({
          title: '连接断开',
          content: '检测到网络异常，请检查设备状态后重试',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
            }
          }
        });
      }
    },
    scrollToLastMsg() {
      const lastItem = this.msgList[this.msgList.length - 1];
      this.toItem = lastItem.sessType + lastItem.seq;
      setTimeout(() => {
        this.toItem = '';
      }, 500);
    },
    onMsgNotify(msgList) {
      console.log('收到新信息：');
      console.log(msgList);
      this.msgList = this.msgList.concat(msgList || []);
      this.scrollToLastMsg();
    },
    loadHistory() {
      wx.showLoading({ title: '加载' });
      this.im.loadMsgHistory(
        15,
        resp => {
          wx.hideLoading();
          console.log('加载历史消息成功~');
          console.log(resp);
          this.hasMore = resp.Complete === 0;
          let firstPull = this.msgList.length === 0;
          this.msgList = (resp.msgList || []).concat(this.msgList);
          if (firstPull) {
            console.log('第一次拉取');
            this.test = 2;
            setTimeout(() => {
              this.scrollToLastMsg();
            }, 500);
          }
        },
        err => {
          console.log('错误~');
          console.log(err);
        }
      );
    },
    onLogin() {
      this.loadHistory();
    },
    onSendMsg(msg) {
      if (this.imConfig.selType === 'C2C') {
        this.msgList.push(msg);
        this.scrollToLastMsg();
      }
    },
    onChooseImg() {
      let file = null;
      // const { IMAGE } = webim.UPLOAD_RES_TYPE;
      const opts = {
        count: 1,
        success: files => {
          console.log(files);
          wx.uploadFile({
            url: 'http://local.me:2333/upload/img',
            filePath: files.tempFilePaths[0],
            name: 'img',
            formData: {
              k: 'fuckyouman'
            },
            success: resp => {
              console.log('====== upload resp =========');
              const opts = JSON.parse(resp.data);
              console.log(opts);
              const bsnType = this.imConfig.selType === 'GROUP' ? 1 : 2;

              const uploadData = {
                fromAccount: this.imConfig.identifier,
                toAccount: this.imConfig.selToID,
                // 图片或文件的业务类型，群消息:1; c2c消息:2; 个人头像：3; 群头像：4
                businessType: bsnType,
                // fileType: 1,
                fileMd5: opts.md5,
                totalSize: opts.totalSize,
                base64Str: opts.base64Str
              };
              console.log('ready upload data..........');
              console.log(uploadData);
              this.uploadPic(
                uploadData,
                uploadRes => {
                  console.log('上传成功。。。。。');
                  console.log(uploadRes);
                },
                uploadErr => {
                  console.log('上传错误。。。。。');
                  console.log(uploadErr);
                }
              );
            }
          });
        }
      };
      wx.chooseImage(opts);
    },
    uploadPic(opts, cbOk, cbErr) {
      this.im.sendPicMsg(opts, cbOk, cbErr);
    }
  }
};
</script>

<style scoped lang='scss'>
$font-color: #606c76;
.wim-container {
  color: $font-color;
  font-size: 32rpx;
}
</style>
