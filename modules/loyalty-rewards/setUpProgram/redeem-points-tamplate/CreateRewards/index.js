/* eslint-disable @next/next/no-img-element */
import GlobalSkeleton from '@/components/atoms/ait-skeleton';
import { use, useEffect, useMemo, useState } from 'react';
import {
  ChildrenText,
  IconWrap,
  Left,
  Right,
  RowItem,
  StyledIcon,
  TitleWrap,
} from '../style';
import { App, Empty, Typography } from 'antd';
import {
  checkValidData,
  getAccessRule,
  textFormatter,
} from '@/utils/common.util';
import logger from '@/utils/logger';
import {
  addRewardsService,
  getCreateRewardsListService,
} from '../../../api/redeemPoints';
import AitButton from '@/components/atoms/ait-button/aitButton';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AmountDiscountForm from './amountDiscountForm';
import FreeShippingForm from './freeShipping';
import FreeProductForm from './freeProduct';
import ProductDiscountForm from './productDiscount';
import CartWidgetPointForm from './cartWidgetPoints';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import StoreCreditForm from './storeCredit';
import { useParams } from 'next/navigation';
import { LockRestrictedIcon } from '@/modules/layouts/svg-icons';
import { getAccessMap } from '@/modules/layouts/helper';

const { Text } = Typography;

