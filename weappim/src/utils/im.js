import webim from './../lib/webim';
import webimhandler from './webim_handler';

// 会话类型
const C2C = webim.SESSION_TYPE.C2C;
const GROUP = webim.SESSION_TYPE.GROUP;

export default class IM {
  constructor(config, listeners) {
    this.config = Object.assign({}, config);
    this.listeners = listeners;
    this.getPrePageC2CHistroyMsgInfoMap = {};
    this.init(config);
  }

  islogin() {
    return webimhandler.isLogin();
  }

  initChat(selToID, selType = C2C, selSess = null) {
    const avChatRoomId = selType === GROUP ? selToID : null;
    Object.assign(this.config, {
      selType,
      selToID,
      selSess
    });
    webimhandler.init({
      accountMode: this.config.accountMode,
      accountType: this.config.accountType,
      sdkAppID: this.config.sdkappid,
      avChatRoomId: avChatRoomId, // 默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
      selType: selType,
      selToID: selToID,
      selSess: selSess // 当前聊天会话
    });
  }

  init(config) {
    const that = this;
    const avChatRoomId = config.avChatRoomId;
    this.isLogOn = config.isLogOn || false;

    const selType = config.selType === 'C2C' ? C2C : GROUP;
    this.initChat(config.selToID, selType);
    // 当前用户身份
    this.loginInfo = {
      sdkAppID: config.sdkappid, // 用户所属应用id,必填
      appIDAt3rd: config.sdkappid, // 用户所属应用id，必填
      accountType: config.accountType, // 用户所属应用帐号类型，必填
      identifier: config.identifier, // 当前用户ID,必须是否字符串类型，选填
      identifierNick: config.nickName || config.identifier, // 当前用户昵称，选填
      userSig: config.userSig // 当前用户身份凭证，必须是字符串类型，选填
    };

    // 监听（多终端同步）群系统消息方法
    // TODO
    const onGroupSystemNotifys = {
      '5': webimhandler.onDestoryGroupNotify, // 群被解散(全员接收)
      '11': webimhandler.onRevokeGroupNotify, // 群已被回收(全员接收)
      '255': webimhandler.onCustomGroupNotify // 用户自定义通知(默认全员接收)
    };

    const { onConnNotify, onMsgNotify, onLogin } = this.listeners;
    // 监听事件
    const listeners = {
      // 监听连接状态回调变化事件
      onConnNotify: resp => {
        let msg = '';
        switch (resp.ErrorCode) {
          case webim.CONNECTION_STATUS.ON:
            // webim.Log.warn('连接状态正常...');
            break;
          case webim.CONNECTION_STATUS.OFF:
            msg = '连接已断开，无法收到新消息，请检查下你的网络是否正常';
            webim.Log.warn(msg);
            break;
          default:
            msg = '未知连接状态,status=' + resp.ErrorCode;
            webim.Log.error(msg);
            break;
        }
        onConnNotify && onConnNotify(msg);
      }, // 选填
      onMsgNotify: msgs => {
        console.log('receive msging........');
        // 监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
        webimhandler.onMsgNotify(msgs, msgList => {
          onMsgNotify &&
            onMsgNotify(
              msgList &&
                msgList.filter(m => {
                  const { selType, selToID, identifier } = this.config;
                  /* eslint-disable */
                  return m.sessType == selType;
                  /* eslint-enable */
                })
            );
        });
      }
    };

    // 其他对象，选填
    const options = {
      isAccessFormalEnv: true, // 是否访问正式环境，默认访问正式，选填
      isLogOn: this.isLogOn // 是否开启控制台打印日志,默认开启，选填
    };

    webimhandler.sdkLogin(
      this.loginInfo,
      listeners,
      options,
      avChatRoomId,
      onLogin
    );
  }

  sendMsg(msg, callback) {
    webimhandler.onSendMsg(msg, callback);
  }

  loadMsgHistory(reqMsgCount, cbOk, cbError) {
    console.log('loading history...');
    const { selType } = this.config;
    if (selType === C2C) {
      webimhandler.getLastC2CHistoryMsgs(reqMsgCount, cbOk, cbError);
    } else {
      webimhandler.getLastGroupHistoryMsgs(reqMsgCount, cbOk, cbError);
    }
  }

  // 上传图片
  // uploadPic() {
  //   const uploadFiles = document.getElementById('upd_pic');
  //   var file = uploadFiles.files[0];
  //   wx.chooseImage({
  //     success: filePaths => {
  //       console.log(filePaths);
  //     },
  //     fail: err => {
  //       console.error(err);
  //     }
  //   });
  //   var businessType; // 业务类型，1-发群图片，2-向好友发图片
  //   if (this.config.selType === C2C) {
  //     // 向好友发图片
  //     businessType = UploadPicBussinessType.C2C_MSG;
  //   } else if (this.config.selType === GROUP) {
  //     // 发群图片
  //     businessType = UploadPicBussinessType.GROUP_MSG;
  //   }
  //   // 封装上传图片请求
  //   var opt = {
  //     file: file, // 图片对象
  //     onProgressCallBack: onProgressCallBack, // 上传图片进度条回调函数
  //     // 'abortButton': document.getElementById('upd_abort'), //停止上传图片按钮
  //     From_Account: loginInfo.identifier, // 发送者帐号
  //     To_Account: selToID, // 接收者
  //     businessType: businessType // 业务类型
  //   };
  //   // 上传图片
  //   webim.uploadPic(
  //     opt,
  //     function(resp) {
  //       // 上传成功发送图片
  //       sendPic(resp);
  //       $('#upload_pic_dialog').modal('hide');
  //     },
  //     function(err) {
  //       console.log(err.ErrorInfo);
  //     }
  //   );
  // }
}
