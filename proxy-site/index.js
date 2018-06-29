const fs = require('fs');
const zlib = require('zlib');
const express = require('express');
const multer = require('multer');
const md5 = require('md5');
const m3Duration = require('mp3-duration');
const request = require('request')
const app = express();
const upload = multer({ dest: 'uploads/' });
const proxy = require('http-proxy-middleware');

const qnHost = 'https://demo-rtc.qnsdk.com';

const script = `<script type="text/javascript">
var title = document.querySelector('.title__3uxox');
console.log(title)
var name = document.querySelector('#username');
name.innerHTML = 'IamFromNodejs';
localStorage.setItem('userid', 'halloman');
</script>`;

// proxy middleware options
const options = {
        target: 'https://demo-rtc.qnsdk.com', // target host
        changeOrigin: true,               // needed for virtual hosted sites
        ws: true,                         // proxy websockets
        // pathRewrite: {
        //     '^/api/old-path' : '/api/new-path',     // rewrite path
        //     '^/api/remove/path' : '/path'           // remove base path
        // },
        onProxyRes: function (proxyRes, req, res) {
          const end = res.end;
          const writeHead = res.writeHead;
          let writeHeadArgs;
          let body;
          let buffer = new Buffer('');
          const manipulateBody = (body) => {
            console.log('======= fuck you man ===========')
            console.log(body)
          }

          // Concat and unzip proxy response
          proxyRes
            .on('data', (chunk) => {
              buffer = Buffer.concat([buffer, chunk]);
            })
            .on('end', () => {
              body = zlib.gunzipSync(buffer).toString('utf8');
            });

          // Defer write and writeHead
          res.write = () => {};
          res.writeHead = (...args) => { writeHeadArgs = args; };

          // Update user response at the end
          res.end = () => {
            const output = manipulateBody(body); // some function to manipulate body
            // res.setHeader('content-length', output.length);
            // res.setHeader('content-encoding', '');
            writeHead.apply(res, writeHeadArgs);

            end.apply(res, [output]);
          };
        },
        router: {
            // when request.headers.host == 'dev.localhost:3000',
            // override target 'http://www.example.org' to 'http://localhost:8000'
            'http://local.me:2333' : 'https://demo-rtc.qnsdk.com'
        }
    };

// app.get('/', (req, res) => {
//   res.send('hallo world~');
// });
const exampleProxy = proxy(options);
app.use('/', exampleProxy);


app.get('/alltest', (req, res) => {
  const url = 'https://demo-rtc.qnsdk.com/room/gsttest';
  request(url, (error, response, body) => {
    console.log('body:', body);
    let result = '';
    let preStr = body.slice(0, body.indexOf('</body>'));
    preStr = preStr.replace('/styles.css', `${qnHost}/styles.css`);
    const scriptPre = '<script type="text/javascript" src="';
    const rgx = /\<script type=\"text\/javascript\" src=\"/g
    preStr = preStr.replace(rgx, `<script type="text/javascript" src="${qnHost}`);

    result = `${preStr}${script}</body>
    </html>`;
    
    res.send(result)
  })
})

app.listen(2333, () => {
  console.log('Express server listening on 2333');
});
