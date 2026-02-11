import { Popover, Space } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useRouter } from 'next/router';

const SegmentActionContent = ({
  record,

  handleDeleteSegmentClick,
  handleExportSegmentClick,
}) => {
  const isDeletable = record.is_default === '0' || record.is_default === 0;
  const router = useRouter();
  return (
    <Space direction="vertical">
      <AitButton
        color="primary"
        variant="text"
        title="Edit"
        icon={<EditOutlined />}
        onClick={() => {
          router.push(`/customers/all-customers/list?segment_id=${record?.id}`);
        }}
      />
      {isDeletable && (
        <AitButton
          color="primary"
          variant="text"
          title="Delete"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteSegmentClick(record.id)}
        />
      )}

      <AitButton
        color="primary"
        variant="text"
        title="View Customer"
        icon={<EyeOutlined />}
        onClick={() => {
          router.push(`/customers/all-customers/list?segment_id=${record?.id}`);
        }}
      />

      <AitButton
        color="primary"
        variant="text"
        title="Export Customers"
        icon={<CopyOutlined />}
        onClick={() => handleExportSegmentClick(record.id)}
      />
    </Space>
  );
};

export default SegmentActionContent;
