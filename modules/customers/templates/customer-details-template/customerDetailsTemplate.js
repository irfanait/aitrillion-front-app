import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import CustomerDetailsLeft from '../../organisms/customer-details-left/customerDetailsLeft';
import {
  getCustomerDetailsApi,
  getCustomerDetailsCustomFieldsApi,
} from '@/redux/apis/customers-api/customersApi';
import { useDispatch, useSelector } from 'react-redux';
import CustomerDetailsLeftSkeleton from '../../customers-loading-skeleton/customer-details-left-part-skeleton/customerDetailsLeftPartSkeleton';
import CustomerDetailsRightSection from '../../organisms/customer-details-right-section/customerDetailsRightSection';
import CustomerDetailsRightSkeleton from '../../customers-loading-skeleton/customer-details-right-section-skeleton/customerDetailsRightSectionSkeleton';
import EditCustomFieldModal from '../../molecules/edit-custom-field-modal/editCustomFieldModal';
import CustomerDetailsBackHeader from '../../molecules/customer-details-back-header/customerDetailsBackHeader';

const CustomerDetailsTemplate = ({ customerId }) => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.customerDetailsState);

  const [editCustomFieldModalVisible, setEditCustomFieldModalVisible] =
    useState(false);
  const [selectedCustomField, setSelectedCustomField] = useState(null);

  useEffect(() => {
    if (!customerId) return;

    // Customer Details
    dispatch(
      getCustomerDetailsApi({
        act: 'detail_customer',
        currentPage: 1,
        key: customerId,
      })
    );

    // Custom Fields
    dispatch(
      getCustomerDetailsCustomFieldsApi({
        act: 'detail_custom_field',
        key: customerId,
        dataload: true,
      })
    );
  }, [customerId]);

  const customer = Array.isArray(data) ? data[0] : data;

  const handleEditCustomField = (field) => {
    setSelectedCustomField(field);
    setEditCustomFieldModalVisible(true);
  };

  return (
    <div style={{ padding: '14px 14px' }}>
      <CustomerDetailsBackHeader />
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={24} md={8} lg={7} xl={7}>
          {loading ? (
            <CustomerDetailsLeftSkeleton />
          ) : (
            <CustomerDetailsLeft
              customer={customer}
              onEditCustomField={handleEditCustomField}
            />
          )}
        </Col>

        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          {loading ? (
            <CustomerDetailsRightSkeleton />
          ) : (
            <CustomerDetailsRightSection customerId={customerId} />
          )}
        </Col>
      </Row>
      <EditCustomFieldModal
        visible={editCustomFieldModalVisible}
        setVisible={setEditCustomFieldModalVisible}
        field={selectedCustomField}
      />
    </div>
  );
};

export default CustomerDetailsTemplate;
