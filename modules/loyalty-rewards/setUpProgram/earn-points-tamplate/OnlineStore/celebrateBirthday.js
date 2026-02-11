import AitButton from '@/components/atoms/ait-button/aitButton';
import { App, Col, Flex, Form, Input, Row, Select, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Label } from '../style';

import { ModalAlertIcon } from '../../../svg-icons';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductAndCollectionService,
  saveActivitiesService,
  updateActivitiesService,
} from '../../../api/earnPoints';
import {
  addEarnPointsListData,
  earnPointsData,
} from '../../../redux/earnPoints/earnPointsSlice';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { InfoCircleOutlined } from '@ant-design/icons';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import AitText from '@/components/atoms/ait-text/aitText';
import {
  convertToFormDataCustom,
  enterOnlyNumericValue,
  getCurrencyByMoneyFormat,
} from '@/utils/common.util';
import { debounce } from 'lodash';
import logger from '@/utils/logger';

const { Option } = Select;

function CelebrateBirthdayForm({
  setIsModalOpen,
  rowData,
  activityId,
  handleCancel,
  updateActivityData,
  setActivitiesLoading,
}) {
  const jwtState = useSelector((state) => state?.jwtState);
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const activitiesData = useSelector(earnPointsData);
  const [loading, setLoading] = useState(false);
  const [birthday_reward_type, setBirthday_reward_type] = useState('1');
  const [give_reward_on_birthday_type, setGive_reward_on_birthday_type] =
    useState('1');
  const [showAppliedToField, setShowAppliedToField] = useState('');
  const [setExpiry, setSetExpiry] = useState(false);
  const [showPOS, setShowPOSExpiry] = useState(true);
  const [searchApiData, setSearchApiData] = useState([]);
  const [searchApiLoading, setSearchApiLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const [birthDayPointMilter, setBirthDayPointMilter] = useState(false);
  const [callFirstTime, setCallFirstTime] = useState(true);
  const [searchProductData, setSearchProductData] = useState([]);
  const [rewardControlRulesState, setRewardControlRulesState] = useState({
    check_reward_for_accepts_marketing: false,
    check_reward_for_previous_discount_used: false,
  });

  const getProductAndCollectionData = async (searchQuery) => {
    if (searchQuery?.length < 3 && !callFirstTime) {
      setSearchApiData([]);
      setSearchProductData([]);
      return;
    }
    if (callFirstTime) {
      setActivitiesLoading(true);
    }
    setSearchApiLoading(true);
    try {
      const formData = new FormData();

      formData.append('all', false);

      const data = rowData?.birthday_applied_to_json
        ? JSON.parse(rowData?.birthday_applied_to_json)
        : [];

      const productId = rowData?.birthday_free_product_select
        ? rowData?.birthday_free_product_select
        : '';

      if (callFirstTime && data?.length > 0) {
        data.forEach((item) => {
          formData.append('selectedIds[]', item);
        });
      } else if (callFirstTime && productId) {
        formData.append('selectedIds[]', productId);
      } else {
        formData.append('searchTerm', searchQuery);
      }

      let response;
      if (
        showAppliedToField === 'COLLECTIONS' &&
        birthday_reward_type === '2'
      ) {
        response = await getProductAndCollectionService(
          formData,
          'getshopifycollections'
        );

        if (response?.status === 200) {
          let arr = response?.data?.collections?.edges?.map((item) => ({
            label: item?.node?.title,
            value: item?.node?.id,
          }));
          if (birthday_reward_type === '2') {
            setSearchApiData(arr);
          }
        }
      } else if (
        showAppliedToField === 'PRODUCTS' ||
        birthday_reward_type === '3'
      ) {
        response = await getProductAndCollectionService(
          formData,
          'getshopifyproducts'
        );

        if (response?.status === 200) {
          let arr = response?.data?.products?.edges?.map((item) => ({
            label: item?.node?.title,
            value: item?.node?.id,
          }));
          if (birthday_reward_type === '3') {
            setSearchProductData(arr);
          } else {
            setSearchApiData(arr);
          }
        }
      }
      setActivitiesLoading(false);
      setCallFirstTime(false);
    } catch (error) {
      logger(error?.response?.msg);
    } finally {
      setActivitiesLoading(false);
      setSearchApiLoading(false);
      setCallFirstTime(false);
    }
  };

  const debouncedSearch = debounce((searchQuery) => {
    getProductAndCollectionData(searchQuery);
  }, 500);

  const handleSearch = (val) => {
    setSearchValue(val.target.value?.length);
    if (val.target.value.trim()?.length >= 3) {
      setSearchApiLoading(true);
      debouncedSearch(val.target.value.trim());
    } else {
      setSearchApiData([]);
      setSearchProductData([]);
    }
  };

  const handleActivityUpdate = async (value) => {
    setLoading(true);
    const formData = new FormData();
    // formData.append('rule_id', activityId);
    // formData.append('points', value?.points);
    // formData.append('happy_birthday', value?.language);
    // formData.append('panel_msg', value?.panel_msg);
    // formData.append('display_notification', value?.display_notification);

    let obj = {
      points: value?.points || rowData?.points,
      rule_id: activityId,
      happy_birthday: value?.language,
      ...value,
    };

    const converted = Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        v === undefined || v === null
          ? ''
          : typeof v === 'boolean'
            ? Number(v)
            : v,
      ])
    );

    const payload = convertToFormDataCustom(converted);

    try {
      const response = rowData.hasOwnProperty('id')
        ? await updateActivitiesService(payload)
        : await saveActivitiesService(payload);
      if (response?.status === 'success') {
        let updatedFields = {
          points: value?.points || value?.birthday_discount_amount,
          happy_birthday: value?.happy_birthday,
          panel_msg: value?.panel_msg,
          display_notification: value?.display_notification,
          status: rowData.hasOwnProperty('id') ? rowData?.status : '1',
          referrer_reward_type: obj?.birthday_reward_type,
          discount_type:
            obj?.birthday_discount_amount_type ||
            rowData?.birthday_discount_amount_type,
        };
        const updated = updateActivityData(
          activitiesData,
          activityId,
          updatedFields
        );
        dispatch(addEarnPointsListData(updated));
        notification.success({
          message: 'Activity updated successfully',
        });
        setIsModalOpen(false);
      } else {
        notification.success({
          message: response?.msg,
        });
      }
    } catch (error) {
      logger(error);
      notification.error({
        message: error?.response?.msg,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      points: rowData.points || '',
      language: rowData.language || 'Happy Birthday',
      panel_msg:
        rowData?.panel_msg ||
        'Get {{points}} reward points on your next birthday.',
      display_notification:
        rowData?.display_notification ||
        'You earned {{points}} reward points on your birthday.',
      birthday_reward_type: rowData?.birthday_reward_type || '1',
      give_reward_on_birthday_type:
        parseFloat(rowData?.give_reward_on_birthday_type) > 0
          ? rowData?.give_reward_on_birthday_type
          : '1',
      birthday_alloted_on_day: rowData?.birthday_alloted_on_day || '',
      birthday_discount_amount: rowData?.birthday_discount_amount || '1',
      birthday_discount_amount_type:
        rowData?.birthday_discount_amount_type ||
        getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format),
      birthday_discount_min_spend: rowData?.birthday_discount_min_spend || '',
      birthday_set_expiry:
        parseFloat(rowData?.birthday_set_expiry) > 0 ? true : false,
      show_in_pos: parseFloat(rowData?.show_in_pos) > 0 ? true : false,
      birthday_coupon_expiry_days: rowData?.birthday_coupon_expiry_days || '1',
      birthday_point_multiplier:
        parseFloat(rowData?.birthday_point_multiplier) > 0 ? true : false,
      birthday_point_multiply_with:
        rowData?.birthday_point_multiply_with || '1',
      birthday_applied_to: rowData?.birthday_applied_to || undefined,
      birthday_applied_to_json: rowData?.birthday_applied_to_json
        ? JSON.parse(rowData?.birthday_applied_to_json)
        : [],
      birthday_free_product_select:
        rowData?.birthday_reward_type === '3'
          ? rowData?.birthday_free_product_select
          : undefined,
      reward_discount_email_marketing:
        parseFloat(rowData?.reward_discount_email_marketing) > 0 ? true : false,
      reward_discount_previous_order:
        parseFloat(rowData?.reward_discount_previous_order) > 0 ? true : false,

      check_reward_for_accepts_marketing:
        parseFloat(rowData?.check_reward_for_accepts_marketing) > 0
          ? true
          : false,
      check_reward_for_previous_discount_used:
        parseFloat(rowData?.check_reward_for_previous_discount_used) > 0
          ? true
          : false,
    });
    setBirthday_reward_type(rowData?.birthday_reward_type || '1');
    setGive_reward_on_birthday_type(
      parseFloat(rowData?.give_reward_on_birthday_type) > 0
        ? rowData?.give_reward_on_birthday_type
        : '1'
    );
    setShowPOSExpiry(parseFloat(rowData?.show_in_pos) > 0 ? true : false);
    setSetExpiry(parseFloat(rowData?.birthday_set_expiry) > 0 ? true : false);
    setBirthDayPointMilter(
      parseFloat(rowData?.birthday_point_multiplier) > 0 ? true : false
    );
    setShowAppliedToField(
      rowData?.birthday_applied_to
        ? rowData?.birthday_applied_to
        : rowData?.birthday_reward_type === '3'
          ? 'PRODUCTS'
          : ''
    );
  }, [rowData]);

  useEffect(() => {
    const data = rowData?.birthday_applied_to_json
      ? JSON.parse(rowData?.birthday_applied_to_json)
      : rowData?.birthday_free_product_select
        ? rowData?.birthday_free_product_select
        : [];

    if (callFirstTime && showAppliedToField && data?.length > 0) {
      setActivitiesLoading(true);
      setTimeout(() => {
        getProductAndCollectionData();
      }, 100);
      setCallFirstTime(false);
    }
  }, [showAppliedToField]);

  return (
    <>
      <AitAlert
        type="warning"
        justify="start"
        //hascustomicon={false}
        barfontsize="13"
        barpadding="8px 10px"
        alignicon="start"
        textAlign="left"
        icontopspacing="2"
        border
        borderradius
        showIcon
        color="var(--ant-color-text-default)"
        message="You can change text in different languages."
        style={{ marginBottom: 24 }}
      />
      <Form form={form} layout="vertical" onFinish={handleActivityUpdate}>
        <Row gutter={[24]}>
          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="birthday_reward_type"
              label="Reward type"
              tooltipText="Choose how customers will be rewarded on their birthday."
            >
              <AitSelectBox
                allowClear={false}
                showSearch={false}
                placeholder="Select"
                value={birthday_reward_type}
                // value="1"
                onChange={(value) => {
                  setBirthday_reward_type(value);
                  if (value === '2' && rowData?.birthday_reward_type !== '2') {
                    setSearchApiData([]);
                    setSelectedValues(undefined);
                    setShowAppliedToField(undefined);
                    //   setShowAppliedToField('PRODUCTS');
                  }
                }}
                options={[
                  {
                    label: 'Points',
                    value: '1',
                  },
                  {
                    label: 'Discount code',
                    value: '2',
                  },
                  {
                    label: 'Free product',
                    value: '3',
                  },
                  {
                    label: 'Free shipping',
                    value: '4',
                  },
                ]}
              />
            </Form.Item>
          </Col>

          {birthday_reward_type === '1' && (
            <>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name="points"
                  rules={[
                    { required: true, message: 'Please enter points awarded' },
                    {
                      validator: (_, value) => {
                        if (value === undefined || value === '') {
                          return Promise.resolve();
                        }
                        if (isNaN(value) || Number(value) <= 0) {
                          return Promise.reject(
                            'Points must be greater than 0'
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  label="Points awarded"
                >
                  <AitInputBox placeholder="100" />
                </Form.Item>
              </Col>
            </>
          )}

          {birthday_reward_type === '2' && (
            <>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name="birthday_discount_amount"
                  // rules={[{ required: true }]}
                  label="Discount value"
                  rules={[
                    { required: true, message: 'Please enter discount value' },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(
                            'Discount value must be an integer'
                          );
                        }

                        if (Number(value) <= 0) {
                          return Promise.reject(
                            'Discount value must be greater than 0'
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <AitInputBox
                    onKeyPress={enterOnlyNumericValue}
                    placeholder="1"
                    addonAfter={
                      <Form.Item name="birthday_discount_amount_type" noStyle>
                        <Select style={{ width: 70, height: 39 }}>
                          <Option value="flat">
                            {getCurrencyByMoneyFormat(
                              jwtState?.login_auth?.money_format
                            )}
                          </Option>
                          <Option value="percentage">%</Option>
                        </Select>
                      </Form.Item>
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Minimum purchase amount"
                  name="birthday_discount_min_spend"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(
                            'Minimum purchase amount must be an integer'
                          );
                        }

                        if (Number(value) <= 0) {
                          return Promise.reject(
                            'Minimum purchase amount must be greater than 0'
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <AitInputBox
                    onKeyPress={enterOnlyNumericValue}
                    placeholder="50"
                    addonBefore={getCurrencyByMoneyFormat(
                      jwtState?.login_auth?.money_format
                    )}
                    style={{ width: '100%', height: 39 }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Flex justify="space-between">
                  <Form.Item
                    label="Set expiry"
                    name="birthday_coupon_expiry_days"
                    rules={[
                      { required: true, message: 'Please enter set expiry ' },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();

                          if (!/^\d+$/.test(value)) {
                            return Promise.reject(
                              'Set expiry must be an integer'
                            );
                          }

                          if (Number(value) <= 0) {
                            return Promise.reject(
                              'Set expiry must be greater than 0'
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <AitInputBox
                      onKeyPress={enterOnlyNumericValue}
                      addonAfter="Days"
                      disabled={!setExpiry}
                      placeholder="1"
                    />
                  </Form.Item>
                  <Form.Item
                    name="birthday_set_expiry"
                    valuePropName="checked"
                    noStyle
                  >
                    <AitSwitch
                      onChange={(checked) => setSetExpiry(checked)}
                      style={{ alignSelf: 'flex-start' }}
                      checked={setExpiry}
                    />
                  </Form.Item>
                </Flex>
              </Col>
              <>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Label>Reward control rules:</Label>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    name="check_reward_for_accepts_marketing"
                    valuePropName="checked"
                  >
                    <AitSwitch
                      label
                      justify="space-between"
                      helpertext="Reward discount only for customers subscribed for email marketing on your store"
                      fontweight={400}
                      onChange={(checked) =>
                        setRewardControlRulesState((prev) => ({
                          ...prev,
                          check_reward_for_accepts_marketing: checked,
                        }))
                      }
                      checked={
                        rewardControlRulesState?.check_reward_for_accepts_marketing
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    name="check_reward_for_previous_discount_used"
                    valuePropName="checked"
                  >
                    <AitSwitch
                      label
                      justify="space-between"
                      helpertext="Reward discount only for customers with at least one previous order without discount"
                      fontweight={400}
                      onChange={(checked) =>
                        setRewardControlRulesState((prev) => ({
                          ...prev,
                          check_reward_for_previous_discount_used: checked,
                        }))
                      }
                      checked={
                        rewardControlRulesState?.check_reward_for_previous_discount_used
                      }
                    />
                  </Form.Item>
                </Col>
              </>
            </>
          )}

          {(birthday_reward_type === '3' || birthday_reward_type === '4') && (
            <>
              {birthday_reward_type === '3' && (
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    label="Select free product"
                    // label={
                    //   showAppliedToField === 'COLLECTIONS'
                    //     ? 'Select collections'
                    //     : 'Select products'
                    // }
                    name="birthday_free_product_select"
                    rules={[
                      {
                        required: true,
                        message: 'Select at least one product',
                      },
                    ]}
                  >
                    <AitSelectBox
                      // label="Select free products"
                      // name="birthday_free_product_select"
                      // mode="multiple"
                      placeholder="Search product by title"
                      onKeyUp={(e) => {
                        setCallFirstTime(false);
                        handleSearch(e);
                      }}
                      showSearch
                      allowClear={false}
                      filterOption={false}
                      value={selectedValues}
                      onChange={(value) => setSelectedValues(value)}
                      notFoundContent={
                        searchApiLoading ? (
                          <AitText>Loading... </AitText>
                        ) : !searchProductData?.length > 0 &&
                          (searchValue === 3 || searchValue > 3) ? (
                          <AitText>No result found</AitText>
                        ) : (
                          <AitText>
                            Please enter{' '}
                            {searchValue > 3 ? '0' : 3 - searchValue || 3} or
                            more characters
                          </AitText>
                        )
                      }
                      options={searchProductData}
                    />
                  </Form.Item>
                </Col>
              )}

              <Col xs={24} sm={12} md={12} lg={12}>
                <Flex justify="space-between">
                  <Form.Item
                    label="Set expiry"
                    name="birthday_coupon_expiry_days"
                    rules={[
                      { required: true, message: 'Please enter set expiry ' },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();

                          if (!/^\d+$/.test(value)) {
                            return Promise.reject(
                              'Set expiry must be an integer'
                            );
                          }

                          if (Number(value) <= 0) {
                            return Promise.reject(
                              'Set expiry must be greater than 0'
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <AitInputBox
                      onKeyPress={enterOnlyNumericValue}
                      addonAfter="Days"
                      disabled={!setExpiry}
                      placeholder="1"
                    />
                  </Form.Item>
                  <Form.Item
                    name="birthday_set_expiry"
                    valuePropName="checked"
                    noStyle
                  >
                    <AitSwitch
                      onChange={(checked) => setSetExpiry(checked)}
                      style={{ alignSelf: 'flex-start' }}
                      checked={setExpiry}
                    />
                  </Form.Item>
                </Flex>
              </Col>
            </>
          )}

          <>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Flex justify="space-between">
                <Form.Item
                  label={
                    <>
                      Birthday points multiplier
                      <Tooltip
                        placement="top"
                        title="The multiplier will be applied only to the points earned from the “Make a purchase” activity on the customer’s birthday."
                      >
                        <InfoCircleOutlined
                          style={{
                            marginLeft: '5px',
                            position: 'relative',
                          }}
                        />
                      </Tooltip>
                    </>
                  }
                  name="birthday_point_multiply_with"
                  // rules={[
                  //   {
                  //     required: setExpiry ? true : false,
                  //     message: 'Please enter expiry days',
                  //   },
                  // ]}
                >
                  <AitInputBox
                    onKeyPress={enterOnlyNumericValue}
                    addonAfter="Points"
                    disabled={!birthDayPointMilter}
                    placeholder="1"
                  />
                </Form.Item>
                <Form.Item
                  name="birthday_point_multiplier"
                  valuePropName="checked"
                  noStyle
                >
                  <AitSwitch
                    onChange={(checked) => setBirthDayPointMilter(checked)}
                    style={{ alignSelf: 'flex-start' }}
                    checked={birthDayPointMilter}
                  />
                </Form.Item>
              </Flex>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item name="give_reward_on_birthday_type">
                <AitSelectBox
                  name="give_reward_on_birthday_type"
                  label="Allot birthday reward on"
                  labelIcon={<InfoCircleOutlined />}
                  tooltipText="Choose when customers will be rewarded on their birthday."
                  placeholder="Select"
                  value={give_reward_on_birthday_type}
                  onChange={(value) => {
                    setGive_reward_on_birthday_type(value);
                  }}
                  showSearch={false}
                  options={[
                    {
                      label: 'On birthday date',
                      value: '1',
                    },
                    {
                      label: 'First day of birthday month',
                      value: '2',
                    },
                    {
                      label: 'Before birthday days',
                      value: '3',
                    },
                  ]}
                />
              </Form.Item>
            </Col>

            {(birthday_reward_type === '2' || birthday_reward_type === '3') && (
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item name="show_in_pos">
                  <AitSwitch
                    justify="space-between"
                    label="Show in POS"
                    name="show_in_pos"
                    lableTooltip="Enabling this setting makes the reward visible in Shopify POS."
                    onChange={(checked) => setShowPOSExpiry(checked)}
                    checked={showPOS}
                  />
                </Form.Item>
              </Col>
            )}
          </>
          {give_reward_on_birthday_type === '3' && (
            <>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name="birthday_alloted_on_day"
                  label="Before birthday (in days)"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(
                            'Before birthday days must be an integer'
                          );
                        }

                        if (Number(value) <= 0) {
                          return Promise.reject(
                            'Before birthday days must be greater than 0'
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <AitInputBox placeholder="Enter number of days" />
                </Form.Item>
              </Col>
              {/* {birthday_reward_type === '2' && (
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item name="show_in_pos">
                    <AitSwitch
                      justify="space-between"
                      label="Show in POS"
                      name="show_in_pos"
                      lableTooltip="Enabling this setting makes the reward visible in Shopify POS."
                      onChange={(checked) => setShowPOSExpiry(checked)}
                      checked={showPOS}
                    />
                  </Form.Item>
                </Col>
              )} */}
            </>
          )}
          {(birthday_reward_type === '3' || birthday_reward_type === '4') && (
            <>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Label>Reward control rules:</Label>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name="check_reward_for_accepts_marketing"
                  valuePropName="checked"
                >
                  <AitSwitch
                    justify="space-between"
                    label="Reward discount only for customers subscribed for email marketing on your store"
                    fontweight={400}
                    onChange={(checked) =>
                      setRewardControlRulesState((prev) => ({
                        ...prev,
                        check_reward_for_accepts_marketing: checked,
                      }))
                    }
                    checked={
                      rewardControlRulesState?.check_reward_for_accepts_marketing
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name="check_reward_for_previous_discount_used"
                  valuePropName="checked"
                >
                  <AitSwitch
                    justify="space-between"
                    label="Reward discount only for customers with at least one previous order without discount"
                    fontweight={400}
                    onChange={(checked) =>
                      setRewardControlRulesState((prev) => ({
                        ...prev,
                        check_reward_for_previous_discount_used: checked,
                      }))
                    }
                    checked={
                      rewardControlRulesState?.check_reward_for_previous_discount_used
                    }
                  />
                </Form.Item>
              </Col>
            </>
          )}
          {birthday_reward_type === '4' && (
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item name="show_in_pos">
                <AitSwitch
                  justify="space-between"
                  label="Show in POS"
                  name="show_in_pos"
                  lableTooltip="Enabling this setting makes the reward visible in Shopify POS."
                  onChange={(checked) => setShowPOSExpiry(checked)}
                  checked={showPOS}
                />
              </Form.Item>
            </Col>
          )}

          {birthday_reward_type === '2' && (
            <>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Label style={{ marginBottom: '10px' }}>Applied to</Label>

                <Form.Item
                  style={{
                    marginBottom: `${
                      showAppliedToField !== 'SELECT' &&
                      showAppliedToField !== undefined &&
                      showAppliedToField !== '' &&
                      showAppliedToField !== null &&
                      '10px'
                    }`,
                  }}
                  name="birthday_applied_to"
                >
                  <AitSelectBox
                    showSearch={false}
                    placeholder="Select"
                    onChange={(value) => {
                      setCallFirstTime(false);
                      setSelectedValues([]);
                      setSearchApiData([]);
                      setShowAppliedToField(value);

                      form.setFieldsValue({
                        birthday_applied_to_json: [],
                      });

                      form.validateFields(['birthday_applied_to_json']);
                    }}
                    options={[
                      {
                        label: 'Specific collections(s)',
                        value: 'COLLECTIONS',
                      },
                      {
                        label: 'Specific products(s)',
                        value: 'PRODUCTS',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              {showAppliedToField !== 'SELECT' &&
                showAppliedToField !== undefined &&
                showAppliedToField !== '' &&
                showAppliedToField !== null && (
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Form.Item
                      name="birthday_applied_to_json"
                      rules={[
                        {
                          validator: (_, value) => {
                            const appliedTo = form.getFieldValue(
                              'birthday_applied_to'
                            );

                            if (!value || value.length === 0) {
                              return Promise.reject(
                                new Error(
                                  appliedTo === 'COLLECTIONS'
                                    ? 'Select at least one collection'
                                    : 'Select at least one product'
                                )
                              );
                            }

                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <AitSelectBox
                        mode="multiple"
                        placeholder={
                          showAppliedToField === 'COLLECTIONS'
                            ? 'Search collections by title'
                            : 'Search product by title'
                        }
                        showSearch
                        filterOption={false}
                        onKeyUp={(e) => {
                          setCallFirstTime(false);
                          handleSearch(e);
                        }}
                        value={selectedValues}
                        onChange={(value) => setSelectedValues(value)}
                        notFoundContent={
                          searchApiLoading ? (
                            <AitText>Loading... </AitText>
                          ) : !searchApiData?.length > 0 &&
                            (searchValue === 3 || searchValue > 3) ? (
                            <AitText>No result found</AitText>
                          ) : (
                            <AitText>
                              Please enter{' '}
                              {searchValue > 3 ? '0' : 3 - searchValue || 3} or
                              more characters
                            </AitText>
                          )
                        }
                        options={searchApiData}
                      />
                    </Form.Item>
                  </Col>
                )}
            </>
          )}

          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item
              name="language"
              rules={[
                { required: true, message: 'Please enter campaign name' },
              ]}
            >
              <AitInputBox
                placeholder="Happy Birthday"
                labelIcon={<InfoCircleOutlined />}
                tooltipText="The name as it will appear on your store."
                required
                label="Campaign name"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item name="panel_msg">
              <AitInputBox
                rows={3}
                textArea
                placeholder="Get {{points}} reward points on your next birthday."
                label="Description"
                labelSubText="Your customers will see this description on your store."
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item name="display_notification">
              <AitInputBox
                rows={3}
                textArea
                placeholder="You earned {{points}} reward points on your birthday."
                label="Reward text"
                labelSubText="Your customers will see this when they receive points."
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 12]} justify={'center'}>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              type="primary"
              title="Update"
              htmlType="submit"
              disabled={loading}
              loading={loading}
              block
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              title="Cancel"
              variant="filled"
              color="default"
              onClick={handleCancel}
              disabled={loading}
              block
            />
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default CelebrateBirthdayForm;
