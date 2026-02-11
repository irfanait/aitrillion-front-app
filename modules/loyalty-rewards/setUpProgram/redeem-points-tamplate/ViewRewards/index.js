/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { App, Empty, Flex, Typography } from 'antd';
import {
  ChildrenText,
  EditIcon,
  IconWrap,
  Left,
  PointsText,
  Right,
  RowItem,
  TitleWrap,
} from '../style';
import GlobalSkeleton from '@/components/atoms/ait-skeleton';
import {
  checkValidCount,
  checkValidData,
  textFormatter,
} from '@/utils/common.util';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import { useState } from 'react';
import AmountDiscountForm from '../CreateRewards/amountDiscountForm';
import FreeShippingForm from '../CreateRewards/freeShipping';
import FreeProductForm from '../CreateRewards/freeProduct';
import ProductDiscountForm from '../CreateRewards/productDiscount';
import CartWidgetPointForm from '../CreateRewards/cartWidgetPoints';
import {
  activedeactivecardwidgetremoteService,
  activedeactivestorecreditremoteService,
  deleteRewardsService,
  statusChangeRewardsService,
  updateRewardsService,
} from '../../../api/redeemPoints';
import logger from '@/utils/logger';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import StoreCreditForm from '../CreateRewards/storeCredit';
import AitText from '@/components/atoms/ait-text/aitText';
import AitButton from '@/components/atoms/ait-button/aitButton';
const { Text } = Typography;

