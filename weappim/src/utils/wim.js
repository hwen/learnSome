import webim from './../lib/webim';

class Wim {
  constructor() {
    this.selToID = null;
    this.loginInfo = null;
    this.sdkAppID = null;
    this.avChatRoomId = null;
    this.selSess = null;
    this.selToID = null;
    this.selSessHeadUrl = null;
  }

  init(config) {
    this.accountMode = config.accountMode;
    this.accountType = config.accountType;
    this.sdkAppID = config.sdkAppID;
    this.avChatRoomId = config.avChatRoomId;
    this.selType = config.selType;
    this.selToID = config.selToID;
  }

  sdkLogin(userInfo, listeners, options, chatRoomId) {
    webim.login(
      userInfo,
      listeners,
      options,
      function(identifierNick) {
        console.debug(identifierNick);
        // identifierNick为登录用户昵称(没有设置时，为帐号)，无登录态时为空
        console.debug(identifierNick);
        webim.Log.info('webim登录成功');
        console.log('gg: webim 登陆成功.......');
        this.loginInfo = userInfo;
        setProfilePortrait(
          {
            ProfileItem: [
              {
                Tag: 'Tag_Profile_IM_Nick',
                Value: userInfo.identifierNick
              }
            ]
          },
          function() {
            avChatRoomId && applyJoinBigGroup(avChatRoomId); //加入大群
          }
        );
        //hideDiscussForm();//隐藏评论表单
        //initEmotionUL();//初始化表情
      },
      function(err) {
        console.error(err.ErrorInfo);
      }
    ); //
  }
}

export default new Wim();
