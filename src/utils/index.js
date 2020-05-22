/**
 * @name: 滚动函数
 * @param {number} amount
 */
export function move(amount) {
  document.documentElement.scrollTop = amount;
  document.body.parentNode.scrollTop = amount;
  document.body.scrollTop = amount;
}

const requestAnimFrame = (function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
}());

/**
 * @name: 计算位置
 * @return: number
 */
export function position() {
  return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
}

/**
 * @name: 滚动倒顶部
 * @param {number} to
 * @param {number} duration
 * @param {function} callback
 */
export function scrollTop(to, duration = 500, callback) {
  const start = position();
  const change = to - start;
  const increment = 20;
  let currentTime = 0;
  const animateScroll = function () {
    currentTime += increment;
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    move(val);
    if (currentTime < duration) {
      requestAnimFrame(animateScroll);
    } else if (callback && typeof (callback) === 'function') {
      callback();
    }
  };
  animateScroll();
}

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t * t + b;
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
