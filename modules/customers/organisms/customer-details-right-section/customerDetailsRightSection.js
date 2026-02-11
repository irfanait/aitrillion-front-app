import React, { useState } from 'react';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import { customerDetailsTabs } from '../../utils/constant';
import CustomerDetailsOverviewTab from '../../molecules/customer-details-overview-tab/customerDetailsOverviewTab';
import CustomerDetailsTimelineTab from '../../molecules/customer-details-timeline-tab/customerDetailsTimelineTab';
import CustomerDetailsOrdersTab from '../../molecules/customer-details-orders-tab/customerDetailsOrdersTab';
import CustomerDetailsOrderDetailsModal from '../../molecules/customer-details-order-details-modal/customerDetailsOrderDetailsModal';
import Cust0merDetailsMembershipTab from '../../molecules/customer-details-membership-tab/cust0merDetailsMembershipTab';
import CustomerDetailsAddMembershipModal from '../../molecules/customer-details-add-membership-modal/customerDetailsAddMembershipModal';
import CustomerDetailsListTab from '../../molecules/customer-details-list-tab/customerDetailsListTab';
import CustomerDetailsAddListModal from '../../molecules/customer-details-add-list-modal/customerDetailsAddListModal';
import CustomerDetailsAffiliateTab from '../../molecules/customer-details-affiliate-tab/customerDetailsAffiliateTab';
import CustomerDetailsVisitedProductTab from '../../molecules/customer-details-visited-product-tab/customerDetailsVisitedProductTab';

const CustomerDetailsRightSection = ({ customerId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [addMembershipModal, setAddMembershipModal] = useState(false);
  const [addListModal, setAddListModal] = useState(false);
  const [updateAffilteGModal, setUpdateAffilteGModal] = useState(false);

  return (
    <AitCard
      hascustomheader
      hastabs
      customheaderleft={
        <AitTabs
          hascustomheader
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={customerDetailsTabs}
        />
      }
    >
      {activeTab === 'overview' && <CustomerDetailsOverviewTab />}

      {activeTab === 'timeline' && (
        <CustomerDetailsTimelineTab customerId={customerId} />
      )}
      {activeTab === 'orders' && (
        <CustomerDetailsOrdersTab
          handleModalOpen={(record, value) => {
            setOrderId(record?.order_id);
            setDetailsModalOpen(value);
          }}
          customerId={customerId}
        />
      )}
      {activeTab === 'membership' && (
        <Cust0merDetailsMembershipTab
          handleAddMembershipModal={() => {
            setAddMembershipModal(true);
          }}
          customerId={customerId}
        />
      )}
      {activeTab === 'list' && (
        <CustomerDetailsListTab
          handleAddListModal={() => {
            setAddListModal(true);
          }}
          customerId={customerId}
        />
      )}
      {activeTab === 'affiliate' && (
        <CustomerDetailsAffiliateTab
          handleUpdateGroupModal={() => {
            setUpdateAffilteGModal(true);
          }}
          customerId={customerId}
          visible={updateAffilteGModal}
          setVisible={setUpdateAffilteGModal}
        />
      )}
      {activeTab === 'visited' && (
        <CustomerDetailsVisitedProductTab customerId={customerId} />
      )}

      <CustomerDetailsOrderDetailsModal
        visible={detailsModalOpen}
        setVisible={setDetailsModalOpen}
        orderId={orderId}
      />
      <CustomerDetailsAddMembershipModal
        visible={addMembershipModal}
        setVisible={setAddMembershipModal}
        customerId={customerId}
      />
      <CustomerDetailsAddListModal
        visible={addListModal}
        setVisible={setAddListModal}
        customerId={customerId}
      />
    </AitCard>
  );
};

export default CustomerDetailsRightSection;