function CreateRewardsTamplate({ setActiveTab, getViewRewardsList }) {
  const { notification } = App.useApp();
  const router = useRouter();
  const params = useParams();
  const jwtState = useSelector((state) => state?.jwtState);
  const loggeInUserState = useSelector((state) => state.loggeInUserState);
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [rowData, setRowData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [formLoading, setFormLoading] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const openEdit = (item) => {
    setRowData(item);
    setModalTitle(item?.reward_name);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setFormLoading(false);
    setIsModalOpen(false);
    setRowData({});
  };

  function mergeData(apiResponse, planPermissionArray, additionalArray) {
    return apiResponse.map((activity) => {
      const matchingPermission = planPermissionArray.find(
        (permission) => permission.id == activity.id
      );

      if (matchingPermission) {
        const mergedData = {
          ...matchingPermission,
          ...activity,
        };

        if (activity.is_not_apply_cart_widget_prev !== 0) {
          const matchingFeature = additionalArray.find(
            (feature) => feature.feature_key === matchingPermission.feature_key
          );

          if (matchingFeature) {
            Object.assign(mergedData, matchingFeature);
          }
        }

        delete mergedData.id;
        return { ...mergedData, id: activity.id };
      }

      return activity;
    });
  }

  const planPermissionArray = [
    {
      feature_key: 'loyalty_rewards_cart_redeem_points_widget',
      id: '6',
      module_feature_id: '1018',
    },
    {
      feature_key: 'loyalty_rewards_product_discount',
      id: '5',
      module_feature_id: '1056',
    },
    {
      feature_key: 'loyalty_rewards_free_product',
      id: '4',
      module_feature_id: '1055',
    },
    {
      feature_key: 'loyalty_rewards_free_shipping',
      id: '3',
      module_feature_id: '1054',
    },
    {
      feature_key: 'loyalty_rewards_percentage_off',
      id: '2',
      module_feature_id: '',
    },
    {
      feature_key: 'loyalty_rewards_amount_discount',
      id: '1',
      module_feature_id: '',
    },
  ];

  const filterRewardsByShopType = (rewards, shopType) => {
    if (shopType !== 'woocommerce') return rewards;

    return rewards.filter(
      (reward) =>
        reward?.reward_name !== 'Store credit' &&
        reward?.reward_name?.trim() !== 'Cart redeem points widget'
    );
  };

  const getCreateRewardsList = async () => {
    setLoading(true);
    try {
      let payload = {
        new_request: 1,
        react_base_path: baseUrl,
      };
      const response = await getCreateRewardsListService(payload);
      if (response?.status === 200) {
        const mergedResult = mergeData(
          filterRewardsByShopType(
            response?.data?.eventCollection,
            jwtState?.login_auth?.shop_type
          ),
          planPermissionArray,
          loggeInUserState?.planInfo
        );

        setListData(mergedResult);
      }
    } catch (error) {
      logger(error?.response);
      setLoading(false);
    }
    setLoading(false);
  };

  const getComponent = (id) => {
    for (const key in formObj) {
      const ids = key?.split(',');
      if (ids?.includes(id?.toString())) {
        return formObj[key];
      }
    }
    return null;
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
      const response = await addRewardsService(formData);
      if (response?.data?.status === 'success') {
        notification.success({
          message: 'Reward created successfully',
        });
        setIsModalOpen(false);
        setActiveTab('viewReward');
        getViewRewardsList();
      }
    } catch (error) {
      logger(error?.response?.msg);
    } finally {
      setFormLoading(false);
    }
  };

  const formObj = {
    '1,2': (
      <AmountDiscountForm
        handleCancel={handleCancel}
        rowData={rowData}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        setFormLoading={setFormLoading}
        isEdit={false}
      />
    ),
    3: (
      <FreeShippingForm
        handleCancel={handleCancel}
        rowData={rowData}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        isEdit={false}
      />
    ),
    4: (
      <FreeProductForm
        handleCancel={handleCancel}
        rowData={rowData}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        isEdit={false}
        setFormLoading={setFormLoading}
      />
    ),
    5: (
      <ProductDiscountForm
        handleCancel={handleCancel}
        rowData={rowData}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        isEdit={false}
        setLoading={setFormLoading}
        setFormLoading={setFormLoading}
      />
    ),
    6: (
      <CartWidgetPointForm
        handleCancel={handleCancel}
        rowData={rowData}
        setIsModalOpen={setIsModalOpen}
        formLoading={formLoading}
        isEdit={false}
        setLoading={setFormLoading}
        getViewRewardsList={getViewRewardsList}
        setActiveTab={setActiveTab}
        setFormLoading={setFormLoading}
      />
    ),
    7: (
      <StoreCreditForm
        formLoading={formLoading}
        handleCancel={handleCancel}
        rowData={rowData}
        setFormLoading={setFormLoading}
        setIsModalOpen={setIsModalOpen}
        setActiveTab={setActiveTab}
        getViewRewardsList={getViewRewardsList}
        isEdit={false}
        setListData={setListData}
        listData={listData}
      />
    ),
  };

  const handleLockIconClick = (content) => {
    router?.push(`/popup?act=${content}`);
  };

  useEffect(() => {
    getCreateRewardsList();
  }, []);

  const checkRewardType = (data) => {
    if (data.reward_name === 'Store credit') {
      if (data?.store_credit_created_status !== 0) {
        return true;
      }
    } else if (data?.hasOwnProperty('cart_widget_created_status')) {
      if (data?.cart_widget_created_status !== 0) {
        return true;
      }
    }
  };

  const accessMap = useMemo(
    () => getAccessMap(loggeInUserState?.planInfo),
    [loggeInUserState?.planInfo]
  );

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
          <RowItem
            cursor={checkRewardType(item) ? 'text' : 'pointer'}
            key={index}
            onClick={() => {
              if (
                item?.hasOwnProperty('cart_widget_created_status') ||
                item?.hasOwnProperty('store_credit_access')
              ) {
                if (
                  item?.cart_widget_created_status === 0 ||
                  (parseFloat(item?.store_credit_access) === 1 &&
                    item?.store_credit_created_status === 0)
                ) {
                  // item?.hasOwnProperty('access')
                  //   ? item?.access === 'Yes'
                  //     ? openEdit(item)
                  //     : handleLockIconClick(item?.content)
                  //   : openEdit(item);
                  if (
                    getAccessRule(accessMap, item?.feature_key)?.isRestricted
                  ) {
                    handleLockIconClick(
                      getAccessRule(accessMap, item?.feature_key)?.upgradeUrl
                    );
                  } else {
                    openEdit(item);
                  }
                }
              } else {
                // item?.hasOwnProperty('access')
                //   ? item?.access === 'Yes'
                //     ? openEdit(item)
                //     : handleLockIconClick(item?.content)
                //   : openEdit(item);
                if (getAccessRule(accessMap, item?.feature_key)?.isRestricted) {
                  handleLockIconClick(
                    getAccessRule(accessMap, item?.feature_key)?.upgradeUrl
                  );
                } else {
                  openEdit(item);
                }
              }
            }}
          >
            <Left>
              <IconWrap>
                <img
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/${item?.icon}`}
                  alt=""
                />
              </IconWrap>
              <TitleWrap>
                <Text strong>
                  {checkValidData(textFormatter(item.reward_name))}
                </Text>
                {item?.store_credit_approve_permission_msg && (
                  <ChildrenText>
                    {item?.store_credit_approve_permission_msg}
                  </ChildrenText>
                )}
              </TitleWrap>
            </Left>
            <Right onClick={(e) => e.stopPropagation()}>
              {item.reward_name === 'Store credit' ? (
                parseFloat(item?.store_credit_access) !== 1 ? (
                  <AitButton
                    type="primary"
                    title="Allow Permission"
                    onClick={() =>
                      // window.open(
                      //   item?.store_credit_permission_url,
                      //   '_blank',
                      //   'noopener,noreferrer'
                      // )
                      router.push(item?.store_credit_permission_url)
                    }
                  />
                ) : (
                  item?.store_credit_created_status === 0 && (
                    <StyledIcon className="icon">+</StyledIcon>
                  )
                )
              ) : item.hasOwnProperty('cart_widget_created_status') ? (
                item?.cart_widget_created_status !== 1 && (
                  <StyledIcon
                    className="icon"
                    onClick={() => {
                      if (
                        item?.hasOwnProperty('cart_widget_created_status') ||
                        item?.hasOwnProperty('store_credit_access')
                      ) {
                        if (
                          item?.cart_widget_created_status === 0 ||
                          (parseFloat(item?.store_credit_access) === 1 &&
                            item?.store_credit_created_status === 0)
                        ) {
                          // item?.hasOwnProperty('access')
                          //   ? item?.access === 'Yes'
                          //     ? openEdit(item)
                          //     : handleLockIconClick(item?.content)
                          //   : openEdit(item);
                          if (
                            getAccessRule(accessMap, item?.feature_key)
                              ?.isRestricted
                          ) {
                            handleLockIconClick(
                              getAccessRule(accessMap, item?.feature_key)
                                ?.upgradeUrl
                            );
                          } else {
                            openEdit(item);
                          }
                        }
                      } else {
                        // item?.hasOwnProperty('access')
                        //   ? item?.access === 'Yes'
                        //     ? openEdit(item)
                        //     : handleLockIconClick(item?.content)
                        //   : openEdit(item);
                        if (
                          getAccessRule(accessMap, item?.feature_key)
                            ?.isRestricted
                        ) {
                          handleLockIconClick(
                            getAccessRule(accessMap, item?.feature_key)
                              ?.upgradeUrl
                          );
                        } else {
                          openEdit(item);
                        }
                      }
                    }}
                  >
                    +
                  </StyledIcon>
                )
              ) : (
                <StyledIcon
                  className="icon"
                  onClick={() => {
                    if (
                      item?.hasOwnProperty('cart_widget_created_status') ||
                      item?.hasOwnProperty('store_credit_access')
                    ) {
                      if (
                        item?.cart_widget_created_status === 0 ||
                        (parseFloat(item?.store_credit_access) === 1 &&
                          item?.store_credit_created_status === 0)
                      ) {
                        // item?.hasOwnProperty('access')
                        //   ? item?.access === 'Yes'
                        //     ? openEdit(item)
                        //     : handleLockIconClick(item?.content)
                        //   : openEdit(item);
                        if (
                          getAccessRule(accessMap, item?.feature_key)
                            ?.isRestricted
                        ) {
                          handleLockIconClick(
                            getAccessRule(accessMap, item?.feature_key)
                              ?.upgradeUrl
                          );
                        } else {
                          openEdit(item);
                        }
                      }
                    } else {
                      // item?.hasOwnProperty('access')
                      //   ? item?.access === 'Yes'
                      //     ? openEdit(item)
                      //     : handleLockIconClick(item?.content)
                      //   : openEdit(item);
                      if (
                        getAccessRule(accessMap, item?.feature_key)
                          ?.isRestricted
                      ) {
                        handleLockIconClick(
                          getAccessRule(accessMap, item?.feature_key)
                            ?.upgradeUrl
                        );
                      } else {
                        openEdit(item);
                      }
                    }
                  }}
                >
                  +
                </StyledIcon>
              )}
              {/* {item?.access === 'No' && item?.action === 'popup' && (
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      right: '-3px',
                      top: '-36px',
                      display: 'flex',
                    }}
                    on
                  >
                    <LockRestrictedIcon />
                  </span>
                </div>
              )} */}
              {getAccessRule(accessMap, item?.feature_key)?.isRestricted && (
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      right: '-3px',
                      top: '-36px',
                      display: 'flex',
                    }}
                    on
                  >
                    <LockRestrictedIcon />
                  </span>
                </div>
              )}
            </Right>
          </RowItem>
        ))
      ) : (
        <Empty
          description={<Text>No data found</Text>}
          style={{ padding: '15px' }}
        />
      )}

      <AitModal
        modalBodyPosition={formLoading && 'static'}
        maskClosable={false}
        open={isModalOpen}
        title={textFormatter(modalTitle)}
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
        {/* <FullPageLoader loading={formLoading} padding={'10px'}> */}
        {/* {formObj[activityId]} */}
        <div style={{ paddingTop: '16px' }}>{getComponent(rowData?.id)}</div>
        {/* </FullPageLoader> */}
      </AitModal>
    </>
  );
}

export default CreateRewardsTamplate;
