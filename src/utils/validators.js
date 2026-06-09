// 表单校验规则，集中管理方便多页面复用。
export const phoneRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1\d{10}$/, message: '请输入正确的 11 位手机号' },
];

export const passwordRules = [
  { required: true, message: '请输入密码' },
  { min: 6, message: '密码长度不能少于 6 位' },
];

export function requiredRule(label) {
  return { required: true, message: '请输入' + label };
}

export function positiveNumberRule(label) {
  return {
    validator(_, value) {
      if (Number(value) > 0) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(label + '必须大于 0'));
    },
  };
}

export function confirmPasswordRule(form) {
  return {
    validator(_, value) {
      if (!value || form.getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('两次输入的密码不一致'));
    },
  };
}
