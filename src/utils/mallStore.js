import { initialMockData } from '../mock';
import { buildOrderSummary } from './formatters';
import { storage } from './storage';

// 统一的本地数据仓库，前后台页面都通过该文件读写数据。
export const STORAGE_KEYS = {
  initialized: 'mall_initialized',
  banners: 'mall_banners',
  categories: 'mall_categories',
  products: 'mall_products',
  users: 'mall_users',
  addresses: 'mall_addresses',
  roles: 'mall_roles',
  admins: 'mall_admins',
  orders: 'mall_orders',
  cartItems: 'mall_cart_items',
  coupons: 'mall_coupons',
  userCoupons: 'mall_user_coupons',
  userSession: 'mall_user_session',
  adminSession: 'mall_admin_session',
  checkoutDraft: 'mall_checkout_draft',
};

const DATA_EVENT = 'mall:datachange';

// 全量商品规格升级映射表：将旧格式（字符串数组）升级为新格式（对象数组 { name, price, marketPrice, stock }）
const PRODUCT_SPEC_UPGRADE_MAP = {
  prod_1001: [{ name: '曜石黑 256G', price: 4999, marketPrice: 5399, stock: 18 }, { name: '深海蓝 512G', price: 5799, marketPrice: 6199, stock: 18 }],
  prod_1002: [{ name: '银色 128G', price: 2899, marketPrice: 3199, stock: 30 }, { name: '灰色 256G', price: 3299, marketPrice: 3599, stock: 28 }],
  prod_1003: [{ name: '标准版', price: 1499, marketPrice: 1799, stock: 25 }, { name: '除醛增强版', price: 1899, marketPrice: 2199, stock: 17 }],
  prod_1004: [{ name: '基础版', price: 2299, marketPrice: 2599, stock: 15 }, { name: '自动上下水版', price: 3299, marketPrice: 3699, stock: 9 }],
  prod_1005: [{ name: '30ml 双瓶装', price: 699, marketPrice: 799, stock: 0 }, { name: '50ml 礼盒装', price: 899, marketPrice: 999, stock: 10 }],
  prod_1006: [{ name: '暖调大地色', price: 239, marketPrice: 299, stock: 60 }, { name: '冷调灰粉色', price: 239, marketPrice: 299, stock: 60 }],
  prod_1007: [{ name: '青轴', price: 399, marketPrice: 459, stock: 25 }, { name: '静音红轴', price: 429, marketPrice: 499, stock: 22 }],
  prod_1008: [{ name: '白色', price: 899, marketPrice: 1099, stock: 32 }, { name: '黑色', price: 899, marketPrice: 1099, stock: 33 }],
  prod_1009: [{ name: '夜幕黑', price: 1199, marketPrice: 1399, stock: 20 }, { name: '薄荷绿', price: 1199, marketPrice: 1399, stock: 19 }],
  prod_1010: [{ name: '曜石黑', price: 599, marketPrice: 699, stock: 44 }, { name: '云雾白', price: 599, marketPrice: 699, stock: 44 }],
  prod_1011: [{ name: '银黑拼色', price: 3699, marketPrice: 4099, stock: 10 }, { name: '纯黑版', price: 3899, marketPrice: 4299, stock: 8 }],
  prod_1012: [{ name: '白橙暖光', price: 199, marketPrice: 239, stock: 56 }, { name: '深灰冷光', price: 199, marketPrice: 239, stock: 40 }],
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function emitMallChange() {
  window.dispatchEvent(new CustomEvent(DATA_EVENT));
}

export function subscribeMallChange(callback) {
  const handler = function () {
    callback();
  };
  window.addEventListener(DATA_EVENT, handler);
  window.addEventListener('storage', handler);
  return function () {
    window.removeEventListener(DATA_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

function readList(key, fallback) {
  return storage.get(key, deepClone(fallback));
}

function writeList(key, value) {
  storage.set(key, value);
  emitMallChange();
  return value;
}

export function generateId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

export function initializeMallData() {
  if (storage.get(STORAGE_KEYS.initialized, false)) {
    return;
  }

  storage.set(STORAGE_KEYS.banners, initialMockData.banners);
  storage.set(STORAGE_KEYS.categories, initialMockData.categories);
  storage.set(STORAGE_KEYS.products, initialMockData.products);
  storage.set(STORAGE_KEYS.users, initialMockData.users);
  storage.set(STORAGE_KEYS.addresses, initialMockData.addresses);
  storage.set(STORAGE_KEYS.roles, initialMockData.roles);
  storage.set(STORAGE_KEYS.admins, initialMockData.admins);
  storage.set(STORAGE_KEYS.orders, initialMockData.orders);
  storage.set(STORAGE_KEYS.cartItems, initialMockData.cartItems);
  storage.set(STORAGE_KEYS.coupons, initialMockData.coupons || []);
  storage.set(STORAGE_KEYS.userCoupons, initialMockData.userCoupons || []);
  storage.set(STORAGE_KEYS.userSession, null);
  storage.set(STORAGE_KEYS.adminSession, null);
  storage.set(STORAGE_KEYS.checkoutDraft, null);
  storage.set(STORAGE_KEYS.initialized, true);
}

export function getBanners() {
  return readList(STORAGE_KEYS.banners, initialMockData.banners);
}

function readCategories() {
  return readList(STORAGE_KEYS.categories, initialMockData.categories);
}

function readProducts() {
  const products = readList(STORAGE_KEYS.products, initialMockData.products);
  let hasUpgraded = false;
  const upgraded = products.map(function (product) {
    if (Array.isArray(product.specs) && product.specs.length && typeof product.specs[0] === 'object') {
      return product;
    }
    const newSpecs = PRODUCT_SPEC_UPGRADE_MAP[product.id];
    if (!newSpecs || !newSpecs.length) return product;
    hasUpgraded = true;
    return {
      ...product,
      specs: deepClone(newSpecs),
      price: newSpecs[0].price,
      marketPrice: newSpecs[0].marketPrice,
      stock: newSpecs.reduce(function (sum, s) { return sum + (s.stock || 0); }, 0),
    };
  });
  if (hasUpgraded) {
    storage.set(STORAGE_KEYS.products, upgraded);
    emitMallChange();
  }
  return hasUpgraded ? upgraded : products;
}

export function getCategories() {
  const categories = readCategories();
  const products = readProducts();

  return categories.filter(function (category) {
    return category.active !== false;
  }).map(function (category) {
    return {
      ...category,
      productCount: products.filter(function (product) {
        return product.categoryId === category.id && product.published;
      }).length,
    };
  });
}

export function getCategoryById(categoryId) {
  return getCategories().find(function (item) {
    return item.id === categoryId;
  });
}

export function getProducts(options = {}) {
  const params = {
    keyword: '',
    categoryId: 'all',
    sort: 'sales',
    page: 1,
    pageSize: 8,
    includeUnpublished: false,
    ...options,
  };

  const categoryMap = Object.fromEntries(
    readCategories().map(function (category) {
      return [category.id, category.name];
    })
  );

  let list = readProducts().map(function (item) {
    return {
      ...item,
      categoryName: categoryMap[item.categoryId] || '未分类',
    };
  });

  if (!params.includeUnpublished) {
    list = list.filter(function (item) {
      return item.published;
    });
  }

  if (params.categoryId && params.categoryId !== 'all') {
    list = list.filter(function (item) {
      return item.categoryId === params.categoryId;
    });
  }

  if (params.keyword) {
    const keyword = params.keyword.trim().toLowerCase();
    list = list.filter(function (item) {
      return item.name.toLowerCase().includes(keyword)
        || item.description.toLowerCase().includes(keyword)
        || item.detail.toLowerCase().includes(keyword)
        || item.categoryName.toLowerCase().includes(keyword)
        || (item.tags || []).join(' ').toLowerCase().includes(keyword);
    });
  }

  const sorters = {
    sales: function (a, b) { return b.sales - a.sales; },
    new: function (a, b) { return String(b.id).localeCompare(String(a.id)); },
    priceAsc: function (a, b) { return a.price - b.price; },
    priceDesc: function (a, b) { return b.price - a.price; },
  };
  list.sort(sorters[params.sort] || sorters.sales);

  const start = (params.page - 1) * params.pageSize;
  return {
    list: list.slice(start, start + params.pageSize),
    total: list.length,
    all: list,
  };
}

export function getHotProducts(limit = 8) {
  return getProducts().all.slice(0, limit);
}

export function getNewProducts(limit = 4) {
  return getProducts({ includeUnpublished: true }).all
    .sort(function (a, b) { return a.id < b.id ? 1 : -1; })
    .slice(0, limit);
}

export function getProductById(productId) {
  return getProducts({ includeUnpublished: true }).all.find(function (item) {
    return item.id === productId;
  });
}

// 获取某个规格的价格/库存信息，兼容旧格式（字符串数组）和新格式（对象数组）
export function getSpecInfo(product, specName) {
  if (!product || !specName) return { price: product?.price, marketPrice: product?.marketPrice, stock: product?.stock };
  const specs = product.specs;
  if (!Array.isArray(specs) || !specs.length) return { price: product.price, marketPrice: product.marketPrice, stock: product.stock };
  // 新格式：对象数组
  if (typeof specs[0] === 'object') {
    const found = specs.find(function (s) { return s.name === specName; });
    if (found) return { name: found.name, price: found.price, marketPrice: found.marketPrice, stock: found.stock };
  }
  // 旧格式或无匹配：回退到商品默认
  return { price: product.price, marketPrice: product.marketPrice, stock: product.stock };
}

function normalizeProductPayload(payload) {
  return {
    ...payload,
    price: Number(payload.price),
    marketPrice: Number(payload.marketPrice),
    stock: Number(payload.stock),
    sales: Number(payload.sales || 0),
    published: Boolean(payload.published),
  };
}

export function createProduct(payload) {
  const list = readList(STORAGE_KEYS.products, initialMockData.products);
  list.unshift({
    ...normalizeProductPayload(payload),
    id: generateId('prod'),
  });
  return writeList(STORAGE_KEYS.products, list);
}

export function updateProduct(productId, payload) {
  const list = readList(STORAGE_KEYS.products, initialMockData.products);
  const index = list.findIndex(function (item) {
    return item.id === productId;
  });

  if (index < 0) {
    throw new Error('商品不存在');
  }

  list[index] = {
    ...list[index],
    ...normalizeProductPayload(payload),
  };
  return writeList(STORAGE_KEYS.products, list);
}

export function deleteProduct(productId) {
  const list = readList(STORAGE_KEYS.products, initialMockData.products).filter(function (item) {
    return item.id !== productId;
  });
  return writeList(STORAGE_KEYS.products, list);
}

export function toggleProductStatus(productId) {
  const product = getProductById(productId);
  if (!product) return;
  return updateProduct(productId, { ...product, published: !product.published });
}

export function createCategory(payload) {
  const list = readList(STORAGE_KEYS.categories, initialMockData.categories);
  list.unshift({
    ...payload,
    id: generateId('cat'),
    active: Boolean(payload.active),
  });
  return writeList(STORAGE_KEYS.categories, list);
}

export function updateCategory(categoryId, payload) {
  const list = readList(STORAGE_KEYS.categories, initialMockData.categories);
  const index = list.findIndex(function (item) {
    return item.id === categoryId;
  });

  if (index < 0) {
    throw new Error('分类不存在');
  }

  list[index] = { ...list[index], ...payload, active: Boolean(payload.active) };
  return writeList(STORAGE_KEYS.categories, list);
}

export function deleteCategory(categoryId) {
  const list = readList(STORAGE_KEYS.categories, initialMockData.categories).filter(function (item) {
    return item.id !== categoryId;
  });
  const products = readList(STORAGE_KEYS.products, initialMockData.products).map(function (item) {
    return item.categoryId === categoryId ? { ...item, categoryId: 'cat_phone' } : item;
  });
  writeList(STORAGE_KEYS.products, products);
  return writeList(STORAGE_KEYS.categories, list);
}

export function registerUser(payload) {
  const users = readList(STORAGE_KEYS.users, initialMockData.users);
  const duplicated = users.find(function (item) {
    return item.username === payload.username || item.phone === payload.phone;
  });

  if (duplicated) {
    throw new Error('用户名或手机号已存在');
  }

  const user = {
    id: generateId('user'),
    username: payload.username,
    nickname: payload.nickname || payload.username,
    phone: payload.phone,
    password: payload.password,
    avatar: payload.username.slice(0, 1),
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
  };

  users.unshift(user);
  writeList(STORAGE_KEYS.users, users);
  storage.set(STORAGE_KEYS.userSession, user.id);
  emitMallChange();
  return user;
}

export function loginUser(payload) {
  const users = readList(STORAGE_KEYS.users, initialMockData.users);
  const user = users.find(function (item) {
    return (item.username === payload.account || item.phone === payload.account) && item.password === payload.password;
  });

  if (!user) {
    throw new Error('账号或密码错误');
  }

  storage.set(STORAGE_KEYS.userSession, user.id);
  emitMallChange();
  return user;
}

export function getCurrentUser() {
  const userId = storage.get(STORAGE_KEYS.userSession, null);
  if (!userId) return null;
  return readList(STORAGE_KEYS.users, initialMockData.users).find(function (item) {
    return item.id === userId;
  }) || null;
}

export function logoutUser() {
  storage.set(STORAGE_KEYS.userSession, null);
  emitMallChange();
}

export function updateCurrentUserProfile(payload) {
  const userId = storage.get(STORAGE_KEYS.userSession, null);
  if (!userId) throw new Error('用户未登录');
  const users = readList(STORAGE_KEYS.users, initialMockData.users);
  const index = users.findIndex(function (item) { return item.id === userId; });
  if (index < 0) throw new Error('用户不存在');
  users[index] = { ...users[index], ...payload };
  writeList(STORAGE_KEYS.users, users);
  emitMallChange();
  return users[index];
}

export function getAddresses(userId) {
  return readList(STORAGE_KEYS.addresses, initialMockData.addresses).filter(function (item) {
    return item.userId === userId;
  });
}

export function getDefaultAddress(userId) {
  return getAddresses(userId).find(function (item) {
    return item.isDefault;
  }) || getAddresses(userId)[0] || null;
}

export function saveAddress(payload) {
  const list = readList(STORAGE_KEYS.addresses, initialMockData.addresses);
  const userAddresses = list.filter(function (item) {
    return item.userId === payload.userId;
  });
  const shouldUseDefault = payload.isDefault || !userAddresses.length;
  const nextPayload = { ...payload, isDefault: shouldUseDefault };

  if (shouldUseDefault) {
    list.forEach(function (item) {
      if (item.userId === payload.userId) {
        item.isDefault = false;
      }
    });
  }

  let savedAddress = null;
  if (nextPayload.id) {
    const index = list.findIndex(function (item) {
      return item.id === nextPayload.id;
    });
    if (index >= 0) {
      list[index] = { ...list[index], ...nextPayload };
      savedAddress = list[index];
    }
  } else {
    savedAddress = { ...nextPayload, id: generateId('addr') };
    list.unshift(savedAddress);
  }

  writeList(STORAGE_KEYS.addresses, list);
  return savedAddress;
}

export function deleteAddress(addressId) {
  const list = readList(STORAGE_KEYS.addresses, initialMockData.addresses).filter(function (item) {
    return item.id !== addressId;
  });
  return writeList(STORAGE_KEYS.addresses, list);
}

export function setDefaultAddress(userId, addressId) {
  const list = readList(STORAGE_KEYS.addresses, initialMockData.addresses).map(function (item) {
    if (item.userId !== userId) return item;
    return { ...item, isDefault: item.id === addressId };
  });
  return writeList(STORAGE_KEYS.addresses, list);
}

export function getCartItems(userId) {
  const list = readList(STORAGE_KEYS.cartItems, initialMockData.cartItems).filter(function (item) {
    return item.userId === userId;
  });

  return list
    .map(function (item) {
      const product = getProductById(item.productId);
      if (!product) return null;
      return {
        ...item,
        product,
        amount: (item.specPrice || product.price) * item.quantity,
      };
    })
    .filter(Boolean);
}

export function addCartItem(payload) {
  const list = readList(STORAGE_KEYS.cartItems, initialMockData.cartItems);
  const existed = list.find(function (item) {
    return item.userId === payload.userId && item.productId === payload.productId && item.spec === payload.spec;
  });
  const product = getProductById(payload.productId);
  const specInfo = getSpecInfo(product, payload.spec);

  if (existed) {
    const nextQuantity = existed.quantity + payload.quantity;
    if (nextQuantity > specInfo.stock) {
      throw new Error('库存不足，购物车中已有 ' + existed.quantity + ' 件，当前最多可购买 ' + specInfo.stock + ' 件');
    }
    existed.quantity = nextQuantity;
    existed.checked = true;
  } else {
    if (payload.quantity > specInfo.stock) {
      throw new Error('库存不足，当前最多可购买 ' + specInfo.stock + ' 件');
    }
    list.unshift({
      id: generateId('cart'),
      userId: payload.userId,
      productId: payload.productId,
      spec: payload.spec,
      specPrice: specInfo.price,
      quantity: payload.quantity,
      checked: true,
    });
  }

  return writeList(STORAGE_KEYS.cartItems, list);
}

export function updateCartItem(cartId, payload) {
  const list = readList(STORAGE_KEYS.cartItems, initialMockData.cartItems).map(function (item) {
    return item.id === cartId ? { ...item, ...payload } : item;
  });
  return writeList(STORAGE_KEYS.cartItems, list);
}

export function removeCartItems(cartIds) {
  const list = readList(STORAGE_KEYS.cartItems, initialMockData.cartItems).filter(function (item) {
    return !cartIds.includes(item.id);
  });
  return writeList(STORAGE_KEYS.cartItems, list);
}

function readCoupons() {
  return readList(STORAGE_KEYS.coupons, initialMockData.coupons || []);
}

function readUserCoupons() {
  return readList(STORAGE_KEYS.userCoupons, initialMockData.userCoupons || []);
}

function writeUserCoupons(value) {
  return writeList(STORAGE_KEYS.userCoupons, value);
}

function getCouponById(couponId) {
  return readCoupons().find(function (item) {
    return item.id === couponId;
  }) || null;
}

function isCouponExpired(coupon) {
  return coupon.endAt && new Date(coupon.endAt.replace(/-/g, '/')).getTime() < Date.now();
}

function getCouponEligibleAmount(coupon, items) {
  return (items || []).reduce(function (sum, item) {
    const product = item.product || getProductById(item.productId);
    if (!product) return sum;
    const productMatched = (coupon.productIds || []).includes(product.id);
    const categoryMatched = (coupon.categoryIds || []).includes(product.categoryId);
    if (!productMatched && !categoryMatched) return sum;
    return sum + product.price * Number(item.quantity || 1);
  }, 0);
}

function buildCouponState(coupon, userId) {
  const userCoupons = readUserCoupons();
  const claimedCount = userCoupons.filter(function (item) {
    return item.couponId === coupon.id;
  }).length;
  const userClaimed = userId ? userCoupons.find(function (item) {
    return item.userId === userId && item.couponId === coupon.id && item.status !== 'used';
  }) : null;
  const remainingStock = Math.max(0, Number(coupon.totalStock || 0) - claimedCount);
  const expired = isCouponExpired(coupon);
  const status = expired ? 'expired' : userClaimed ? 'claimed' : remainingStock <= 0 ? 'soldOut' : 'claimable';
  return {
    ...coupon,
    userCouponId: userClaimed?.id || '',
    remainingStock,
    status,
  };
}

export function getActivityCoupons(activityId, userId = '') {
  return readCoupons().filter(function (coupon) {
    return coupon.activityId === activityId;
  }).map(function (coupon) {
    return buildCouponState(coupon, userId);
  });
}

export function claimCoupon(userId, couponId) {
  if (!userId) {
    throw new Error('请先登录后再领取优惠券');
  }
  const coupon = getCouponById(couponId);
  if (!coupon) {
    throw new Error('优惠券不存在');
  }
  const state = buildCouponState(coupon, userId);
  if (state.status === 'expired') {
    throw new Error('优惠券已结束');
  }
  if (state.status === 'soldOut') {
    throw new Error('优惠券已抢光');
  }
  if (state.status === 'claimed') {
    return { coupon: state, claimed: false, reason: 'alreadyClaimed' };
  }
  const userCoupons = readUserCoupons();
  const userClaimCount = userCoupons.filter(function (item) {
    return item.userId === userId && item.couponId === couponId;
  }).length;
  if (userClaimCount >= Number(coupon.perUserLimit || 1)) {
    return { coupon: state, claimed: false, reason: 'limitReached' };
  }
  const userCoupon = {
    id: generateId('user_coupon'),
    userId,
    couponId,
    status: 'available',
    claimedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    usedAt: '',
    orderId: '',
  };
  writeUserCoupons([userCoupon].concat(userCoupons));
  return { coupon: buildCouponState(coupon, userId), userCoupon, claimed: true };
}

export function claimActivityCoupons(userId, activityId) {
  const coupons = getActivityCoupons(activityId, userId);
  return coupons.reduce(function (result, coupon) {
    if (coupon.status !== 'claimable') {
      result.skipped += 1;
      return result;
    }
    const claimed = claimCoupon(userId, coupon.id);
    if (claimed.claimed) {
      result.claimed += 1;
    } else {
      result.skipped += 1;
    }
    return result;
  }, { claimed: 0, skipped: 0 });
}

export function getUserCoupons(userId) {
  const couponMap = Object.fromEntries(readCoupons().map(function (coupon) {
    return [coupon.id, coupon];
  }));
  return readUserCoupons().filter(function (item) {
    return item.userId === userId;
  }).map(function (item) {
    return {
      ...item,
      coupon: couponMap[item.couponId] || null,
    };
  }).filter(function (item) {
    return item.coupon;
  });
}

export function getAvailableCoupons(userId, items) {
  return getUserCoupons(userId).map(function (userCoupon) {
    const coupon = userCoupon.coupon;
    const eligibleAmount = getCouponEligibleAmount(coupon, items);
    const expired = isCouponExpired(coupon);
    let available = userCoupon.status === 'available' && !expired;
    let reason = '';
    if (userCoupon.status === 'used') {
      available = false;
      reason = '已使用';
    } else if (expired) {
      available = false;
      reason = '已过期';
    } else if (eligibleAmount < Number(coupon.threshold || 0)) {
      available = false;
      reason = '未满足使用门槛';
    }
    return {
      ...userCoupon,
      available,
      reason,
      eligibleAmount,
      discountAmount: available ? Math.min(Number(coupon.amount || 0), eligibleAmount) : 0,
    };
  }).sort(function (a, b) {
    return b.discountAmount - a.discountAmount;
  });
}

export function applyBestCoupon(items, userCoupons) {
  return (userCoupons || []).filter(function (item) {
    return item.available;
  }).sort(function (a, b) {
    return b.discountAmount - a.discountAmount;
  })[0] || null;
}

export function markCouponUsed(userCouponId, orderId) {
  if (!userCouponId) return null;
  const list = readUserCoupons().map(function (item) {
    if (item.id !== userCouponId) return item;
    return {
      ...item,
      status: 'used',
      usedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      orderId,
    };
  });
  return writeUserCoupons(list);
}

export function setCheckoutDraft(payload) {
  storage.set(STORAGE_KEYS.checkoutDraft, payload);
  emitMallChange();
}

export function getCheckoutDraft() {
  return storage.get(STORAGE_KEYS.checkoutDraft, null);
}

export function clearCheckoutDraft() {
  storage.set(STORAGE_KEYS.checkoutDraft, null);
  emitMallChange();
}

export function createOrder(payload) {
  const products = readList(STORAGE_KEYS.products, initialMockData.products);
  const orders = readList(STORAGE_KEYS.orders, initialMockData.orders);
  const cartItems = readList(STORAGE_KEYS.cartItems, initialMockData.cartItems);
  const addresses = readList(STORAGE_KEYS.addresses, initialMockData.addresses);
  const summary = buildOrderSummary(payload.items);
  const goodsAmount = Number(payload.goodsAmount ?? summary.totalAmount);
  const freightAmount = Number(payload.freightAmount || 0);
  const discountAmount = Number(payload.discountAmount || 0);
  const payAmount = Math.max(0, Number(payload.payAmount ?? (goodsAmount + freightAmount - discountAmount)));
  const address = addresses.find(function (item) {
    return item.id === payload.addressId && item.userId === payload.userId;
  });

  if (!address) {
    throw new Error('收货地址不存在');
  }

  if (!Array.isArray(payload.items) || !payload.items.length) {
    throw new Error('订单商品不能为空');
  }

  payload.items.forEach(function (item) {
    if (!item || Number(item.quantity) <= 0) {
      throw new Error('商品数量必须大于0');
    }

    const product = products.find(function (current) {
      return current.id === item.productId;
    });

    if (!product) {
      throw new Error('商品不存在，无法下单');
    }

    if (!product.published) {
      throw new Error('商品已下架，无法下单');
    }

    const specInfo = getSpecInfo(product, item.spec);
    if (specInfo.stock < Number(item.quantity)) {
      throw new Error('库存不足，无法下单');
    }
  });

  payload.items.forEach(function (item) {
    const product = products.find(function (current) {
      return current.id === item.productId;
    });
    const specInfo = getSpecInfo(product, item.spec);
    if (product) {
      const hasObjectSpecs = Array.isArray(product.specs) && product.specs.length && typeof product.specs[0] === 'object';
      if (hasObjectSpecs) {
        // 对象规格：只扣当前规格 stock，product.stock 重新汇总为各规格 stock 之和
        const specObj = product.specs.find(function (s) { return s.name === item.spec; });
        if (specObj && specObj.stock !== undefined) {
          specObj.stock -= item.quantity;
        }
        product.stock = product.specs.reduce(function (sum, s) { return sum + (s.stock || 0); }, 0);
      } else {
        // 字符串规格或无规格：只扣 product.stock
        product.stock -= item.quantity;
      }
      product.sales += item.quantity;
    }
  });

  const order = {
    id: generateId('order'),
    orderNo: 'XS' + Date.now(),
    userId: payload.userId,
    status: '待付款',
    totalAmount: payAmount,
    goodsAmount,
    freightAmount,
    discountAmount,
    payAmount,
    couponId: payload.couponId || '',
    couponTitle: payload.couponTitle || '',
    userCouponId: payload.userCouponId || '',
    addressId: payload.addressId,
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    source: payload.source,
    items: payload.items.map(function (item) {
      const product = products.find(function (current) {
        return current.id === item.productId;
      });
      const specInfo = getSpecInfo(product, item.spec);
      return {
        id: generateId('order_item'),
        productId: item.productId,
        productName: product.name,
        spec: item.spec,
        price: specInfo.price,
        quantity: item.quantity,
        cover: product.cover,
      };
    }),
  };

  writeList(STORAGE_KEYS.products, products);
  writeList(STORAGE_KEYS.orders, [order].concat(orders));
  markCouponUsed(payload.userCouponId, order.id);

  if (payload.source === 'cart') {
    const checkedIds = payload.items.map(function (item) {
      return item.id;
    });
    const nextCartItems = cartItems.filter(function (item) {
      return !checkedIds.includes(item.id);
    });
    writeList(STORAGE_KEYS.cartItems, nextCartItems);
  }

  clearCheckoutDraft();
  return order;
}

export function getOrders(options = {}) {
  const params = {
    userId: null,
    status: 'all',
    keyword: '',
    page: 1,
    pageSize: 6,
    ...options,
  };

  const addressMap = Object.fromEntries(
    readList(STORAGE_KEYS.addresses, initialMockData.addresses).map(function (item) {
      return [item.id, item];
    })
  );

  let list = readList(STORAGE_KEYS.orders, initialMockData.orders).map(function (item) {
    return {
      ...item,
      address: addressMap[item.addressId] || null,
      itemCount: item.items.reduce(function (sum, current) {
        return sum + current.quantity;
      }, 0),
    };
  });

  if (params.userId) {
    list = list.filter(function (item) {
      return item.userId === params.userId;
    });
  }

  if (params.status && params.status !== 'all') {
    if (params.status === '待收货分组') {
      list = list.filter(function (item) {
        return ['待发货', '待收货'].includes(item.status);
      });
    } else {
      list = list.filter(function (item) {
        return item.status === params.status;
      });
    }
  }

  if (params.keyword) {
    list = list.filter(function (item) {
      return item.orderNo.includes(params.keyword.trim());
    });
  }

  list.sort(function (a, b) {
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });

  const start = (params.page - 1) * params.pageSize;
  return {
    list: list.slice(start, start + params.pageSize),
    total: list.length,
    all: list,
  };
}

export function getOrderById(orderId) {
  return getOrders().all.find(function (item) {
    return item.id === orderId;
  }) || null;
}

export function payOrder(orderId) {
  const list = readList(STORAGE_KEYS.orders, initialMockData.orders).map(function (item) {
    if (item.id !== orderId) return item;
    return { ...item, status: '待发货', paidAt: new Date().toLocaleString('zh-CN', { hour12: false }) };
  });
  return writeList(STORAGE_KEYS.orders, list);
}

export function updateOrderStatus(orderId, status) {
  const list = readList(STORAGE_KEYS.orders, initialMockData.orders).map(function (item) {
    return item.id === orderId ? { ...item, status } : item;
  });
  return writeList(STORAGE_KEYS.orders, list);
}

export function getRoles() {
  return readList(STORAGE_KEYS.roles, initialMockData.roles);
}

export function createRole(payload) {
  const roles = readList(STORAGE_KEYS.roles, initialMockData.roles);
  const role = {
    id: generateId('role'),
    name: payload.name,
    code: payload.code,
    loginUsername: payload.loginUsername || '',
    loginPassword: payload.loginPassword || '',
    permissions: payload.permissions || [],
    description: payload.description || '',
  };
  roles.unshift(role);
  return writeList(STORAGE_KEYS.roles, roles);
}

export function updateRole(roleId, payload) {
  const roles = readList(STORAGE_KEYS.roles, initialMockData.roles);
  const index = roles.findIndex(function (item) {
    return item.id === roleId;
  });

  if (index < 0) {
    throw new Error('角色不存在');
  }

  roles[index] = {
    ...roles[index],
    ...payload,
    permissions: payload.permissions || [],
  };
  return writeList(STORAGE_KEYS.roles, roles);
}

export function deleteRole(roleId) {
  const admins = readList(STORAGE_KEYS.admins, initialMockData.admins);
  const hasAdmin = admins.some(function (item) {
    return item.roleId === roleId;
  });

  if (hasAdmin) {
    throw new Error('该角色已绑定管理员，无法删除');
  }

  const roles = readList(STORAGE_KEYS.roles, initialMockData.roles).filter(function (item) {
    return item.id !== roleId;
  });
  return writeList(STORAGE_KEYS.roles, roles);
}

export function getAdmins() {
  return readList(STORAGE_KEYS.admins, initialMockData.admins).map(function (admin) {
    const role = getRoles().find(function (item) {
      return item.id === admin.roleId;
    });
    return {
      ...admin,
      roleName: role ? role.name : '未知角色',
      permissions: role ? role.permissions : [],
    };
  });
}

export function createAdmin(payload) {
  const admins = readList(STORAGE_KEYS.admins, initialMockData.admins);
  const admin = {
    id: generateId('admin'),
    username: payload.username,
    password: payload.password,
    name: payload.name,
    roleId: payload.roleId,
  };
  admins.unshift(admin);
  return writeList(STORAGE_KEYS.admins, admins);
}

export function updateAdmin(adminId, payload) {
  const admins = readList(STORAGE_KEYS.admins, initialMockData.admins);
  const index = admins.findIndex(function (item) {
    return item.id === adminId;
  });

  if (index < 0) {
    throw new Error('管理员不存在');
  }

  admins[index] = {
    ...admins[index],
    username: payload.username,
    password: payload.password,
    name: payload.name,
    roleId: payload.roleId,
  };
  return writeList(STORAGE_KEYS.admins, admins);
}

export function deleteAdmin(adminId) {
  const currentAdminId = storage.get(STORAGE_KEYS.adminSession, null);
  if (currentAdminId === adminId) {
    throw new Error('不能删除当前登录管理员');
  }

  const admins = readList(STORAGE_KEYS.admins, initialMockData.admins).filter(function (item) {
    return item.id !== adminId;
  });
  return writeList(STORAGE_KEYS.admins, admins);
}

export function loginAdmin(payload) {
  const admin = getAdmins().find(function (item) {
    return item.username === payload.username && item.password === payload.password;
  });

  if (!admin) {
    throw new Error('管理员账号或密码错误');
  }

  storage.set(STORAGE_KEYS.adminSession, admin.id);
  emitMallChange();
  return admin;
}

export function getCurrentAdmin() {
  const adminId = storage.get(STORAGE_KEYS.adminSession, null);
  if (!adminId) return null;
  return getAdmins().find(function (item) {
    return item.id === adminId;
  }) || null;
}

export function logoutAdmin() {
  storage.set(STORAGE_KEYS.adminSession, null);
  emitMallChange();
}

export function getDashboardStats() {
  const products = getProducts({ includeUnpublished: true }).all;
  const orders = getOrders().all;
  const users = readList(STORAGE_KEYS.users, initialMockData.users);

  return {
    productCount: products.length,
    onlineProductCount: products.filter(function (item) {
      return item.published;
    }).length,
    categoryCount: getCategories().length,
    userCount: users.length,
    orderCount: orders.length,
    pendingPayCount: orders.filter(function (item) {
      return item.status === '待付款';
    }).length,
    pendingShipCount: orders.filter(function (item) {
      return item.status === '待发货';
    }).length,
  };
}
