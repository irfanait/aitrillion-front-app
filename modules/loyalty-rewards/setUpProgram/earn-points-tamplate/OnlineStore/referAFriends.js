/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Switch,
  Collapse,
  Tabs,
  Button,
  Select,
  Divider,
  ColorPicker,
  Tooltip,
  Flex,
  App,
  Empty,
  ConfigProvider,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  ButtonImageWrapper,
  CustomButton,
  HelperText,
  Image,
  ImageWrapper,
  Label,
  StyledCol,
  StyledRow,
  StyledSelect,
} from '../style';
import {
  enterOnlyNumericValue,
  getCurrencyByMoneyFormat,
  validateImageFile,
} from '@/utils/common.util';
import AitUpload from '@/components/atoms/ait-upload';
import { ModalAlertIcon } from '../../../svg-icons';
import logger from '@/utils/logger';
import {
  addEarnPointsListData,
  earnPointsData,
} from '../../../redux/earnPoints/earnPointsSlice';
import {
  getProductAndCollectionService,
  saveActivitiesService,
  updateActivitiesService,
} from '../../../api/earnPoints';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitAutocomplete from '@/components/atoms/ait-autocomplete/aitAutocomplete';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import AitText from '@/components/atoms/ait-text/aitText';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitColorSwitch from '@/components/atoms/ait-color-switch/aitColorSwitch';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Option } = Select;

