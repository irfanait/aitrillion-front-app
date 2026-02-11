import React from 'react';
import { AitModal } from '../ait-modal/aitModal';
import { CenteredContent, StyleTitle } from './style';
import { Typography } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
const { Text } = Typography;

const AitBothActionTriggerModal = ({
  visible,
  onCancel,
  onConfirm,
  icon = '',
  message = '',
  description = '',
  cancelText = '',
  confirmText = '',
  confirmButtonType = 'primary',
  setVisible,
  title = '',
  confirmButtonLoading = false,
  cancelButtonLoading = false,
}) => {
  return (
    <AitModal
      open={visible}
      setVisible={setVisible}
      centered
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      width={550}
      title={title}
    >
      <CenteredContent>
        {icon && <div style={{ fontSize: 37 }}>{icon}</div>}
        {message && (
          <StyleTitle level={4} type="primary" className="font-weight-500">
            {message}
          </StyleTitle>
        )}
        <Text
          type="secondary"
          style={{
            textAlign: 'left',
            width: '100%',
            marginBottom: 24,
            marginTop: 14,
          }}
        >
          {description}
        </Text>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <AitButton
            onClick={onConfirm}
            type={confirmButtonType}
            title={confirmText}
            loading={confirmButtonLoading}
          />
          <AitButton
            onClick={onCancel}
            title={cancelText}
            loading={cancelButtonLoading}
          />
        </div>
      </CenteredContent>
    </AitModal>
  );
};

export default AitBothActionTriggerModal;
