const ilog = console.log;
const getAsync = (params, isReject) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isReject) reject(params);
      else {
        resolve({ a: params });
      }
    }, 500);
  });
};

const getB = () => {
  // 可以在 then 更改返回
  return getAsync()
    .then(resp => {
      console.log(`getB:${resp}`);
      return {
        b: resp,
        test: 'hallo'
      };
    })
    .catch(err => {
      throw err;
    });
};

const notThrowErr = () => {
  return getAsync('not throw...', true)
    .then(resp => {
      return Object.assign(resp, { mes: 'Iam extended by notThrowErr' });
    })
    .catch(err => {
      console.log('Iam not throw, but return err');
      return err;
      // throw err;
    });
};

// getB then 里可以改变 resp 的值
getB()
  .then(resp => {
    console.log('======== after ==========');
    console.log(resp);
    // 输出 { b: { a:1 }, test: 'hallo' }
  })
  .catch(err => {
    console.log('========== what the fucking err ==========');
    console.log(err);
  });

// 测试 async/await 在 for 循环里使用
async function testFor() {
  const result = [];
  for (let i = 0; i < 11; i++) {
    const resp = await getAsync(i);
    result.push(resp);
  }
  console.log('======= async/await with for =========');
  console.log(result);
}

testFor();

(async () => {
  try {
    const resp = await notThrowErr();
  } catch (err) {
    ilog(`End: ${err}`);
  }
})();
