import { EnvironmentOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Modal, Space, Switch, Tag, Typography, message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_CENTER = [121.4737, 31.2304];
let amapLoaderPromise = null;
const DEBUG_SERVER_URL = 'http://127.0.0.1:7777/event';
const DEBUG_SESSION_ID = 'checkout-map-ready';

// #region debug-point common:report
function reportMapDebug(hypothesisId, messageText, data) {
  fetch(DEBUG_SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION_ID,
      runId: 'post-fix',
      hypothesisId,
      location: 'src/components/AddressMapModal.jsx',
      msg: '[DEBUG] ' + messageText,
      data,
      ts: Date.now(),
    }),
  }).catch(function () {});
}
// #endregion

function loadAmapScript(apiKey, securityJsCode) {
  if (!apiKey) {
    return Promise.reject(new Error('missing_api_key'));
  }

  if (window.AMap) {
    return Promise.resolve(window.AMap);
  }

  if (!amapLoaderPromise) {
    amapLoaderPromise = new Promise(function (resolve, reject) {
      if (securityJsCode) {
        window._AMapSecurityConfig = {
          securityJsCode,
        };
      }
      const script = document.createElement('script');
      script.src = 'https://webapi.amap.com/maps?v=2.0&key=' + apiKey + '&plugin=AMap.Geocoder,AMap.PlaceSearch';
      script.async = true;
      script.onload = function () {
        if (window.AMap) {
          resolve(window.AMap);
        } else {
          reject(new Error('amap_not_ready'));
        }
      };
      script.onerror = function () {
        reject(new Error('amap_load_failed'));
      };
      document.body.appendChild(script);
    });
  }

  return amapLoaderPromise;
}

function buildInitialForm(address) {
  return {
    receiver: address?.receiver || '',
    phone: address?.phone || '',
    tag: address?.tag || '家',
    isDefault: Boolean(address?.isDefault),
    region: address?.region || '',
    detail: address?.detail || '',
    province: address?.province || '',
    city: address?.city || '',
    district: address?.district || '',
    street: address?.street || '',
    locationName: address?.locationName || '',
    lng: address?.lng || null,
    lat: address?.lat || null,
  };
}

function buildRegionFromComponent(component) {
  return [component.province, component.city, component.district].filter(Boolean).join(' ');
}

function buildDetailFromRegeo(regeo) {
  const component = regeo.addressComponent || {};
  const detailParts = [
    component.township,
    component.streetNumber?.street,
    component.streetNumber?.number,
  ].filter(Boolean);

  if (detailParts.length) {
    return detailParts.join('');
  }

  return regeo.formattedAddress || '';
}

