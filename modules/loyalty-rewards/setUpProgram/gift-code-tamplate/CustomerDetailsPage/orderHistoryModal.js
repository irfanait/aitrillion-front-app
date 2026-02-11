import React, { useEffect, useState } from 'react';
import { Col, Skeleton, Row, Divider } from 'antd';
import { DetailRow, HistoryWrapper, InfoGroup, Label, Value } from '../style';
import logger from '@/utils/logger';
import { getsHistoryDataService } from '../../../api/giftCode';
import { checkValidData, getCurrencyByMoneyFormat } from '@/utils/common.util';
import { useSelector } from 'react-redux';
import CustomAitTable from '@/components/molecules/custom-ait-table';
import AitText from '@/components/atoms/ait-text/aitText';
import AitLink from '@/components/atoms/ait-link/aitLink';

const OrderHistoryDetails = ({ orderHistoryModal }) => {
  const jwtState = useSelector((state) => state?.jwtState);
  const [historyData, setHistoryData] = useState({
    data: {},
    loading: false,
  });

  const getDetailsData = async (id) => {
    setHistoryData((prev) => ({
      ...prev,
      loading: true,
      data: [],
    }));
    try {
      let payload = {
        act: 'get_order_line_items',
        order_id: id,
        shop_id: jwtState?.login_auth?.shop_id,
      };
      const response = await getsHistoryDataService(payload);
      console.log('response', response);

      if (response?.data?.status === 'success') {
        setHistoryData((prev) => ({
          ...prev,
          loading: true,
          data: response?.data,
        }));
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setHistoryData((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const columns = [
    {
      title: 'Product Id',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: 'Product name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  const handleOpenShop = () => {
    let shopUrl = jwtState?.login_auth?.shop_name;

    if (!shopUrl) return;

    if (!/^https?:\/\//i.test(shopUrl)) {
      shopUrl = `https://${shopUrl}`;
    }

    window.open(shopUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (orderHistoryModal) {
      getDetailsData(orderHistoryModal);
    }
  }, [orderHistoryModal]);

  return (
    <HistoryWrapper>
      <div style={{ marginTop: 16 }}></div>
      <AitText strong size={16} type={'primary'} bottommargin={16}>
        Customer details
      </AitText>

      <InfoGroup>
        <DetailRow gutter={[16, 15]}>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText strong size={13} lineheight={16} type={'default'}>
                  Shop name:
                </AitText>
              </Col>
              <Col span={15} style={{ lineHeight: '16px' }}>
                <AitLink size={13} onClick={() => handleOpenShop()}>
                  {checkValidData(jwtState?.login_auth?.shop_name)}
                </AitLink>
              </Col>
            </Row>
            {/*  */}
            {/* </Row> */}
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Order date:
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(historyData?.data?.orderDetails?.created_at)
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
        </DetailRow>

        <DetailRow gutter={[16, 15]}>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Order Id:
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(
                      historyData?.data?.orderDetails?.nameOrderId
                        ? `${historyData?.data?.orderDetails?.nameOrderId}`
                        : '-'
                    )
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Store order Id:
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(
                      historyData?.data?.orderDetails?.order_shopify_order_id
                    )
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
        </DetailRow>

        <DetailRow gutter={[16, 15]}>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Name:
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(historyData?.data?.orderDetails?.name)
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Email Id:
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(historyData?.data?.orderDetails?.email)
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
        </DetailRow>

        <DetailRow gutter={[16, 15]}>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Total price:
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(historyData?.data?.orderDetails?.total_price)
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  USD total price:{' '}
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(
                      historyData?.data?.orderDetails?.total_price_usd
                        ? `${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)}${historyData?.data?.orderDetails?.total_price_usd}`
                        : '-'
                    )
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
        </DetailRow>

        <DetailRow gutter={[16, 15]}>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Total discount:
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(
                      historyData?.data?.orderDetails?.total_discounts
                    )
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Shipping price:
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(
                      historyData?.data?.orderDetails?.shipping_cost
                    )
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
        </DetailRow>

        <DetailRow gutter={[16, 15]}>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Discount code:
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(
                      historyData?.data?.orderDetails?.discount_codes_display
                    )
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
        </DetailRow>

        <DetailRow gutter={[16, 15]}>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Payment gateway:
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(
                      historyData?.data?.orderDetails?.payment_gateway_names
                    )
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Source:{' '}
                </AitText>
              </Col>{' '}
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(historyData?.data?.orderDetails?.source_name)
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
        </DetailRow>

        <DetailRow gutter={[16, 15]}>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Shipping address:{' '}
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(
                      historyData?.data?.orderDetails?.shipping_address
                    )
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={24}>
              <Col span={9}>
                <AitText type={'default'} strong size={13} lineheight={16}>
                  Billing address:{' '}
                </AitText>
              </Col>
              <Col span={15}>
                <AitText type={'secondary'} size={13} lineheight={16}>
                  {historyData?.loading ? (
                    <div style={{ width: '100%', maxWidth: 400 }}>
                      <Skeleton.Button
                        block
                        active
                        style={{
                          width: '2%',
                          height: 20,
                        }}
                      />
                    </div>
                  ) : (
                    checkValidData(
                      historyData?.data?.orderDetails?.billing_address
                    )
                  )}
                </AitText>
              </Col>
            </Row>
          </Col>
        </DetailRow>
      </InfoGroup>

      <Divider />

      <AitText strong size={16} type={'primary'}>
        Product details
      </AitText>

      <CustomAitTable
        showTotalCount={false}
        tableData={historyData?.data?.orderItemsList}
        columns={columns}
        size="small"
        loading={historyData?.loading}
        pagination={false}
      />
    </HistoryWrapper>
  );
};

export default OrderHistoryDetails;
