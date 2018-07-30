// import au from './utils/autoitcc';
import tool from './utils';
// import au from 'autoit';
const au = require('autoit');

tool.hi();
au.Init();
au.Run('notepad.exe');
au.WinWait('[Class:Notepad]');
au.Send('Hello, autoit & nodejs!');
