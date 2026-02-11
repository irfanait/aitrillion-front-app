import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import React from 'react';
import { useSelector } from 'react-redux';

const DeleteTemplateModal = (props) => {
  const { visible, setVisible, handleDeleteTemplate } = props;
  const templateState = useSelector(
    (state) => state.emailMarketingTemplateState
  );
  return (
    <>
      <AitConfirmationModal
        visible={visible}
        setVisible={setVisible}
        description={<>This template will be deleted permanently.</>}
        onConfirm={() => {
          handleDeleteTemplate();
        }}
        message={'Are you sure ?'}
        confirmText={'Yes delete it!'}
        cancelText={'No cancel it!'}
        confirmButtonLoading={templateState?.deleteTemplateLoading}
      />
    </>
  );
};

export default DeleteTemplateModal;
