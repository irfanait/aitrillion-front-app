import React, { useEffect } from 'react';
import SegmentListTemplate from '@/modules/customers/templates/segment-list-template/segmentListTemplate';
import { setSegmentListFilters } from '@/redux/customers-slice/segment-slices/segment-slice';
import { useDispatch } from 'react-redux';

export default function Page() {
  return (
    <>
      <SegmentListTemplate />
    </>
  );
}
