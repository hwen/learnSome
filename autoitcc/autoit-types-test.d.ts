/*
declare namespace autoit {
    function Init(): void;

    function error(): number;

    function AutoItSetOption(szOption: string, nValue: number): number;

    function ClipGet(nBufSize: number[]): any;

    function ClipPut(szClip: string): void;

    function ControlClick(szTitle [, szText], szControl [, szButton] [, nNumClicks] [, nX] [, nY]): number;
    function ControlClick(hWnd, hCtrl [, szButton] [, nNumClicks] [, nX] [, nY]): number;

    function ControlCommand(szTitle [, szText], szControl, szCommand [, szExtra] [, nBufSize]): string;
    function ControlCommand(hWnd, hCtrl, szCommand [, szExtra] [, nBufSize]): string;

    function ControlListView(szTitle [, szText], szControl, szCommand [, szExtra1] [, szExtra2] [, nBufSize]): string;
    function ControlListView(hWnd, hCtrl, szCommand [, szExtra1] [, szExtra2] [, nBufSize]): string;

    function ControlDisable(szTitle [, szText], szControl): number;
    function ControlDisable(hWnd, hCtrl): number;

    function ControlEnable(szTitle [, szText], szControl): number;
    function ControlEnable(hWnd, hCtrl): number;

    function ControlFocus(szTitle [, szText], szControl): number;
    function ControlFocus(hWnd, hCtrl): number;

    function ControlGetFocus(szTitle [, szText] [, nBufSize]): string;
    function ControlGetFocus(hWnd [, nBufSize]): string;

    function ControlGetHandle(hWnd, szControl): any;
    function ControlGetHandleAsText(szTitle [, szText], szControl [, nBufSize]): string;

    function ControlGetPos(szTitle [, szText], szControl): any;
    function ControlGetPos(hWnd, hCtrl): any;

    function ControlGetText(szTitle [, szText], szControl [, nBufSize]): string;
    function ControlGetText(hWnd, hCtrl [, nBufSize]): string;

    function ControlHide(szTitle [, szText], szControl): number;
    function ControlHide(hWnd, hCtrl): number;

    function ControlMove(szTitle [, szText], szControl, nX, nY [, nWidth] [, nHeight]): number;
    function ControlMove(hWnd, hCtrl, nX, nY [, nWidth] [, nHeight]): number;

    function ControlSend(szTitle [, szText], szControl, szSendText [, nMode]): number;
    function ControlSend(hWnd, hCtrl, szSendText [, nMode]): number;

    function ControlSetText(szTitle [, szText], szControl, szControlText): number;
    function ControlSetText(hWnd, hCtrl, szControlText): number;

    function ControlShow(szTitle [, szText], szControl): number;
    function ControlShow(hWnd, hCtrl): number;

    function ControlTreeView(szTitle [, szText], szControl, szCommand [, szExtra1] [, szExtra2] [, nBufSize]): string;
    function ControlTreeView(hWnd, hCtrl, szCommand [, szExtra1] [, szExtra2] [, nBufSize]): string;

    function DriveMapAdd(szDevice, szShare, nFlags [, szUser] [, szPwd] [, nBufSize]): string;
    function DriveMapDel(szDevice): number;
    function DriveMapGet(szDevice [, nBufSize]): string;

    function IsAdmin(): number;

    function MouseClick([szButton] [, nX] [, nY] [, nClicks] [, nSpeed]): number;
    function MouseClickDrag(szButton, nX1, nY1, nX2, nY2 [, nSpeed]): number;
    function MouseDown([szButton]): void;
    function MouseGetCursor(): number;
    function MouseGetPos(): any;
    function MouseMove(nX, nY [, nSpeed]): number;
    function MouseUp([szButton]): void;
    function MouseWheel(szDirection, nClicks): void;

    function Opt(szOption, nValue): number;

    function PixelChecksum(lpRect [, nStep]): number;
    function PixelGetColor(nX, nY): number;
    function PixelSearch(lpRect, nCol [, nVar] [, nStep]): any;
    function ProcessClose(szProcess): number;
    function ProcessExists(szProcess): number;
    function ProcessSetPriority(szProcess, nPriority): number;
    function ProcessWait(szProcess [, nTimeout]): number;
    function ProcessWaitClose(szProcess [, nTimeout]): number;

    function Run(szProgram [, szDir] [, nShowFlag]);: number;
    function RunWait(szProgram [, szDir] [, nShowFlag]);: number;
    function RunAs(szUser, szDomain, szPassword, nLogonFlag, szProgram [, szDir] [, nShowFlag]): number;
    function RunAsWait(szUser, szDomain, szPassword, nLogonFlag, szProgram [, szDir] [, nShowFlag]): number;

    function Send(szSendText [, nMode]): void;
    function Shutdown(nFlags): number;
    function Sleep(nMilliseconds): void;
    function StatusbarGetText(szTitle [, szText] [, nPart] [, nBufSize]): string;
    function StatusbarGetText(hWnd [, nPart] [, nBufSize]): string;

    function ToolTip(szTip [, nX] [, nY]): void;

    function WinActivate(szTitle [, szText]): number;
    function WinActivate(hWnd): number;

    function WinActive(szTitle [, szText]): number;
    function WinActive(hWnd): number;

    function WinClose(szTitle [, szText]): number;
    function WinClose(hWnd): number;

    function WinExists(szTitle [, szText]): number;
    function WinExists(hWnd): number;

    function WinGetCaretPos(): any;

    function WinGetClassList(szTitle [, szText] [, nBufSize]): string;
    function WinGetClassList(hWnd [, nBufSize]): string;

    function WinGetClientSize(szTitle [, szText]): any;
    function WinGetClientSize(hWnd): any;

    function WinGetHandle(szTitle [, szText]): any;

    function WinGetHandleAsText(szTitle [, szText] [, nBufSize]): string;

    function WinGetPos(szTitle [, szText]): any;
    function WinGetPos(hWnd): any;

    function WinGetProcess(szTitle [, szText]): number;
    function WinGetProcess(hWnd): number;

    function WinGetState(szTitle [, szText]): number;
    function WinGetState(hWnd): number;

    function WinGetText(szTitle [, szText] [, nBufSize]): string;
    function WinGetText(hWnd [, nBufSize]): string;

    function WinGetTitle(szTitle [, szText] [, nBufSize]): string;
    function WinGetTitle(hWnd [, nBufSize]): string;

    function WinKill(szTitle [, szText]): number;
    function WinKill(hWnd): number;

    function WinMenuSelectItem(szTitle [, szText], szItem1 [, szItem2] [, szItem3] [, szItem4] [, szItem5] [, szItem6] [, szItem7] [, szItem8]): number;
    function WinMenuSelectItem(hWnd, szItem1 [, szItem2] [, szItem3] [, szItem4] [, szItem5] [, szItem6] [, szItem7] [, szItem8]): number;

    function WinMinimizeAll(): void;
    function WinMinimizeAllUndo(): void;

    function WinMove(szTitle [, szText], nX, nY [, nWidth] [, nHeight]): number;
    function WinMove(hWnd, nX, nY [, nWidth] [, nHeight]): number;

    function WinSetOnTop(szTitle [, szText], nFlag): number;
    function WinSetOnTop(hWnd, nFlag): number;

    function WinSetState(szTitle [, szText], nFlags): number;
    function WinSetState(hWnd, nFlags): number;

    function WinSetTitle(szTitle [, szText], szNewTitle): number;
    function WinSetTitle(hWnd, szNewTitle): number;

    function WinSetTrans(szTitle [, szText], nTrans): number;
    function WinSetTrans(hWnd, nTrans): number;

    function WinWait(szTitle [, szText] [, nTimeout]): number;
    function WinWait(hWnd [, nTimeout]): number;

    function WinWaitActive(szTitle [, szText] [, nTimeout]): number;
    function WinWaitActive(hWnd [, nTimeout]): number;

    function WinWaitClose(szTitle [, szText] [, nTimeout]): number;
    function WinWaitClose(hWnd [, nTimeout]): number;

    function WinWaitNotActive(szTitle [, szText] [, nTimeout]): number;
    function WinWaitNotActive(hWnd [, nTimeout]): number;

    function PostMessage(hWnd, nMsg [, nWParam] [, nLParam]): number;

    function SendMessage(hWnd, nMsg [, nWParam] [, nLParam]): number;
}

export = autoit;
export as namespace autoit;
*/
