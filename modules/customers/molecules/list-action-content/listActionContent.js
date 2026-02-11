import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  ImportOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import React from 'react';

const ListActionContent = ({
  record,
  handleEdit,
  handleDeleteClick,
  handleExportListClick,
  handleSendCammpaignClick,
  handleViewCustomerClick,
  handleImportContactClick,
}) => {
  return (
    <Space direction="vertical">
      <AitButton
        color="primary"
        variant="text"
        title="Edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(record)}
      />

      <AitButton
        color="primary"
        variant="text"
        title="Import contact"
        icon={<ImportOutlined />}
        onClick={() => handleImportContactClick(record)}
      />

      <AitButton
        color="primary"
        variant="text"
        title="Send campaign"
        icon={<SendOutlined />}
        onClick={() => handleSendCammpaignClick(record)}
      />

      <AitButton
        color="primary"
        variant="text"
        title="View customers"
        icon={<EyeOutlined />}
        onClick={() => handleViewCustomerClick(record)}
      />

      <AitButton
        color="primary"
        variant="text"
        title="Export customers"
        icon={<ExportOutlined />}
        onClick={() => handleExportListClick(record)}
      />

      <AitButton
        color="primary"
        variant="text"
        title="Delete"
        danger
        icon={<DeleteOutlined />}
        onClick={() => handleDeleteClick(record)}
      />
    </Space>
  );
};

export default ListActionContent;
