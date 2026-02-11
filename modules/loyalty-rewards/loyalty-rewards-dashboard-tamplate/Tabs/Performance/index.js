import { Card, Col, Row } from 'antd';
import DashboardFilters from '../../dashboardFilter';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import LoyaltyPerformanceSection from './LoyaltyPerformanceSection';
import { Container, FilterSection, Titles } from '../../style';

function PerformanceTab({
  performanceTabData,
  filterState,
  setFilterState,
  performanceTabLoading,
  chartData,
  activeInnerTab,
  setInnerActiveTab,
  activeTab,
  screens,
}) {
  screens;
  return (
    <>
      <Container screens={screens}>
        <Row align="middle" gutter={[16, 25]}>
          <Col xs={24} md={{ flex: 'auto' }}>
            <Titles>Loyalty program performance</Titles>
          </Col>
          <Col xs={24} md={{ flex: 'none' }}>
            <DashboardFilters
              filterState={filterState}
              setFilterState={setFilterState}
              activeTab={activeTab}
              loading={performanceTabLoading}
            />
          </Col>
        </Row>
      </Container>

      {/* Ensure that FullPageLoader wraps only the content that's loading */}
      <FullPageLoader loading={performanceTabLoading}>
        <Card>
          <LoyaltyPerformanceSection
            performanceTabData={performanceTabData}
            chartData={chartData}
            setInnerActiveTab={setInnerActiveTab}
            activeInnerTab={activeInnerTab}
            setFilterState={setFilterState}
            filterState={filterState}
          />
        </Card>
      </FullPageLoader>
    </>
  );
}

export default PerformanceTab;
