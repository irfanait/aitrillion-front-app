import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitTimeline from '../../atoms/ait-timeline/aitTimeline';
import { getCustomerDetailsTimelineApi } from '@/redux/apis/customers-api/customersApi';

const CustomerDetailsTimelineTab = ({ customerId }) => {
  const dispatch = useDispatch();

  const {
    timeline,
    timelineLoading,
    today,
    yesterday,
    timelinePagination,
    loadingMore,
  } = useSelector((state) => state.customerDetailsState);

  const { currentPage, totalPages } = timelinePagination;

  useEffect(() => {
    dispatch(
      getCustomerDetailsTimelineApi({
        act: 'get_customer_activity',
        currentPage: 1,
        key: customerId,
        loadpage: 1,
        opencurrentPage: 1,
      })
    );
  }, [customerId]);

  const handleLoadMore = (nextPage, unlock) => {
    if (nextPage > totalPages) {
      unlock?.();
      return;
    }

    dispatch(
      getCustomerDetailsTimelineApi({
        act: 'get_customer_activity',
        currentPage: nextPage,
        key: customerId,
        loadpage: nextPage,
        opencurrentPage: nextPage,
      })
    ).finally(() => {
      unlock?.();
    });
  };

  return (
    <AitCard
      loading={timelineLoading}
      bodypadding={{ xs: '0px', sm: '0px', md: '0px' }}
      borderless={true}
      bordercolor="transparent"
    >
      {!timelineLoading && (
        <AitTimeline
          activityLog={timeline}
          today={today}
          yesterday={yesterday}
          currentPage={currentPage}
          totalPages={totalPages}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
        />
      )}
    </AitCard>
  );
};

export default CustomerDetailsTimelineTab;
