import Vue, { PluginObject } from 'vue';
// 手机号验证
export const phone = (rule, value, callback) => {
  const regFormat = /^[1]([3-9])[0-9]{9}$/; // 正确手机号
  if (!value) {
    return callback(new Error('不能为空'));
  }
  if (!(regFormat.test(value))) {
    callback(new Error('请输入正确手机号'));
  } else {
    callback();
  }
};
// 校验 url
export const checkUrl = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不能为空'));
  }
  const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
  if (!reg.test(value)) {
    callback(new Error('请输入正确的域名'));
  } else {
    callback();
  }
};
export const loginPassWord = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不能为空'));
  }
  if (value.length < 6) {
    return callback(new Error('密码支持6-20位，包含数字、字母'));
  } if (value.length > 20) {
    return callback(new Error('密码支持6-20位，包含数字、字母'));
  }

  const regFormat = /[\W]/g;
  if ((regFormat.test(value))) {
    callback(new Error('请输入数字或字母'));
  } else {
    callback();
  }
};
export const loginName = (rule, value, callback) => {
  const regFormat = /[\W]/g;
  if (!value) {
    return callback(new Error('不能为空'));
  }
  if ((regFormat.test(value))) {
    callback(new Error('请输入数字或字母'));
  } else {
    callback();
  }
};
// 数字验证
export const number = (rule, value, callback) => {
  const regFormat = /^[0-9]*$/; // 数字
  if (!value) {
    return callback(new Error('不能为空'));
  }
  if (!(regFormat.test(value))) {
    callback(new Error('请输入数字'));
  } else {
    callback();
  }
};
// text不能为空
export const text = (rule, value, callback) => {
  const regFormat = /^[^!@#$%^&*()-=+]/g; // 中文字符
  (value === '' || value == null);
  if (value === '' || value == null) {
    return callback(new Error('不能为空'));
  }
  callback();

  if (!(regFormat.test(value))) {
    callback(new Error('请输入有效字符(数字\字母\空格\中文)'));
  } else {
    callback();
  }
};
// desc不能为空
export const desc = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不能为空'));
  }
  callback();
};
// 邮箱
export const email = (rule, value, callback) => {
  const mal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!value) {
    return callback(new Error('不能为空'));
  }
  if (!(mal.test(value))) {
    callback(new Error('请输入正确邮箱'));
  } else {
    callback();
  }
};
// 开始时间
export const startTime = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择开始日期'));
  }
  callback();
};
// 开始时间
export const endTime = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择结束日期'));
  }
  callback();
};
// 时间
export const time = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择日期'));
  }
  callback();
};
// 多选框
export const checkbox = (rule, value, callback) => {
  if (value.length < 1) {
    return callback(new Error('请选择一个'));
  }
  callback();
};
// 单选框
export const radio = (rule, value, callback) => {
  // (value)
  if (!value) {
    return callback(new Error('请选择一个'));
  }
  callback();
};
// 下拉框
export const select = (rule, value, callback) => {
  if (value.length < 1) {
    return callback(new Error('请选择一个'));
  }
  callback();
};
// 上传图片
export const imageUrl = (rule, value, callback) => {
  // (value)
  if (!value) {
    callback(new Error('请上传图片'));
  } else {
    callback();
  }
};
// 身份证验证
export const IDCard = (rule, value, callback) => {
  const IDExpress = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!IDExpress.test(value)) {
    callback(new Error('请填写正确的身份证号码'));
  } else {
    callback();
  }
};

// ip验证 regxp = new RegExp("^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\.$)\.)){4}$")
export const ip = (rule, value, callback) => {
  const mal = /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])($|(?!\.$)\.)){4}$/;
  if (!value) {
    return callback(new Error('不能为空'));
  }
  if (!(mal.test(value))) {
    callback(new Error('请输入正确ip地址'));
  } else {
    callback();
  }
};
// 端口验证
export const port = (rule, value, callback) => {
  const mal = /^[0-9]*$/;
  if (!value) {
    return callback(new Error('不能为空'));
  }
  if (!(mal.test(value))) {
    callback(new Error('请输入正确端口号'));
  } else if (value >= 0 && value <= 65535) {
    callback();
  } else {
    callback(new Error('请输入0~65535范围内的端口号'));
  }
};

// 填写校验 不填写不校验
export const isCheck = (rule, value, callback, ruleName) => {
  if (value !== '') {
    eval(ruleName)(rule, value, callback);
  } else {
    callback();
  }
};

export const formVer = {
  // 插件
  checkUrl,
  loginName,
  phone,
  number,
  text,
  desc,
  email,
  startTime,
  endTime,
  time,
  checkbox,
  radio,
  select,
  imageUrl,
  IDCard,
  isCheck,
  loginPassWord,
};

