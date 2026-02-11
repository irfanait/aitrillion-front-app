import { Space } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';

const CampaignActionContent = ({
  record,
  handleEditClick,
  handleViewClick,
  handleDeleteCampaign,
  handleCloneClick,
  handleEditABClick,
}) => {
  const status = record.status_text?.toLowerCase();
  const isAbTest = record.camp_type === 'ab_testing';
  const messageId = record.message_id;

  const showView =
    status === 'sent' ||
    (status === 'pending' && isAbTest) ||
    status === 'processing';

  const showClone =
    (status === 'draft' && !isAbTest) ||
    (status === 'sent' && !isAbTest) ||
    (status === 'pending' && !isAbTest) ||
    status === 'processing' ||
    (status === 'scheduled' && !isAbTest);

  const showEdit = status === 'draft' || status === 'scheduled';

  const showDelete = status === 'draft' || status === 'scheduled';

  return (
    <Space direction="vertical">
      {showView && (
        <AitButton
          color="primary"
          variant="text"
          title="View"
          icon={<EyeOutlined />}
          onClick={() => handleViewClick(messageId)}
        />
      )}

      {showClone && (
        <AitButton
          color="primary"
          variant="text"
          title="Clone"
          icon={<CopyOutlined />}
          onClick={() => handleCloneClick(messageId)}
        />
      )}

      {showEdit && (
        <AitButton
          color="primary"
          variant="text"
          title="Edit"
          icon={<EditOutlined />}
          onClick={() =>
            isAbTest ? handleEditABClick(messageId) : handleEditClick(messageId)
          }
        />
      )}

      {showDelete && (
        <AitButton
          color="primary"
          variant="text"
          title="Delete"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteCampaign(messageId)}
        />
      )}
    </Space>
  );
};

export default CampaignActionContent;
