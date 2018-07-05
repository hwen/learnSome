const getAsync = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ a: 1 });
    }, 500);
  });
};

const getB = () => {
  // 可以在 then 更改返回
  return getAsync().then(resp => {
    console.log(`getB:${resp}`);
    return {
      b: resp,
      test: 'hallo'
    };
  });
};

getB().then(resp => {
  console.log('======== after ==========');
  console.log(resp);
  // 输出 { b: { a:1 }, test: 'hallo' }
});
