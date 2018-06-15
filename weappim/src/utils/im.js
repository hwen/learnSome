import webim from './../lib/webim';
import webimhandler from './webim_handler';

console.log(webim.Log);

export default class IM {
  constructor(config, listeners) {
    this.init(config);
    this.listeners = listeners;
  }

  init(config) {
    const that = this;

    const avChatRoomId = config.avChatRoomId;
    webimhandler.init({
      accountMode: config.accountMode,
      accountType: config.accountType,
      sdkAppID: config.sdkappid,
      avChatRoomId: avChatRoomId, // 默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
      selType: webim.SESSION_TYPE.GROUP,
      selToID: avChatRoomId,
      selSess: null // 当前聊天会话
    });
    // 当前用户身份
    const loginInfo = {
      sdkAppID: config.sdkappid, // 用户所属应用id,必填
      appIDAt3rd: config.sdkappid, // 用户所属应用id，必填
      accountType: config.accountType, // 用户所属应用帐号类型，必填
      identifier: that.data.Identifier, // 当前用户ID,必须是否字符串类型，选填
      identifierNick: that.data.Identifier, // 当前用户昵称，选填
      userSig: that.data.UserSig // 当前用户身份凭证，必须是字符串类型，选填
    };

    // 监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
    const onGroupSystemNotifys = {
      '5': webimhandler.onDestoryGroupNotify, // 群被解散(全员接收)
      '11': webimhandler.onRevokeGroupNotify, // 群已被回收(全员接收)
      '255': webimhandler.onCustomGroupNotify // 用户自定义通知(默认全员接收)
    };

    // 监听连接状态回调变化事件
    const onConnNotify = function(resp) {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          // webim.Log.warn('连接状态正常...');
          break;
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn(
            '连接已断开，无法收到新消息，请检查下你的网络是否正常'
          );
          break;
        default:
          webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
          break;
      }
    };

    // 监听事件
    const listeners = {
      onConnNotify: webimhandler.onConnNotify, // 选填
      onMsgNotify: msgs => {
        console.log('receive msging........');
        // 监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
        webimhandler.onMsgNotify(msgs, this.listeners.onMsgNotify);
      }
    };

    // 其他对象，选填
    const options = {
      isAccessFormalEnv: true, // 是否访问正式环境，默认访问正式，选填
      isLogOn: false // 是否开启控制台打印日志,默认开启，选填
    };

    console.log('login ready...');
    if (config.accountMode === 1) {
      // 托管模式
      webimhandler.sdkLogin(loginInfo, listeners, options, avChatRoomId);
    } else {
      // 独立模式
      console.log('独立模式登陆中...');
      console.log('loginInfo...');
      console.log(loginInfo);
      console.log('options...');
      console.log(options);
      webimhandler.sdkLogin(loginInfo, listeners, options, avChatRoomId);
    }
  }
}
