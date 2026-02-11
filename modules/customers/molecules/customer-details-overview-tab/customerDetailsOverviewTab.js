import { Col, Row } from 'antd';
import React from 'react';
import GeneralInfoCard from '../general-info-card/generalInfoCard';
import RfmMetricsCard from '../rfm-metrics-card/rfmMetricsCard';
import UnSubscribeCard from '../un-subscribe-card/unSubscribeCard';
import { useSelector } from 'react-redux';

const CustomerDetailsOverviewTab = () => {
  const { data, loading } = useSelector((state) => state.customerDetailsState);

  const customer = Array.isArray(data) ? data[0] : data;

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={24} md={12}>
        <GeneralInfoCard data={customer} loading={loading} />
      </Col>

      <Col xs={24} sm={24} md={12}>
        <RfmMetricsCard data={customer} />
      </Col>

      <Col span={24}>
        <UnSubscribeCard data={customer} />
      </Col>
    </Row>
  );
};

export default CustomerDetailsOverviewTab;