function ViewRewards({ loading, listData, getViewRewardsList, setActiveTab }) {
  const { notification } = App.useApp();
  const [rowData, setRowData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [statusChange, setStatusChange] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const openEdit = (item) => {
    setRowData(item);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setFormLoading(false);
    setIsModalOpen(false);
    setRowData({});
  };

  const convertToFormDataCustom = (obj, formData = new FormData()) => {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      const value = obj[key];
      if (key === 'applied_to_json' && Array.isArray(value)) {
        value.forEach((item) => {
          formData.append('applied_to_json[]', item);
        });
      } else {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      }
    }

    return formData;
  };

  const handleSubmit = async (values) => {
    setFormLoading(true);
    const formData = convertToFormDataCustom(values);
    try {
      const response = await updateRewardsService(formData);
      if (response?.data?.status === 'success') {
        notification.success({
          message: 'Update reward successfully',
        });
        getViewRewardsList();
        setIsModalOpen(false);
      }
    } catch (error) {
      logger(error?.response?.msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteReward = async () => {
    setDeleteLoading(true);
    let obj = {};
    obj.id = rowData?.id;
    obj.reward_id = rowData?.reward_id;
    const formData = convertToFormDataCustom(obj);
    try {
      const response = await deleteRewardsService(formData);
      if (response?.data?.status === 'success') {
        notification.success({
          message: 'Reward has been deleted successfully',
        });
        setVisible(false);
        getViewRewardsList();
      }
    } catch (error) {
      logger(error?.response?.msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChangeStatusReward = async () => {
    setDeleteLoading(true);
    let obj = {};
    obj.id = rowData?.id;
    obj.rewardId = rowData?.reward_id;
    obj.status = rowData?.status === '1' ? '0' : '1';
    const formData = convertToFormDataCustom(obj);
    try {
      const response =
        rowData?.reward_display_name === 'cart widget discount'
          ? await activedeactivecardwidgetremoteService(formData)
          : rowData?.reward_name === 'Store credit'
            ? await activedeactivestorecreditremoteService(formData)
            : await statusChangeRewardsService(formData);

      if (response?.data?.status === 'success') {
        notification.success({
          message: 'Reward status updated successfully',
        });
        setStatusChange(false);
        getViewRewardsList();
      }
      if (
        (rowData?.reward_display_name === 'cart widget discount' &&
          response?.data?.status === 'error') ||
        (rowData?.reward_name === 'Store credit' &&
          response?.data?.status === 'error')
      ) {
        notification.success({
          message: 'Reward status updated successfully',
        });
        setStatusChange(false);
        getViewRewardsList();
      }
    } catch (error) {
      logger(error?.response?.msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formObj = {
    'Amount discount': (
      <AmountDiscountForm
        handleCancel={handleCancel}
        rowData={rowData}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        setFormLoading={setFormLoading}
        setActivitiesLoading={setActivitiesLoading}
        isEdit
      />
    ),
    'Percentage off': (
      <AmountDiscountForm
        handleCancel={handleCancel}
        rowData={rowData}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        setFormLoading={setFormLoading}
        setActivitiesLoading={setActivitiesLoading}
        isEdit
      />
    ),
    'Free shipping': (
      <FreeShippingForm
        handleCancel={handleCancel}
        rowData={rowData}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        setFormLoading={setFormLoading}
        setActivitiesLoading={setActivitiesLoading}
        isEdit
      />
    ),
    'Free product': (
      <FreeProductForm
        handleCancel={handleCancel}
        rowData={rowData}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        setFormLoading={setFormLoading}
        setActivitiesLoading={setActivitiesLoading}
        isEdit
      />
    ),
    'Product discount': (
      <ProductDiscountForm
        handleCancel={handleCancel}
        rowData={rowData}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        setFormLoading={setFormLoading}
        setActivitiesLoading={setActivitiesLoading}
        isEdit
      />
    ),
    'cart widget discount': (
      <CartWidgetPointForm
        handleCancel={handleCancel}
        rowData={rowData}
        setFormLoading={setFormLoading}
        setIsModalOpen={setIsModalOpen}
        setActiveTab={setActiveTab}
        formLoading={formLoading}
        getViewRewardsList={getViewRewardsList}
        setActivitiesLoading={setActivitiesLoading}
        isEdit
      />
    ),
    'Store credit': (
      <StoreCreditForm
        handleCancel={handleCancel}
        rowData={rowData}
        setFormLoading={setFormLoading}
        setIsModalOpen={setIsModalOpen}
        setActiveTab={setActiveTab}
        formLoading={formLoading}
        getViewRewardsList={getViewRewardsList}
        setActivitiesLoading={setActivitiesLoading}
        isEdit
      />
    ),
  };

  console.log('rowData', rowData);

  return (
    <>
      {loading ? (
        new Array(7).fill(null)?.map((_) => (
          <>
            <RowItem>
              <GlobalSkeleton />
            </RowItem>
          </>
        ))
      ) : listData?.length > 0 ? (
        listData?.map((item, index) => (
          <RowItem key={index} onClick={() => openEdit(item)}>
            <Left>
              <IconWrap>
                <img
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/${item?.icon}`}
                  alt=""
                />
              </IconWrap>
              <TitleWrap>
                <Text strong>
                  {checkValidData(
                    textFormatter(item.reward_display_name || item?.reward_name)
                  )}
                </Text>
                {item?.store_credit_approve_permission_msg && (
                  <ChildrenText>
                    {item?.store_credit_approve_permission_msg}
                  </ChildrenText>
                )}
                <PointsText>
                  Claimed:{' '}
                  {checkValidCount(
                    item?.voucher_codes_redeem || item?.storeCreditUsed
                  )}{' '}
                  times
                  {item?.reward_name !== 'Store credit' && (
                    <>
                      {' '}
                      | Used: {checkValidCount(item?.voucher_codes_used)}{' '}
                      times{' '}
                    </>
                  )}
                </PointsText>
              </TitleWrap>
            </Left>
            <Right onClick={(e) => e.stopPropagation()}>
              <EditIcon onClick={() => openEdit(item)}>
                <img
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/edit_icon.svg`}
                  alt="edit-icon"
                />
              </EditIcon>
              {!item.hasOwnProperty('cart_widget_status') &&
                !item.hasOwnProperty('cart_widget_points') &&
                item?.reward_name !== 'Store credit' && (
                  <EditIcon
                    onClick={() => {
                      setVisible(true);
                      setRowData(item);
                    }}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/delete_icon.svg`}
                      alt="edit-icon"
                    />
                  </EditIcon>
                )}
              <AitSwitch
                checked={parseFloat(item.status) > 0}
                onChange={(e) => {
                  setRowData(item);
                  setStatusChange(true);
                }}
                defaultChecked={parseFloat(item.status) > 0}
              />
            </Right>
          </RowItem>
        ))
      ) : (
        // <Empty
        //   description={<Text>No data found</Text>}
        //   style={{ padding: '15px' }}
        // />
        <>
          <Flex
            vertical
            align="center"
            justify="center"
            style={{ width: '100%', height: 300, gap: 20 }}
          >
            <AitText type="secondary" size={18} bottommargin={10}>
              You haven't created any rewards yet!
            </AitText>

            <AitButton
              title="Add ways to redeem"
              type="primary"
              size="large"
              onClick={() => setActiveTab('createReward')}
            />
          </Flex>
        </>
      )}

      <AitModal
        maskClosable={false}
        open={isModalOpen}
        title={
          <>
            {checkValidData(
              textFormatter(
                rowData?.reward_name ||
                  rowData?.reward_display_name ||
                  rowData?.store_credit_title
              )
            )}
            {rowData?.store_credit_title === 'Store credit' && (
              <>
                {' '}
                <br />
                <Text style={{ fontSize: 13, color: '#6e7f9d' }}>
                  This reward is used to redeem points for store credit.
                </Text>
              </>
            )}
          </>
        }
        handleModalClose={handleCancel}
        footer={null}
        centered
        width={
          rowData?.reward_name === 'Free shipping'
            ? '450px'
            : {
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '50%',
                xxl: '40%',
              }
        }
        destroyOnHidden
      >
        <FullPageLoader loading={activitiesLoading} padding={'10px'}>
          <div style={{ paddingTop: '16px' }}>
            {
              formObj[
                rowData?.reward_name ||
                  rowData?.reward_display_name ||
                  rowData?.store_credit_title
              ]
            }
          </div>
        </FullPageLoader>
      </AitModal>

      <AitConfirmationModal
        visible={visible}
        setVisible={setVisible}
        confirmText="Yes, delete it!"
        description="Deleting a coupon means it will no longer show up in your popup and your customers will no longer be able to redeem their points for it."
        onConfirm={() => {
          handleDeleteReward();
        }}
        confirmButtonLoading={deleteLoading}
      />

      <AitConfirmationModal
        visible={statusChange}
        setVisible={setStatusChange}
        message={`Are you sure you want to ${parseFloat(rowData?.status) === 0 ? 'enable' : 'disable'} this reward?`}
        confirmText={`Yes, ${parseFloat(rowData?.status) === 0 ? 'enable' : 'disable'} it!`}
        description=""
        onConfirm={() => {
          handleChangeStatusReward();
        }}
        confirmButtonLoading={deleteLoading}
      />
    </>
  );
}

export default ViewRewards;
