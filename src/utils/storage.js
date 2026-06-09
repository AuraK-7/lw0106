// localStorage 统一封装，避免页面层直接操作浏览器存储细节。
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.error('读取本地存储失败：', error);
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('写入本地存储失败：', error);
    }
  },
  remove(key) {
    window.localStorage.removeItem(key);
  },
};
