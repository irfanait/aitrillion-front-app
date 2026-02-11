import React, { useState } from 'react';
import { Card, Col, Row, Space, Typography } from 'antd';
import { useSelector } from 'react-redux';

import {
  DetailesClickedIcon,
  DetailesCubeIcon,
  DetailesDeliveredIcon,
  DetailesEmailIcon,
  DetailsDollarIcon,
  DetailsRevenueIcon,
  SentIcon,
} from '../../svg-icons';
import { StyledColoredDot } from './style';

import {
  formatSendDate,
  getPercentage,
  getText,
  renderChart,
  renderStats,
} from '../../utils/helper';
import AitButton from '@/components/atoms/ait-button/aitButton';
import TemplatePreviewModal from '../template-preview-modal/templatePreviewModal';

const { Text, Title } = Typography;

const CampaignDetailsOverView = () => {
  const {
    campaignDetailsData,
    campaignDetailsLoading,
    campaignDetailsReportLoading,
    campaignDetailsReportData,
  } = useSelector((state) => state.emailMarketingCampaignState);

  const [templatePreviewModalVisible, setTemplatePreviewModalVisible] =
    useState(false);

  const graph0 = campaignDetailsReportData?.graphdata?.[0] || {};

  const statCards = [
    {
      title: 'Sent vs. Delivered',
      data: [
        {
          name: 'Sent',
          value: Number(
            campaignDetailsReportData?.deliveryRate?.totalSent || 0
          ),
        },
        {
          name: 'Delivered',
          value: Number(
            campaignDetailsReportData?.deliveryRate?.totalDelivered || 0
          ),
        },
      ],
      percentage: campaignDetailsReportData?.deliveryRatePercentage,
      label: 'Delivery rate',
    },
    {
      title: 'Delivered vs. Open',
      data: [
        {
          name: 'Delivered',
          value: Number(
            campaignDetailsReportData?.openRate?.totalDelivered || 0
          ),
        },
        {
          name: 'Opened',
          value: Number(campaignDetailsReportData?.openRate?.totalOpened || 0),
        },
      ],
      percentage: campaignDetailsReportData?.openRatePercentage,
      label: 'Open rate',
    },
    {
      title: 'Open vs. Click',
      data: [
        {
          name: 'Opened',
          value: Number(campaignDetailsReportData?.clickRate?.totalOpened || 0),
        },
        {
          name: 'Clicked',
          value: Number(
            campaignDetailsReportData?.clickRate?.totalClicked || 0
          ),
        },
      ],
      percentage: campaignDetailsReportData?.clickRatePercentage,
      label: 'Click rate',
    },
    {
      title: 'Click vs. Conversion',
      data: [
        {
          name: 'Clicked',
          value: Number(
            campaignDetailsReportData?.conversionRate?.totalClicked || 0
          ),
        },
        {
          name: 'Converted',
          value: Number(
            campaignDetailsReportData?.conversionRate?.conversions || 0
          ),
        },
      ],
      percentage: campaignDetailsReportData?.conversionRatePercentage,
      label: 'Conversion rate',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {statCards.map((card, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card loading={campaignDetailsReportLoading}>
            <Title level={5}>{card.title}</Title>
            {renderChart(card.data)} {/* Pass only data */}
            <Text strong>{getPercentage(card.percentage)}</Text>{' '}
            <Text type="secondary">{card.label}</Text>
          </Card>
        </Col>
      ))}

      <Col xs={24} lg={12}>
        <Card loading={campaignDetailsLoading}>
          {[
            {
              label: 'Subject:',
              value: campaignDetailsData?.messagedetail?.email_subject,
            },
            {
              label: 'Email body:',
              value: (
                <AitButton
                  type="link"
                  title={'Check out our collection'}
                  padding={'0px !important'}
                  size="small"
                  onClick={() => {
                    setTemplatePreviewModalVisible(true);
                  }}
                />
              ),
            },
            {
              label: 'From:',
              value: campaignDetailsData?.messagedetail?.from_email,
            },
            {
              label: 'Reply to:',
              value: campaignDetailsData?.messagedetail?.reply_to_email,
            },
            {
              label: 'Total recipients:',
              value: campaignDetailsData?.messagedetail?.sent,
            },
            {
              label: 'Sent on:',
              value: formatSendDate(
                campaignDetailsData?.messagedetail?.send_date_time
              ),
            },
          ].map(({ label, value }, idx) => (
            <Row key={idx} gutter={8} style={{ marginBottom: 18 }}>
              <Col xs={8} sm={6}>
                <Text strong style={{ fontSize: 13 }} type="primary">
                  {label}
                </Text>
              </Col>
              <Col xs={16} sm={18}>
                <Text style={{ fontSize: 13 }} type="secondary">
                  {getText(value)}
                </Text>
              </Col>
            </Row>
          ))}
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card loading={campaignDetailsReportLoading} style={{ height: '100%' }}>
          <Row style={{ height: '100%' }} gutter={[0, 10]}>
            {renderStats([
              {
                icon: <SentIcon />,
                value: graph0?.totalSent || 0,
                label: 'Sent',
                percentage: null,
              },
              {
                icon: <DetailesDeliveredIcon />,
                value: campaignDetailsReportData?.deliveryRate?.totalDelivered,
                label: 'Delivered',
                percentage: campaignDetailsReportData?.deliveryRatePercentage,
              },
              {
                icon: <DetailesEmailIcon />,
                value: campaignDetailsReportData?.openRate?.totalOpened,
                label: 'Opened',
                percentage: campaignDetailsReportData?.openRatePercentage,
              },
              {
                icon: <DetailesClickedIcon />,
                value: campaignDetailsReportData?.clickRate?.totalClicked,
                label: 'Clicked',
                percentage: campaignDetailsReportData?.clickRatePercentage,
              },
              {
                icon: <DetailesCubeIcon />,
                value: graph0?.totalOrders || 0,
                label: 'Placed order',
                percentage: null,
              },
              {
                icon: <DetailsDollarIcon />,
                value: `${graph0?.total_order_amount || 0}`,
                label: 'Total Revenue',
                percentage: null,
              },
              {
                icon: <DetailsRevenueIcon />,
                value: campaignDetailsReportData?.revenuePerEmail,
                label: 'Revenue per email',
                percentage: null,
              },
            ])}
          </Row>
        </Card>
      </Col>

      {/* Undelivered */}
      <Col xs={24} lg={12}>
        <Card loading={campaignDetailsReportLoading}>
          <Title level={5}>
            Undelivered (
            {getPercentage(campaignDetailsReportData?.undeliverablePercentage)})
          </Title>
          <Row>
            <Col span={12}>
              <Text strong>
                {getText(campaignDetailsReportData?.hardBounce)}
              </Text>{' '}
              <Text>
                (
                {getPercentage(campaignDetailsReportData?.hardBouncePercentage)}
                )
              </Text>
              <br />
              <Text type="secondary">Hard bounce</Text>
              <StyledColoredDot color="#FC9701" />
            </Col>
            <Col span={12}>
              <Text strong>
                {getText(campaignDetailsReportData?.softBounce)}
              </Text>{' '}
              <Text>
                (
                {getPercentage(campaignDetailsReportData?.softBouncePercentage)}
                )
              </Text>
              <br />
              <Text type="secondary">Soft bounce</Text>
              <StyledColoredDot color="#32AEFF" />
            </Col>
          </Row>
        </Card>
      </Col>

      {/* Contact Loss */}
      <Col xs={24} lg={12}>
        <Card loading={campaignDetailsReportLoading}>
          <Title level={5}>
            Contact loss (
            {getPercentage(campaignDetailsReportData?.contactlossPercentage)})
          </Title>
          <Row>
            <Col span={12}>
              <Text strong>
                {getText(campaignDetailsReportData?.unsubscribes)}
              </Text>{' '}
              <Text>
                (
                {getPercentage(
                  campaignDetailsReportData?.unsubscribesPercentage
                )}
                )
              </Text>
              <br />
              <Text type="secondary">Unsubscribe</Text>
              <StyledColoredDot color="#44D4DB" />
            </Col>
            <Col span={12}>
              <Text strong>
                {getText(campaignDetailsReportData?.complaint)}
              </Text>{' '}
              <Text>
                ({getPercentage(campaignDetailsReportData?.complaintPercentage)}
                )
              </Text>
              <br />
              <Text type="secondary">Complaint</Text>
              <StyledColoredDot color="#888888" />
            </Col>
          </Row>
        </Card>
      </Col>
      <TemplatePreviewModal
        visible={templatePreviewModalVisible}
        setVisible={setTemplatePreviewModalVisible}
        htmlString={
          campaignDetailsData?.messagedetail?.email_content ||
          '<p>No content</p>'
        }
      />
    </Row>
  );
};

export default CampaignDetailsOverView;
