/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Banner,
  Content,
  IconBox,
  LinkA,
  Right,
  SetupLink,
  PagePad,
  TopNoticeBar,
  CloseBarButton,
  CloseIconBtn,
} from './style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { Button, Flex, Skeleton, Typography, Grid, Row, Col, App } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import DashboardStatCards from '@/modules/email-marketing/molecules/dashboard-stat-cards/dashboardStatCards';
import {
  AddIcon,
  ReadMoreIcon,
  ShoppingBagIcon,
  StarIcon,
  UserIcon,
} from '../svg-icons';
import { LayoutContainer } from '@/modules/email-marketing/organisms/create-campaign-left-section/style';
import GettingStartedTab from './Tabs/GattingStarted';
import PerformanceTab from './Tabs/Performance';
import AnalyticsTab from './Tabs/Analytics';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import {
  getChartDataService,
  getDashboardDataService,
  getPerformanceCountService,
  updateModuleService,
} from '../api/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDashboardData,
  loyaltyDashboardData,
} from '../redux/dashboard/dashboardSlice';
import AitButton from '@/components/atoms/ait-button/aitButton';
import logger from '@/utils/logger';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import parse from 'html-react-parser';
import {
  checkValidCount,
  checkValidData,
  currencyFormatter,
} from '@/utils/common.util';
import moment from 'moment';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import AitCard from '@/components/atoms/ait-card/aitCard';
import GlobalSkeleton from '@/components/atoms/ait-skeleton';
import AitLink from '@/components/atoms/ait-link/aitLink';
import { moduleRoute } from '@/modules/layouts/routeControl/route';
import { getToken } from '@/utils/authHelpers';
import { getAccessMap, handleLockIconClick } from '@/modules/layouts/helper';

const { Text } = Typography;
const { useBreakpoint } = Grid;
import { useRouter } from 'next/router';
import { LockRestrictedIcon } from '@/modules/layouts/svg-icons';

