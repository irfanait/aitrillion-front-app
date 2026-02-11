import React from 'react';
import { Row, Col } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  FilterOutlined,
  PieChartFilled,
  DeleteFilled,
} from '@ant-design/icons';

const ApplyFilterActions = ({
  chips,
  chipsFromSegment,
  afterApply,
  handleApplyFilterClick,
  handleClearFilter,
}) => {
  const applyDisabled = chips.length === 0 || chipsFromSegment;

  return (
    <Row gutter={[10, 10]} style={{ marginTop: 20 }}>
      <Col>
        <AitButton
          title="Apply filters"
          icon={<FilterOutlined />}
          disabled={applyDisabled}
          onClick={handleApplyFilterClick}
        />
      </Col>

      {afterApply && (
        <>
          <Col>
            <AitButton title="Save segment" icon={<PieChartFilled />} />
          </Col>
          <Col>
            <AitButton
              title="Clear filters"
              icon={<DeleteFilled />}
              onClick={handleClearFilter}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default ApplyFilterActions;
