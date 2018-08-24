export function throttle(fn, delay) {
  let lastCall = 0;
  return function(...arg) {
    const now = new Date();
    if (now - lastCall > delay) {
      /**
       * The fn(...args) is a call to the original listener, fn.
       * The function in which it is called is
       * the stand-in (proxy) listener that manages the throttling.
       * The return value of the fn(...args) call is returned
       *  so that anything you would return from your normal listener
       *  (e.g., return false to prevent the default behavior) would also be
       * returned from the stand-in listener.
       */
      return fn(...arg);
    }
    lastCall = now;
  };
}

/**
 * _.throttle 方法，只不过是多给 debounce 传了一个 maxWait 选项，
 * 这个选项的意思是至少保证在每 maxWait 时间让 func 被调用一次。
 *
 * @export
 * @param {*} fn
 * @param {*} delay
 * @returns
 */
export function throttle2(fn, delay) {
  let timer;
  return function(...arg) {
    if (!timer) {
      timer = setTimeout(function() {
        fn(...arg);
        timer = null;
      }, delay);
    }
  };
}

export function debounce(fn, delay) {
  let timer;
  return function(...arg) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      fn(...arg);
      timer = null;
    }, delay);
  };
}
