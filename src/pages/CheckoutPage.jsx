import {
  CheckCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Col, Empty, Input, List, Radio, Row, Space, Steps, Tag, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressMapModal from '../components/AddressMapModal';
import { useMallData } from '../hooks/useMallData';
import { useUser } from '../contexts/UserContext';
import { formatPrice } from '../utils/formatters';
import { createOrder, getAddresses, getCheckoutDraft, getDefaultAddress, saveAddress } from '../utils/mallStore';

const DELIVERY_OPTIONS = [
  {
    value: 'express',
    label: '官方快递',
    desc: '预计明日 18:00 前送达，支持送货上门',
  },
  {
    value: 'pickup',
    label: '门店自提',
    desc: '下单后 2 小时内可提货，适合急需场景',
  },
];

// 创建订单页统一处理购物车结算和立即购买两种场景。
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const draft = useMallData(function () { return getCheckoutDraft(); }, []);
  const addresses = useMallData(function () { return user ? getAddresses(user.id) : []; }, [user?.id]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deliveryType, setDeliveryType] = useState('express');
  const [buyerMessage, setBuyerMessage] = useState('');

  const summary = useMemo(function () {
    const goodsAmount = (draft?.items || []).reduce(function (sum, item) {
      const price = item.specPrice || (item.product ? item.product.price : 0);
      return sum + price * item.quantity;
    }, 0);
    const totalQuantity = (draft?.items || []).reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);
    const freightAmount = deliveryType === 'pickup' || goodsAmount >= 99 ? 0 : 12;
    const payAmount = goodsAmount + freightAmount;
    return { goodsAmount, totalQuantity, freightAmount, payAmount };
  }, [draft?.items, deliveryType]);

  const selectedAddress = useMemo(function () {
    return addresses.find(function (item) {
      return item.id === selectedAddressId;
    }) || null;
  }, [addresses, selectedAddressId]);

  useEffect(function () {
    const address = user ? getDefaultAddress(user.id) : null;
    if (!selectedAddressId || !addresses.some(function (item) { return item.id === selectedAddressId; })) {
      setSelectedAddressId(address?.id || addresses[0]?.id || '');
    }
  }, [user, addresses, selectedAddressId]);

  if (!draft?.items?.length) return <Card className="section-card"><Empty description="暂无待提交订单，请从购物车或商品详情发起购买"><Button type="primary" onClick={function () { navigate('/'); }}>返回首页</Button></Empty></Card>;

  return (
    <>
      <div className="page-section-stack checkout-page">
        <Card className="section-card checkout-hero-card">
          <div className="checkout-hero">
            <div>
              <Typography.Title level={2} style={{ marginBottom: 8 }}>确认订单信息</Typography.Title>
              <Typography.Text type="secondary">地址、商品、配送方式确认无误后即可提交订单。</Typography.Text>
            </div>
            <Steps
              className="checkout-steps"
              current={1}
              items={[
                { title: '购物车' },
                { title: '确认订单' },
                { title: '支付' },
                { title: '完成' },
              ]}
            />
          </div>
        </Card>

        <Row gutter={[24, 24]} align="top">
          <Col lg={16} xs={24}>
            <div className="page-section-stack">
              <Card className="section-card checkout-section-card">
                <div className="checkout-section-head">
                  <div>
                    <Typography.Title level={3}>选择收货地址</Typography.Title>
                    <Typography.Text type="secondary">支持高德地图定位，点击整张地址卡即可切换。</Typography.Text>
                  </div>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={function () {
                      setEditingAddress(null);
                      setAddressModalOpen(true);
                    }}
                  >
                    新增地址
                  </Button>
                </div>

                {addresses.length ? (
                  <div className="checkout-address-grid">
                    {addresses.map(function (address) {
                      const active = address.id === selectedAddressId;
                      return (
                        <div
                          key={address.id}
                          className={'checkout-address-card' + (active ? ' active' : '')}
                          onClick={function () { setSelectedAddressId(address.id); }}
                          onKeyDown={function (event) {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setSelectedAddressId(address.id);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="checkout-address-card__top">
                            <Space size={8}>
                              <Typography.Text strong>{address.receiver}</Typography.Text>
                              <Typography.Text>{address.phone}</Typography.Text>
                            </Space>
                            {active ? <CheckCircleFilled className="checkout-address-card__icon" /> : null}
                          </div>
                          <Typography.Paragraph className="checkout-address-card__text" ellipsis={{ rows: 2 }}>
                            {address.region} {address.detail}
                          </Typography.Paragraph>
                          <div className="checkout-address-card__bottom">
                            <Space size={8} wrap>
                              {address.isDefault ? <Tag color="blue">默认地址</Tag> : null}
                              <Tag>{address.tag || '常用'}</Tag>
                              {address.lng && address.lat ? <Tag color="cyan">地图定位</Tag> : null}
                            </Space>
                            <Button
                              type="link"
                              size="small"
                              onClick={function (event) {
                                event.stopPropagation();
                                setEditingAddress(address);
                                setAddressModalOpen(true);
                              }}
                            >
                              编辑
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无收货地址，请先新增地址"
                  >
                    <Button
                      type="primary"
                      onClick={function () {
                        setEditingAddress(null);
                        setAddressModalOpen(true);
                      }}
                    >
                      立即添加地址
                    </Button>
                  </Empty>
                )}
              </Card>

              <Card className="section-card checkout-section-card">
                <div className="checkout-section-head">
                  <div>
                    <Typography.Title level={3}>确认商品清单</Typography.Title>
                    <Typography.Text type="secondary">对照商品、规格、数量和小计，符合淘宝式结算页展示逻辑。</Typography.Text>
                  </div>
                  <Tag color="gold">{draft.source === 'cart' ? '购物车结算' : '立即购买'}</Tag>
                </div>

                <List
                  className="checkout-goods-list"
                  dataSource={draft.items}
                  itemLayout="horizontal"
                  renderItem={function (item) {
                    return (
                      <List.Item className="checkout-goods-list__item">
                        <div className="checkout-goods-list__meta">
                          <img alt={item.product.name} className="checkout-goods-list__cover" src={item.product.cover} />
                          <div className="checkout-goods-list__info">
                            <Typography.Text strong>{item.product.name}</Typography.Text>
                            <Typography.Text type="secondary">规格：{item.spec || '--'}</Typography.Text>
                          </div>
                        </div>
                        <div className="checkout-goods-list__price">
                          <Typography.Text>单价 {formatPrice(item.specPrice || item.product.price)}</Typography.Text>
                          <Typography.Text>数量 x {item.quantity}</Typography.Text>
                          <Typography.Text strong>{formatPrice((item.specPrice || item.product.price) * item.quantity)}</Typography.Text>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </Card>

              <Card className="section-card checkout-section-card">
                <div className="checkout-section-head">
                  <div>
                    <Typography.Title level={3}>配送与备注</Typography.Title>
                    <Typography.Text type="secondary">补足送达信息、配送方式和买家留言模块。</Typography.Text>
                  </div>
                </div>

                <Radio.Group
                  className="checkout-choice-group"
                  value={deliveryType}
                  optionType="button"
                  onChange={function (event) { setDeliveryType(event.target.value); }}
                >
                  {DELIVERY_OPTIONS.map(function (item) {
                    return (
                      <Radio.Button key={item.value} value={item.value}>
                        <div className="checkout-choice-group__item">
                          <span className="checkout-choice-group__title">{item.label}</span>
                          <span className="checkout-choice-group__desc">{item.desc}</span>
                        </div>
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>

                <div className="checkout-delivery-panels">
                  <div className="checkout-mini-panel">
                    <TruckOutlined />
                    <div>
                      <Typography.Text strong>{deliveryType === 'pickup' ? '门店自提' : '商家发货'}</Typography.Text>
                      <Typography.Text type="secondary">{deliveryType === 'pickup' ? '下单后 2 小时内可提货' : '预计明日 18:00 前送达'}</Typography.Text>
                    </div>
                  </div>
                  <div className="checkout-mini-panel">
                    <SafetyCertificateOutlined />
                    <div>
                      <Typography.Text strong>售后服务</Typography.Text>
                      <Typography.Text type="secondary">支持 7 天无理由退货，订单页可查看售后说明。</Typography.Text>
                    </div>
                  </div>
                </div>

                <div>
                  <Typography.Text strong>买家留言</Typography.Text>
                  <Input.TextArea
                    className="checkout-inline-input"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    maxLength={120}
                    placeholder="选填：如配送时间、包装要求等"
                    value={buyerMessage}
                    onChange={function (event) { setBuyerMessage(event.target.value); }}
                  />
                </div>
              </Card>
            </div>
          </Col>

          <Col lg={8} xs={24}>
            <div className="checkout-summary-sticky">
              <Card className="section-card checkout-summary-card">
                <Typography.Title level={3}>订单总览</Typography.Title>
                <div className="checkout-summary-card__group">
                  <div className="checkout-summary-card__row">
                    <span>商品总额</span>
                    <span>{formatPrice(summary.goodsAmount)}</span>
                  </div>
                  <div className="checkout-summary-card__row">
                    <span>商品件数</span>
                    <span>{summary.totalQuantity} 件</span>
                  </div>
                  <div className="checkout-summary-card__row">
                    <span>运费</span>
                    <span>{summary.freightAmount ? formatPrice(summary.freightAmount) : '免运费'}</span>
                  </div>
                </div>

                <div className="checkout-summary-card__payable">
                  <span>应付总额</span>
                  <strong>{formatPrice(summary.payAmount)}</strong>
                </div>

                <Alert
                  className="checkout-summary-card__alert"
                  type="info"
                  showIcon
                  message={deliveryType === 'pickup' ? '当前选择门店自提，无需支付运费。' : '当前选择官方快递，订单提交后进入支付流程。'}
                />

                <div className="checkout-summary-card__address">
                  <Typography.Text strong>收货信息</Typography.Text>
                  {selectedAddress ? (
                    <>
                      <Typography.Paragraph className="checkout-summary-card__address-text">
                        {selectedAddress.region} {selectedAddress.detail}
                      </Typography.Paragraph>
                      <Typography.Text type="secondary">{selectedAddress.receiver} {selectedAddress.phone}</Typography.Text>
                    </>
                  ) : (
                    <Typography.Text type="danger">请先选择收货地址</Typography.Text>
                  )}
                </div>

                <Button
                  block
                  type="primary"
                  size="large"
                  loading={submitting}
                  disabled={submitting}
                  onClick={async function () {
                    if (submitting) return;
                    try {
                      setSubmitting(true);
                      if (!selectedAddressId) {
                        message.warning('请选择收货地址');
                        return;
                      }
                      const order = createOrder({
                        userId: user.id,
                        addressId: selectedAddressId,
                        items: draft.items,
                        source: draft.source,
                      });
                      message.success('订单提交成功');
                      if (buyerMessage.trim()) {
                        message.info('当前版本已记录留言输入，后续可继续接入订单详情展示');
                      }
                      navigate('/pay/' + order.id);
                    } catch (error) {
                      message.error(error.message || '订单提交失败');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  提交订单
                </Button>

                <div className="checkout-summary-card__benefits">
                  <div className="checkout-summary-card__benefit"><EnvironmentOutlined /> 地图选点地址</div>
                  <div className="checkout-summary-card__benefit"><ClockCircleOutlined /> 实时同步默认地址</div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      <AddressMapModal
        open={addressModalOpen}
        address={editingAddress}
        onCancel={function () {
          setAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSubmit={function (values) {
          const savedAddress = saveAddress({ ...values, userId: user.id });
          setAddressModalOpen(false);
          setEditingAddress(null);
          if (savedAddress?.id) {
            setSelectedAddressId(savedAddress.id);
          }
          message.success(values.id ? '地址修改成功' : '地址新增成功');
        }}
      />
    </>
  );
}
