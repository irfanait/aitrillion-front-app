import React from 'react';
import { Typography, Space, Flex, Descriptions } from 'antd';
import {
  UserOutlined,
  AimOutlined,
  EnvironmentFilled,
  GlobalOutlined,
  MailFilled,
  PhoneFilled,
  CalendarFilled,
  BarChartOutlined,
} from '@ant-design/icons';
import { LuCalendarCheck, LuPhoneCall } from 'react-icons/lu';
import { LiaCalendarAltSolid } from 'react-icons/lia';
import { RiCake2Line } from 'react-icons/ri';
import { AiOutlineMail } from 'react-icons/ai';

import AitCard from '@/components/atoms/ait-card/aitCard';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import {
  Bold,
  LabelWrapper,
  LeftScrollableWrapper,
  RowItem,
  SectionPadding,
  ValueWrapper,
} from './style';
import CustomerDetailsHeader from '../../molecules/customer-details-header/customerDetailsHeader';
import {
  formatDateSafe,
  getFieldValue,
  getFormattedDate,
} from '../../utils/helper';
import CustomerDetailsCustomFieldSection from '../../molecules/custom-details-custom-field-section/customerDetailsCustomFieldSection';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { updateCustomerStatusLocal } from '@/redux/customers-slice/customer-details-slices/customerDetailsSlice';
import { updateCustomerStatusApi } from '@/redux/apis/customers-api/customersApi';
import moment from 'moment';
import AitText from '@/components/atoms/ait-text/aitText';

const { Item } = Descriptions;

