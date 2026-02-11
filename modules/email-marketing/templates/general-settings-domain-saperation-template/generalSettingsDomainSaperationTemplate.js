import React, { useEffect, useState } from 'react';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import DomainSuppressionTab from '../../organisms/domain-suppression-tab/domainSuppressionTab';
import AitBothActionTriggerModal from '@/components/molecules/ait-both-action-trigger-modal/aitBothActionTriggerModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteDomainApi,
  getDomainListApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { App } from 'antd';
import {
  addDomainReset,
  setDomainListFilters,
} from '@/redux/email-marketing-slices/settingsSlice/settingsSlice';
import ImportSupressTab from '../../organisms/import-supress-tab/importSupressTab';

const GeneralSettingsDomainSaperationTemplate = () => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const { deleteApiState, deleteLoading, deleteMessage } = useSelector(
    (state) => state.emailMarketingSettingsState
  );

  const [activeTab, setActiveTab] = useState('domain_suppression');
  const [domainDeleteModalVisible, setDomainDeleteModalVisible] =
    useState(false);
  const [domainId, setDomainId] = useState('');
  const [actionSlug, setActionSlug] = useState('');

  useEffect(() => {
    if (deleteApiState === 'success') {
      notification.success({
        message: deleteMessage,
      });
      setDomainDeleteModalVisible(false);
      setDomainId('');
      dispatch(addDomainReset());
      dispatch(setDomainListFilters({ act: 'get_suppress_domains' }));
      dispatch(getDomainListApi());
    }
    if (deleteApiState === 'error') {
      notification.error({
        message: deleteMessage,
      });
      dispatch(addDomainReset());
    }
  }, [deleteApiState]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleDomainDeleteClick = (slug) => {
    setActionSlug(slug);
    const payload = {
      act: 'delete_suppress_domain',
      active_markfrom: slug === 'yes' ? 'all' : 'now',
      del_domain_id: domainId,
    };
    dispatch(deleteDomainApi(payload));
  };

  return (
    <>
      <AitCard
        hascustomheader={true}
        hastabs={true}
        custombodypadding={'12px 24px 24px 24px'}
        customheaderleft={
          <AitTabs
            hascustomheader={true}
            activeKey={activeTab}
            onChange={handleTabChange}
            items={[
              { key: 'domain_suppression', label: 'Domain suppression' },
              {
                key: 'import_customer_tab',
                label: 'Import suppress/inactive customer list',
              },
            ]}
          />
        }
      >
        {activeTab === 'domain_suppression' && (
          <DomainSuppressionTab
            onDeleteClick={(id) => {
              setDomainId(id);
              setDomainDeleteModalVisible(true);
            }}
          />
        )}
        {activeTab === 'import_customer_tab' && <ImportSupressTab />}
      </AitCard>
      <AitBothActionTriggerModal
        title="Please confirm?"
        visible={domainDeleteModalVisible}
        setVisible={setDomainDeleteModalVisible}
        confirmText="Yes, Activate all customers"
        cancelText="No, Activate only new customers"
        description="If need to activate the all existing customers or need to activate only new customers from now on."
        onConfirm={() => {
          handleDomainDeleteClick('yes');
        }}
        onCancel={() => {
          handleDomainDeleteClick('no');
        }}
        confirmButtonLoading={actionSlug === 'yes' ? deleteLoading : false}
        cancelButtonLoading={actionSlug === 'no' ? deleteLoading : false}
      />
    </>
  );
};

export default GeneralSettingsDomainSaperationTemplate;
