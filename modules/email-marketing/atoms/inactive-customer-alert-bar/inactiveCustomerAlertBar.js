import React from 'react';
import { Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';

const { Text, Link } = Typography;

const InactiveCustomerAlertBar = ({ getAudienceCountState }) => {
  const inactiveCount =
    getAudienceCountState?.fetchAudienceCounts?.totalinactiverecord || 0;

  return (
    <div
      style={{
        borderRadius: 8,
        border: '1px solid #FCECCF',
        background: '#FFF7E6',
        padding: '5px 10px',
        marginBottom: 12,
      }}
    >
      <AitCollapse
        bordered={false}
        colorBgContainer="transparent"
        itemSpacing="0px"
        firstItemTopspacing="0px"
        firstItemBottomspacing="0px"
        itemHeaderPadding="6px 0px"
        headerLeftRightTopSpacing="0px"
        collapseIconTopSpacing="0px"
        collapseIconBotSpacing="0px"
        borderTop="none"
        borderBottom="none"
        bodyBorderTop="none"
        itemBodyPadding="4px 0px 12px 0px"
        headericonalign="start"
        extraiconbg="none"
        headerMinHeight="auto"
        headeralignvertival="center"
        panels={[
          {
            key: '1',
            icon: (
              <ExclamationCircleFilled
                style={{
                  fontSize: 18,
                  color: '#FAAD14',
                  position: 'relative',
                  top: 1, // perfect alignment w/ bullet dot
                }}
              />
            ),
            title: (
              <Text
                strong
                style={{
                  fontSize: 14,
                  lineHeight: '20px',
                }}
              >
                Why your campaign audience might be smaller?
              </Text>
            ),
            children: (
              <ul
                style={{
                  paddingLeft: 22, // FIGMA bullet indentation
                  marginTop: 4,
                  marginBottom: 0,
                  listStyle: 'disc',
                }}
              >
                {inactiveCount > 0 && (
                  <li
                    style={{
                      marginBottom: 8,
                      lineHeight: '18px',
                      fontSize: 13,
                    }}
                  >
                    You currently have <b>{inactiveCount} inactive contacts</b>.{' '}
                    <Link
                      href={process.env.NEXT_PUBLIC_INACTIVE_GUIDE}
                      underline
                    >
                      follow this guide
                    </Link>{' '}
                    to activate them before sending your campaign.
                  </li>
                )}

                <li
                  style={{ marginBottom: 8, lineHeight: '18px', fontSize: 13 }}
                >
                  Check if you’ve enabled suppression for customers who haven’t
                  subscribed to email marketing and adjust if needed.
                </li>

                <li
                  style={{ marginBottom: 0, lineHeight: '18px', fontSize: 13 }}
                >
                  Some contacts may be unsubscribed, bounced, or missing email
                  addresses.{' '}
                  <Link
                    href={process.env.NEXT_PUBLIC_SUPPRESSION_GUIDE}
                    underline
                    style={{
                      marginBottom: 0,
                      lineHeight: '18px',
                      fontSize: 13,
                    }}
                  >
                    learn more about suppression conditions here
                  </Link>
                  .
                </li>
              </ul>
            ),
          },
        ]}
      />
    </div>
  );
};

export default InactiveCustomerAlertBar;