const CustomerDetailsLeft = ({ customer, onEditCustomField }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { customFieldCount, customerPointExpiryData } = useSelector(
    (state) => state.customerDetailsState
  );

  const safe = (value) => (value && value !== '' ? value : '–');

  const fullName = getFieldValue(
    `${customer?.first_name || ''} ${customer?.last_name || ''}`.trim()
  );

  const rawBirthday = customer?.lyt_cus_birthday;

  const birthday = rawBirthday
    ? moment(
        rawBirthday.replace(/\s\d{1,2}:\d{2}\s?(AM|PM)$/i, ''),
        'YYYY-MM-DD HH:mm:ss',
        true
      ).format('MM-DD-YYYY')
    : '–';

  const address = customer?.customerAddress?.[0] || {};

  const accountState = customer?.state === 'enabled' ? 'Registered' : 'Guest';

  // Format Shopify Tags into separate lines
  const formattedTags = customer?.tags
    ? customer.tags
        .split(',')
        .map((tag) => tag.trim())
        .join(', ')
    : '–';

  const onAddCustomFields = () => {
    router.push('/customers/custom-fields/custom-field-list');
  };

  const onToggleStatus = async (checked) => {
    const customer_id = customer?.id;
    const status = checked; // true / false

    // Optimistic UI update
    const is_inactive = checked ? '0' : '1';
    dispatch(updateCustomerStatusLocal(is_inactive));
    dispatch(updateCustomerStatusApi({ customer_id, status }));
  };

  const mapQuery = [
    address.address1,
    address.address2,
    address.city,
    address.province,
    address.country,
    address.zip,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <LeftScrollableWrapper>
      <AitCard
        bodyBorderTop="none"
        headerpadding={{
          xs: '15px 20px',
          sm: '15px 20px',
          md: '15px 20px',
        }}
        bodypadding={{
          xs: '0px 0px 10px 0px',
          sm: '0px 0px 10px 0px',
          md: '0px 0px 10px 0px',
        }}
        //  style={{ borderRadius: 12 }}
        title={
          <>
            {/* HEADER */}
            <CustomerDetailsHeader
              name={fullName}
              location={
                address
                  ? `${address.city || '–'}, ${address.country_name || '–'}`
                  : '–'
              }
              customer={customer}
              onToggleStatus={onToggleStatus}
            />
          </>
        }
      >
        {/* COLLAPSE */}
        <AitCollapse
          headerMinHeight="auto"
          borderBottom="none"
          firstItemBottomspacing="0px"
          firstItemTopspacing="0px"
          itemSpacing="0px"
          bodyBorderTop="none"
          maxHeight="fit-content"
          bordered={false}
          collapseIconTopSpacing="auto"
          collapseIconBotSpacing="auto"
          itemHeaderPadding="16px 20px 16px 20px"
          itemBodyPadding={{ xs: '5px 20px', sm: '5px 20px', md: '0px 20px' }}
          headerLeftRightTopSpacing="0px"
          expandIconPosition="center"
          defaultActiveKey={['details', 'address']}
          panels={[
            // DETAILS
            {
              key: 'details',
              title: (
                <AitText strong size={15} type="primary">
                  Details
                </AitText>
              ),
              children: (
                <SectionPadding>
                  <Descriptions
                    column={1}
                    size="small"
                    colon={false}
                    labelStyle={{
                      width: 180,
                      color: '#595959',
                      fontWeight: 500,
                    }}
                    contentStyle={{
                      color: '#262626',
                    }}
                  >
                    <Item
                      label={
                        <Space size={8}>
                          <UserOutlined />
                          User
                        </Space>
                      }
                    >
                      {safe(fullName)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <AiOutlineMail />
                          Email
                        </Space>
                      }
                    >
                      {safe(customer?.email)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <LuPhoneCall />
                          Phone
                        </Space>
                      }
                    >
                      {safe(customer?.phone)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <RiCake2Line />
                          Birthday
                        </Space>
                      }
                    >
                      {birthday}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <BarChartOutlined />
                          Last seen
                        </Space>
                      }
                    >
                      {formatDateSafe(
                        customer?.last_seen_date_orival,
                        null,
                        'MM-DD-YYYY'
                      )}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <LiaCalendarAltSolid />
                          First seen
                        </Space>
                      }
                    >
                      {formatDateSafe(
                        customer?.first_seen_date_orival,
                        null,
                        'MM-DD-YYYY'
                      )}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <LuCalendarCheck />
                          Signed up
                        </Space>
                      }
                    >
                      {formatDateSafe(
                        customer?.created_at_orival,
                        null,
                        'MM-DD-YYYY'
                      )}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <BarChartOutlined />
                          Web sessions
                        </Space>
                      }
                    >
                      {safe(customer?.web_session_count)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <BarChartOutlined />
                          Account state
                        </Space>
                      }
                    >
                      {safe(accountState)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <AimOutlined />
                          Point expiry date
                        </Space>
                      }
                    >
                      {formatDateSafe(
                        customerPointExpiryData?.expiry_date || null,
                        'MM-DD-YYYY'
                      )}
                    </Item>
                  </Descriptions>
                </SectionPadding>
              ),
            },
            // ADDRESS
            {
              key: 'address',
              title: (
                <AitText strong size={15} type="primary">
                  Address
                </AitText>
              ),
              children: (
                <SectionPadding>
                  <Descriptions
                    column={1}
                    size="small"
                    colon={false}
                    labelStyle={{
                      width: 180,
                      color: '#595959',
                      fontWeight: 500,
                    }}
                    contentStyle={{
                      color: '#262626',
                    }}
                  >
                    <Item
                      label={
                        <Space size={8}>
                          <GlobalOutlined />
                          Company name
                        </Space>
                      }
                    >
                      {getFieldValue(address.company)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <EnvironmentFilled />
                          Address 1
                        </Space>
                      }
                    >
                      {getFieldValue(address.address1)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <EnvironmentFilled />
                          Address 2
                        </Space>
                      }
                    >
                      {getFieldValue(address.address2)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <EnvironmentFilled />
                          City
                        </Space>
                      }
                    >
                      {getFieldValue(address.city)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <EnvironmentFilled />
                          State
                        </Space>
                      }
                    >
                      {getFieldValue(address.province)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <EnvironmentFilled />
                          Country
                        </Space>
                      }
                    >
                      {getFieldValue(address.country)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <EnvironmentFilled />
                          Zip
                        </Space>
                      }
                    >
                      {getFieldValue(address.zip)}
                    </Item>

                    <Item
                      label={
                        <Space size={8}>
                          <EnvironmentFilled />
                          Location
                        </Space>
                      }
                    >
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          mapQuery
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on map
                      </a>
                    </Item>
                  </Descriptions>
                </SectionPadding>
              ),
            },

            // CUSTOM FIELDS
            {
              key: 'custom',
              title: (
                <AitText strong size={15} type="primary">
                  {`Custom fields ${customFieldCount}`}
                </AitText>
              ),
              children: (
                <CustomerDetailsCustomFieldSection
                  onEdit={onEditCustomField}
                  onAdd={onAddCustomFields}
                />
              ),
            },

            // TAGS
            {
              key: 'tags',
              title: (
                <AitText strong size={15} type="primary">
                  Tags
                </AitText>
              ),
              children: (
                <>
                  <RowItem>
                    <AitText type="default" strong size={13}>
                      <span>Shopify Tags:</span>
                    </AitText>
                    <AitText type="default" size={13}>
                      {formattedTags}
                    </AitText>
                  </RowItem>
                  <RowItem>
                    <AitText type="default" strong size={13}>
                      <span>AI Tags:</span>
                    </AitText>
                    <AitText type="default" size={13}>
                      -
                    </AitText>
                  </RowItem>
                  <RowItem>
                    <AitText type="default" strong size={13}>
                      <span>Prospective Tags:</span>
                    </AitText>
                    <AitText type="default" size={13}>
                      {safe(customer?.prospective_tag)}
                    </AitText>
                  </RowItem>
                </>
              ),
            },
          ]}
        />
      </AitCard>
    </LeftScrollableWrapper>
  );
};

export default CustomerDetailsLeft;
