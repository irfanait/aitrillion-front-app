import React, { useEffect, useState } from 'react';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { Row, Col, Space, App } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCustomFieldOptionApi,
  getCustomFieldOptionsApi,
} from '@/redux/apis/customers-api/customersApi';
import { createCustomFieldOptionReset } from '@/redux/customers-slice/custom-fields-slices/customFieldsSlices';

const AddOptionForm = ({ onBack, selectedFieldData }) => {
  const dispatch = useDispatch();

  const { notification } = App.useApp();
  const {
    createCustomFieldOptionsApiState,
    createCustomFieldOptionsLoading,
    createCustomFieldOptionsMessage,
  } = useSelector((state) => state.customFieldsState);

  const [label, setLabel] = useState('');

  useEffect(() => {
    if (createCustomFieldOptionsApiState === 'success') {
      notification.success({
        message: createCustomFieldOptionsMessage,
      });
      dispatch(createCustomFieldOptionReset());
      onBack();
      setLabel('');
      handleFetchOptions();
    }

    if (createCustomFieldOptionsApiState === 'error') {
      notification.error({
        message: createCustomFieldOptionsMessage,
      });
      dispatch(createCustomFieldOptionReset());
    }
  }, [createCustomFieldOptionsApiState]);

  const handleFetchOptions = () => {
    const payload = {
      act: 'get_option',
      customType: 0,
      field_id: selectedFieldData?.id,
      groupType: 0,
      keyword: '',
    };
    dispatch(getCustomFieldOptionsApi(payload));
  };

  const handleSubmit = () => {
    const payload = {
      act: 'add_option',
      customType: 0,
      field_id: selectedFieldData?.id,
      groupType: 0,
      keyword: '',
      make_default: false,
      option_lable: label,
      option_order: 2,
      shop_id: selectedFieldData?.shop_id, // if needed, otherwise pass from parent
    };

    dispatch(createCustomFieldOptionApi(payload));
  };

  return (
    <Space
      direction="vertical"
      size="small"
      style={{
        width: '100%',
        textAlign: 'center',
        padding: '10px 0px',
      }}
    >
      <Row>
        <Col span={24}>
          <AitInputBox
            label="Option:"
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter option label"
          />
        </Col>
      </Row>

      <Row justify="start" style={{ marginTop: 10 }}>
        <Col>
          <AitButton title="Back" type="default" onClick={onBack} />
        </Col>
        <Col style={{ marginLeft: 10 }}>
          <AitButton
            title="Save"
            type="primary"
            onClick={handleSubmit}
            loading={createCustomFieldOptionsLoading}
          />
        </Col>
      </Row>
    </Space>
  );
};

export default AddOptionForm;
