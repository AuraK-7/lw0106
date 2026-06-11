// Mock 数据统一放在该文件中，方便课程作业集中维护。
export const banners = [
  {
    id: 'banner_1',
    title: '618 数码焕新季',
    subtitle: '限时直降，热门单品 24 小时闪购',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cinematic%20ecommerce%20banner%2C%20premium%20electronics%20display%2C%20blue%20and%20gold%20lighting%2C%20clean%20retail%20scene&image_size=landscape_16_9',
  },
  {
    id: 'banner_2',
    title: '品质生活精选',
    subtitle: '家居、美妆、穿戴设备每日上新',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20lifestyle%20shopping%20banner%2C%20elegant%20home%20and%20beauty%20products%2C%20luxury%20editorial%20style&image_size=landscape_16_9',
  },
  {
    id: 'banner_3',
    title: '前后台数据联动演示',
    subtitle: '后台维护商品与订单，前台同步呈现最新结果',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=futuristic%20admin%20dashboard%20and%20shopping%20mall%20visual%2C%20clean%20ui%20panels%2C%20dark%20blue%20interface&image_size=landscape_16_9',
  },
];

export const categories = [
  { id: 'cat_phone', name: '手机数码', description: '手机、平板与智能设备', cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20smartphone%20category%20cover%2C%20studio%20lighting%2C%20clean%20product%20composition&image_size=square_hd', active: true },
  { id: 'cat_home', name: '智能家居', description: '提升幸福感的智能产品', cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=smart%20home%20devices%20category%20cover%2C%20warm%20interior%2C%20minimal%20style&image_size=square_hd', active: true },
  { id: 'cat_beauty', name: '美妆护肤', description: '人气护肤和彩妆精选', cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=beauty%20skincare%20category%20cover%2C%20luxury%20editorial%2C%20soft%20light&image_size=square_hd', active: true },
  { id: 'cat_office', name: '办公学习', description: '学习办公场景高频好物', cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20office%20desk%20setup%20category%20cover%2C%20clean%20stationery%20and%20laptop&image_size=square_hd', active: true },
  { id: 'cat_wear', name: '运动穿戴', description: '运动健康与穿戴设备', cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=fitness%20wearable%20tech%20category%20cover%2C%20smartwatch%20and%20earbuds%2C%20dynamic%20scene&image_size=square_hd', active: true },
];

export const products = [
  { id: 'prod_1001', categoryId: 'cat_phone', name: '星舟 X1 Pro 旗舰手机', price: 4999, marketPrice: 5399, stock: 36, sales: 268, published: true, tags: ['新品', '热卖'], specs: ['曜石黑 256G', '深海蓝 512G'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20smartphone%20product%20shot%2C%20dark%20blue%20studio%20background%2C%20realistic%20reflection&image_size=portrait_4_3', description: '6.8 英寸高刷屏，影像旗舰，支持全天候 AI 场景优化。', detail: '采用新一代影像模组和大容量电池，适合摄影、游戏与重度办公用户。' },
  { id: 'prod_1002', categoryId: 'cat_phone', name: '星舟 Pad Air 平板电脑', price: 2899, marketPrice: 3199, stock: 58, sales: 155, published: true, tags: ['办公', '轻薄'], specs: ['银色 128G', '灰色 256G'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20tablet%20computer%20product%20photo%2C%20minimal%20commercial%20lighting&image_size=portrait_4_3', description: '轻薄机身搭配手写笔生态，兼顾娱乐与学习。', detail: '支持多任务分屏、磁吸键盘与高色域显示。' },
  { id: 'prod_1003', categoryId: 'cat_home', name: '云岛智能空气净化器', price: 1499, marketPrice: 1799, stock: 42, sales: 93, published: true, tags: ['家用', '净化'], specs: ['标准版', '除醛增强版'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=smart%20air%20purifier%20product%20photo%2C%20clean%20home%20interior%2C%20premium%20commercial%20style&image_size=portrait_4_3', description: '三重滤芯系统，支持手机 App 联动查看空气质量。', detail: '适合卧室和客厅使用，低噪模式下夜间依旧安静。' },
  { id: 'prod_1004', categoryId: 'cat_home', name: '极光扫拖一体机器人', price: 2299, marketPrice: 2599, stock: 24, sales: 176, published: true, tags: ['清洁', '智能'], specs: ['基础版', '自动上下水版'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=robot%20vacuum%20cleaner%20product%20photo%2C%20premium%20home%20scene&image_size=portrait_4_3', description: '自动建图避障，解放日常清洁时间。', detail: '支持智能分区清扫，拖布自动回洗，适合大户型家庭。' },
  { id: 'prod_1005', categoryId: 'cat_beauty', name: '琉光修护精华套组', price: 699, marketPrice: 799, stock: 80, sales: 322, published: true, tags: ['护肤', '礼盒'], specs: ['30ml 双瓶装', '50ml 礼盒装'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20skincare%20serum%20gift%20box%2C%20soft%20editorial%20lighting&image_size=portrait_4_3', description: '修护维稳型护肤套组，适合日常保湿提亮。', detail: '礼盒包装精致，节日送礼与自用都很合适。' },
  { id: 'prod_1006', categoryId: 'cat_beauty', name: '雾感持妆彩妆盘', price: 239, marketPrice: 299, stock: 120, sales: 409, published: true, tags: ['彩妆', '热门'], specs: ['暖调大地色', '冷调灰粉色'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=makeup%20palette%20product%20photo%2C%20luxury%20beauty%20brand%2C%20soft%20shadow&image_size=portrait_4_3', description: '一盘满足通勤与约会妆容，粉质细腻易晕染。', detail: '高显色不飞粉，适合新手快速完成眼妆。' },
  { id: 'prod_1007', categoryId: 'cat_office', name: '墨羽机械键盘', price: 399, marketPrice: 459, stock: 47, sales: 146, published: true, tags: ['键盘', '办公'], specs: ['青轴', '静音红轴'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mechanical%20keyboard%20product%20photo%2C%20dark%20desk%20setup%2C%20clean%20commercial%20style&image_size=portrait_4_3', description: '紧凑布局与高颜值配色兼具，手感稳定。', detail: '适合代码编写、文案创作与日常娱乐。' },
  { id: 'prod_1008', categoryId: 'cat_office', name: '星穹降噪会议耳机', price: 899, marketPrice: 1099, stock: 65, sales: 198, published: true, tags: ['会议', '蓝牙'], specs: ['白色', '黑色'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=wireless%20headphones%20product%20photo%2C%20minimal%20studio%20lighting&image_size=portrait_4_3', description: '双麦降噪，适合远程办公与通勤佩戴。', detail: '支持多设备连接和长续航，会议沟通更高效。' },
  { id: 'prod_1009', categoryId: 'cat_wear', name: '追风智能运动手表', price: 1199, marketPrice: 1399, stock: 39, sales: 211, published: true, tags: ['运动', '健康'], specs: ['夜幕黑', '薄荷绿'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=smartwatch%20product%20photo%2C%20sport%20lifestyle%20branding%2C%20premium%20detail&image_size=portrait_4_3', description: '支持多种运动模式与心率睡眠监测。', detail: '适合跑步、骑行、健身等日常运动场景。' },
  { id: 'prod_1010', categoryId: 'cat_wear', name: '疾光开放式耳机', price: 599, marketPrice: 699, stock: 88, sales: 267, published: true, tags: ['蓝牙', '轻量'], specs: ['曜石黑', '云雾白'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=open%20ear%20wireless%20earbuds%20product%20photo%2C%20dynamic%20fitness%20branding&image_size=portrait_4_3', description: '开放式佩戴更安全，长时间佩戴无明显压迫。', detail: '适合晨跑、通勤和办公室场景使用。' },
  { id: 'prod_1011', categoryId: 'cat_phone', name: '影像大师便携相机', price: 3699, marketPrice: 4099, stock: 18, sales: 67, published: true, tags: ['摄影', '便携'], specs: ['银黑拼色', '纯黑版'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=compact%20camera%20product%20photo%2C%20premium%20studio%20lighting&image_size=portrait_4_3', description: '轻便机身配合高像素传感器，记录旅途灵感。', detail: '适合城市随拍与 Vlog 创作，色彩表现自然。' },
  { id: 'prod_1012', categoryId: 'cat_home', name: '暮云香薰夜灯', price: 199, marketPrice: 239, stock: 96, sales: 305, published: false, tags: ['氛围', '居家'], specs: ['白橙暖光', '深灰冷光'], cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=aroma%20diffuser%20night%20lamp%20product%20photo%2C%20warm%20home%20ambience&image_size=portrait_4_3', description: '打造放松睡眠氛围的桌面夜灯香薰组合。', detail: '后台可演示下架商品对前台列表的实时联动效果。' },
];

export const users = [
  { id: 'user_1001', username: 'zhangsan', nickname: '张三', phone: '13800000001', password: '123456', avatar: '张', createdAt: '2026-06-01 10:00:00' },
  { id: 'user_1002', username: 'lisi', nickname: '李四', phone: '13800000002', password: '123456', avatar: '李', createdAt: '2026-06-02 09:30:00' },
];

export const addresses = [
  { id: 'addr_1001', userId: 'user_1001', receiver: '张三', phone: '13800000001', region: '上海市 浦东新区', detail: '张江高科技园科苑路 88 号 12 栋 602', tag: '公司', isDefault: true },
  { id: 'addr_1002', userId: 'user_1001', receiver: '张三', phone: '13800000001', region: '上海市 徐汇区', detail: '漕河泾开发区宜山路 700 号', tag: '家', isDefault: false },
];

export const roles = [
  { id: 'role_super', name: '超级管理员', code: 'superAdmin', permissions: ['dashboard', 'products', 'categories', 'orders', 'permissions'], description: '拥有全部后台模块访问权限，可维护商品、分类、订单与角色说明。' },
  { id: 'role_operator', name: '普通运营', code: 'operator', permissions: ['dashboard', 'products', 'orders'], description: '仅可查看工作台、处理订单并维护商品基础信息，无法进入分类与权限模块。' },
];

export const admins = [
  { id: 'admin_1001', username: 'admin', password: 'admin123', name: '系统管理员', roleId: 'role_super' },
  { id: 'admin_1002', username: 'operator', password: 'operator123', name: '商城运营', roleId: 'role_operator' },
];

export const orders = [
  { id: 'order_1001', orderNo: 'XS202606080001', userId: 'user_1001', status: '待付款', totalAmount: 4999, addressId: 'addr_1001', createdAt: '2026-06-08 09:20:00', source: 'direct', items: [{ id: 'order_item_1001', productId: 'prod_1001', productName: '星舟 X1 Pro 旗舰手机', spec: '曜石黑 256G', price: 4999, quantity: 1, cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20smartphone%20product%20shot%2C%20dark%20blue%20studio%20background%2C%20realistic%20reflection&image_size=portrait_4_3' }] },
  { id: 'order_1002', orderNo: 'XS202606080002', userId: 'user_1001', status: '待收货', totalAmount: 1237, addressId: 'addr_1002', createdAt: '2026-06-08 11:10:00', source: 'cart', items: [{ id: 'order_item_1002', productId: 'prod_1006', productName: '雾感持妆彩妆盘', spec: '暖调大地色', price: 239, quantity: 1, cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=makeup%20palette%20product%20photo%2C%20luxury%20beauty%20brand%2C%20soft%20shadow&image_size=portrait_4_3' }, { id: 'order_item_1003', productId: 'prod_1010', productName: '疾光开放式耳机', spec: '曜石黑', price: 599, quantity: 1, cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=open%20ear%20wireless%20earbuds%20product%20photo%2C%20dynamic%20fitness%20branding&image_size=portrait_4_3' }, { id: 'order_item_1004', productId: 'prod_1007', productName: '墨羽机械键盘', spec: '静音红轴', price: 399, quantity: 1, cover: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mechanical%20keyboard%20product%20photo%2C%20dark%20desk%20setup%2C%20clean%20commercial%20style&image_size=portrait_4_3' }] },
];

export const cartItems = [
  { id: 'cart_1001', userId: 'user_1001', productId: 'prod_1009', spec: '夜幕黑', quantity: 1, checked: true },
  { id: 'cart_1002', userId: 'user_1001', productId: 'prod_1003', spec: '标准版', quantity: 1, checked: false },
];

export const initialMockData = { banners, categories, products, users, addresses, roles, admins, orders, cartItems };
