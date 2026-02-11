import React from 'react';
import { Typography, Space, Col, Row } from 'antd';
import { AitModal } from '../ait-modal/aitModal';
import { WarningOutlined } from '@ant-design/icons';
import { CenteredContent, StyleTitle } from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';

const { Text, Title } = Typography;

const AitConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
  icon = <WarningOutlined style={{ color: '#FC9701' }} />,
  message = 'Are you sure?',
  description = 'This action cannot be undone.',
  cancelText = 'No, cancel it!',
  confirmText = 'Yes, delete it!',
  confirmButtonType = 'primary',
  setVisible,
  confirmButtonLoading = false,
  showCancelBtn = true,
}) => {
  return (
    <AitModal
      open={visible}
      setVisible={setVisible}
      footer={null}
      closable={false}
      centered
      headerPadding={0}
      width={450}
      closeIconVisible={false}
      onCancel={onCancel}
      padding="10px"
    >
      <CenteredContent>
        <div style={{ fontSize: 37 }}>{icon}</div>
        <StyleTitle level={4} type="primary" className="font-weight-500">
          {message}
        </StyleTitle>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          {description}
        </Text>

        <Row gutter={12} justify={'center'}>
          {showCancelBtn && (
            <Col>
              <AitButton
                onClick={() => {
                  setVisible(false);
                }}
                color="default"
                variant="filled"
                title={cancelText}
              />
            </Col>
          )}
          <Col>
            <AitButton
              onClick={onConfirm}
              type={confirmButtonType}
              title={confirmText}
              loading={confirmButtonLoading}
            />
          </Col>
        </Row>
      </CenteredContent>
    </AitModal>
  );
};

export default AitConfirmationModal;
