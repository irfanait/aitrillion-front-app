/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState } from 'react';
import {
  PagePad,
  RowItem,
  Left,
  IconWrap,
  TitleWrap,
  PointsText,
  Right,
  EditIcon,
  CountTag,
  ActivitiesText,
} from './style';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';

import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import { Typography, Empty, App } from 'antd';
import logger from '@/utils/logger';
import {
  getActivitiesDetailsByIdService,
  getEarnPointsDataService,
  updateActivitiesStatusService,
} from '../../api/earnPoints';
import { useDispatch, useSelector } from 'react-redux';
import {
  addEarnPointsListData,
  earnPointsData,
} from '../../redux/earnPoints/earnPointsSlice';
import AitCard from '@/components/atoms/ait-card/aitCard';
import {
  checkValidCount,
  checkValidData,
  commasFormatter,
  getAccessRule,
  getCurrencyByMoneyFormat,
  textFormatter,
} from '@/utils/common.util';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import {
  AllowPushNotificationForm,
  BecomeAnAffilateForm,
  CreateAnAccountForm,
  OnCustomerTagForm,
} from './SignUpActivitys';
import {
  BuyXGetYPointsForm,
  BuyXOrderGetYPointsForm,
  CelebrateBirthdayForm,
  GiftCodeForm,
  LeaveAReviewForm,
  MakeAPurchaseForm,
  ReferAFriendForm,
  StoreVisitForm,
} from './OnlineStore';
import SocialEngagementsForm from './SocialEngagements';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import GlobalSkeleton from '@/components/atoms/ait-skeleton';
import { LockRestrictedIcon } from '@/modules/layouts/svg-icons';
import { useRouter } from 'next/router';
import { getAccessMap } from '@/modules/layouts/helper';

const { Text } = Typography;

