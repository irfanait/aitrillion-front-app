import React, { useEffect } from 'react';
import { Row, Col, Typography, Divider, Spin } from 'antd';

import {
  ModalWrapper,
  SectionTitle,
  FieldRow,
  FieldLabel,
  FieldValue,
} from './style';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitTable from '@/components/molecules/ait-table/aitTable';
import { useDispatch, useSelector } from 'react-redux';
import { customerDetailsOrdersDetailsApi } from '@/redux/apis/customers-api/customersApi';

const { Link } = Typography;

const CustomerDetailsOrderDetailsModal = (props) => {
  const { visible, setVisible, orderId } = props;
  const dispatch = useDispatch();
  const { orderDetails, orderDetailsLoading } = useSelector(
    (state) => state.customerDetailsState
  );

  const order = orderDetails?.orderDetails || {};
  const items = Object.values(orderDetails?.orderItemsList || {});

  const productColumns = [
    {
      title: 'Product Id',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: 'Product name',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 70,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
    },
  ];

  useEffect(() => {
    if (!orderId) return;
    const payload = {
      act: 'customer_order_detail',
      order_id: orderId,
    };
    dispatch(customerDetailsOrdersDetailsApi(payload));
  }, [orderId]);

  return (
    <AitModal
      open={visible}
      setVisible={setVisible}
      centered
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      width={750}
      title="Order details"
    >
      <ModalWrapper>
        <SectionTitle>Customer details</SectionTitle>

        {orderDetailsLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '350px',
              width: '100%',
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row gutter={[24, 12]}>
              <Col span={12}>
                <FieldRow>
                  <FieldLabel>Shop name:</FieldLabel>
                  <FieldValue>
                    <Link href={`https://${order.shop_name}`} target="_blank">
                      {order.shop_name}
                    </Link>
                  </FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>Order Id:</FieldLabel>
                  <FieldValue>{order.nameOrderId}</FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>Name:</FieldLabel>
                  <FieldValue>{order.customer_name}</FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>Total price:</FieldLabel>
                  <FieldValue>{order.total_price}</FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>Total discount:</FieldLabel>
                  <FieldValue>{order.total_discounts}</FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>Discount code:</FieldLabel>
                  <FieldValue>-</FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>Payment gateway:</FieldLabel>
                  <FieldValue>{order.payment_gateway_names}</FieldValue>
                </FieldRow>
              </Col>

              <Col span={12}>
                <FieldRow>
                  <FieldLabel>Order date:</FieldLabel>
                  <FieldValue>{order.created_at}</FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>Store Order Id:</FieldLabel>
                  <FieldValue>{order.shopify_order_id}</FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>Email Id:</FieldLabel>
                  <FieldValue>{order.email}</FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>USD total price:</FieldLabel>
                  <FieldValue>{order.total_price}</FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>Shipping price:</FieldLabel>
                  <FieldValue>{order.shipping_cost}</FieldValue>
                </FieldRow>

                <FieldRow>
                  <FieldLabel>Source:</FieldLabel>
                  <FieldValue>{order.source_name}</FieldValue>
                </FieldRow>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={12}>
                <FieldRow>
                  <FieldLabel>Shipping address:</FieldLabel>
                  <FieldValue>{order.shipping_address}</FieldValue>
                </FieldRow>
              </Col>
              <Col span={12}>
                <FieldRow>
                  <FieldLabel>Billing address:</FieldLabel>
                  <FieldValue>{order.billing_address}</FieldValue>
                </FieldRow>
              </Col>
            </Row>
            <Divider />
            <SectionTitle>Product details</SectionTitle>
            <AitTable
              rowKey="shopify_line_item_id"
              columns={productColumns}
              loading={orderDetailsLoading}
              dataSource={items}
              pagination={false}
              showFilters={false}
              showSorterTooltip={false}
              scroll={{ x: 'max-content', y: 240 }}
            />
          </>
        )}
      </ModalWrapper>
    </AitModal>
  );
};

export default CustomerDetailsOrderDetailsModal;
