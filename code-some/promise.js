const getAsync = (params) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ a: params });
      // reject({a: 'fuck fuck....'});
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
  }).catch(err => {
    throw err;
  });
};

// getB then 里可以改变 resp 的值
getB().then(resp => {
  console.log('======== after ==========');
  console.log(resp);
  // 输出 { b: { a:1 }, test: 'hallo' }
}).catch(err => {
  console.log('========== what the fucking err ==========');
  console.log(err)
});

// 测试 async/await 在 for 循环里使用
async function testFor() {
  const result = [];
  for (let i = 0; i < 11; i++) {
    const resp = await getAsync(i);
    result.push(resp)
  }
  console.log('======= async/await with for =========')
  console.log(result)
}

testFor();
