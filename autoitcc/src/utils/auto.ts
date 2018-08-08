// import au from 'autoit';
const au = require('autoit');
const ilog = console.log;
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

export function randomMove(): void {
  for (let i = 0; i < 40; i++) {
    au.MouseMove(1000 * Math.random(), 1000 * Math.random(), 200);
  }
}

export function getPosition(): void {
  au.Run('notepad.exe');
  const pad = au.WinWait('[CLASS:Notepad]', '', 10);
  ilog(pad);
  ilog(typeof pad);
  const pos = au.ControlGetPos(`${pad}`, '', 'Edit1');
  const other = au.WinGetPos(pad);
  ilog(pos);
  ilog(`other pos =>`);
  ilog(other);
  au.WinClose(pad);
}

export function searchPixel() {
  const result = au.PixelSearch(
    au
      .RECT({
        left: 0,
        top: 0,
        right: 1000,
        bottom: 1000
      })
      .ref(),
    0xff0000,
    10
  );
  ilog('==== search pixel ====');
  ilog(result);
}
