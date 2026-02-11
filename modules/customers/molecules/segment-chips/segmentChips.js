import React from 'react';
import { Row, Col } from 'antd';
import AitChip from '@/components/atoms/ait-chip/aitChip';
import MoreSegmentModal from '../../molecules/more-segment-modal/moreSegmentModal';

const PRIMARY_COUNT = 13;

const SegmentChips = ({ visibleSegments, selected, onSelect }) => {
  const primary = visibleSegments.slice(0, PRIMARY_COUNT);
  const overflow = visibleSegments.slice(PRIMARY_COUNT);

  return (
    <>
      <Row gutter={[10, 10]} style={{ marginTop: 10 }}>
        {primary.map((seg) => (
          <Col key={seg.id}>
            <AitChip
              label={seg.title}
              active={selected === seg.id}
              onClick={() => onSelect(seg)}
            />
          </Col>
        ))}

        {overflow.length > 0 && (
          <Col>
            <MoreSegmentModal
              overflow={overflow}
              selected={selected}
              handleSelectSegmentChip={(seg) => onSelect(seg)}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default SegmentChips;
