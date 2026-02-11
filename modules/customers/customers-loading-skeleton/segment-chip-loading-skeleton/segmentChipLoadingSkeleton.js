import { Col, Row, Skeleton } from 'antd';
import React from 'react';
const { Button } = Skeleton;

const SegmentChipLoadingSkeleton = () => {
  return (
    <Row style={{ marginTop: 10 }} gutter={[10, 10]} wrap align="middle">
      {Array.from({ length: 10 }).map((_, i) => (
        <Col key={`skeleton-${i}`} flex="none">
          <Button
            active
            size="small"
            // shape="round"
            style={{ width: 120, height: 36 }}
          />
        </Col>
      ))}
      {/* "More" skeleton button */}
      <Col key="skeleton-more" flex="none">
        <Button
          active
          size="small"
          //   shape="round"
          style={{ width: 80, height: 36 }}
        />
      </Col>
    </Row>
  );
};

export default SegmentChipLoadingSkeleton;
