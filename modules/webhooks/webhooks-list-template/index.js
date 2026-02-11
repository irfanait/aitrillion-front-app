/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Flex, Space, App } from 'antd';
import { useSelector } from 'react-redux';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitText from '@/components/atoms/ait-text/aitText';
import CustomAitTable from '@/components/molecules/custom-ait-table';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import { checkValidData } from '@/utils/common.util';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import WebhookForm from './webhookModal';
import {
  getWebhooksListService,
  getWebhookDetailsService,
  createWebhookService,
  updateWebhookService,
  deleteWebhookService,
} from '../api';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';

function WebhooksListTemplate() {
  const jwtState = useSelector((state) => state?.jwtState);
  const { notification } = App.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [webhooksData, setWebhooksData] = useState([]);
  const [showStatusConfirmModal, setShowStatusConfirmModal] = useState(false);
  const [statusToggleWebhook, setStatusToggleWebhook] = useState(null);
  const [statusToggleValue, setStatusToggleValue] = useState(false);
  const [statusToggleLoading, setStatusToggleLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteWebhook, setDeleteWebhook] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortValue, setSortValue] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState(false);

  const getErrorMessage = (error) => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.response?.data?.msg) {
      return error.response.data.msg;
    }
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  const fetchWebhooksList = async () => {
    setWebhooksData([]);
    setTableLoading(true);
    try {
      const shopId = jwtState?.login_auth?.shop_id || '';

      const payload = {
        shop_id: shopId,
        order: sortOrder ? 0 : 1,
        limit: pageSize,
        currentPage: currentPage,
        // countSync: 1,
        order_by_col: sortValue,
      };

      const response = await getWebhooksListService(payload);

      if (response.data && response.data.status === 'success') {
        const webhooks = response.data.data || [];
        setWebhooksData(webhooks);
        setTotalRecords(response.data.totalRecords || 0);
      } else {
        notification.error({
          message: 'Failed to fetch webhooks',
        });
      }
    } catch (error) {
      console.error('Error fetching webhooks:', error);
      notification.error({
        message: getErrorMessage(error),
      });
    } finally {
      setTableLoading(false);
    }
  };

  const handleToggleStatus = (webhook, checked) => {
    setStatusToggleWebhook(webhook);
    setStatusToggleValue(checked);
    setShowStatusConfirmModal(true);
  };

  const confirmStatusToggle = async () => {
    setStatusToggleLoading(true);
    try {
      const shopId = jwtState?.login_auth?.shop_id || '';

      const payload = {
        id: statusToggleWebhook.id,
        shop_id: parseFloat(shopId),
        is_active: statusToggleValue ? 1 : 0,
      };

      const response = await updateWebhookService(payload);

      if (response.data && response.data.status === 'success') {
        notification.success({
          message: `Webhook ${statusToggleValue ? 'enabled' : 'disabled'} successfully`,
        });
        setShowStatusConfirmModal(false);
        setStatusToggleWebhook(null);
        fetchWebhooksList();
      } else {
        notification.error({
          message: response.data?.message || 'Failed to update webhook status',
        });
      }
    } catch (error) {
      console.error('Error updating webhook status:', error);
      notification.error({
        message: getErrorMessage(error),
      });
    } finally {
      setStatusToggleLoading(false);
    }
  };

  const getEvents = (events) => {
    const count = events.split(',').filter((e) => e.trim() !== '').length;
    return `${count} event(s)`;
  };

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      width: 100,
      fixed: 'left',
      sortValue: 'enabled',
      render: (cell, row) => (
        <AitSwitch
          checked={row?.enabled}
          onChange={(checked) => handleToggleStatus(row, checked)}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortValue: 'webhook_name',
      width: 200,
      render: (cell, row) => (
        <div
          style={{
            color: 'var(--ant-color-primary)',
            fontWeight: '500',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}
        >
          {checkValidData(row?.webhook_name)}
        </div>
      ),
    },
    {
      title: 'Webhook URL',
      dataIndex: 'endpoint',
      key: 'endpoint',
      sorter: true,
      sortValue: 'endpoint',
      width: 250,
      render: (cell, row) => checkValidData(row?.endpoint),
    },
    {
      title: 'Events',
      dataIndex: 'events',
      key: 'events',
      width: 200,
      sorter: true,
      sortValue: 'events',
      render: (cell, row) => {
        if (!row?.events || row?.events.length === 0) return '-';
        return (
          <AitText size={13} style={{ color: '#4a566b' }}>
            {getEvents(row?.events)}
          </AitText>
        );
      },
    },
    {
      title: 'Updated date',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 180,
      sorter: true,
      sortValue: 'updated_at',
      render: (cell, row) => {
        if (!row?.updated_at) return '-';
        const date = new Date(row.updated_at);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render(cell, row) {
        return (
          <Flex>
            <Space size={16}>
              <img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/edit_icon.svg`}
                alt="edit-icon"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setIsModalOpen(true);
                  handleEdit(row);
                }}
              />
              <img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/delete_icon.svg`}
                alt="delete-icon"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDelete(row)}
              />
            </Space>
          </Flex>
        );
      },
    },
  ];

  const handleCreateNew = () => {
    setSelectedWebhook(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (webhook) => {
    try {
      setLoading(true);
      const shopId = jwtState?.login_auth?.shop_id || '';
      const payload = {
        webhook_id: webhook.id,
        shop_id: shopId,
      };

      const response = await getWebhookDetailsService(payload);

      if (response.data && response.data.status === 'success') {
        const webhookDetails = response.data.data;
        setSelectedWebhook(webhookDetails);
      } else {
        notification.error({
          message: 'Failed to fetch webhook details',
        });
      }
    } catch (error) {
      console.error('Error fetching webhook details:', error);
      notification.error({
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (webhook) => {
    setDeleteWebhook(webhook);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const shopId = jwtState?.login_auth?.shop_id || '';

      const payload = {
        id: deleteWebhook.id,
        shop_id: shopId,
      };

      const response = await deleteWebhookService(payload);

      if (response.data && response.data.status === 'success') {
        notification.success({
          message: 'Webhook deleted successfully',
        });
        setShowDeleteConfirmModal(false);
        setDeleteWebhook(null);
        fetchWebhooksList();
      } else {
        notification.error({
          message: response.data?.message || 'Failed to delete webhook',
        });
      }
    } catch (error) {
      console.error('Error deleting webhook:', error);
      notification.error({
        message: getErrorMessage(error),
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedWebhook(null);
    setSaveLoading(false);
  };

  const handleSave = async (values) => {
    setSaveLoading(true);
    try {
      const shopId = jwtState?.login_auth?.shop_id || '';
      const shopName = jwtState?.login_auth?.shop_name || '';

      // Convert selected events to comma-separated event keys
      const webhookEventKeys = [];
      Object.keys(values.selectedEvents).forEach((module) => {
        if (
          values.selectedEvents[module] &&
          values.selectedEvents[module].length > 0
        ) {
          // Convert event titles to event keys using the mapping
          const eventTitles = values.selectedEvents[module];
          eventTitles.forEach((title) => {
            const eventKey = values.eventTitleToKeyMap[title];
            if (eventKey) {
              webhookEventKeys.push(eventKey);
            }
          });
        }
      });

      const payload = {
        shop_id: parseFloat(shopId),
        shop_name: shopName,
        webhook_name: values.name,
        endpoint_url: values.webhookUrl,
        webhook_events: webhookEventKeys.join(','),
        description: null,
        api_version: '2025-10',
        is_active: values.status ? 1 : 0,
      };

      let response;
      if (selectedWebhook) {
        // Update existing webhook
        payload.id = selectedWebhook.id;
        response = await updateWebhookService(payload);
      } else {
        // Create new webhook
        response = await createWebhookService(payload);
      }

      if (response.data && response.data.status === 'success') {
        notification.success({
          message: selectedWebhook
            ? 'Webhook updated successfully'
            : 'Webhook created successfully',
        });
        setIsModalOpen(false);
        setSelectedWebhook(null);
        fetchWebhooksList();
      } else {
        notification.error({
          message: response.data?.message || 'Failed to save webhook',
        });
      }
    } catch (error) {
      console.error('Error saving webhook:', error);
      notification.error({
        message: getErrorMessage(error),
      });
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooksList();
  }, [currentPage, pageSize, sortValue, sortOrder]);

  return (
    <>
      <AitPageHeader
        title="Webhooks"
        subtitle="Connect AiTrillion with your preferred tools and receive instant notifications whenever key events occur."
        buttonLabel="Create new webhook"
        buttonIcon={<PlusOutlined />}
        onButtonClick={handleCreateNew}
      />

      <CustomAitTable
        title="Configured webhooks"
        tableData={webhooksData}
        columns={columns}
        loading={tableLoading}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalRecords={totalRecords}
        setPageSize={setPageSize}
        pageSize={pageSize}
        setSortValue={setSortValue}
        setSortOrder={(val) => setSortOrder(val === 'asc')}
        verticalScrollHeight={'46vh'}
        scroll={{ x: 1000 }}
        isCard
      />

      <AitModal
        maskClosable={false}
        open={isModalOpen}
        title={selectedWebhook ? 'Edit webhook' : 'Create new webhook'}
        handleModalClose={handleModalClose}
        centered
        destroyOnHidden
        width={{
          xs: '95%',
          sm: '90%',
          md: '80%',
          lg: '70%',
          xl: '60%',
          xxl: '50%',
        }}
      >
        <FullPageLoader loading={loading} padding={'10px'}>
          <WebhookForm
            open={isModalOpen}
            onCancel={handleModalClose}
            onSave={handleSave}
            webhook={selectedWebhook}
            saveLoading={saveLoading}
          />
        </FullPageLoader>
      </AitModal>

      <AitConfirmationModal
        visible={showStatusConfirmModal}
        setVisible={setShowStatusConfirmModal}
        onCancel={() => {
          setShowStatusConfirmModal(false);
          setStatusToggleWebhook(null);
        }}
        onConfirm={confirmStatusToggle}
        message={`${statusToggleValue ? 'Enable' : 'Disable'} Webhook?`}
        description={`Are you sure you want to ${statusToggleValue ? 'enable' : 'disable'} "${statusToggleWebhook?.webhook_name || statusToggleWebhook?.name}"?`}
        confirmText={`Yes, ${statusToggleValue ? 'enable' : 'disable'} it!`}
        cancelText="No, cancel!"
        confirmButtonLoading={statusToggleLoading}
      />

      <AitConfirmationModal
        visible={showDeleteConfirmModal}
        setVisible={setShowDeleteConfirmModal}
        onCancel={() => {
          setShowDeleteConfirmModal(false);
          setDeleteWebhook(null);
        }}
        onConfirm={confirmDelete}
        message="Delete Webhook?"
        description={`Are you sure you want to delete ${deleteWebhook?.webhook_name || deleteWebhook?.name}`}
        confirmText="Yes, delete it!"
        cancelText="No, cancel!"
        confirmButtonType="primary"
        confirmButtonLoading={deleteLoading}
      />
    </>
  );
}

export default WebhooksListTemplate;
