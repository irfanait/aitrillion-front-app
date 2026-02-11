import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Switch,
  Skeleton,
  App,
  Grid,
  Tooltip,
} from 'antd';
import {
  ActionButtons,
  AlertBox,
  AvatarCircle,
  CenterContent,
  Header,
  InfoSection,
  PageWrapper,
  PointsCard,
  SwitchRow,
  TableContainer,
  Wrapper,
} from '../style';
import CustomAitTable from '@/components/molecules/custom-ait-table';
import {
  AvailablePoint,
  LifetimePoint,
  PointExpired,
  PointRedeem,
  TierYearlyPointFirst,
  TierYearlyPointSecond,
} from '../../../svg-icons';
import DashboardStatCards from '@/modules/email-marketing/molecules/dashboard-stat-cards/dashboardStatCards';
import {
  checkValidCount,
  checkValidData,
  convertToFormDataCustom,
  nameFormatter,
  textFormatter,
} from '@/utils/common.util';
import {
  blockCustomerService,
  getDetailsDataService,
  getDetailsHistoryDataService,
  getDetailsOrdersDataService,
} from '../../../api/giftCode';
import logger from '@/utils/logger';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import GivAndReturnPointForm from './giveAndReturnPointForm';
import OrderHistoryDetails from './orderHistoryModal';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import ChangeTierForm from './changeTierForm';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitText from '@/components/atoms/ait-text/aitText';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