const EarnPointsTemplate = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const jwtState = useSelector((state) => state?.jwtState);
  const loggeInUserState = useSelector((state) => state.loggeInUserState);
  const { notification } = App.useApp();
  const earnPointData = useSelector(earnPointsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  const [activityId, setActivityId] = useState(0);
  const [activityName, setActivityName] = useState();
  const [pageLoading, setPageLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [fullPageLoading, setFullPageLoading] = useState(false);
  const [listData, setListData] = useState([]);

  const openEdit = (item) => {
    setActivityId(item?.activity_id);
    setActivityName(item?.rule_name);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRowData({});
  };

  const getEarnPointListData = async () => {
    setPageLoading(true);
    try {
      const response = await getEarnPointsDataService();

      if (response?.status === 'success') {
        let finalData = { ...response.data };

        if (jwtState?.login_auth?.shop_type === 'woocommerce') {
          finalData.sign_up_activities = finalData.sign_up_activities.filter(
            (activity) =>
              activity.rule_name !== 'On customer tag' &&
              activity.rule_name !== 'Become an affiliate'
          );
        }
        if (jwtState?.login_auth?.shop_type === 'woocommerce') {
          finalData.social_engagements = finalData.social_engagements.filter(
            (activity) => activity.rule_name !== 'Facebook share on thank you'
          );
        }

        setListData(finalData);
      }
    } catch (error) {
      logger(error);
    } finally {
      setPageLoading(false);
    }
  };

  const getActivitiesDetailsById = async () => {
    setActivitiesLoading(true);
    try {
      let payload = {
        activity_id: activityId,
      };
      const response = await getActivitiesDetailsByIdService(payload);
      if (response?.status === 'success') {
        setRowData(response?.data);
      }
    } catch (error) {
      logger(error);
    }
    setActivitiesLoading(false);
  };

  function updateActivityData(originalData, activityIdToUpdate, updatedFields) {
    const newData = { ...originalData };
    const categories = [
      'sign_up_activities',
      'online_store',
      'social_engagements',
    ];
    for (let category of categories) {
      const activities = [...originalData[category]];
      for (let i = 0; i < activities.length; i++) {
        if (activities[i].activity_id === activityIdToUpdate) {
          let obj = { ...updatedFields, rule_exist: 1 };
          activities[i] = {
            ...activities[i],
            ...obj,
          };
          newData[category] = activities;
          return newData;
        }
      }
    }
    return newData;
  }

  const upateActivitiesStatus = async (value, id) => {
    setFullPageLoading(true);
    const formData = new FormData();
    formData.append('updateto', value === true ? 'enable' : 'disable');
    formData.append('rule_id', id);

    try {
      const response = await updateActivitiesStatusService(formData);
      if (response?.status === 'success') {
        let updatedFields = {
          status: value === true ? '1' : '0',
        };
        const updated = updateActivityData(earnPointData, id, updatedFields);
        dispatch(addEarnPointsListData(updated));
        notification.success({
          message: 'Settings Updated Successfully!',
        });
      } else {
        notification.success({
          message: response?.msg,
        });
      }
    } catch (error) {
      logger(error);
    }
    setFullPageLoading(false);
  };

  useEffect(() => {
    getEarnPointListData();
  }, []);

  useEffect(() => {
    if (isModalOpen && activityId !== '') {
      getActivitiesDetailsById();
    }
  }, [isModalOpen]);

  const formatNumber = (value) => {
    if (value) {
      if (value % 1 === 0) {
        return parseFloat(value)?.toFixed(0);
      }
      return value?.toString();
    }
  };

  const formObj = {
    2: (
      <CreateAnAccountForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
    25: (
      <OnCustomerTagForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
    24: (
      <AllowPushNotificationForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
    26: (
      <BecomeAnAffilateForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
    10: (
      <CelebrateBirthdayForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
        setActivitiesLoading={setActivitiesLoading}
      />
    ),
    1: (
      <MakeAPurchaseForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
        setActivitiesLoading={setActivitiesLoading}
      />
    ),
    3: (
      <ReferAFriendForm
        setActivitiesLoading={setActivitiesLoading}
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
    4: (
      <StoreVisitForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
    6: (
      <BuyXGetYPointsForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
    7: (
      <BuyXOrderGetYPointsForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
    15: (
      <LeaveAReviewForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
    16: (
      <GiftCodeForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
    '17,18,19,20,21,22': (
      <SocialEngagementsForm
        setIsModalOpen={setIsModalOpen}
        rowData={rowData}
        handleCancel={handleCancel}
        activityId={activityId}
        updateActivityData={updateActivityData}
      />
    ),
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

  const planPermissionArray = [
    {
      feature_key: 'loyalty_allow_push_notifications',
      activity_id: 24,
      module_feature_id: '1053',
    },
    {
      feature_key: 'loyalty_activities_on_customer_tag',
      activity_id: 25,
      module_feature_id: '1050',
    },
    {
      feature_key: 'loyalty_activity_become_an_affiliate',
      activity_id: 26,
      module_feature_id: '1048',
    },
    {
      feature_key: 'loyalty_celebrate_birthday',
      activity_id: 10,
      module_feature_id: '1046',
    },
    {
      feature_key: 'loyalty_rewards_refer_a_friend',
      activity_id: 3,
      module_feature_id: '25',
    },
    {
      feature_key: 'loyalty_activity_buy_x_get_y_points',
      activity_id: 6,
      module_feature_id: '1047',
    },
    {
      feature_key: 'loyalty_activity_on_x_ordes_get_y_points',
      activity_id: 7,
      module_feature_id: '1049',
    },
    {
      feature_key: 'loyalty_rewards_advance_activities',
      activity_id: 15,
      module_feature_id: '24',
    },
    {
      feature_key: 'loyalty_activities_gift_code',
      activity_id: 16,
      module_feature_id: '1052',
    },
  ];
  function mergeData(apiResponse, planPermissionArray, additionalArray) {
    const mergeActivities = (activities) => {
      return activities.map((activity) => {
        const matchingPermission = planPermissionArray.find(
          (permission) => permission.activity_id == activity.activity_id
        );
        if (matchingPermission) {
          const matchingFeature = additionalArray.find(
            (feature) => feature.feature_key === matchingPermission.feature_key
          );
          if (matchingFeature) {
            return { ...activity, ...matchingPermission, ...matchingFeature };
          }
          return { ...activity, ...matchingPermission };
        }
        return activity;
      });
    };

    const mergedSignUpActivities = mergeActivities(
      apiResponse.sign_up_activities
    );
    const mergedOnlineStore = mergeActivities(apiResponse.online_store);
    const mergedSocialEngagements = mergeActivities(
      apiResponse.social_engagements
    );
    return {
      sign_up_activities: mergedSignUpActivities,
      online_store: mergedOnlineStore,
      social_engagements: mergedSocialEngagements,
    };
  }

  useEffect(() => {
    if (listData?.sign_up_activities?.length > 0) {
      const mergedResult = mergeData(
        listData,
        planPermissionArray,
        loggeInUserState?.planInfo
      );
      dispatch(addEarnPointsListData(mergedResult));
    }
  }, [listData]);

  const handleLockIconClick = (content) => {
    router?.push(`/popup?act=${content}`);
  };

  const accessMap = useMemo(
    () => getAccessMap(loggeInUserState?.planInfo),
    [loggeInUserState?.planInfo]
  );

  return (
    <>
      {/* <LayoutContainer>
        <MainWrapper> */}
      <>
        <AitPageHeader
          title="Make your customer earn points"
          subtitle="Select ways for customers to earn points on your store."
          hideButton
        />
        <FullPageLoader
          loading={fullPageLoading}
          extraStyle={fullPageLoading}
          // extraStyle={{ height: fullPageLoading ? '100vh' : '' }}
        >
          <>
            <AitCard
              bodypadding={{
                md: '0px 0px 0px 0px',
                xs: '0px 0px 0px 0px',
              }}
              headerpadding={{ md: '20px 24px 20px 24px;' }}
              headerborderradius="0px"
              title={
                <>
                  Sign up activities{' '}
                  <CountTag>
                    {checkValidCount(earnPointData?.sign_up_activities?.length)}{' '}
                    Activities
                  </CountTag>
                  <br />
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: 14,
                      color: '#6e809d',
                      letterSpacing: '-.01em',
                    }}
                  >
                    Customers can earn points for the following sign up
                    activities.
                  </div>
                </>
              }
            >
              {pageLoading ? (
                new Array(4).fill(null)?.map((_) => (
                  <>
                    <RowItem>
                      <GlobalSkeleton />
                    </RowItem>
                  </>
                ))
              ) : earnPointData?.sign_up_activities?.length > 0 ? (
                earnPointData?.sign_up_activities?.map(
                  (item, index) =>
                    !getAccessRule(accessMap, item?.feature_key)?.isHidden && (
                      <RowItem
                        key={index}
                        // onClick={() =>
                        //   item?.hasOwnProperty('access')
                        //     ? item?.access === 'Yes'
                        //       ? item?.rule_exist !== 0 && openEdit(item)
                        //       : handleLockIconClick(item?.content)
                        //     : item?.rule_exist !== 0 && openEdit(item)
                        // }
                        onClick={() => {
                          if (
                            getAccessRule(accessMap, item?.feature_key)
                              ?.isRestricted
                          ) {
                            handleLockIconClick(
                              getAccessRule(accessMap, item?.feature_key)
                                ?.upgradeUrl
                            );
                          } else if (item?.rule_exist !== 0) {
                            openEdit(item);
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
                            <ActivitiesText>
                              {checkValidData(item.rule_name)}
                            </ActivitiesText>
                            {item?.rule_exist !== 0 && (
                              <PointsText>
                                Points:{' '}
                                {item.points.startsWith('[')
                                  ? checkValidCount(
                                      commasFormatter(JSON.parse(item.points))
                                    )
                                  : checkValidCount(
                                      parseFloat(item.points)?.toFixed(0)
                                    )}
                              </PointsText>
                            )}
                          </TitleWrap>
                        </Left>
                        <Right onClick={(e) => e.stopPropagation()}>
                          {item?.rule_exist !== 0 && (
                            <EditIcon onClick={() => openEdit(item)}>
                              <img
                                src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/edit_icon.svg`}
                                alt="edit-icon"
                              />
                            </EditIcon>
                          )}

                          <AitSwitch
                            checked={parseFloat(item.status) > 0}
                            onChange={(e) => {
                              if (
                                getAccessRule(accessMap, item?.feature_key)
                                  ?.isRestricted
                              ) {
                                handleLockIconClick(
                                  getAccessRule(accessMap, item?.feature_key)
                                    ?.upgradeUrl
                                );
                              } else if (item?.rule_exist === 0) {
                                openEdit(item);
                              } else {
                                upateActivitiesStatus(e, item?.activity_id);
                              }
                            }}
                            defaultChecked={parseFloat(item.status) > 0}
                          />
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

                          {getAccessRule(accessMap, item?.feature_key)
                            ?.isRestricted && (
                            <div
                              style={{
                                position: 'absolute',
                                right: '0px',
                                left: 'auto',
                              }}
                              onClick={() => {
                                if (
                                  getAccessRule(accessMap, item?.feature_key)
                                    ?.isRestricted
                                ) {
                                  handleLockIconClick(
                                    getAccessRule(accessMap, item?.feature_key)
                                      ?.upgradeUrl
                                  );
                                } else if (item?.rule_exist !== 0) {
                                  openEdit(item);
                                }
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  right: '10px',
                                  top: '-28px',
                                  display: 'flex',
                                }}
                              >
                                <LockRestrictedIcon />
                              </span>
                            </div>
                          )}
                        </Right>
                      </RowItem>
                    )
                )
              ) : (
                <Empty
                  description={<Text>No activity found</Text>}
                  style={{ padding: '15px' }}
                />
              )}
            </AitCard>

            <AitCard
              bodypadding={{
                md: '0px 0px 0px 0px',
                xs: '0px 0px 0px 0px',
              }}
              headerpadding={{ md: '20px 24px 20px 24px;' }}
              headerborderradius="0px"
              title={
                <>
                  Online store{' '}
                  <CountTag>
                    {checkValidCount(earnPointData?.online_store?.length)}{' '}
                    Activities
                  </CountTag>
                  <br />
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: 14,
                      color: '#6e809d',
                      letterSpacing: '-.01em',
                    }}
                  >
                    Customers can earn points for the following store
                    activities.
                  </div>
                </>
              }
              margintop={'20px'}
            >
              {pageLoading ? (
                new Array(8).fill(null)?.map((_) => (
                  <>
                    <RowItem>
                      <GlobalSkeleton />
                    </RowItem>
                  </>
                ))
              ) : earnPointData?.online_store?.length > 0 ? (
                earnPointData?.online_store?.map(
                  (item, index) =>
                    !getAccessRule(accessMap, item?.feature_key)?.isHidden && (
                      <RowItem
                        key={index}
                        // onClick={() =>
                        //   item?.hasOwnProperty('access')
                        //     ? item?.access === 'Yes'
                        //       ? openEdit(item)
                        //       : handleLockIconClick(item?.content)
                        //     : openEdit(item)
                        // }
                        onClick={() => {
                          if (
                            getAccessRule(accessMap, item?.feature_key)
                              ?.isRestricted
                          ) {
                            handleLockIconClick(
                              getAccessRule(accessMap, item?.feature_key)
                                ?.upgradeUrl
                            );
                          } else if (item?.rule_exist !== 0) {
                            openEdit(item);
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
                            <ActivitiesText>
                              {checkValidData(item.rule_name)}
                            </ActivitiesText>
                            {parseFloat(item?.activity_id) !== 16 &&
                              item?.rule_exist !== 0 && (
                                <PointsText>
                                  {parseFloat(item?.activity_id) === 3 ||
                                  parseFloat(item?.activity_id) === 10
                                    ? item?.referrer_reward_type === '2'
                                      ? `Discount`
                                      : item?.referrer_reward_type === '3'
                                        ? 'Free product'
                                        : item?.referrer_reward_type === '4'
                                          ? 'Free shipping'
                                          : 'Points'
                                    : 'Points'}{' '}
                                  {!['3', '4'].includes(
                                    item?.referrer_reward_type
                                  ) &&
                                    item?.points != null && (
                                      <span>
                                        :{' '}
                                        {checkValidCount(
                                          item?.referrer_reward_type === '2' &&
                                            item?.discount_type ===
                                              'percentage' ? (
                                            <span>
                                              {formatNumber(item.points)}%{' '}
                                            </span>
                                          ) : item?.discount_type === 'flat' ? (
                                            <span>
                                              {getCurrencyByMoneyFormat(
                                                jwtState?.login_auth
                                                  ?.money_format
                                              )}
                                              {formatNumber(item.points)}
                                            </span>
                                          ) : item?.referrer_reward_type ===
                                              '2' &&
                                            item?.discount_type ===
                                              getCurrencyByMoneyFormat(
                                                jwtState?.login_auth
                                                  ?.money_format
                                              ) ? (
                                            <span>
                                              {getCurrencyByMoneyFormat(
                                                jwtState?.login_auth
                                                  ?.money_format
                                              )}
                                              {formatNumber(item.points)}
                                            </span>
                                          ) : (
                                            formatNumber(item.points)
                                          )
                                        )}
                                      </span>
                                    )}
                                </PointsText>
                              )}
                          </TitleWrap>
                        </Left>
                        <Right onClick={(e) => e.stopPropagation()}>
                          {item?.rule_exist !== 0 && (
                            <EditIcon onClick={() => openEdit(item)}>
                              <img
                                src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/edit_icon.svg`}
                                alt="edit-icon"
                              />
                            </EditIcon>
                          )}

                          <AitSwitch
                            checked={parseFloat(item.status) > 0}
                            // onChange={(e) => {
                            //   if (item?.rule_exist === 0) {
                            //     openEdit(item);
                            //   } else {
                            //     upateActivitiesStatus(e, item?.activity_id);
                            //   }
                            // }}
                            onChange={(e) => {
                              if (
                                getAccessRule(accessMap, item?.feature_key)
                                  ?.isRestricted
                              ) {
                                handleLockIconClick(
                                  getAccessRule(accessMap, item?.feature_key)
                                    ?.upgradeUrl
                                );
                              } else if (item?.rule_exist === 0) {
                                openEdit(item);
                              } else {
                                upateActivitiesStatus(e, item?.activity_id);
                              }
                            }}
                            defaultChecked={parseFloat(item.status) > 0} // Sets the default checked status
                          />
                          {/* {item?.access === 'No' && item?.action === 'popup' && (
                        <div style={{ position: 'relative' }}>
                          <span
                            style={{
                              position: 'absolute',
                              right: '-3px',
                              top: '-36px',
                              display: 'flex',
                            }}
                          >
                            <LockRestrictedIcon />
                          </span>
                        </div>
                      )} */}
                          {getAccessRule(accessMap, item?.feature_key)
                            ?.isRestricted && (
                            <div
                              style={{
                                position: 'absolute',
                                right: '0px',
                                left: 'auto',
                              }}
                              onClick={() => {
                                if (
                                  getAccessRule(accessMap, item?.feature_key)
                                    ?.isRestricted
                                ) {
                                  handleLockIconClick(
                                    getAccessRule(accessMap, item?.feature_key)
                                      ?.upgradeUrl
                                  );
                                } else if (item?.rule_exist !== 0) {
                                  openEdit(item);
                                }
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  right: '10px',
                                  top: '-28px',
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
                    )
                )
              ) : (
                <Empty
                  description={<Text>No activity found</Text>}
                  style={{ padding: '15px' }}
                />
              )}
            </AitCard>

            <AitCard
              bodypadding={{
                md: '0px 0px 0px 0px',
                xs: '0px 0px 0px 0px',
              }}
              headerpadding={{ md: '20px 24px 20px 24px;' }}
              headerborderradius="0px"
              title={
                <>
                  Social engagements{' '}
                  <CountTag>
                    {checkValidCount(earnPointData?.social_engagements?.length)}{' '}
                    Activities
                  </CountTag>
                  <br />
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: 14,
                      color: '#6e809d',
                      letterSpacing: '-.01em',
                    }}
                  >
                    Customers can earn points for the following social media
                    activities.
                  </div>
                </>
              }
              margintop={'20px'}
            >
              {pageLoading ? (
                new Array(6).fill(null)?.map((_) => (
                  <>
                    <RowItem>
                      <GlobalSkeleton />
                    </RowItem>
                  </>
                ))
              ) : earnPointData?.social_engagements?.length > 0 ? (
                earnPointData?.social_engagements?.map(
                  (item, index) =>
                    !getAccessRule(accessMap, item?.feature_key)?.isHidden && (
                      <RowItem
                        key={index}
                        // onClick={() =>
                        //   item?.hasOwnProperty('access')
                        //     ? item?.access === 'Yes'
                        //       ? openEdit(item)
                        //       : handleLockIconClick(item?.content)
                        //     : openEdit(item)
                        // }
                        onClick={() => {
                          if (
                            getAccessRule(accessMap, item?.feature_key)
                              ?.isRestricted
                          ) {
                            handleLockIconClick(
                              getAccessRule(accessMap, item?.feature_key)
                                ?.upgradeUrl
                            );
                          } else if (item?.rule_exist !== 0) {
                            openEdit(item);
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
                            <ActivitiesText>
                              {checkValidData(item.rule_name)}
                            </ActivitiesText>
                            {item?.rule_exist !== 0 && (
                              <PointsText>
                                Points:{' '}
                                {item.points
                                  ? checkValidCount(
                                      parseFloat(item.points)?.toFixed(0)
                                    )
                                  : 0}
                              </PointsText>
                            )}
                          </TitleWrap>
                        </Left>
                        <Right onClick={(e) => e.stopPropagation()}>
                          {item?.rule_exist !== 0 && (
                            <EditIcon onClick={() => openEdit(item)}>
                              <img
                                src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/edit_icon.svg`}
                                alt="edit-icon"
                              />
                            </EditIcon>
                          )}
                          <AitSwitch
                            checked={parseFloat(item.status) > 0}
                            // onChange={(e) => {
                            //   if (item?.rule_exist === 0) {
                            //     openEdit(item);
                            //   } else {
                            //     upateActivitiesStatus(e, item?.activity_id);
                            //   }
                            // }}
                            onChange={(e) => {
                              if (
                                getAccessRule(accessMap, item?.feature_key)
                                  ?.isRestricted
                              ) {
                                handleLockIconClick(
                                  getAccessRule(accessMap, item?.feature_key)
                                    ?.upgradeUrl
                                );
                              } else if (item?.rule_exist === 0) {
                                openEdit(item);
                              } else {
                                upateActivitiesStatus(e, item?.activity_id);
                              }
                            }}
                            defaultChecked={parseFloat(item.status) > 0} // Sets the default checked status
                          />
                          {/* {item?.access === 'No' && item?.action === 'popup' && (
                        <div style={{ position: 'relative' }}>
                          <span
                            style={{
                              position: 'absolute',
                              right: '-3px',
                              top: '-36px',
                              display: 'flex',
                            }}
                          >
                            <LockRestrictedIcon />
                          </span>
                        </div>
                      )} */}
                          {getAccessRule(accessMap, item?.feature_key)
                            ?.isRestricted && (
                            <div
                              style={{
                                position: 'absolute',
                                right: '0px',
                                left: 'auto',
                              }}
                              onClick={() => {
                                if (
                                  getAccessRule(accessMap, item?.feature_key)
                                    ?.isRestricted
                                ) {
                                  handleLockIconClick(
                                    getAccessRule(accessMap, item?.feature_key)
                                      ?.upgradeUrl
                                  );
                                } else if (item?.rule_exist !== 0) {
                                  openEdit(item);
                                }
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  right: '10px',
                                  top: '-28px',
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
                    )
                )
              ) : (
                <Empty
                  description={<Text>No activity found</Text>}
                  style={{ padding: '15px' }}
                />
              )}
            </AitCard>
          </>
        </FullPageLoader>
      </>
      {/* </MainWrapper>
      </LayoutContainer> */}

      <AitModal
        modalBodyPosition={activitiesLoading && 'static'}
        maskClosable={false}
        open={isModalOpen}
        title={
          activityName === 'Celebrate birthday'
            ? 'Happy birthday'
            : activityName === 'Refer a friend'
              ? 'Refer a friend'
              : textFormatter(activityName)
        }
        handleModalClose={handleCancel}
        footer={null}
        centered
        width={
          activityId == '16'
            ? '450px'
            : activityId == '25'
              ? '600px'
              : activityId == '26'
                ? '600px'
                : activityId == '1'
                  ? '900px'
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
          {/* {formObj[activityId]} */}
          <div style={{ paddingTop: '15px' }}>{getComponent(activityId)}</div>
        </FullPageLoader>
      </AitModal>
    </>
  );
};

export default EarnPointsTemplate;
