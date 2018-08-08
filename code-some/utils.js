/*
Ex:
stringifyQuery({foo: "bar", baz: ['a','b'], fizz: {foo: [1,2,3], bar: {bees: "knees"}}});
-> ?foo=bar&baz[]=a&baz[]=b&fizz[foo][]=1&fizz[foo][]=2&fizz[foo][]=3&fizz[bar][bees]=knees
Square brackets will be URL encoded; I didn't do so in this example for readability.
*/

const ilog = console.log;

function stringifyQuery(obj, parentName) {
  let res = null;
  if (obj) {
    res = Object.keys(obj)
      .map(key => {
        const val = obj[key];

        if (parentName) key = parentName + '[' + key + ']';
        if (val === undefined) return '';
        if (val === null) return encodeURIComponent(key);

        if (!Array.isArray(val) && typeof val === 'object') {
          return stringifyQuery(val, key).slice(1);
        }

        if (Array.isArray(val)) {
          const result = [];

          val.forEach(val2 => {
            if (val2 === undefined) return;
            if (val2 === null) {
              result.push(encodeURIComponent(key + '[]'));
            } else {
              result.push(
                encodeURIComponent(key + '[]') + '=' + encodeURIComponent(val2)
              );
            }
          });

          return result.join('&');
        }

        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
      })
      .filter(x => x.length > 0)
      .join('&');
  }

  return res ? `?${res}` : '';
}

function getQueryObject(url) {
  const search = url ? url.substring(url.lastIndexOf('?') + 1) : '';
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

function getType(v) {
  return Object.prototype.toString.call(v).slice(8, -1);
}

// tiny version of lodash get
function get(obj = {}, path = '') {
  return path
    .replace(/\[(.+?)\]/g, '.$1')
    .split('.')
    .reduce((o, key) => o && o[key], obj);
}

let obj = { a: { name: 'bbb', shop: { addr: 'cccd' }, arr: ['idx1', 'idx2'] } };
ilog('==== get =======');
ilog(get(null, 'a.arr'));
ilog(get(45, 'a.arr'));
ilog(get(obj, 'a.arr'));
ilog(get(obj, 'a.arr[1]'));

ilog('- - -');

ilog(get(obj, 'a.name'));
ilog(get(obj, '[a][shop].addr')); // 如果第一个是中括号，会有问题
ilog(get(obj, 'a[shop][addr]'));
ilog(get(obj, 'a[shop].addr'));

ilog('- - -');

ilog(get(obj, 'a[shop].ojbk'));
ilog(get(obj, 'a.xxx.ojbk'));
ilog(get(obj, 'xxx.xxx.ojbk'));

function omit(obj, omits = []) {
  if (!obj || typeof obj !== 'object') return null;
  return Object.keys(obj).reduce((o, key) => {
    if (!omits.includes(key)) {
      o[key] = obj[key];
    }
    return o;
  }, {});
}

function pick(obj, picks = []) {
  if (!obj || typeof obj !== 'object') return null;
  return Object.keys(obj).reduce((o, key) => {
    if (picks.includes(key)) {
      o[key] = obj[key];
    }
    return o;
  }, {});
}

obj = { a: '123231', b: 'dafdsa', name: 'hallo', say: () => {}, circle: obj };
ilog('===== omit & pick =======');
ilog(pick(null, ['name', 'b']));
ilog(pick(undefined, ['name', 'b']));
ilog(pick(45, ['name', 'b']));
ilog(omit(obj, ['name', 'b']));
ilog(omit(obj, ['obj', 'circle']));
ilog(pick(obj, ['name', 'say', 'circle']));
ilog(pick(obj, ['xxx', 'circle']));

/**
 * Format a date like YYYY-MM-DD.
 *
 * @param {string} template
 * @param {Date=} [date]
 * @return {string}
 */
function formatDate(template, date) {
  var specs = 'YYYY:MM:DD:HH:mm:ss'.split(':');
  date = new Date(date || Date.now() - new Date().getTimezoneOffset() * 6e4);
  return date
    .toISOString()
    .split(/[-:.TZ]/)
    .reduce(function(template, item, i) {
      return template.split(specs[i]).join(item);
    }, template);
}

/**
 *
 * other infomations: 
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance_API
 * https://developers.google.com/web/tools/chrome-devtools/rendering-tools/
 * https://css-tricks.com/paint-timing-api/
 * @returns
 */

function getAllListeners() {
  const taglist = document.body.getElementsByTagName('*');
  let count = {};
  let total = 0;

  for (let i = 0; i < taglist.length; i++) {
    /* eslint-disable no-undef */
    const listeners = getEventListeners(taglist[i]);
    /* eslint-enable no-undef */
    const keys = Object.keys(listeners);
    keys.reduce((ct, key) => {
      const len = listeners[key].length;
      total += len;
      ct[key] = ct[key] ? ct[key] + len : len;
      return ct;
    }, count)
  }

  count.total = total;
  return count;
}
