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

// tiny version of lodash get
function get(obj = {}, path = '', defaultValue = null) {
  return (
    path
      .replace(/\[(.+?)\]/g, '.$1')
      .split('.')
      .reduce((o, key) => o && o[key], obj) || defaultValue
  );
}

let obj = { a: { name: 'bbb', shop: { addr: 'cccd' }, arr: [] } };
ilog('==== get =======');
ilog(obj);
ilog(get(obj, 'a.arr'));
ilog(get(obj, 'a.name'));
ilog(get(obj, 'a.shop.addr'));
ilog(get(obj, 'a[shop][addr]'));
ilog(get(obj, 'a[shop].addr'));
ilog(get(obj, 'a[shop].ojbk'));
ilog(get(obj, 'a.xxx.ojbk'));
ilog(get(obj, 'xxx.xxx.ojbk'));

function omit(obj = {}, omits = []) {
  return Object.keys(obj).reduce((o, key) => {
    if (!omits.includes(key)) {
      o[key] = obj[key];
    }
    return o;
  }, {});
}

function pick(obj = {}, picks = []) {
  return Object.keys(obj).reduce((o, key) => {
    if (picks.includes(key)) {
      o[key] = obj[key];
    }
    return o;
  }, {});
}

obj = { a: '123231', b: 'dafdsa', name: 'hallo', say: () => {}, circle: obj };
ilog('===== omit & pick =======');
ilog(omit(obj, ['name', 'b']));
ilog(omit(obj, ['obj', 'circle']));
ilog(pick(obj, ['name', 'say', 'circle']));
ilog(pick(obj, ['xxx', 'circle']));
