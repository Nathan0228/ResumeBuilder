let toastFn = null;
let confirmResolveFn = null;

export function toast(message, options = {}) {
  if (toastFn) {
    toastFn(message, options);
  }
}

export function confirm(message, options = {}) {
  return new Promise((resolve) => {
    if (toastFn) {
      confirmResolveFn = resolve;
      toastFn(message, {
        ...options,
        isConfirm: true,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
      });
    } else {
      resolve(window.confirm(message));
    }
  });
}

export function registerToastFn(fn) {
  toastFn = fn;
}

export function resolveConfirm(result) {
  if (confirmResolveFn) {
    confirmResolveFn(result);
    confirmResolveFn = null;
  }
}