export default function AddressMapModal({ open, address, onCancel, onSubmit }) {
  const apiKey = import.meta.env.VITE_AMAP_KEY || '';
  const securityJsCode = import.meta.env.VITE_AMAP_SECURITY_JS_CODE || '';
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const placeSearchRef = useRef(null);
  const [form, setForm] = useState(buildInitialForm(address));
  const [keyword, setKeyword] = useState('');
  const [loadingMap, setLoadingMap] = useState(false);
  const [mapError, setMapError] = useState('');
  const [initAttempt, setInitAttempt] = useState(0);

  useEffect(function () {
    if (open) {
      setForm(buildInitialForm(address));
      setKeyword(address?.locationName || address?.detail || '');
    }
  }, [open, address]);

  useEffect(function () {
    let retryTimer = null;
    // #region debug-point C:effect-entry
    reportMapDebug('C', 'modal effect entered', {
      open,
      hasMapRef: Boolean(mapRef.current),
      hasApiKey: Boolean(apiKey),
      hasSecurityJsCode: Boolean(securityJsCode),
      initAttempt,
    });
    // #endregion
    if (!open || !mapRef.current) {
      // #region debug-point C:effect-early-return
      reportMapDebug('C', 'effect returned before init', {
        open,
        hasMapRef: Boolean(mapRef.current),
        initAttempt,
      });
      // #endregion
      if (open && !mapRef.current) {
        retryTimer = window.setTimeout(function () {
          setInitAttempt(function (value) { return value + 1; });
        }, 80);
      }
      return;
    }

    if (!apiKey) {
      // #region debug-point A:no-api-key
      reportMapDebug('A', 'api key missing in modal effect', {
        apiKeyLength: apiKey.length,
        hasSecurityJsCode: Boolean(securityJsCode),
      });
      // #endregion
      setMapError('未检测到高德地图 Key，当前使用结构化地址手动填写模式。');
      return;
    }

    let destroyed = false;
    setLoadingMap(true);
    setMapError('');

    loadAmapScript(apiKey, securityJsCode)
      .then(function (AMap) {
        if (destroyed) return;
        // #region debug-point A:script-loaded
        reportMapDebug('A', 'amap script loaded', {
          hasAMap: Boolean(AMap),
          hasMapCtor: Boolean(AMap?.Map),
          hasGeocoderCtor: Boolean(AMap?.Geocoder),
          hasSecurityJsCode: Boolean(securityJsCode),
        });
        // #endregion

        const center = form.lng && form.lat ? [form.lng, form.lat] : DEFAULT_CENTER;
        const map = new AMap.Map(mapRef.current, {
          zoom: 14,
          center,
        });
        const geocoder = new AMap.Geocoder({});
        const placeSearch = new AMap.PlaceSearch({
          pageSize: 1,
          pageIndex: 1,
        });
        // #region debug-point B:map-ready
        reportMapDebug('B', 'map and geocoder initialized', {
          center,
          hasGeocoder: Boolean(geocoder),
          hasPlaceSearch: Boolean(placeSearch),
        });
        // #endregion

        mapInstanceRef.current = map;
        geocoderRef.current = geocoder;
        placeSearchRef.current = placeSearch;

        map.on('click', function (event) {
          updateByLocation(event.lnglat.lng, event.lnglat.lat);
        });

        if (form.lng && form.lat) {
          syncMarker(AMap, map, [form.lng, form.lat]);
        }
      })
      .catch(function () {
        // #region debug-point D:script-load-failed
        reportMapDebug('D', 'amap script failed to initialize', {
          hasApiKey: Boolean(apiKey),
          hasSecurityJsCode: Boolean(securityJsCode),
        });
        // #endregion
        if (!destroyed) {
          setMapError('高德地图加载失败，当前可继续手动填写结构化地址。');
        }
      })
      .finally(function () {
        if (!destroyed) {
          setLoadingMap(false);
        }
      });

    return function () {
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
      destroyed = true;
      markerRef.current = null;
      geocoderRef.current = null;
      placeSearchRef.current = null;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, apiKey, securityJsCode, initAttempt]);

  function syncMarker(AMap, map, position) {
    if (!markerRef.current) {
      markerRef.current = new AMap.Marker({
        position,
        offset: new AMap.Pixel(-13, -30),
      });
      map.add(markerRef.current);
    } else {
      markerRef.current.setPosition(position);
    }
    map.setCenter(position);
  }

  function updateByLocation(lng, lat) {
    const map = mapInstanceRef.current;
    const geocoder = geocoderRef.current;

    if (!map || !geocoder || !window.AMap) {
      return;
    }

    syncMarker(window.AMap, map, [lng, lat]);
    geocoder.getAddress([lng, lat], function (status, result) {
      // #region debug-point B:reverse-geocode-callback
      reportMapDebug('B', 'reverse geocode callback received', {
        lng,
        lat,
        status,
        hasRegeocode: Boolean(result?.regeocode),
      });
      // #endregion
      if (status !== 'complete' || !result?.regeocode) {
        message.warning('定位成功，但地址解析失败，请手动补充详细信息');
        setForm(function (current) {
          return { ...current, lng, lat };
        });
        return;
      }

      const regeo = result.regeocode;
      const component = regeo.addressComponent || {};
      const region = buildRegionFromComponent(component);
      const detail = buildDetailFromRegeo(regeo);

      setForm(function (current) {
        return {
          ...current,
          lng,
          lat,
          province: component.province || '',
          city: Array.isArray(component.city) ? component.province || '' : component.city || component.province || '',
          district: component.district || '',
          street: component.streetNumber?.street || component.township || '',
          region,
          detail: current.detail || detail,
          locationName: regeo.formattedAddress || current.locationName,
        };
      });
    });
  }

  function handleSearch() {
    // #region debug-point E:search-click
    reportMapDebug('E', 'search triggered', {
      keyword,
      hasGeocoder: Boolean(geocoderRef.current),
      hasPlaceSearch: Boolean(placeSearchRef.current),
      hasMap: Boolean(mapInstanceRef.current),
    });
    // #endregion
    if (!keyword.trim()) {
      message.warning('请输入需要搜索的地点关键词');
      return;
    }

    const placeSearch = placeSearchRef.current;
    if (!placeSearch) {
      // #region debug-point E:search-no-geocoder
      reportMapDebug('E', 'search aborted because place search is not ready', {
        keyword,
      });
      // #endregion
      message.warning('地图尚未就绪，请直接手动填写结构化地址');
      return;
    }

    placeSearch.search(keyword.trim(), function (status, result) {
      // #region debug-point E:search-callback
      reportMapDebug('E', 'search callback received', {
        keyword,
        status,
        poiCount: result?.poiList?.pois?.length || 0,
      });
      // #endregion
      const location = result?.poiList?.pois?.[0]?.location;
      if (status !== 'complete' || !location) {
        // #region debug-point E:search-no-location
        reportMapDebug('E', 'search finished without usable location', {
          keyword,
          status,
          firstPoi: result?.poiList?.pois?.[0] || null,
        });
        // #endregion
        message.warning('未搜索到相关地址，请尝试更精确的关键词');
        return;
      }
      updateByLocation(location.lng, location.lat);
    });
  }

  function handleSubmit() {
    if (!form.receiver.trim() || !form.phone.trim() || !form.region.trim() || !form.detail.trim()) {
      message.warning('请完整填写收货地址信息');
      return;
    }

    if (!/^1\d{10}$/.test(form.phone.trim())) {
      message.warning('请输入正确的手机号');
      return;
    }

    onSubmit({
      ...address,
      ...form,
      receiver: form.receiver.trim(),
      phone: form.phone.trim(),
      tag: form.tag.trim() || '家',
      region: form.region.trim(),
      detail: form.detail.trim(),
      province: form.province.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      street: form.street.trim(),
      locationName: form.locationName.trim(),
    });
  }

  const footer = useMemo(function () {
    return [
      <Button key="cancel" onClick={onCancel}>取消</Button>,
      <Button key="submit" type="primary" onClick={handleSubmit}>保存地址</Button>,
    ];
  }, [onCancel, handleSubmit]);

  return (
    <Modal
      destroyOnHidden
      forceRender
      footer={footer}
      open={open}
      onCancel={onCancel}
      title={address ? '编辑收货地址' : '新增收货地址'}
      width={1080}
      className="address-map-modal"
    >
      <div className="address-map-modal__layout">
        <div className="address-map-modal__form">
          <div className="address-map-modal__grid">
            <div className="address-map-modal__field">
              <span className="address-map-modal__label">收货人</span>
              <Input
                placeholder="请输入收货人姓名"
                value={form.receiver}
                onChange={function (event) {
                  setForm({ ...form, receiver: event.target.value });
                }}
              />
            </div>
            <div className="address-map-modal__field">
              <span className="address-map-modal__label">手机号</span>
              <Input
                placeholder="请输入 11 位手机号"
                value={form.phone}
                onChange={function (event) {
                  setForm({ ...form, phone: event.target.value });
                }}
              />
            </div>
          </div>

          <div className="address-map-modal__grid address-map-modal__grid--triple">
            <div className="address-map-modal__field">
              <span className="address-map-modal__label">省份</span>
              <Input
                placeholder="如：上海市"
                value={form.province}
                onChange={function (event) {
                  setForm({ ...form, province: event.target.value });
                }}
              />
            </div>
            <div className="address-map-modal__field">
              <span className="address-map-modal__label">城市</span>
              <Input
                placeholder="如：上海市"
                value={form.city}
                onChange={function (event) {
                  setForm({ ...form, city: event.target.value });
                }}
              />
            </div>
            <div className="address-map-modal__field">
              <span className="address-map-modal__label">区县</span>
              <Input
                placeholder="如：浦东新区"
                value={form.district}
                onChange={function (event) {
                  setForm({ ...form, district: event.target.value, region: [form.province, form.city, event.target.value].filter(Boolean).join(' ') });
                }}
              />
            </div>
          </div>

          <div className="address-map-modal__field">
            <span className="address-map-modal__label">行政区域</span>
            <Input
              placeholder="地图选点后自动回填，也可手动输入"
              value={form.region}
              onChange={function (event) {
                setForm({ ...form, region: event.target.value });
              }}
            />
          </div>

          <div className="address-map-modal__field">
            <span className="address-map-modal__label">详细地址</span>
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="请输入街道、门牌号、楼栋房间号"
              value={form.detail}
              onChange={function (event) {
                setForm({ ...form, detail: event.target.value });
              }}
            />
          </div>

          <div className="address-map-modal__grid">
            <div className="address-map-modal__field">
              <span className="address-map-modal__label">地址标签</span>
              <Input
                placeholder="如：家、公司、学校"
                value={form.tag}
                onChange={function (event) {
                  setForm({ ...form, tag: event.target.value });
                }}
              />
            </div>
            <div className="address-map-modal__field">
              <span className="address-map-modal__label">设为默认地址</span>
              <div className="address-map-modal__switch">
                <Switch
                  checked={form.isDefault}
                  onChange={function (checked) {
                    setForm({ ...form, isDefault: checked });
                  }}
                />
                <Typography.Text type="secondary">下次进入结算页时优先选中</Typography.Text>
              </div>
            </div>
          </div>

          <div className="address-map-modal__meta">
            <Tag icon={<EnvironmentOutlined />} color="blue">
              {form.lng && form.lat ? '已完成地图定位' : '尚未完成地图定位'}
            </Tag>
            {form.locationName ? (
              <Typography.Text type="secondary">定位结果：{form.locationName}</Typography.Text>
            ) : null}
          </div>
        </div>

        <div className="address-map-modal__map-panel">
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <div className="address-map-modal__search">
              <Input
                placeholder="搜索小区、写字楼、街道名称"
                prefix={<SearchOutlined />}
                value={keyword}
                onChange={function (event) {
                  setKeyword(event.target.value);
                }}
                onPressEnter={handleSearch}
              />
              <Button type="primary" onClick={handleSearch}>搜索定位</Button>
            </div>

            {mapError ? (
              <Alert
                showIcon
                type="warning"
                icon={<InfoCircleOutlined />}
                message={mapError}
              />
            ) : (
              <Alert
                showIcon
                type="info"
                message="支持搜索地点或直接点击地图，系统会自动回填省市区和详细地址。"
              />
            )}

            <div className="address-map-modal__map-wrap">
              {loadingMap ? <div className="address-map-modal__map-placeholder">地图加载中...</div> : null}
              <div ref={mapRef} className="address-map-modal__map" />
              {!apiKey || mapError ? (
                <div className="address-map-modal__map-placeholder address-map-modal__map-placeholder--overlay">
                  <Typography.Title level={5}>当前使用结构化地址填写模式</Typography.Title>
                  <Typography.Text type="secondary">
                    配置 `VITE_AMAP_KEY` 后即可启用高德地图选点与自动回填能力。
                  </Typography.Text>
                </div>
              ) : null}
            </div>
          </Space>
        </div>
      </div>
    </Modal>
  );
}
