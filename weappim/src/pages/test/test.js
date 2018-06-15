/* eslint-disable */
//index.js
//获取应用实例
var webim = require('../../utils/webim.js');
var webimhandler = require('../../utils/webim_handler.js');
var tls = require('../../utils/tls.js');

webimhandler.setLog(false);

var Config = {
  sdkappid: 0,
  accountType: 0,
  accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
};

tls.init({
  sdkappid: Config.sdkappid
});
var app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    msgs: [],
    Identifier: null,
    UserSig: null,
    msgContent: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    });
  },

  clearInput: function() {
    this.setData({
      msgContent: ''
    });
  },

  bindConfirm: function(e) {
    var that = this;
    var content = e.detail.value;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    console.log('准备发送消息。。。');
    webimhandler.onSendMsg(content, function() {
      that.clearInput();
    });
  },

  bindTap: function() {
    webimhandler.sendGroupLoveMsg();
  },

  login: function(cb) {
    var that = this;
    cb();
  },

  receiveMsgs: function(data) {
    if (data && data.length > 1) {
      data.map(item => {
        delete item.sess;
        item.content = item.elems.reduce((result, item) => {
          result += item.text;
        }, '');
        return item;
      });
    }
    var msgs = this.data.msgs || [];
    msgs.push(data);

    //最多展示10条信息
    if (msgs.length > 10) {
      msgs.splice(0, msgs.length - 10);
    }

    this.setData({
      msgs: msgs
    });
  },

  initIM: function(userInfo) {
    var that = this;

    var avChatRoomId = '@TGS#2Y3IVPIFK';
    webimhandler.init({
      accountMode: Config.accountMode,
      accountType: Config.accountType,
      sdkAppID: Config.sdkappid,
      avChatRoomId: avChatRoomId, //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
      selType: webim.SESSION_TYPE.C2C,
      selToID: avChatRoomId,
      selSess: null //当前聊天会话
    });
    //当前用户身份
    var loginInfo = {
      sdkAppID: Config.sdkappid, //用户所属应用id,必填
      appIDAt3rd: Config.sdkappid, //用户所属应用id，必填
      accountType: Config.accountType, //用户所属应用帐号类型，必填
      identifier: that.data.Identifier, //当前用户ID,必须是否字符串类型，选填
      identifierNick: that.data.Identifier, //当前用户昵称，选填
      userSig: that.data.UserSig //当前用户身份凭证，必须是字符串类型，选填
    };

    //监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
    var onGroupSystemNotifys = {
      '5': webimhandler.onDestoryGroupNotify, //群被解散(全员接收)
      '11': webimhandler.onRevokeGroupNotify, //群已被回收(全员接收)
      '255': webimhandler.onCustomGroupNotify //用户自定义通知(默认全员接收)
    };

    //监听连接状态回调变化事件
    var onConnNotify = function(resp) {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          //webim.Log.warn('连接状态正常...');
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

    //监听事件
    var listeners = {
      onConnNotify: webimhandler.onConnNotify, //选填
      onBigGroupMsgNotify: function(msg) {
        webimhandler.onBigGroupMsgNotify(msg, function(msgs) {
          that.receiveMsgs(msgs);
        });
      }, //监听新消息(大群)事件，必填
      onMsgNotify: function(msgs) {
        console.log('receive msging........');
        //监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
        webimhandler.onMsgNotify(msgs);
        // that.receiveMsgs(msgs)
      }, //监听新消息(大群)事件，必填
      onGroupSystemNotifys: webimhandler.onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
      onGroupInfoChangeNotify: webimhandler.onGroupInfoChangeNotify //监听群资料变化事件，选填
    };

    //其他对象，选填
    var options = {
      isAccessFormalEnv: true, //是否访问正式环境，默认访问正式，选填
      isLogOn: true //是否开启控制台打印日志,默认开启，选填
    };

    console.log('login ready...');
    if (Config.accountMode == 1) {
      //托管模式
      webimhandler.sdkLogin(loginInfo, listeners, options, avChatRoomId);
    } else {
      //独立模式
      //sdk登录
      console.log('独立模式登陆中...');
      console.log('loginInfo...');
      console.log(loginInfo);
      console.log('options...');
      console.log(options);
      webimhandler.sdkLogin(loginInfo, listeners, options);
    }
  },
  onLoad: function() {
    var that = this;
    //调用应用实例的方法获取全局数据

    app.getUserInfo(function(userInfo) {
      //更新数据
      console.debug(userInfo);
      that.setData({
        userInfo: userInfo
      });

      console.log('get User Info complete...');
      that.login(function() {
        that.initIM(userInfo);
      });
    });
  }
});