const LoyaltyRewardsDashboardTemplate = () => {
  const { notification } = App.useApp();
  const router = useRouter();
  const screens = useBreakpoint();
  const dispatch = useDispatch();
  const token = getToken();
  const authData = useSelector((state) => state);
  const dashboardData = useSelector(loyaltyDashboardData);
  const jwtState = useSelector((state) => state?.jwtState);
  const loggeInUserState = useSelector((state) => state.loggeInUserState);
  const login_auth = jwtState?.login_auth || {};
  const accessModuleWithMapping = login_auth?.accessModuleWithMapping || null;
  const [activeTab, setActiveTab] = useState('performance');
  const [performanceTabData, setPerformanceTabData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [moduleStatusLoading, setModuleStatusLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [performanceTabLoading, setPerformanceTabLoading] = useState(false);
  const [activeInnerTab, setInnerActiveTab] = useState('activity-performance');
  const [showHideAlert, setShowHideAlert] = useState(true);
  const [filterState, setFilterState] = useState({
    selectDay: 'lstwk',
    fromDate: '',
    toDate: '',
    calling: false,
    customDateFilter: false,
  });

  const onChangeModuleStatus = async () => {
    setModuleStatusLoading(true);
    try {
      const formData = new FormData();
      formData.append('moduleid', '2');

      const res = await updateModuleService(formData);
      if (res?.status === 'success') {
        notification.success({
          message: 'Status updated successfully.',
        });
        dispatch(
          addDashboardData({
            ...dashboardData,
            module_status_data: {
              ...dashboardData.module_status_data,
              module_status:
                dashboardData.module_status_data.module_status === 1 ? 0 : 1,
            },
          })
        );
      }
    } catch (error) {
      logger(error.response?.data || error.message);
    } finally {
      setModuleStatusLoading(false);
    }
  };

  const getPerformanceCountData = async () => {
    setPerformanceTabLoading(true);
    const today = moment().startOf('day');

    const formData = new FormData();
    formData.append(
      'num_days[start_date]',
      filterState.fromDate ||
        today.clone().subtract(6, 'days').format('YYYY-MM-DD')
    );
    formData.append(
      'num_days[end_date]',
      filterState.toDate || today.format('YYYY-MM-DD')
    );
    formData.append('address', 'home');

    try {
      const res = await getPerformanceCountService(formData);
      if (res?.status === 200) {
        setPerformanceTabData(res.data);
      }
    } catch (error) {
      logger(error.response?.data || error.message);
    } finally {
      setPerformanceTabLoading(false);
    }
  };

  const getChartData = async () => {
    setPerformanceTabLoading(true);
    const today = moment().startOf('day');

    const formData = new FormData();
    formData.append(
      'num_days[start_date]',
      filterState.fromDate ||
        today.clone().subtract(6, 'days').format('YYYY-MM-DD')
    );
    formData.append(
      'num_days[end_date]',
      filterState.toDate || today.format('YYYY-MM-DD')
    );
    formData.append('address', 'home');
    formData.append('filter', activeInnerTab);
    formData.append(
      'filterVal',
      filterState?.customDateFilter ? '' : filterState?.selectDay || ''
    );
    try {
      const res = await getChartDataService(formData);
      if (res?.status === 200) {
        setChartData(res.data.slice(1));
      }
    } catch (error) {
      logger(error.response?.data || error.message);
    } finally {
      setPerformanceTabLoading(false);
    }
  };

  // const getDashboardData = async () => {
  //   try {
  //     const res = await getDashboardDataService();
  //     if (res.status === 'success') {
  //       dispatch(addDashboardData(res));
  //     }
  //   } catch (error) {
  //     logger(error.response?.data || error.message);
  //   }
  // };

  const fetchAllDashboardData = async () => {
    setPageLoading(true);
    try {
      await Promise.all([
        getPerformanceCountData(),
        getChartData(),
        // getDashboardData(),
      ]);
    } catch (error) {
      logger(error.response?.data || error.message);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (activeInnerTab && filterState?.calling) {
        setChartData([]);
      }

      if (filterState.calling || (activeInnerTab && filterState.calling)) {
        try {
          await Promise.all([getPerformanceCountData(), getChartData()]);
          setFilterState((prevState) => ({
            ...prevState,
            calling: false,
          }));
        } catch (error) {
          logger(error);
          setFilterState((prevState) => ({
            ...prevState,
            calling: false,
          }));
        }
      }
    };

    fetchData();
  }, [filterState.calling, activeInnerTab]);

  const emailDashboardStats = [
    {
      label: 'Loyalty members',
      icon: <UserIcon />,
      value: currencyFormatter(
        dashboardData?.dashboard_statics_counters?.total_customers,
        'INR'
      ),
      link: moduleRoute?.loyalty_rewards?.loyalty_members,
    },
    {
      label: 'Points earned',
      icon: <AddIcon />,
      value: currencyFormatter(
        dashboardData?.dashboard_statics_counters?.total_given_points,
        'INR'
      ),
      link:
        authData?.loggedInUserDetailsState?.userDetails
          ?.is_enable_customer_segmentation_v2 === '1'
          ? '/customers/all-customers/list'
          : `${process.env.NEXT_PUBLIC_APP_URL}/customers#/list?ai_v2=${token}`,
      // link: `${process.env.NEXT_PUBLIC_APP_URL}/customers#/list?ai_v2=${token}`,
    },
    {
      label: 'Points redeemed',
      icon: <StarIcon />,
      value: currencyFormatter(
        dashboardData?.dashboard_statics_counters?.total_redeemed_points,
        'INR'
      ),
      // link: `${process.env.NEXT_PUBLIC_APP_URL}/customers#/list?ai_v2=${token}`,
      link:
        authData?.loggedInUserDetailsState?.userDetails
          ?.is_enable_customer_segmentation_v2 === '1'
          ? '/customers/all-customers/list'
          : `${process.env.NEXT_PUBLIC_APP_URL}/customers#/list?ai_v2=${token}`,
    },
    {
      label: 'Total orders',
      icon: <ShoppingBagIcon />,
      value: currencyFormatter(
        dashboardData?.dashboard_statics_counters?.total_redeem_orders,
        'INR'
      ),
      link: `${process.env.NEXT_PUBLIC_APP_URL}/order/list#/orderlist/loyalty?ai_v2=${token}`,
    },
  ];

  useEffect(() => {
    if (accessModuleWithMapping[2] != 1) {
      setActiveTab('getting');
    }
  }, [accessModuleWithMapping]);

  const accessMap = useMemo(
    () => getAccessMap(loggeInUserState?.planInfo),
    [loggeInUserState?.planInfo]
  );

  const tabItems = [
    {
      label: 'Getting started',
      key: 'getting',
    },
    {
      label: 'Performance',
      key: 'performance',
    },
    {
      label: 'Analytics',
      key: 'analytics',
      ai_module_feature: 'loyalty_analytics',
    },
  ];

  // console.log('accessMap', accessMap);

  const tabItemsWithAccess = tabItems.map((item) => {
    const rule = accessMap?.[item.ai_module_feature] || {};
    const isHidden = rule?.action === 'hide' && rule?.access === 'No';
    const isRestricted = rule?.action === 'popup' && rule.access === 'No';
    const upgradeUrl = rule?.content || '/popup?act=upgrade';

    if (isHidden) return null;

    return {
      ...item,
      isRestricted, // 👈 important
      label: isRestricted ? (
        <div
          className="module-locked"
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={(e) => {
            e.stopPropagation(); // 👈 prevents tab activation
            handleLockIconClick(upgradeUrl, router);
          }}
        >
          {item.label}
          <LockRestrictedIcon marginleft={5} />
        </div>
      ) : (
        item.label
      ),
    };
  });

  return (
    // <LayoutContainer>
    //   {dashboardData?.module_status_data?.module_status === 0 && (
    //     <AitAlert
    //       type="warning"
    //       hascustomicon={false}
    //       bgcolor="#cdd8ea"
    //       color="#374C76"
    //       barpadding="4.5px 10px 5px 10px"
    //       message="Currently your loyalty module is disabled"
    //       buttonText="Activate now"
    //       onClick={() => {
    //         onChangeModuleStatus();
    //       }}
    //       buttonVariant={'solid'}
    //       buttonSize={'small'}
    //       buttonstyle={{
    //         backgroundColor: '#234CA5 !important',
    //         color: '#fff !important',
    //         borderColor: '#234CA5 !important',
    //         marginLeft: '8px',
    //         fontWeight: '500',
    //       }}
    //       buttonhoverstyle={{
    //         backgroundColor: '#234CA5 !important',
    //         color: '#fff !important',
    //         borderColor: '#234CA5 !important',
    //       }}
    //     />
    //   )}
    //   <MainWrapper>
    <>
      <AitPageHeader
        title="Loyalty rewards dashboard"
        subtitle="Create ways for your customers to earn and redeem points."
        hideButton
        isSwitchLoading={moduleStatusLoading}
        isSwitchButton={dashboardData?.module_status_data?.module_status === 1}
        checked={dashboardData?.module_status_data?.module_status === 1}
        onButtonClick={onChangeModuleStatus}
        buttonLabel="Enable"
        subtitleRightText="View changes"
        subtitleRightTooltipTitle="New changes take up to 15 minutes to appear on your site, use this link to view them now."
      />

      {/* Top info banner */}
      {/* {pageLoading ? (
        <FullPageLoader initalLoading />
      ) : ( */}
      <>
        {dashboardData?.module_status_data?.module_status === 1 &&
          dashboardData?.intersted_modules?.module_id &&
          showHideAlert && (
            <Banner
              style={{
                backgroundColor: checkValidData(
                  dashboardData?.intersted_modules?.bar_bg_color
                ),
                borderColor: checkValidData(
                  dashboardData?.intersted_modules?.bar_bg_color
                ),
              }}
            >
              {pageLoading ? (
                <GlobalSkeleton />
              ) : (
                <Flex
                  gap={12}
                  alignItems="center"
                  justify={screens.xs ? 'start' : 'end'}
                >
                  <IconBox>
                    <img
                      src={`${process.env.NEXT_PUBLIC_APP_URL}/${dashboardData?.intersted_modules?.icon_bg_img}`}
                      alt="icon"
                    />
                  </IconBox>
                  <Content>
                    <Flex
                      gap={12}
                      align="center"
                      justify={!screens.md ? 'start' : 'end'}
                      wrap={!screens.md ? 'wrap' : 'nowrap'}
                    >
                      <Text>
                        <strong>
                          {checkValidData(
                            dashboardData?.intersted_modules?.name
                          )}
                          :{' '}
                        </strong>
                        {parse(
                          checkValidData(
                            dashboardData?.intersted_modules?.description
                          ) || ''
                        )}{' '}
                        <AitLink
                          style={{ width: 'auto', display: 'inline-block' }}
                          weight="500"
                          onClick={() =>
                            window.open(
                              dashboardData?.intersted_modules?.kb_link,
                              '_blank',
                              'noopener,noreferrer'
                            )
                          }
                        >
                          <Flex align="center" gap={4}>
                            Read more <ReadMoreIcon />
                          </Flex>
                        </AitLink>
                      </Text>

                      <Right>
                        <AitLink
                          weight="500"
                          hoverline={false}
                          onClick={() =>
                            window.open(
                              `${process.env.NEXT_PUBLIC_APP_URL}/${dashboardData?.intersted_modules?.setup_link}`,
                              '_blank',
                              'noopener,noreferrer'
                            )
                          }
                        >
                          Setup now
                        </AitLink>
                      </Right>
                    </Flex>
                  </Content>
                  <CloseIconBtn
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => setShowHideAlert(!showHideAlert)}
                  />
                </Flex>
              )}
            </Banner>
          )}

        {(parseFloat(
          dashboardData?.dashboard_statics_counters?.total_customers
        ) > 0 ||
          parseFloat(
            dashboardData?.dashboard_statics_counters?.total_given_points
          ) > 0 ||
          parseFloat(
            dashboardData?.dashboard_statics_counters?.total_redeemed_points
          ) > 0 ||
          parseFloat(
            dashboardData?.dashboard_statics_counters?.total_redeem_orders
          ) > 0) && (
          <DashboardStatCards
            data={emailDashboardStats}
            loading={pageLoading}
          />
        )}

        <Row gutter={[{ xs: 32, sm: 32, md: 32, lg: 70 }]}>
          <AitCard
            hascustomheader={true}
            headerpadding={{ md: '0px 35px 0px 35px' }}
            custombodypadding={{ md: '20px 35px 24px 35px' }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
            }}
            customheaderleft={
              <AitTabs
                width="100%"
                defaultActiveKey={activeTab}
                activeKey={activeTab}
                onChange={(key) => {
                  const clickedTab = tabItemsWithAccess.find(
                    (item) => item.key === key
                  );

                  // 🚫 stop restricted tabs from becoming active
                  if (clickedTab?.isRestricted) {
                    return;
                  }

                  setActiveTab(key);
                }}
                items={tabItemsWithAccess}
              />
            }
          >
            <Row gutter={[48, 16]}>
              <Col xs={24}>
                <Row gutter={[0, 16]}>
                  <Col xs={24}>
                    {activeTab === 'getting' && <GettingStartedTab />}
                    {activeTab === 'performance' && (
                      <PerformanceTab
                        performanceTabData={performanceTabData}
                        filterState={filterState}
                        setFilterState={setFilterState}
                        performanceTabLoading={performanceTabLoading}
                        chartData={chartData}
                        setInnerActiveTab={setInnerActiveTab}
                        activeInnerTab={activeInnerTab}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        screens={screens}
                      />
                    )}
                    {activeTab === 'analytics' && (
                      <AnalyticsTab
                        activeInnerTab={activeInnerTab}
                        filterState={filterState}
                        setFilterState={setFilterState}
                        activeTab={activeTab}
                      />
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </AitCard>
        </Row>
      </>
      {/* )} */}
    </>
    //   </MainWrapper>
    // </LayoutContainer>
  );
};

export default LoyaltyRewardsDashboardTemplate;
