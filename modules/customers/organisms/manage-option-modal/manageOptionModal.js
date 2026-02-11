import AitButton from '@/components/atoms/ait-button/aitButton';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { PlusOutlined } from '@ant-design/icons';
import { App, Col, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import ManageOptionModalAlertBar from '../../atoms/manage-option-modal-alert-bar/manageOptionModalAlertBar';
import ManageOptionsListTable from '../manage-option-list-table/manageOptionsListTable';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteFieldOptionApi,
  getCustomFieldOptionsApi,
} from '@/redux/apis/customers-api/customersApi';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import { deleteCustomFieldOptionsReset } from '@/redux/customers-slice/custom-fields-slices/customFieldsSlices';
import AddOptionModal from '../../molecules/add-option-modal/addOptionModal';

const ManageOptionModal = (props) => {
  const dispatch = useDispatch();

  const { notification } = App.useApp();
  const { visible, setVisible, selectedFieldData } = props;
  const { shop_id } = useSelector((state) => state.jwtState.login_auth);
  const {
    deleteCustomFieldOptionsApiState,
    deleteCustomFieldOptionsLoading,
    deleteCustomFieldOptionsMessage,
  } = useSelector((state) => state.customFieldsState);

  const [deleteOptionsModalVisible, setDeleteOptionsModalVisible] =
    useState(false);
  const [optionData, setOptionData] = useState(null);
  const [modalView, setModalView] = useState('list');

  useEffect(() => {
    if (!selectedFieldData?.id) return;
    const payload = {
      act: 'get_option',
      customType: 0,
      field_id: selectedFieldData?.id,
      groupType: 0,
      keyword: '',
    };
    dispatch(getCustomFieldOptionsApi(payload));
  }, [selectedFieldData?.id, dispatch]);

  useEffect(() => {
    if (deleteCustomFieldOptionsApiState === 'success') {
      notification.success({
        message:
          deleteCustomFieldOptionsMessage || 'Option deleted successfully',
      });
      setDeleteOptionsModalVisible(false);
      setOptionData(null);
      dispatch(deleteCustomFieldOptionsReset());
    }
    if (deleteCustomFieldOptionsApiState === 'error') {
      notification.error({
        message: deleteCustomFieldOptionsMessage || 'Failed to delete option',
      });
      dispatch(deleteCustomFieldOptionsReset());
    }
  }, [deleteCustomFieldOptionsApiState]);

  const handleDeleteModalClick = () => {
    const payload = {
      act: 'delete_field_option',
      id: optionData?.id,
      shop_id: shop_id,
    };
    dispatch(deleteFieldOptionApi(payload));
  };

  return (
    <AitModal
      open={visible}
      centered
      isHeaderAtCenter
      headerTitleLevel={3}
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      width={modalView === 'list' ? 760 : 560}
      title={
        modalView === 'list'
          ? `Manage ${selectedFieldData?.field_type} options`
          : `Create a new ${selectedFieldData?.field_type} option`
      }
      setVisible={setVisible}
      destroyOnClose
      maskClosable
    >
      <Space
        direction="vertical"
        size="small"
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '10px 0px',
        }}
      >
        {modalView === 'list' ? (
          <>
            <ManageOptionModalAlertBar />
            <AitCard
              hascustomheader={true}
              custombodypadding={'12px 24px 24px 24px'}
              headercolreverse={true}
              customheaderright={
                <Row gutter={[20, 20]}>
                  <Col xs={{ span: 24 }} sm={{ span: 'auto' }}>
                    <div style={{ paddingLeft: '5px' }}>
                      <AitButton
                        title="Add new"
                        type="primary"
                        onClick={() => setModalView('add')}
                        icon={<PlusOutlined />}
                      />
                    </div>
                  </Col>
                </Row>
              }
            >
              <ManageOptionsListTable
                handleDeleteClick={(record) => {
                  setOptionData(record);
                  setDeleteOptionsModalVisible(true);
                }}
              />
            </AitCard>
          </>
        ) : (
          <AddOptionModal
            selectedFieldData={selectedFieldData}
            onBack={() => setModalView('list')}
          />
        )}
      </Space>

      <AitConfirmationModal
        visible={deleteOptionsModalVisible}
        setVisible={setDeleteOptionsModalVisible}
        description="This field will be deleted permanently, but already mapped data with this option in customer will remain saved."
        onConfirm={() => handleDeleteModalClick()}
        confirmButtonLoading={deleteCustomFieldOptionsLoading}
      />
    </AitModal>
  );
};

export default ManageOptionModal;
