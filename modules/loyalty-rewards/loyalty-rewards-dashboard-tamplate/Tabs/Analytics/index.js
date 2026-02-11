/* eslint-disable react-hooks/exhaustive-deps */
import { App, Card, Col, Row, Tooltip } from 'antd';
import LoyaltyRevenueContributionChart from './LoyaltyRevenueContributionChart';
import {
  ChartContainer,
  ColoredCheckbox,
  Container,
  FilterSection,
  HeaderContainer,
  HeaderText,
  HeaderTextBold,
  Section,
  Titles,
  Wrapper,
} from '../../style';
import DashboardFilters from '../../dashboardFilter';
import { useEffect, useMemo, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getAnalyticChartDataService } from '@/modules/loyalty-rewards/api/dashboard';
import logger from '@/utils/logger';
import { checkValidData } from '@/utils/common.util';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import TotalRevenueChart from './totalRevenueChart';
import CustomerAverageOrderChart from './customerAverageOrderChart';
import AitCard from '@/components/atoms/ait-card/aitCard';

function AnalyticsTab({ activeTab, screens }) {
  const { notification } = App.useApp();
  const [chartData, setChartData] = useState([]);
  const [apiData, setApiData] = useState();
  const [pageLoading, setPageLoading] = useState(false);
  const [checkboxChartState, setCheckboxChartState] = useState({
    loyaltyRedeemerRevenueState: true,
    allOtherRevenue: true,
    totalRedeeminCheck: true,
    totalNonRedeeminCheck: true,
    totalNonMemberCheck: true,
    customerRedeeminCheck: true,
    customerNonRedeeminCheck: true,
    customerNonMemberCheck: true,
  });

  const [filterState, setFilterState] = useState({
    selectDay: 'lst30',
    fromDate: '',
    toDate: '',
    calling: false,
    customDateFilter: false,
  });
  const [errorData, setErrorData] = useState();

  const getChartData = async () => {
    const today = moment().startOf('day');

    const formData = new FormData();
    formData.append(
      'num_days[start_date]',
      filterState.fromDate ||
        today.clone().subtract(29, 'days').format('YYYY-MM-DD')
    );
    formData.append(
      'num_days[end_date]',
      filterState.toDate || today.format('YYYY-MM-DD')
    );
    formData.append('type', 'loyalty_attribute');
    formData.append('filter', 'activity-performance');
    customDateFilter: (false,
      formData.append(
        'filterVal',
        filterState?.customDateFilter ? '' : filterState?.selectDay || ''
      ));
    try {
      const res = await getAnalyticChartDataService(formData);

      if (res?.status === 200) {
        setChartData(res.data);
      } else {
        setErrorData(res?.data);
      }
    } catch (error) {
      logger(error.response?.data || error.message);
    }
  };

  const getTotalRevenueAndOrderValueChartData = async () => {
    const today = moment().startOf('day');

    const formData = new FormData();
    formData.append(
      'num_days[start_date]',
      filterState.fromDate ||
        today.clone().subtract(29, 'days').format('YYYY-MM-DD')
    );
    formData.append(
      'num_days[end_date]',
      filterState.toDate || today.format('YYYY-MM-DD')
    );
    formData.append('type', 'loyalty_redeem_revenue');
    formData.append('filter', 'activity-performance');
    customDateFilter: (false,
      formData.append(
        'filterVal',
        filterState?.customDateFilter ? '' : filterState?.selectDay || ''
      ));
    try {
      const res = await getAnalyticChartDataService(formData);
      if (res?.status === 200) {
        setApiData(res.data);
      }
    } catch (error) {
      logger(error.response?.data || error.message);
    }
  };

  const fetchAllDashboardData = async () => {
    setPageLoading(true);
    try {
      await Promise.all([
        getChartData(),
        getTotalRevenueAndOrderValueChartData(),
      ]);
    } catch (error) {
      logger(error.response?.data || error.message);
    } finally {
      setPageLoading(false);
    }
  };

  function calculateLoyaltyRevenuePercentage(loyalty, other) {
    let percentage = 0;

    if (other !== 0 && !isNaN(loyalty) && !isNaN(other)) {
      percentage = (loyalty / other) * 100;
    } else {
      percentage = 0;

      if (loyalty > 0 && other === 0) {
        percentage = loyalty;
      }
    }

    return percentage?.toFixed(2);
  }

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAllDashboardData();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchData = async () => {
      if (filterState.calling) {
        try {
          await fetchAllDashboardData();
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
  }, [filterState.calling]);

  useEffect(() => {
    if (errorData?.code === 1111 && errorData?.status === 'error') {
      notification.error({ message: errorData?.msg });
    }
  }, [errorData]);

  return (
    <>
      <Container screens={screens}>
        <Row align="middle" gutter={[16, 25]}>
          <Col xs={24} md={{ flex: 'auto' }}>
            <Titles>Loyalty program performance</Titles>
          </Col>
          <Col xs={24} md={{ flex: 'none' }}>
            <DashboardFilters
              data={chartData}
              filterState={filterState}
              setFilterState={setFilterState}
              activeTab={activeTab}
              loading={pageLoading}
            />
          </Col>
        </Row>
      </Container>
      <FullPageLoader loading={pageLoading}>
        <AitCard
          hascustomheader={true}
          headerpadding={{ md: '24px 24px 10px 24px' }}
          customheaderleft={
            <>
              <HeaderContainer>
                <HeaderText as="h4">
                  Loyalty redeemer revenue contribution
                </HeaderText>
                <Tooltip
                  placement="right"
                  title="The percentage of total revenue that can be directly attributed to specific interactions or engagements with the loyalty program, such as reward redemptions or engaged member segments. This does not encompass all revenue generated by members of the loyalty program, only the portion that can be specifically attributed to loyalty-related activities."
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </HeaderContainer>
              <HeaderTextBold>
                {`${calculateLoyaltyRevenuePercentage(
                  chartData?.totalLoyaltyRevenue,
                  chartData?.totalOtherRevenue
                )}% of total revenue`}
              </HeaderTextBold>
            </>
          }
        >
          {/* <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <span style={{ color: '#6b7280', fontSize: 12 }}>
              113.14% of total revenue
            </span>
          </div> */}

          <ChartContainer>
            <LoyaltyRevenueContributionChart
              data={
                apiData?.graphData?.length > 0
                  ? apiData?.graphData?.map((item) => ({
                      d: item[0],
                      redeemer: typeof item[1] === 'number' ? item[1] : 0,
                      other: typeof item[2] === 'number' ? item[2] : 0,
                      label: typeof item[3] === 'string' ? item[3] : '',
                    }))
                  : []
              }
              checkboxChartState={checkboxChartState}
            />
          </ChartContainer>
          <div
            style={{
              marginTop: 80,
              borderTop: '1px solid #f1f5f9',
              // paddingTop: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
              }}
            >
              <Wrapper>
                <HeaderContainer>
                  <Tooltip
                    placement="right"
                    title="Revenue by redeeming members who have actively engaged with the loyalty program by redeeming points to claim a reward."
                  >
                    <ColoredCheckbox
                      checkedColor="#7c5cff"
                      checked={checkboxChartState?.loyaltyRedeemerRevenueState}
                      onChange={() =>
                        setCheckboxChartState({
                          ...checkboxChartState,
                          loyaltyRedeemerRevenueState:
                            !checkboxChartState?.loyaltyRedeemerRevenueState,
                        })
                      }
                    >
                      Loyalty redeemer revenue
                    </ColoredCheckbox>
                    {''}
                    <InfoCircleOutlined />
                  </Tooltip>
                </HeaderContainer>
              </Wrapper>
              <div style={{ fontWeight: 600 }}>
                {checkValidData(chartData?.totalLoyaltyRevenueWithFormat)}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                marginTop: 6,
              }}
            >
              <Wrapper>
                <HeaderContainer>
                  <Tooltip
                    placement="right"
                    title="Revenue by non-redeemers and non-members."
                  >
                    <ColoredCheckbox
                      checkedColor="#b0a7ff"
                      checked={checkboxChartState?.allOtherRevenue}
                      onChange={() =>
                        setCheckboxChartState({
                          ...checkboxChartState,
                          allOtherRevenue: !checkboxChartState?.allOtherRevenue,
                        })
                      }
                    >
                      All other revenue
                    </ColoredCheckbox>
                    {''}
                    <InfoCircleOutlined />
                  </Tooltip>
                </HeaderContainer>
              </Wrapper>

              <div style={{ fontWeight: 600 }}>
                {' '}
                {checkValidData(chartData?.totalOtherRevenueWithFormat)}
              </div>
            </div>
          </div>
        </AitCard>

        <Section>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <TotalRevenueChart
                data={
                  apiData?.graphData?.length > 0
                    ? apiData?.graphData?.map((item) => ({
                        d: item[0],
                        redeemer: typeof item[1] === 'number' ? item[1] : 0,
                        other: typeof item[2] === 'number' ? item[2] : 0,
                        nonMember: typeof item[3] === 'number' ? item[3] : 0,
                        label: typeof item[4] === 'string' ? item[4] : '',
                      }))
                    : []
                }
                setCheckboxChartState={setCheckboxChartState}
                checkboxChartState={checkboxChartState}
                apiData={apiData}
              />
            </Col>
            <Col xs={24} md={12}>
              <CustomerAverageOrderChart
                apiData={apiData}
                setCheckboxChartState={setCheckboxChartState}
                checkboxChartState={checkboxChartState}
              />
            </Col>
          </Row>
        </Section>
      </FullPageLoader>
    </>
  );
}

export default AnalyticsTab;
