// import au from 'autoit';
const au = require('autoit');
au.Init();

export function openNotePad(): void {
  au.Run('notepad.exe');
  au.WinWait('[Class:Notepad]');
  au.Send('Hello, autoit & nodejs!');
}

export function logMousePos(second: number = 10): void {
  let count = 0;
  let sid = setInterval(() => {
    if (count++ > second) clearInterval(sid);
    console.log('鼠标位置：' + JSON.stringify(au.MouseGetPos()));
  }, 1000);
}
