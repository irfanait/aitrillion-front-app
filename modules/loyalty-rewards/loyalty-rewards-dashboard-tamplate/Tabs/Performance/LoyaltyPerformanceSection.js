import { Row } from 'antd';
import { KPICard, KPIRow, Wrap } from '../../style';
import { checkValidCount } from '@/utils/common.util';
import ActivityPerformanceChart from '../../Charts/activityPerformaceChart';
import BarChartComponent from '../../Charts/engagedMemberChart';

export default function LoyaltyPerformanceSection({
  performanceTabData,
  chartData,
  activeInnerTab,
  setInnerActiveTab,
  setFilterState,
  filterState,
}) {
  const onTabChange = (val) => {
    setInnerActiveTab(val);
    setFilterState({
      ...filterState,
      calling: true,
    });
  };

  const charts = {
    'activity-performance': (
      <ActivityPerformanceChart
        performanceTabData={performanceTabData}
        chartData={chartData?.length > 0 ? chartData : []}
      />
    ),
    'new-program-members': (
      <BarChartComponent
        chartData={chartData?.length > 0 ? chartData : []}
        label="Number of engaged members on date"
      />
    ),
    'total-redeem-customer': (
      <BarChartComponent
        chartData={chartData?.length > 0 ? chartData : []}
        label="Redeeming members"
      />
    ),
    'activities-completed': (
      <BarChartComponent
        chartData={chartData?.length > 0 ? chartData : []}
        label="Activities completed"
      />
    ),
    'loyalty-purchases': (
      <BarChartComponent
        chartData={chartData?.length > 0 ? chartData : []}
        label="Loyalty Purchases"
      />
    ),
  };

  return (
    <Wrap>
      <KPIRow>
        <KPICard
          active={activeInnerTab === 'activity-performance'}
          onClick={() => onTabChange('activity-performance')}
        >
          <div className="value">
            {checkValidCount(performanceTabData?.total_activity_count)}
          </div>
          <div className="label">Activity performance</div>
        </KPICard>

        <KPICard
          active={activeInnerTab === 'new-program-members'}
          onClick={() => onTabChange('new-program-members')}
        >
          <div className="value">
            {' '}
            {checkValidCount(performanceTabData?.total_unique_member)}
          </div>
          <div className="label">Engaged members</div>
        </KPICard>

        <KPICard
          active={activeInnerTab === 'total-redeem-customer'}
          onClick={() => onTabChange('total-redeem-customer')}
        >
          <div className="value">
            {checkValidCount(performanceTabData?.points_redeemed_customer)}
          </div>
          <div className="label">Redeeming members</div>
        </KPICard>

        <KPICard
          active={activeInnerTab === 'activities-completed'}
          onClick={() => onTabChange('activities-completed')}
        >
          <div className="value">
            {checkValidCount(performanceTabData?.activity_completed)}
          </div>
          <div className="label">Activities completed</div>
        </KPICard>

        <KPICard
          active={activeInnerTab === 'loyalty-purchases'}
          onClick={() => onTabChange('loyalty-purchases')}
        >
          <div className="value">
            {checkValidCount(performanceTabData?.loyalty_purchases)}
          </div>
          <div className="label">Loyalty purchases</div>
        </KPICard>
      </KPIRow>

      <Row gutter={[16, 16]}>
        <>{charts[activeInnerTab]}</>
      </Row>
    </Wrap>
  );
}
