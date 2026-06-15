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
  userSession: 'mall_user_session',
  adminSession: 'mall_admin_session',
  checkoutDraft: 'mall_checkout_draft',
};

const DATA_EVENT = 'mall:datachange';

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
  return readList(STORAGE_KEYS.products, initialMockData.products);
}

export function getCategories() {
  const categories = readCategories();
  const products = readProducts();

  return categories.map(function (category) {
    return {
      ...category,
      productCount: products.filter(function (product) {
        return product.categoryId === category.id;
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
      return item.name.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword);
    });
  }

  list.sort(function (a, b) {
    return b.sales - a.sales;
  });

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

  if (payload.isDefault) {
    list.forEach(function (item) {
      if (item.userId === payload.userId) {
        item.isDefault = false;
      }
    });
  }

  if (payload.id) {
    const index = list.findIndex(function (item) {
      return item.id === payload.id;
    });
    if (index >= 0) {
      list[index] = { ...list[index], ...payload };
    }
  } else {
    list.unshift({ ...payload, id: generateId('addr') });
  }

  return writeList(STORAGE_KEYS.addresses, list);
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
        amount: product.price * item.quantity,
      };
    })
    .filter(Boolean);
}

export function addCartItem(payload) {
  const list = readList(STORAGE_KEYS.cartItems, initialMockData.cartItems);
  const existed = list.find(function (item) {
    return item.userId === payload.userId && item.productId === payload.productId && item.spec === payload.spec;
  });

  if (existed) {
    existed.quantity += payload.quantity;
    existed.checked = true;
  } else {
    list.unshift({
      id: generateId('cart'),
      userId: payload.userId,
      productId: payload.productId,
      spec: payload.spec,
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

    if (product.stock < Number(item.quantity)) {
      throw new Error('库存不足，无法下单');
    }
  });

  payload.items.forEach(function (item) {
    const product = products.find(function (current) {
      return current.id === item.productId;
    });
    if (product) {
      product.stock -= item.quantity;
      product.sales += item.quantity;
    }
  });

  const order = {
    id: generateId('order'),
    orderNo: 'XS' + Date.now(),
    userId: payload.userId,
    status: '待付款',
    totalAmount: summary.totalAmount,
    addressId: payload.addressId,
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    source: payload.source,
    items: payload.items.map(function (item) {
      const product = products.find(function (current) {
        return current.id === item.productId;
      });
      return {
        id: generateId('order_item'),
        productId: item.productId,
        productName: product.name,
        spec: item.spec,
        price: product.price,
        quantity: item.quantity,
        cover: product.cover,
      };
    }),
  };

  writeList(STORAGE_KEYS.products, products);
  writeList(STORAGE_KEYS.orders, [order].concat(orders));

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
