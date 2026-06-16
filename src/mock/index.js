export const banners = [
  {
    id: 'banner_1',
    kicker: '数码焕新',
    title: '把好用的设备带回日常',
    subtitle: '手机、平板、耳机与智能穿戴，精选热卖单品限时推荐。',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    link: '/',
  },
  {
    id: 'banner_2',
    kicker: '品质生活',
    title: '让家里的每一天更轻松',
    subtitle: '智能家居、清洁设备与氛围好物，给生活多一点秩序感。',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1600&q=80',
    link: '/',
  },
  {
    id: 'banner_3',
    kicker: '新品上架',
    title: '通勤、运动、办公都能选',
    subtitle: '后台维护商品后，前台列表会同步更新，适合课程演示联动效果。',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80',
    link: '/',
  },
];

export const categories = [
  { id: 'cat_phone', name: '手机数码', description: '手机、平板与智能设备', cover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80', active: true },
  { id: 'cat_home', name: '智能家居', description: '提升幸福感的家居好物', cover: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80', active: true },
  { id: 'cat_beauty', name: '美妆护肤', description: '人气护肤和彩妆精选', cover: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80', active: true },
  { id: 'cat_office', name: '办公学习', description: '学习办公场景高频好物', cover: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80', active: true },
  { id: 'cat_wear', name: '运动穿戴', description: '运动健康与穿戴设备', cover: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=900&q=80', active: true },
];

export const products = [
  { id: 'prod_1001', categoryId: 'cat_phone', name: '星舷 X1 Pro 旗舰手机', price: 4999, marketPrice: 5399, stock: 36, sales: 268, published: true, tags: ['新品', '热卖'], specs: [{ name: '曜石黑 256G', price: 4999, marketPrice: 5399, stock: 18 }, { name: '深海蓝 512G', price: 5799, marketPrice: 6199, stock: 18 }], cover: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80', description: '6.8 英寸高刷屏，旗舰影像系统，支持全天候 AI 场景优化。', detail: '采用新一代影像模组和大容量电池，适合摄影、游戏与重度办公用户。' },
  { id: 'prod_1002', categoryId: 'cat_phone', name: '星舷 Pad Air 平板电脑', price: 2899, marketPrice: 3199, stock: 58, sales: 155, published: true, tags: ['办公', '轻薄'], specs: [{ name: '银色 128G', price: 2899, marketPrice: 3199, stock: 30 }, { name: '灰色 256G', price: 3299, marketPrice: 3599, stock: 28 }], cover: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80', description: '轻薄机身搭配手写笔生态，兼顾娱乐、学习与移动办公。', detail: '支持多任务分屏、磁吸键盘与高色域显示，适合课程笔记和演示。' },
  { id: 'prod_1003', categoryId: 'cat_home', name: '云岛智能空气净化器', price: 1499, marketPrice: 1799, stock: 42, sales: 93, published: true, tags: ['家用', '净化'], specs: [{ name: '标准版', price: 1499, marketPrice: 1799, stock: 25 }, { name: '除醛增强版', price: 1899, marketPrice: 2199, stock: 17 }], cover: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80', description: '三重滤芯系统，支持手机 App 联动查看空气质量。', detail: '适合卧室和客厅使用，低噪模式下夜间依旧安静。' },
  { id: 'prod_1004', categoryId: 'cat_home', name: '极光扫拖一体机器人', price: 2299, marketPrice: 2599, stock: 24, sales: 176, published: true, tags: ['清洁', '智能'], specs: [{ name: '基础版', price: 2299, marketPrice: 2599, stock: 15 }, { name: '自动上下水版', price: 3299, marketPrice: 3699, stock: 9 }], cover: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80', description: '自动建图避障，解放日常清洁时间。', detail: '支持智能分区清扫，拖布自动回洗，适合大户型家庭。' },
  { id: 'prod_1005', categoryId: 'cat_beauty', name: '琉光修护精华套组', price: 699, marketPrice: 799, stock: 10, sales: 322, published: true, tags: ['护肤', '礼盒'], specs: [{ name: '30ml 双瓶装', price: 699, marketPrice: 799, stock: 0 }, { name: '50ml 礼盒装', price: 899, marketPrice: 999, stock: 10 }], cover: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80', description: '修护维稳型护肤套组，适合日常保湿提亮。', detail: '礼盒包装精致，节日送礼与自用都很合适。' },
  { id: 'prod_1006', categoryId: 'cat_beauty', name: '雾感持妆彩妆盘', price: 239, marketPrice: 299, stock: 120, sales: 409, published: true, tags: ['彩妆', '热门'], specs: [{ name: '暖调大地色', price: 239, marketPrice: 299, stock: 60 }, { name: '冷调灰粉色', price: 239, marketPrice: 299, stock: 60 }], cover: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80', description: '一盘满足通勤与约会妆容，粉质细腻易晕染。', detail: '高显色不飞粉，适合新手快速完成眼妆。' },
  { id: 'prod_1007', categoryId: 'cat_office', name: '墨羽机械键盘', price: 399, marketPrice: 459, stock: 47, sales: 146, published: true, tags: ['键盘', '办公'], specs: [{ name: '青轴', price: 399, marketPrice: 459, stock: 25 }, { name: '静音红轴', price: 429, marketPrice: 499, stock: 22 }], cover: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80', description: '紧凑布局与高颜值配色兼具，手感稳定。', detail: '适合代码编写、文案创作与日常娱乐。' },
  { id: 'prod_1008', categoryId: 'cat_office', name: '星空降噪会议耳机', price: 899, marketPrice: 1099, stock: 65, sales: 198, published: true, tags: ['会议', '蓝牙'], specs: [{ name: '白色', price: 899, marketPrice: 1099, stock: 32 }, { name: '黑色', price: 899, marketPrice: 1099, stock: 33 }], cover: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', description: '双麦降噪，适合远程办公与通勤佩戴。', detail: '支持多设备连接和长续航，会议沟通更高效。' },
  { id: 'prod_1009', categoryId: 'cat_wear', name: '追风智能运动手表', price: 1199, marketPrice: 1399, stock: 39, sales: 211, published: true, tags: ['运动', '健康'], specs: [{ name: '夜幕黑', price: 1199, marketPrice: 1399, stock: 20 }, { name: '薄荷绿', price: 1199, marketPrice: 1399, stock: 19 }], cover: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', description: '支持多种运动模式与心率睡眠监测。', detail: '适合跑步、骑行、健身等日常运动场景。' },
  { id: 'prod_1010', categoryId: 'cat_wear', name: '疾光开放式耳机', price: 599, marketPrice: 699, stock: 88, sales: 267, published: true, tags: ['蓝牙', '轻量'], specs: [{ name: '曜石黑', price: 599, marketPrice: 699, stock: 44 }, { name: '云雾白', price: 599, marketPrice: 699, stock: 44 }], cover: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80', description: '开放式佩戴更安全，长时间佩戴无明显压迫。', detail: '适合晨跑、通勤和办公室场景使用。' },
  { id: 'prod_1011', categoryId: 'cat_phone', name: '影像大师便携相机', price: 3699, marketPrice: 4099, stock: 18, sales: 67, published: true, tags: ['摄影', '便携'], specs: [{ name: '银黑拼色', price: 3699, marketPrice: 4099, stock: 10 }, { name: '纯黑版', price: 3899, marketPrice: 4299, stock: 8 }], cover: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80', description: '轻便机身配合高像素传感器，记录旅途灵感。', detail: '适合城市随拍与 Vlog 创作，色彩表现自然。' },
  { id: 'prod_1012', categoryId: 'cat_home', name: '暮云香薰夜灯', price: 199, marketPrice: 239, stock: 96, sales: 305, published: false, tags: ['氛围', '居家'], specs: [{ name: '白橙暖光', price: 199, marketPrice: 239, stock: 56 }, { name: '深灰冷光', price: 199, marketPrice: 239, stock: 40 }], cover: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=80', description: '打造放松睡眠氛围的桌面夜灯香薰组合。', detail: '后台可演示下架商品对前台列表的实时联动效果。' },
];

export const users = [
  { id: 'user_1001', username: 'zhangsan', nickname: '张三', phone: '13800000001', password: '123456', avatar: '张', createdAt: '2026-06-01 10:00:00' },
  { id: 'user_1002', username: 'lisi', nickname: '李四', phone: '13800000002', password: '123456', avatar: '李', createdAt: '2026-06-02 09:30:00' },
];

export const addresses = [
  { id: 'addr_1001', userId: 'user_1001', receiver: '张三', phone: '13800000001', region: '上海市 浦东新区', detail: '张江高科科技园科苑路 88 号 12 栋 602', tag: '公司', isDefault: true },
  { id: 'addr_1002', userId: 'user_1001', receiver: '张三', phone: '13800000001', region: '上海市 徐汇区', detail: '漕河泾开发区宜山路 700 号', tag: '家', isDefault: false },
];

export const roles = [
  { id: 'role_super', name: '超级管理员', code: 'superAdmin', permissions: ['dashboard', 'products', 'categories', 'orders', 'permissions'], description: '拥有全部后台模块访问权限，可维护商品、分类、订单与角色说明。' },
  { id: 'role_operator', name: '普通运营', code: 'operator', permissions: ['dashboard', 'products', 'orders'], description: '可查看工作台、处理订单并维护商品基础信息。' },
];

export const admins = [
  { id: 'admin_1001', username: 'admin', password: 'admin123', name: '系统管理员', roleId: 'role_super' },
  { id: 'admin_1002', username: 'operator', password: 'operator123', name: '商城运营', roleId: 'role_operator' },
];

export const orders = [
  { id: 'order_1001', orderNo: 'XS202606080001', userId: 'user_1001', status: '待付款', totalAmount: 4999, addressId: 'addr_1001', createdAt: '2026-06-08 09:20:00', source: 'direct', items: [{ id: 'order_item_1001', productId: 'prod_1001', productName: '星舷 X1 Pro 旗舰手机', spec: '曜石黑 256G', price: 4999, quantity: 1, cover: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80' }] },
  { id: 'order_1002', orderNo: 'XS202606080002', userId: 'user_1001', status: '待收货', totalAmount: 1237, addressId: 'addr_1002', createdAt: '2026-06-08 11:10:00', source: 'cart', items: [{ id: 'order_item_1002', productId: 'prod_1006', productName: '雾感持妆彩妆盘', spec: '暖调大地色', price: 239, quantity: 1, cover: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80' }, { id: 'order_item_1003', productId: 'prod_1010', productName: '疾光开放式耳机', spec: '曜石黑', price: 599, quantity: 1, cover: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80' }, { id: 'order_item_1004', productId: 'prod_1007', productName: '墨羽机械键盘', spec: '静音红轴', price: 399, quantity: 1, cover: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80' }] },
];

export const cartItems = [
  { id: 'cart_1001', userId: 'user_1001', productId: 'prod_1009', spec: '夜幕黑', quantity: 1, checked: true },
  { id: 'cart_1002', userId: 'user_1001', productId: 'prod_1003', spec: '标准版', quantity: 1, checked: false },
];

export const coupons = [
  { id: 'coupon_phone_500', activityId: 'cat_phone', title: '手机数码满 5000 减 500', amount: 500, threshold: 5000, categoryIds: ['cat_phone'], productIds: [], startAt: '2026-06-01 00:00:00', endAt: '2026-12-31 23:59:59', totalStock: 30, perUserLimit: 1, stackable: false, type: 'category' },
  { id: 'coupon_phone_300', activityId: 'cat_phone', title: '旗舰手机满 3000 减 300', amount: 300, threshold: 3000, categoryIds: [], productIds: ['prod_1001', 'prod_1011'], startAt: '2026-06-01 00:00:00', endAt: '2026-12-31 23:59:59', totalStock: 20, perUserLimit: 1, stackable: false, type: 'product' },
  { id: 'coupon_phone_120', activityId: 'cat_phone', title: '平板学习满 1200 减 120', amount: 120, threshold: 1200, categoryIds: [], productIds: ['prod_1002'], startAt: '2026-06-01 00:00:00', endAt: '2026-12-31 23:59:59', totalStock: 25, perUserLimit: 1, stackable: false, type: 'product' },
  { id: 'coupon_phone_60', activityId: 'cat_phone', title: '数码配件满 600 减 60', amount: 60, threshold: 600, categoryIds: ['cat_phone'], productIds: [], startAt: '2026-06-01 00:00:00', endAt: '2026-12-31 23:59:59', totalStock: 0, perUserLimit: 1, stackable: false, type: 'category' },
];

export const userCoupons = [];

export const initialMockData = { banners, categories, products, users, addresses, roles, admins, orders, cartItems, coupons, userCoupons };