const ReferAFriendForm = ({
  setActivitiesLoading,
  setIsModalOpen,
  rowData,
  activityId,
  handleCancel,
  updateActivityData,
}) => {
  const jwtState = useSelector((state) => state?.jwtState);
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const activitiesData = useSelector(earnPointsData);
  const [loading, setLoading] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Refer Friends');
  const [displayButton, setDisplayButton] = useState(true);
  const [buttonColor, setButtonColor] = useState('1A73E8');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [position, setPosition] = useState('left');
  const [referrerRewardType, setReferrerRewardType] = useState('0');
  const [showAppliedToCollections, setShowAppliedToCollections] =
    useState(false);
  const [showAdditionalConditions, setShowAdditionalConditions] =
    useState(false);
  const [setExpiry, setSetExpiry] = useState(false);
  const [showPOS, setShowPOSExpiry] = useState(true);

  const [showAppliedToField, setShowAppliedToField] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  const [searchApiLoading, setSearchApiLoading] = useState(false);
  const [callFirstTime, setCallFirstTime] = useState(true);
  const [searchValue, setSearchValue] = useState();
  const [activeTab, setActiveTab] = useState('');
  const [popupInitalValue, setPopInitialValue] = useState();

  const colorOptions = ['#00C4FF', '#1E73BE', 'custom'];
  const textColorOptions = ['light', 'dark', 'custom'];

  const handleRewardTypeChange = (value) => {
    setReferrerRewardType(value);
  };

  // const handleAppliedToChange = (value) => {
  //   setShowAppliedToCollections(value === 'COLLECTIONS');
  // };

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

  const fieldNames = [
    'language',
    'panel_msg',
    'display_notification',
    'is_show_sepbutton',
    'rf_btn_text',
    'rf_btn_text_color',
    'rf_btn_bg_color',
    'sep_btn_position',
    'rf_poppup_heading',
    'rf_poppup_subheading',
    'rf_social_media_message',
    'rf_popup_image',
    'points',
    'approval_period',
    'min_spend',
    'referrer_discount_amount',
    'referrer_discount_min_spend',
    'refer_applied_to',
    'refer_applied_to_json',
    'refer_coupon_expiry_days',
    'refer_set_expiry',
    'color_picker_manual_background',
    'color_picker_manual_text',
  ];

  const getDynamicValues = (fields) => {
    let result = {};
    fields.forEach((field) => {
      result[field] = form.getFieldValue(field);
    });
    return result;
  };

  const onActivutyUpdate = async (values) => {
    setLoading(true);

    try {
      const dynamicValues = getDynamicValues(fieldNames);
      let obj = { ...values, ...dynamicValues };
      obj.rule_id = activityId;
      obj.refer_a_friend = obj?.language;
      obj.refer_set_expiry = values?.refer_set_expiry === true ? '1' : '0';
      obj.is_show_sepbutton = values?.is_show_sepbutton === true ? '1' : '0';
      obj.text_color = obj?.rf_btn_text_color;
      obj.rt_popup_image = obj.rf_popup_image;
      obj.reset_image = '0';
      obj.show_in_pos = values?.show_in_pos === true ? '1' : '0';
      obj.enable_for_all_ongoing_orders = '0';
      obj.points_after_first_order = '1';
      obj.code = '';
      obj.color_picker_manual_background =
        dynamicValues?.color_picker_manual_text?.toLowerCase();
      obj.color_picker_manual_text =
        dynamicValues?.color_picker_manual_text?.toLowerCase();
      obj.rf_btn_bg_color = buttonColor?.startsWith('#')
        ? buttonColor
        : `#${buttonColor}`;
      obj.rf_btn_text_color = textColor?.startsWith('#')
        ? textColor
        : `#${textColor}`;
      obj.referrer_discount_amount_type =
        obj?.referrer_discount_amount_type || '';
      obj.sep_btn_position = obj?.sep_btn_position || '';

      if (obj?.refer_applied_to === undefined) {
        obj.refer_applied_to = '';
      }

      if (obj?.rt_popup_image === null) {
        obj.reset_image = '1';
      }

      delete obj.language;

      const formData = convertToFormDataCustom(obj);
      const response = rowData.hasOwnProperty('id')
        ? await updateActivitiesService(formData)
        : await saveActivitiesService(formData);
      if (response?.status === 'success') {
        let updatedFields = {
          points:
            obj?.referrer_reward_type === '1'
              ? obj?.points
              : obj?.referrer_discount_amount,
          status: rowData.hasOwnProperty('id') ? rowData?.status : '1',
          referrer_reward_type: obj?.referrer_reward_type,
          discount_type:
            obj?.referrer_discount_amount_type ||
            rowData?.referrer_discount_amount_type,
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
        setLoading(false);
      } else {
        notification.success({
          message: response?.msg,
        });
      }
    } catch (error) {
      logger(error?.response?.msg);
      setLoading(false);
    }
    setLoading(false);
  };

  const getProductAndCollectionData = async (searchQuery) => {
    if (searchQuery?.length < 3 && !callFirstTime) {
      setSearchApiData([]);
      return;
    }
    if (callFirstTime) {
      setActivitiesLoading(true);
    }
    setSearchApiLoading(true);
    try {
      const formData = new FormData();

      formData.append('all', false);

      const data = rowData?.refer_applied_to_json
        ? JSON.parse(rowData?.refer_applied_to_json)
        : [];

      if (callFirstTime && data?.length > 0) {
        data.forEach((item) => {
          formData.append('selectedIds[]', item);
        });
      } else {
        formData.append('searchTerm', searchQuery);
      }

      let response;
      if (showAppliedToField === 'COLLECTIONS') {
        response = await getProductAndCollectionService(
          formData,
          'getshopifycollections'
        );

        if (response?.status === 200) {
          let arr = response?.data?.collections?.edges?.map((item) => ({
            label: item?.node?.title,
            value: item?.node?.id,
          }));
          setSearchApiData(arr);
        }
      } else if (showAppliedToField === 'PRODUCTS') {
        response = await getProductAndCollectionService(
          formData,
          'getshopifyproducts'
        );

        if (response?.status === 200) {
          let arr = response?.data?.products?.edges?.map((item) => ({
            label: item?.node?.title,
            value: item?.node?.id,
          }));
          setSearchApiData(arr);
        }
      }
      setActivitiesLoading(false);
    } catch (error) {
      logger(error?.response?.msg);
    } finally {
      setActivitiesLoading(false);
      setSearchApiLoading(false);
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
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      referrer_reward_type: rowData?.referrer_reward_type || '1',
      points: rowData?.points || '',
      approval_period: rowData?.approval_period || '',
      min_spend: rowData?.min_spend || '',
      discount_amount: rowData?.discount_amount || '1',
      discount_amount_type: rowData?.discount_amount_type || 'flat',
      discount_min_spend: rowData?.discount_min_spend || '',
      language: rowData?.language || 'Refer a friend',
      panel_msg:
        rowData?.panel_msg ||
        'Earn {{points}} reward points for referring a friend',
      display_notification:
        rowData?.display_notification ||
        'You earned {{points}} reward points for referring a friend',
      is_show_sepbutton:
        parseFloat(rowData?.is_show_sepbutton) > 0 ? true : false,
      rf_btn_text: rowData?.rf_btn_text || 'Refer Friends',
      rf_btn_text_color: rowData?.rf_btn_text_color || '',
      rf_btn_bg_color: rowData?.rf_btn_bg_color || '',
      sep_btn_position: rowData?.sep_btn_position || 'left',
      rf_poppup_heading:
        rowData?.rf_poppup_heading || 'Give a friend {friend_offer_value} off',
      rf_poppup_subheading:
        rowData?.rf_poppup_subheading ||
        'On their first purchase and earn {earn_points} points if they spend over',
      rf_social_media_message:
        rowData?.rf_social_media_message ||
        "I wanted to share my referral URL with you - {shared_url}. I think you'd like the website and its product. When you will click here you will get coupon for the purchase.",
      rf_popup_image: rowData?.rf_popup_image || '',
      referrer_discount_amount: rowData?.referrer_discount_amount || '',
      referrer_discount_min_spend:
        parseFloat(rowData?.referrer_discount_min_spend) > 0
          ? rowData?.referrer_discount_min_spend
          : '',
      refer_applied_to: rowData?.refer_applied_to || undefined,
      refer_applied_to_json: rowData?.refer_applied_to_json
        ? JSON.parse(rowData?.refer_applied_to_json)
        : [],
      refer_set_expiry:
        parseFloat(rowData?.refer_set_expiry) > 0 ? true : false,
      refer_coupon_expiry_days: rowData?.refer_coupon_expiry_days || '1',
      referrer_discount_amount_type:
        rowData?.referrer_discount_amount_type || 'flat',
      show_in_pos: parseFloat(rowData?.show_in_pos) > 0 ? true : false,
      color_picker_manual_background:
        rowData?.color_picker_manual_background || '#DDE8EE',
      color_picker_manual_text: rowData?.color_picker_manual_text || '#DDE8EE',
    });
    setDisplayButton(parseFloat(rowData?.is_show_sepbutton) > 0 ? true : false);
    setButtonTitle(rowData?.rf_btn_text || 'Refer Friends');
    setPosition(rowData?.sep_btn_position || 'left');
    setReferrerRewardType(rowData?.referrer_reward_type || '1');
    setSetExpiry(parseFloat(rowData?.refer_set_expiry) > 0 ? true : false);
    setShowPOSExpiry(parseFloat(rowData?.show_in_pos) > 0 ? true : false);
    setShowAppliedToField(rowData?.refer_applied_to);
    setTextColor(
      rowData.rf_btn_text_color === undefined
        ? '#FFFFFF'
        : rowData.rf_btn_text_color?.startsWith('#')
          ? rowData.rf_btn_text_color
          : `#${rowData.rf_btn_text_color}`
    );
    setButtonColor(
      rowData.rf_btn_text_color === undefined
        ? '1A73E8'
        : rowData?.rf_btn_bg_color
          ? rowData?.rf_btn_bg_color?.startsWith('#')
            ? rowData?.rf_btn_bg_color
            : `#${rowData?.rf_btn_bg_color}`
          : '1A73E8'
    );
    setPopInitialValue(
      rowData?.rf_popup_image
        ? `${rowData?.popup_images_from_aws}${rowData?.rf_popup_image}`
        : `${process.env.NEXT_PUBLIC_IMAGE_S3_BASE_URL}/upload/popup_images/444185refer-friend-graphic.png`
    );
  }, [rowData]);

  useEffect(() => {
    const data = rowData?.refer_applied_to_json
      ? JSON.parse(rowData?.refer_applied_to_json)
      : [];
    if (callFirstTime && showAppliedToField && data?.length > 0) {
      setActivitiesLoading(true);
      getProductAndCollectionData();
      setCallFirstTime(false);
    }
  }, [showAppliedToField]);

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onActivutyUpdate}>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12}>
            {/* <Label></Label> */}
            <Form.Item
              label="Select reward type"
              name="referrer_reward_type"
              rules={[
                { required: true, message: 'Please select a reward type' },
              ]}
            >
              <StyledSelect
                width="100%"
                style={{ height: 39 }}
                placeholder="Select reward type"
                onChange={handleRewardTypeChange}
              >
                {/* <Option value="0">Select reward type</Option> */}
                <Option value="1">Loyalty points</Option>
                <Option value="2">Discount code</Option>
              </StyledSelect>
            </Form.Item>
          </Col>
          {referrerRewardType === '1' && (
            <>
              <Col xs={24} sm={12} md={12} lg={12}>
                {/* <Label>Points awarded </Label> */}
                <Form.Item
                  label="Points awarded"
                  name="points"
                  rules={[
                    { required: true, message: 'Please enter points' },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        if (Number(value) <= 0) {
                          return Promise.reject(
                            'Points must be greater than 0'
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <AitInputBox
                    placeholder="50"
                    onKeyPress={enterOnlyNumericValue}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>

              {/* <Button
                type="link"
                onClick={() =>
                  setShowAdditionalConditions(!showAdditionalConditions)
                }
              >
                {showAdditionalConditions
                  ? 'Hide conditions'
                  : 'Additional conditions'}
              </Button> */}
            </>
          )}
          {referrerRewardType === '2' && (
            <Col xs={24} md={12}>
              {/* <Label>Discount value </Label> */}
              <Form.Item
                label="Discount value"
                name="referrer_discount_amount"
                rules={[
                  {
                    required: true,
                    message: 'Please enter discount value ',
                  },
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
                    <Form.Item name="referrer_discount_amount_type" noStyle>
                      <Select style={{ width: 70, height: 39 }}>
                        <Option value="flat">
                          {' '}
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
          )}
        </Row>
        {/* ---------------- Points Section ---------------- */}

        <>
          {referrerRewardType === '1' && (
            <>
              <Row gutter={24}>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Label>
                    {' '}
                    <span>
                      Approval period&nbsp;
                      <Tooltip title='The points will appear as "pending" to the customers during approval period.'>
                        <InfoCircleOutlined
                          style={{
                            marginLeft: '1px',
                            position: 'relative',
                          }}
                        />
                      </Tooltip>
                    </span>
                  </Label>
                  <Form.Item
                    name="approval_period"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please enter approval period',
                    //   },
                    // ]}
                  >
                    <AitInputBox
                      placeholder="Enter approval period"
                      onKeyUp={enterOnlyNumericValue}
                      addonAfter="days"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Label> Minimum spend</Label>
                  <Form.Item
                    name="min_spend"
                    // rules={[
                    //   { required: true, message: 'Please enter minimum spend' },
                    // ]}
                  >
                    <AitInputBox
                      onKeyPress={enterOnlyNumericValue}
                      placeholder="Enter minimum spend"
                      prefix={getCurrencyByMoneyFormat(
                        jwtState?.login_auth?.money_format
                      )}
                      style={{ width: '100%', height: 39 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </>

        {/* ---------------- Discount Section ---------------- */}
        {referrerRewardType === '2' && (
          <>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="referrer_discount_min_spend"
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Please enter minimum purchase amount',
                    // },
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
                    label="Minimum purchase amount"
                    onKeyPress={enterOnlyNumericValue}
                    placeholder="50"
                    prefix={getCurrencyByMoneyFormat(
                      jwtState?.login_auth?.money_format
                    )}
                    style={{ width: '100%', height: 39 }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Flex justify="space-between">
                  <Form.Item
                    name="refer_coupon_expiry_days"
                    // rules={[
                    //   {
                    //     required: setExpiry ? true : false,
                    //     message: 'Please enter expiry days',
                    //   },
                    // ]}
                  >
                    <AitInputBox
                      label="Set expiry"
                      onKeyPress={enterOnlyNumericValue}
                      addonAfter="Days"
                      disabled={!setExpiry}
                      placeholder="1"
                    />
                  </Form.Item>
                  <Form.Item
                    name="refer_set_expiry"
                    valuePropName="checked"
                    noStyle
                  >
                    <AitSwitch
                      onChange={(checked) => setSetExpiry(checked)}
                      style={{ alignSelf: 'flex-start' }}
                    />
                  </Form.Item>
                </Flex>

                <Form.Item
                  label="Show in POS"
                  name="show_in_pos"
                  style={{ display: 'none' }}
                >
                  <AitSwitch
                    onChange={(checked) => setShowPOSExpiry(checked)}
                    checked={showPOS}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} style={{ marginBottom: 24 }}>
                <Label>Applied to </Label>
                <Form.Item name="refer_applied_to" style={{ marginBottom: 0 }}>
                  <StyledSelect
                    width="100%"
                    style={{ height: 39 }}
                    placeholder="Select"
                    allowClear
                    onChange={(e) => {
                      // setSearchApiData([]);
                      // setSelectedValues([]);
                      // form.setFieldsValue({
                      //   refer_applied_to_json: [],
                      // });
                      // setShowAppliedToField(e);
                      setCallFirstTime(false);
                      setSelectedValues([]);
                      setSearchApiData([]);
                      setShowAppliedToField(e);
                      form.setFieldsValue({
                        refer_applied_to_json: [], // Clear the specific field
                      });
                      form.validateFields(['refer_applied_to_json']);
                    }}
                  >
                    <Option value="COLLECTIONS">Specific Collections</Option>
                    <Option value="PRODUCTS">Specific Products</Option>
                  </StyledSelect>
                </Form.Item>
                {showAppliedToField !== '' &&
                  showAppliedToField !== undefined &&
                  showAppliedToField !== null && (
                    <Form.Item
                      name="refer_applied_to_json"
                      rules={[
                        {
                          validator: (_, value) => {
                            const appliedTo =
                              form.getFieldValue('refer_applied_to');

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
                      style={{ marginTop: 10, marginBottom: 0 }}
                    >
                      <AitSelectBox
                        mode="multiple"
                        placeholder={
                          showAppliedToField === 'COLLECTIONS'
                            ? 'Search collections by title'
                            : 'Search product by title'
                        }
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
                  )}
              </Col>
            </Row>
          </>
        )}
        <Divider style={{ borderColor: '#E4EDF4', marginTop: 0 }} />
        <AitText size={16} type="primary" strong bottommargin={16}>
          Referred friend reward
        </AitText>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Discount value"
              name="discount_amount"
              validateTrigger={['onChange', 'onSubmit']}
              rules={[
                { required: true, message: 'Please enter discount value' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();

                    if (!/^\d+$/.test(value)) {
                      return Promise.reject(
                        new Error('Discount value must be an integer')
                      );
                    }

                    if (Number(value) <= 0) {
                      return Promise.reject(
                        new Error('Discount value must be greater than 0')
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <AitInputBox
                onKeyPress={enterOnlyNumericValue}
                placeholder="Enter discount value"
                addonAfter={
                  <Form.Item name="discount_amount_type" noStyle>
                    <Select style={{ width: 70 }}>
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
              name="discount_min_spend"
              // rules={[
              //   {
              //     required: true,
              //     message: 'Please enter minimum purchase amount',
              //   },
              // ]}
            >
              <AitInputBox
                label="Minimum purchase amount"
                placeholder="50"
                style={{ width: '100%' }}
                addonAfter={getCurrencyByMoneyFormat(
                  jwtState?.login_auth?.money_format
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Display Settings */}
        <Row gutter={[48, 12]}>
          <AitCollapse
            accordion
            bodyBorderTop="none"
            style={{ width: '100%' }}
            itemSpacing="0px"
            firstItemTopspacing="0px"
            panels={[
              {
                key: '1',
                title: 'Display settings',
                children: (
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
                    <Row gutter={24}>
                      <Col xs={24} md={24}>
                        <Form.Item
                          label="Campaign name"
                          name="language"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter campaign name',
                            },
                          ]}
                        >
                          <AitInputBox
                            labelSubText="The name as it will appear on your store."
                            placeholder="Refer a friend"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col xs={24} md={12}>
                        <Form.Item name="panel_msg">
                          <AitInputBox
                            textArea
                            label="Description"
                            labelSubText="Your customers will see this description on your store."
                            placeholder="Earn {{points}} reward points for referring a friend."
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="display_notification">
                          <AitInputBox
                            textArea
                            label="Reward text"
                            labelSubText="Your customers will see this when they receive points."
                            placeholder="You earned {{points}} reward for referring a friend."
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ),
              },
              {
                key: '2',
                title: 'Appearance settings',
                children: (
                  <ConfigProvider
                    theme={{
                      components: {
                        Tabs: {
                          horizontalItemPadding: '8px 30px', // this works
                        },
                      },
                    }}
                  >
                    <Tabs defaultActiveKey="3">
                      <TabPane tab="Button" key="3">
                        <Row gutter={24}>
                          {/* Left Section */}
                          <Col xs={24} md={10}>
                            <Label>
                              Display the refer a friend button on store
                            </Label>
                            <Form.Item name="is_show_sepbutton">
                              <AitSwitch
                                checked={displayButton}
                                onChange={(val) => setDisplayButton(val)}
                              />
                            </Form.Item>

                            <Form.Item
                              label="Title"
                              name="rf_btn_text"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter title',
                                },
                              ]}
                            >
                              <AitInputBox
                                placeholder="Refer Friends"
                                value={buttonTitle}
                                onChange={(e) => setButtonTitle(e.target.value)}
                              />
                            </Form.Item>

                            {/* Button Color */}
                            <Label>Color</Label>
                            <Form.Item name="rf_btn_text_color">
                              <AitColorSwitch
                                round={true}
                                // defaultValue="15C0F5"
                                defaultValue={
                                  buttonColor?.startsWith('#')
                                    ? buttonColor?.replace('#', '')
                                    : `#${buttonColor}`
                                }
                                onChange={(e) => {
                                  setButtonColor(e);
                                }}
                                colorOptions={[
                                  { value: '15C0F5', label: 'Lightblue' },
                                  { value: '1A73E8', label: 'darkblue' },
                                ]}
                              />
                            </Form.Item>

                            <Label>Text color</Label>
                            <Form.Item name="rf_btn_bg_color">
                              <AitColorSwitch
                                // defaultValue="FFFFFF"
                                // defaultValue={textColor}
                                defaultValue={
                                  textColor?.startsWith('#')
                                    ? textColor?.replace('#', '')
                                    : `#${textColor}`
                                }
                                onChange={(e) => setTextColor(e)}
                                colorOptions={[
                                  { value: 'FFFFFF', label: 'Light' },
                                  { value: '000000', label: 'Dark' },
                                ]}
                              />
                            </Form.Item>

                            <StyledRow gutter={0}>
                              {/* Left Column - Position Select */}
                              <StyledCol span={24}>
                                <Label>Position</Label>
                                <Flex style={{ width: '100%' }} gap={10}>
                                  <Form.Item
                                    // label="Position"
                                    name="sep_btn_position"
                                    style={{ marginBottom: 0, width: '100%' }}
                                  >
                                    <AitSelectBox
                                      style={{ width: '100%' }}
                                      value={position}
                                      allowClear={false}
                                      showSearch={false}
                                      onChange={(value) => setPosition(value)}
                                      options={[
                                        { value: 'left', label: 'Left' },
                                        { value: 'right', label: 'Right' },
                                        {
                                          value: 'left-center',
                                          label: 'Left vertical',
                                        },
                                        {
                                          value: 'right-center',
                                          label: 'Right vertical',
                                        },
                                      ]}
                                    />
                                    {/* <Option value="left">Left</Option>
                                      <Option value="right">Right</Option>
                                      <Option value="left-vertical">
                                        Left Vertical
                                      </Option>
                                      <Option value="right-vertical">
                                        Right Vertical
                                      </Option>
                                    </AitSelectBox> */}
                                  </Form.Item>
                                  {/* Right Column - Image */}

                                  <Image
                                    src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/${
                                      position === 'right'
                                        ? 'right'
                                        : position === 'left'
                                          ? 'left'
                                          : position === 'left-center'
                                            ? 'Left-Vertical'
                                            : position === 'right-center'
                                              ? 'Right-Vertical'
                                              : ''
                                    }-position.png`}
                                    alt="image"
                                  />
                                </Flex>
                              </StyledCol>
                            </StyledRow>
                          </Col>
                          <Col xs={24} md={14}>
                            <ButtonImageWrapper>
                              <img
                                src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/refer_friend_preview.svg`}
                                alt="image"
                                style={{
                                  width: '100%',
                                  verticalAlign: 'middle',
                                  borderStyle: 'none',
                                }}
                              />
                              {displayButton && (
                                <CustomButton
                                  position={position}
                                  bgColor={
                                    buttonColor?.startsWith('#')
                                      ? buttonColor
                                      : `#${buttonColor}`
                                  }
                                  textColor={
                                    textColor?.startsWith('#')
                                      ? textColor
                                      : `#${textColor}`
                                  }
                                >
                                  {buttonTitle}
                                </CustomButton>
                              )}
                            </ButtonImageWrapper>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tab="Popup" key="4">
                        <Row gutter={24}>
                          {/* Left Section */}
                          <Col xs={24} md={12}>
                            <Form.Item
                              name="rf_poppup_heading"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter header text',
                                },
                              ]}
                            >
                              <AitInputBox
                                label="Header text"
                                required={true}
                                placeholder="Give a friend {{friend_offer_value}} off"
                              />
                            </Form.Item>
                            <Form.Item
                              name="rf_poppup_subheading"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter description',
                                },
                              ]}
                            >
                              <AitInputBox
                                textArea
                                label="Description"
                                required={true}
                                rows={3}
                                placeholder="On their first purchase and earn {{earn_points}} points if they spend over {{spend_amount}}"
                              />
                            </Form.Item>

                            <Form.Item
                              name="rf_social_media_message"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    'Please enter social media share message',
                                },
                              ]}
                            >
                              <AitInputBox
                                textArea
                                label="Share on social media message"
                                required={true}
                                rows={3}
                                placeholder="I wanted to share my referral URL with you - {{shared_url}}."
                              />
                            </Form.Item>
                            <Row gutter={24}>
                              <Col xs={24} md={24}>
                                <Label>Popup Image </Label>
                                <Form.Item
                                  name="rf_popup_image"
                                  valuePropName="fileList"
                                  getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) {
                                      return e;
                                    }
                                    return e && e.fileList;
                                  }}
                                  rules={[{ validator: validateImageFile }]}
                                >
                                  <AitUpload
                                    listType="picture-card"
                                    imgheight="auto"
                                    imgwidth="100%"
                                    initalValue={
                                      popupInitalValue
                                      // rowData?.rf_popup_image
                                      //   ? `${rowData?.popup_images_from_aws}${rowData?.rf_popup_image}`
                                      //   : `${process.env.NEXT_PUBLIC_APP_AWS_BUCKET}.s3.amazonaws.com/upload/popup_images/444185refer-friend-graphic.png`
                                    }
                                    onImageChange={(e) =>
                                      form.setFieldsValue({
                                        rf_popup_image: e,
                                      })
                                    }
                                    imageStyle={{
                                      width: '100px',
                                      height: '100px',
                                      flex: '0 0 100px',
                                      minWidth: '100px',
                                      //   borderRadius: '5px',
                                      //   border: '1px solid #D3D6DB',
                                      //   flex: '0 0 100px',
                                      objectFit: 'cover',
                                    }}
                                    referAFriend
                                    onResetValue={() =>
                                      setPopInitialValue(
                                        `${process.env.NEXT_PUBLIC_IMAGE_S3_BASE_URL}/upload/popup_images/444185refer-friend-graphic.png`
                                      )
                                    }
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>

                          <Col xs={24} md={12}>
                            <div
                              style={{
                                textAlign: 'right',
                                width: '100%',
                                float: 'left',
                                marginBottom: '24px',
                                marginTop: '24px',
                                position: 'relative',
                              }}
                            >
                              <img
                                src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/popup_preview_refer_a_friend.svg`}
                                alt="image"
                                style={{
                                  marginLeft: 'auto',
                                  marginRight: '0.75rem',
                                  width: '100%',
                                  verticalAlign: 'middle',
                                  borderStyle: 'none',
                                }}
                              />
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                    </Tabs>
                  </ConfigProvider>
                ),
              },
            ]}
          />
        </Row>

        <Row gutter={[12, 12]} justify={'center'} style={{ marginTop: 5 }}>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              type="primary"
              title={rowData.hasOwnProperty('id') ? 'Update' : 'Save'}
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
};

export default ReferAFriendForm;
