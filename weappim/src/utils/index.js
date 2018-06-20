function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [month, day].map(formatNumber).join('/');
  const t2 = [hour, minute, second].map(formatNumber).join(':');

  return `${t1} ${t2}`;
}

export function getProp(obj, path) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  let keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    // 如果 obj 为空，返回 undefined
    if (!tempObj) return undefined;
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      // 没找到 path 返回 undefined
      return undefined;
    }
  }
  return tempObj;
}

export function omit(obj, paths) {
  let temp = {};
  for (let key in obj) {
    if (paths.indexOf(key) === -1) {
      temp[key] = obj[key];
    }
  }
  return temp;
}

export default {
  formatNumber,
  formatTime
};
