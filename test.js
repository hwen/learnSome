let state = {};
export function updateApi(name) {
  if (state[name]) {
    state[name].api.update();
  }
}
function initState(item) {
  return Object.assign(item, { loading: false, data: null, error: "" });
}
// 对比参数
function variableDiff(preVariable, variable) {
  if (preVariable == undefined && variable == undefined) return true;
  if (preVariable == variable) return true;
  let res = Object.keys(variable).some(
    key => preVariable[key] != variable[key]
  );
  return !res;
}

function fetch(option) {
  let {
    isLoading = false,
    ql,
    title = "加载中...",
    onError,
    onSuccess,
    variable,
    updateQuery,
    name
  } = option;
  state[name].initialQuery = true;
  if (state[name].loading == false) {
    state[name].loading = true;
    state[name].update();
  }
  if (isLoading) wx.showLoading({ title });
  return ql(variable)
    .then(data => {
      if (updateQuery) {
        data = updateQuery(state[name].data, data, variable);
      }
      state[name].loading = false;
      state[name].data = data;
      //更新
      state[name].update();
      isLoading && wx.hideLoading();
      onSuccess &&
        onSuccess({ type: "success", message: `${title}成功` }, data);
      return data;
    })
    .catch(error => {
      state[name].loading = false;
      state[name].error = error;
      state[name].update();
      isLoading && wx.hideLoading();
      onError &&
        onError({ type: "error", message: `${error.message || error.msg}` });
      return error;
    });
}

//主动调用
export function useAutoQuery(com, options) {
  // 初始数据
  const name = options.name;
  //初始state
  if (!state[name]) {
    state[name] = {};
    initState(state[name]);
    state[name].loading = true;
  }
  //每次render后确保都是最新的组件
  state[name].update = () => com.forceUpdate();
  let preVariable = state[name].variable;
  state[name].variable = options.variable;
  //组件是否准备好
  if (com.__isReady) {
    //是否需要请求 状态是否改变
    if (options.hold) {
      console.lo