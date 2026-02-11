import React from 'react';
import { Row, Col } from 'antd';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitButton from '@/components/atoms/ait-button/aitButton';

const CreateSegmentControls = ({
  operator,
  setOperator,
  searchInput,
  setSearchInput,
}) => {
  return (
    <Row gutter={[10, 10]} style={{ marginTop: 10 }}>
      <Col>
        <AitSelectBox
          value={operator === 'and' ? 'all' : 'any'}
          options={[
            { label: 'That match all filters', value: 'all' },
            { label: 'That match any filters', value: 'any' },
          ]}
        />
      </Col>

      <Col>
        <AitButton title="Add filter" icon={<span>+</span>} />
      </Col>
    </Row>
  );
};

export default CreateSegmentControls;
