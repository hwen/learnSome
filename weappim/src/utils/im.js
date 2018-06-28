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

  static isLogin() {
    return webimhandler.isLogin();
  }

  initChat(config, selSess = null) {
    let avChatRoomId = null;
    let selToID = config.toId || '';
    let selType = config.selType === 'C2C' ? C2C : GROUP;
    if (selType === GROUP) {
      avChatRoomId = config.group || null;
      selToID = config.group || null;
    }
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

  // 创建默认的可直接加入的聊天室
  initGroup(opts, cbOk, cbErr) {
    const groupOpts = Object.assign(
      {
        // groudId: `@TGS#testtesttest${this.config.id}-${Math.round(
        //   Math.random() * Date.now()
        // )}`,
        invitedFriends: [],
        notification: '',
        introduction: '',
        faceUrl: '',
        name: `GST#${this.config.id}-${Math.round(Math.random() * 4294967296)}`,
        /**
         * 其他：只能看到入群之后的历史消息
         * 聊天室：群成员可以看到入群之前的历史消息
         */
        groupType: 'ChatRoom',
        joinOption: 'FreeAccess'
      },
      opts
    );
    webimhandler.createGroup(groupOpts, cbOk, cbErr);
  }

  init(config) {
    const avChatRoomId = config.group;
    this.isLogOn = config.isLogOn || false;
    this.initChat(config);
    // 当前用户身份
    this.loginInfo = {
      sdkAppID: config.sdkappid, // 用户所属应用id,必填
      appIDAt3rd: config.sdkappid, // 用户所属应用id，必填
      accountType: config.accountType, // 用户所属应用帐号类型，必填
      identifier: config.id, // 当前用户ID,必须是否字符串类型，选填
      identifierNick: config.nickName || config.id, // 当前用户昵称，选填
      avatar: config.avatarUrl || '',
      userSig: config.userSig // 当前用户身份凭证，必须是字符串类型，选填
    };

    // 监听（多终端同步）群系统消息方法
    // TODO
    const onGroupSystemNotifys = {
      '5': webimhandler.onDestoryGroupNotify, // 群被解散(全员接收)
      '11': webimhandler.onRevokeGroupNotify, // 群已被回收(全员接收)
      '255': webimhandler.onCustomGroupNotify // 用户自定义通知(默认全员接收)
    };

    const { onConnNotify, onMsgNotify, onReadyChat } = this.listeners;
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
                  // 筛选出会话中的消息
                  const { selType, selToID } = this.config;
                  /* eslint-disable */
                  return m.sessType == selType && m.sess.id == selToID;
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
      loginSuccessInfo => {
        console.log(loginSuccessInfo);
        const { selType, selToID, toId } = this.config;
        const invites = toId ? [toId] : [''];
        if (selType === GROUP && !selToID) {
          this.initGroup(
            { invitedFriends: invites },
            resp => {
              console.log('===== 建群成功 =====');
              console.log(resp);
              // 创群成功后，重新初始化聊天配置
              this.config.group = resp.GroupId;
              this.initChat(this.config);
              onReadyChat();
            },
            err => {
              throw err;
            }
          );
        } else {
          onReadyChat();
        }
      }
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

  sendPicMsg(opts, cbOk, cbErr) {
    // webimhandler.sendPicMsg(opts, cbOk, cbErr);
    webimhandler.sendMediaMsg('image', opts, cbOk, cbErr);
  }

  sendSoundMsg(opts, cbOk, cbErr) {
    webimhandler.sendMediaMsg('sound', opts, cbOk, cbErr);
  }
}