const CustomerDetailsTamplate = () => {
  const jwtState = useSelector((state) => state?.jwtState);
  const screens = useBreakpoint();
  const router = useRouter();
  const { id } = router?.query;
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [detailsData, setDetailsData] = useState();
  const [historyData, setHistoryData] = useState({
    data: [],
    loading: false,
    totalRecord: 0,
    currentPage: 1,
    pageSize: 10,
    sortVal: 'tal.date_created',
    sortOrder: false,
  });
  const [orderData, setOrderData] = useState({
    data: [],
    loading: false,
    totalRecord: 0,
    currentPage: 1,
    pageSize: 5,
    sortVal: 'o.created_at',
    sortOrder: false,
  });
  const [givePointModal, setGivPointModal] = useState(false);
  const [removePointModal, setRemovePointModal] = useState(false);
  const [orderHistoryModal, setOrderHistoryModal] = useState('');
  const [customerStatusState, setCustomerStatusState] = useState({
    loading: false,
    modal: false,
  });
  const [changeTierModal, setChangeTierModal] = useState(false);

  const historyColumns = [
    {
      title: 'Created date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      sortValue: 'tal.date_created',
      render: (cell, row) => checkValidData(row?.date),
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
      width: 220,
      sorter: true,
      sortValue: 'tal.activitytype',
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      sorter: true,
      sortValue: 'order_number',
      render: (cell, row) => (
        <div
          onClick={() =>
            setOrderHistoryModal(row?.actual_order_id?.replace('#', ''))
          }
          style={{
            color: 'var(--ant-color-primary)',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          {checkValidData(row?.order_id)}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortValue: 'activitystatus',
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      sorter: true,
      sortValue: 'points',
    },
  ];

  const orderColumns = [
    {
      title: 'Created date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      sortValue: 'created_at',
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      sorter: true,
      dataIndex: 'order_id',
      key: 'order_id',
      sorter: true,
      sortValue: 'order_number',
      render: (cell, row) => (
        <div
          onClick={() =>
            setOrderHistoryModal(row?.actual_order_id?.replace('#', ''))
          }
          style={{
            color: 'var(--ant-color-primary)',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          {checkValidData(row?.order_id)}
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'total_price',
      key: 'total_price',
      sorter: false,
      sortValue: 'tal.date_created',
    },
    {
      title: 'Payment Status',
      dataIndex: 'financial_status',
      key: 'financial_status',
      sorter: true,
      sortValue: 'financial_status',
    },
  ];

  const getDetailsData = async (customer_id) => {
    setLoading(true);
    try {
      let payload = {
        customer_id,
      };
      const detailsData = await getDetailsDataService(payload);
      if (detailsData?.data?.status === 'success') {
        setDetailsData(detailsData?.data?.data);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setLoading(false);
    }
  };

  const getHistoryData = async (
    customer_id,
    currentPage,
    historyPageSize,
    sort,
    sortOrder
  ) => {
    setHistoryData((prev) => ({
      ...prev,
      loading: true,
      data: [],
    }));
    try {
      const payload = {
        customer_id,
        currentPage: currentPage,
        limit: historyPageSize,
        sort,
        order: sortOrder,
      };

      const response = await getDetailsHistoryDataService(payload);

      if (response?.data?.status === 'success') {
        setHistoryData((prev) => ({
          ...prev,
          data: response?.data?.data,
          totalRecord: response?.data?.totalrecord,
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

  const getOrderData = async (
    customer_id,
    currentPage,
    historyPageSize,
    sort,
    sortOrder
  ) => {
    setOrderData((prev) => ({
      ...prev,
      loading: true,
      data: [],
    }));
    try {
      const payload = {
        customer_id,
        currentPage: currentPage,
        limit: historyPageSize,
        sort,
        order: sortOrder,
        money_format: '${{amount}}',
        reset: false,
        messageFilter: 'all',
        keyword: '',
      };

      const response = await getDetailsOrdersDataService(payload);

      if (response?.data?.status === 'success') {
        setOrderData((prev) => ({
          ...prev,
          data: response?.data?.data,
          totalRecord: response?.data?.totalrecord,
        }));
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setOrderData((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  let emailDashboardStats = [
    {
      label: 'Available points',
      icon: <AvailablePoint />,
      value: checkValidCount(detailsData?.total_points_available),
    },
    {
      label: 'Lifetime points',
      icon: <LifetimePoint />,
      value: checkValidCount(detailsData?.total_points_earned),
    },
    {
      label: 'Points redeemed',
      icon: <PointRedeem />,
      value: checkValidCount(detailsData?.total_redeem_points),
    },
    {
      label: 'Points expired',
      icon: <PointExpired />,
      value: checkValidCount(detailsData?.total_redeem_expire),
    },
  ];

  if (
    detailsData?.milestone_settings?.milestone_period !== 'lifetime' &&
    detailsData?.milestone_settings?.milestone_type !== 'tag_based'
  ) {
    const obj = {
      label: checkValidData(detailsData?.tier_achive_text),
      icon:
        detailsData?.milestone_settings?.milestone_type === 'amount' ? (
          <PointRedeem />
        ) : (
          <PointRedeem />
        ),
      value: checkValidCount(detailsData?.tier_achive_value_text),
    };

    emailDashboardStats = [...emailDashboardStats, obj];
  }

  const changeCustomerStatus = async () => {
    setCustomerStatusState((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      let obj = {};
      obj.customer_id = id;
      let payload = convertToFormDataCustom(obj);
      const response = await blockCustomerService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setDetailsData((prev) => ({
          ...prev,
          customer_status: prev === 'active' ? 'block' : 'active',
        }));
        setCustomerStatusState((prev) => ({
          ...prev,
          modal: false,
        }));
        getDetailsData(id);
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setCustomerStatusState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    if (id) {
      getDetailsData(id);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getHistoryData(
        id,
        historyData?.currentPage,
        historyData?.pageSize,
        historyData?.sortVal,
        historyData?.sortOrder
      );
    }
  }, [
    id,
    historyData?.currentPage,
    historyData?.pageSize,
    historyData?.sortVal,
    historyData?.sortOrder,
  ]);

  useEffect(() => {
    if (id) {
      getOrderData(
        id,
        orderData?.currentPage,
        orderData?.pageSize,
        orderData?.sortVal,
        orderData?.sortOrder
      );
    }
  }, [
    id,
    orderData?.currentPage,
    orderData?.pageSize,
    orderData?.sortVal,
    orderData?.sortOrder,
  ]);

  return (
    <>
      <PageWrapper>
        <Content>
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={7}>
              <AitCard
                headerpadding={{
                  xs: '15px 0px',
                  sm: '15px 0px',
                  md: '15px 0px',
                }}
                bodypadding={{
                  xs: '20px 0px 0px 0px',
                  sm: '20px 0px 0px 0px',
                  md: '20px 0px 0px 0px',
                }}
                title={
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    Loyalty wallet
                  </div>
                }
              >
                <Wrapper>
                  <CenterContent>
                    {' '}
                    {loading ? (
                      <Skeleton.Avatar active size="large" />
                    ) : (
                      <AvatarCircle>
                        {checkValidData(
                          detailsData?.first_name?.charAt(0)?.toUpperCase()
                        )}
                      </AvatarCircle>
                    )}
                    <Title
                      level={4}
                      style={{ margin: '5px 0', textTransform: 'capitalize' }}
                    >
                      {loading ? (
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
                        nameFormatter(
                          detailsData?.first_name,
                          detailsData?.last_name
                        )
                      )}
                    </Title>
                    <AitText>
                      {loading ? (
                        <div style={{ width: '100%', maxWidth: 600 }}>
                          <Skeleton.Input
                            block
                            active
                            style={{
                              width: '5%',
                              height: 20,
                            }}
                          />
                        </div>
                      ) : detailsData?.customer_email ? (
                        `(${detailsData?.customer_email})`
                      ) : (
                        ''
                      )}
                    </AitText>
                    <AitText strong>
                      {loading ? (
                        <div style={{ width: '100%', maxWidth: 600 }}>
                          <Skeleton.Input
                            block
                            active
                            style={{
                              width: '5%',
                              height: 20,
                            }}
                          />
                        </div>
                      ) : detailsData?.customer_phone ? (
                        `(${detailsData?.customer_phone})`
                      ) : (
                        ''
                      )}
                    </AitText>
                    {!screens?.md && (
                      <PointsCard bordered={true}>
                        <Row
                          gutter={[
                            { xs: 10, sm: 10, lg: 0 },
                            { xs: 7, sm: 10, lg: 0 },
                          ]}
                          justify={{
                            xs: 'center',
                            sm: 'center',
                            lg: 'space-between',
                          }}
                          align={'middle'}
                        >
                          <Col
                            xs={{ span: 24, order: 2, justify: 'center' }}
                            sm={{ span: 24, order: 2, justify: 'center' }}
                            lg={{ flex: 'auto', order: 1 }}
                          >
                            <Title
                              type="primary"
                              level={3}
                              style={{ margin: 0 }}
                            >
                              {loading ? (
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
                                <AitText
                                  type="secondary"
                                  style={{
                                    color: 'var(--ant-color-primary',
                                    fontSize: 24,
                                    fontWeight: 700,
                                  }}
                                >
                                  {checkValidCount(
                                    detailsData?.total_points_available
                                  )}
                                </AitText>
                              )}
                            </Title>
                            <AitText
                              type="secondary"
                              style={{ color: 'var(--ant-color-primary' }}
                            >
                              Available points
                            </AitText>
                          </Col>
                          <Col
                            xs={{ span: 24, order: 1, justify: 'center' }}
                            sm={{ span: 24, order: 1, justify: 'center' }}
                            lg={{ flex: 'none', order: 2 }}
                          >
                            {/* <AvailablePoint /> */}
                          </Col>
                        </Row>
                      </PointsCard>
                    )}
                    <ActionButtons>
                      <AitButton
                        variant="outlined"
                        color="primary"
                        title={'Give points'}
                        onClick={() => setGivPointModal(true)}
                        padding={'8px 10px'}
                      />
                      <AitButton
                        title="Remove points"
                        variant="filled"
                        color="default"
                        onClick={() => setRemovePointModal(true)}
                        padding={'8px 10px'}
                      />
                    </ActionButtons>
                  </CenterContent>

                  {jwtState?.login_auth?.shop_type !== 'woocommerce' && (
                    <InfoSection>
                      <p>
                        <AitText size={13} strong>
                          Tier name:
                        </AitText>
                        <AitText size={13}>
                          {loading ? (
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
                              detailsData?.customer_current_tier_name
                            )
                          )}
                        </AitText>
                      </p>
                      <p>
                        <AitText size={13} strong>
                          Tier achieved date:
                        </AitText>
                        <AitText size={13}>
                          {loading ? (
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
                            checkValidData(detailsData?.last_tier_achived_date)
                          )}
                        </AitText>
                      </p>
                      <p>
                        <AitText size={13} strong>
                          Tier expiration date:
                        </AitText>
                        <AitText size={13}>
                          {loading ? (
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
                            checkValidData(detailsData?.tier_expiration_date)
                          )}
                        </AitText>
                      </p>
                      <p>
                        <AitText size={13} strong>
                          Tier assigned:
                        </AitText>
                        <AitText size={13}>
                          {loading ? (
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
                            checkValidData(detailsData?.tier_assigned)
                          )}
                        </AitText>
                      </p>

                      <AitButton
                        variant="outlined"
                        color="primary"
                        title={'Change VIP tier'}
                        onClick={() => setChangeTierModal(true)}
                        size="medium"
                      />
                    </InfoSection>
                  )}
                  <InfoSection>
                    {detailsData?.point_expiry_date && (
                      <p>
                        <AitText size={13} strong>
                          Point expiry date:
                        </AitText>
                        <AitText size={13}>
                          {' '}
                          {loading ? (
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
                            checkValidData(detailsData?.point_expiry_date)
                          )}
                        </AitText>
                      </p>
                    )}
                    <p>
                      <AitText strong size={13}>
                        Last transaction:
                      </AitText>
                      <AitText size={13}>
                        {' '}
                        {loading ? (
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
                          checkValidData(detailsData?.last_transaction_date)
                        )}
                      </AitText>
                    </p>

                    <SwitchRow>
                      <AitText size={13} strong style={{ marginTop: 'auto' }}>
                        Block member
                      </AitText>

                      {detailsData?.blocked_reason === 'by tag' ? (
                        <Tooltip
                          placement="topLeft"
                          title="You've enabled tag-based loyalty program blocking. That means you cannot utilize this setting to block or unblock a customer."
                        >
                          {' '}
                          <AitSwitch
                            style={{ marginTop: 'auto' }}
                            // loading={loading}
                            checked={true}
                            // onChange={() =>
                            //   setCustomerStatusState((prev) => ({
                            //     ...customerStatusState,
                            //     modal: true,
                            //   }))
                            // }
                          />
                        </Tooltip>
                      ) : (
                        <AitSwitch
                          style={{ marginTop: 'auto' }}
                          loading={loading}
                          checked={
                            detailsData?.customer_status === 'active'
                              ? false
                              : true
                          }
                          onChange={() =>
                            setCustomerStatusState((prev) => ({
                              ...customerStatusState,
                              modal: true,
                            }))
                          }
                        />
                      )}
                    </SwitchRow>

                    <p>
                      <AitText size={13} strong>
                        Blocked status:
                      </AitText>
                      <AitText size={13}>
                        {loading ? (
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
                            detailsData?.customer_status === 'active'
                              ? 'Active'
                              : 'Blocked'
                          )
                        )}
                      </AitText>
                    </p>
                    {detailsData?.blocked_reason !== '' && (
                      <p>
                        <AitText size={13} strong>
                          Blocked reason:
                        </AitText>
                        <AitText size={13}>
                          {loading ? (
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
                              textFormatter(detailsData?.blocked_reason)
                            )
                          )}
                        </AitText>
                      </p>
                    )}
                  </InfoSection>
                </Wrapper>
              </AitCard>
            </Col>

            <Col xs={24} sm={24} md={24} lg={16} xl={17}>
              <DashboardStatCards
                data={emailDashboardStats}
                md={8}
                loading={loading}
              />

              <CustomAitTable
                isCard
                title="History"
                tableData={historyData?.data}
                columns={historyColumns}
                size="small"
                loading={historyData?.loading}
                totalRecords={historyData?.totalRecord}
                pageSize={historyData?.pageSize}
                currentPage={historyData?.currentPage}
                setCurrentPage={(val) =>
                  setHistoryData((prev) => ({
                    ...prev,
                    currentPage: val,
                  }))
                }
                setPageSize={(val) =>
                  setHistoryData((prev) => ({
                    ...prev,
                    pageSize: val,
                  }))
                }
                setSortValue={(val) =>
                  setHistoryData((prev) => ({
                    ...prev,
                    sortVal: val,
                  }))
                }
                setSortOrder={(val) =>
                  setHistoryData((prev) => ({
                    ...prev,
                    sortOrder: val === 'asc' ? true : false,
                  }))
                }
                verticalScrollminHeight={200}
              />

              {/* Orders Table */}
              <div style={{ marginTop: 24 }}>
                <CustomAitTable
                  isCard
                  title="Orders"
                  tableData={orderData?.data}
                  columns={orderColumns}
                  size="small"
                  loading={orderData?.loading}
                  totalRecords={orderData?.totalRecord}
                  pageSize={orderData?.pageSize}
                  currentPage={orderData?.currentPage}
                  setCurrentPage={(val) =>
                    setOrderData((prev) => ({
                      ...prev,
                      currentPage: val,
                    }))
                  }
                  setPageSize={(val) =>
                    setOrderData((prev) => ({
                      ...prev,
                      pageSize: val,
                    }))
                  }
                  setSortValue={(val) =>
                    setOrderData((prev) => ({
                      ...prev,
                      sortVal: val,
                    }))
                  }
                  setSortOrder={(val) =>
                    setOrderData((prev) => ({
                      ...prev,
                      sortOrder: val === 'asc' ? true : false,
                    }))
                  }
                  verticalScrollminHeight={200}
                />
              </div>
            </Col>
          </Row>
          {/* )} */}
        </Content>
      </PageWrapper>
      <AitModal
        maskClosable={false}
        open={givePointModal || removePointModal}
        title={givePointModal ? 'Give points' : 'Remove points'}
        handleModalClose={() => {
          setRemovePointModal(false);
          setGivPointModal(false);
        }}
        footer={null}
        centered
        width={'450px'}
        destroyOnHidden
      >
        {removePointModal && (
          <AitAlert
            style={{ marginTop: 10, marginBottom: 20 }}
            icon
            type="warning"
            barfontsize="13"
            barpadding="8px 10px"
            justify="start"
            textAlign="left"
            border
            borderradius
            // note
            color="var(--ant-color-text-default)"
            message="Do not remove points for order returns, refunds etc. These will be
              removed by Referel-loyalty automatically; removing them here will
              result in the customer losing double the number of points."
          />
        )}
        <GivAndReturnPointForm
          getDetailsData={getDetailsData}
          removePointModal={removePointModal}
          setGivPointModal={setGivPointModal}
          setRemovePointModal={setRemovePointModal}
          getHistoryData={getHistoryData}
          getOrderData={getOrderData}
        />
      </AitModal>

      <AitModal
        maskClosable={false}
        open={orderHistoryModal}
        title="Order details"
        handleModalClose={() => {
          setOrderHistoryModal('');
        }}
        footer={null}
        centered
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
        destroyOnHidden
      >
        <OrderHistoryDetails orderHistoryModal={orderHistoryModal} />
      </AitModal>

      <AitConfirmationModal
        visible={customerStatusState?.modal}
        setVisible={() => {
          setCustomerStatusState((prev) => ({
            ...customerStatusState,
            modal: false,
          }));
        }}
        confirmText={`Yes, ${detailsData?.customer_status === 'active' ? 'block' : 'unblock'} it!`}
        description={`You want to ${detailsData?.customer_status === 'active' ? 'block' : 'unblock'} this member?`}
        onConfirm={() => {
          changeCustomerStatus();
        }}
        confirmButtonLoading={customerStatusState?.loading}
      />

      <AitModal
        maskClosable={false}
        open={changeTierModal}
        title="Change tier"
        handleModalClose={() => {
          setChangeTierModal(false);
        }}
        footer={null}
        centered
        width={'450px'}
        destroyOnHidden
      >
        <ChangeTierForm
          detailsData={detailsData}
          setChangeTierModal={setChangeTierModal}
          getDetailsData={getDetailsData}
          getHistoryData={getHistoryData}
          getOrderData={getOrderData}
        />
      </AitModal>
    </>
  );
};

export default CustomerDetailsTamplate;
