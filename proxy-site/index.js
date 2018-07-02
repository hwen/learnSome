/* eslint-disable */
const express = require('express');
const multer = require('multer');
const request = require('request');
const app = express();
const upload = multer({ dest: 'uploads/' });
const proxy = require('http-proxy-middleware');
const modifyRes = require('./modifyRes');

// proxy qn webrtc
const qnHost = 'https://demo-rtc.qnsdk.com';

// insert before web script
const firstScript = `<script type="text/javascript">
document.title = 'proxy your site man';
var store = localStorage;
if (!store.getItem('userid')) {
  var randomId = 'halloman' + Math.round(Math.random() * 100234);
  store.setItem('userid', randomId);
}
</script>`;

// hide stats ui
const script = `<script type="text/javascript">
var stat = document.querySelector('.stats__3FGWY');
var roomName = document.querySelector('.roomName__31vKZ');
var avatars = document.querySelector('#avatars');
if (stat) {
  stat.parentNode.removeChild(stat);
}
if (roomName) {
  roomName.innerHTML = 'Yoyooo man';
}
if (avatars) {
  avatars.parentNode.removeChild(avatars);
}
</script>`;

const addScript = body => {
  console.log('body:', body);
  let result = '';
  let preStr = body.slice(0, body.indexOf('</body>'));
  preStr = preStr.replace('/styles.css', `${qnHost}/styles.css`);
  const scriptPre = '<script type="text/javascript" src="';

  const rgx = /\<script type=\"text\/javascript\" src=\"/g;
  // 插入 firstScript
  preStr = preStr.replace(scriptPre, `${firstScript}${scriptPre}`);
  preStr = preStr.replace(rgx, `<script type="text/javascript" src="${qnHost}`);

  // 插入脚本
  result = `${preStr}${script}</body>
  </html>`;
  return result;
};

// proxy middleware options
const options = {
  target: 'https://demo-rtc.qnsdk.com', // target host
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  onProxyRes: function(proxyRes, req, res) {
    console.log(req.url);
    if (req.url == '/' || req.url == '/room/heiman') {
      modifyRes(res, proxyRes, body => {
        console.log('on data...');
        console.log(body);
        return addScript(body);
      });
    }
  },
  router: {
    // your site : target site
    'https://local.me:2333': 'https://demo-rtc.qnsdk.com'
  }
};

const proxyWebRtc = proxy(options);
app.use('/', proxyWebRtc);

app.listen(2333, () => {
  console.log('Express server listening on 2333');
});
