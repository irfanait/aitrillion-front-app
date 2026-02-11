import React from 'react';
import {
  Bold,
  CustomFieldsHeader,
  LabelWrapper,
  RowItem,
  SectionPadding,
  ValueWrapper,
} from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { Flex, Tooltip, Typography } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import AitText from '@/components/atoms/ait-text/aitText';
import dayjs from 'dayjs';

const { Text } = Typography;

const CustomerDetailsCustomFieldSection = ({ onEdit, onAdd }) => {
  const { customFields, customFieldValues } = useSelector(
    (state) => state.customerDetailsState
  );

  const mappedCustomFields = customFields?.map((field) => {
    const raw = customFieldValues[field.field_name];
    let displayValue = '';

    if (Array.isArray(raw)) {
      displayValue = raw.join(', ');
    } else if (typeof raw === 'object' && raw !== null) {
      displayValue = Object.keys(raw).join(', ');
    } else if (
      typeof raw === 'string' &&
      field.front_type === 'datetime-local'
    ) {
      displayValue = dayjs(raw).isValid()
        ? dayjs(raw).format('MM/DD/YYYY hh:mm A')
        : raw;
    } else if (typeof raw === 'string' && field.front_type === 'date') {
      displayValue = dayjs(raw).isValid()
        ? dayjs(raw).format('MM/DD/YYYY')
        : raw;
    } else {
      displayValue = raw ?? '–';
    }

    return {
      ...field,
      label: field.field_label,
      value: displayValue,
    };
  });

  return (
    <>
      <RowItem>
        <AitText strong size={14} type="primary">
          Custom fields
        </AitText>
        <AitText strong size={13} type="primary">
          Value
        </AitText>
        <Tooltip title="Add new field">
          <AitButton
            color="primary"
            variant="outlined"
            padding={'2px 3px !important'}
            onClick={onAdd}
            icon={<PlusOutlined />}
            shape="circle"
            style={{
              lineHeight: 'normal',
              fontSize: '10px',
              minWidth: 'auto',
            }}
          />
        </Tooltip>
      </RowItem>

      <SectionPadding>
        {mappedCustomFields.length === 0 ? (
          <Text type="secondary">No custom fields found</Text>
        ) : (
          mappedCustomFields.map((item) => (
            <RowItem key={item.id}>
              <AitText type="default" strong size={13}>
                <span>{item.label} :</span>
              </AitText>
              <AitText type="default" size={13}>
                {' '}
                {typeof item.value === 'object'
                  ? Object.keys(item.value).join(', ') // safety fallback
                  : item.value}
              </AitText>

              <AitText type="theme" size={13}>
                <EditOutlined
                  style={{
                    marginLeft: 10,
                    cursor: 'pointer',
                  }}
                  onClick={() => onEdit(item)}
                />
              </AitText>
            </RowItem>
          ))
        )}
      </SectionPadding>
    </>
  );
};

export default CustomerDetailsCustomFieldSection;
