/* eslint-disable react-hooks/exhaustive-deps */
import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  App,
  Button,
  Col,
  DatePicker,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
  Tooltip,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import {
  HelperText,
  Label,
  RadioGroupContainer,
  RadioItem,
  ResponsiveContainer,
} from '../style';
import { ModalAlertIcon } from '../../../svg-icons';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  getProductAndCollectionService,
  saveActivitiesService,
  updateActivitiesService,
} from '../../../api/earnPoints';
import {
  addEarnPointsListData,
  earnPointsData,
} from '../../../redux/earnPoints/earnPointsSlice';
import { useDispatch, useSelector } from 'react-redux';
import logger from '@/utils/logger';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import {
  enterOnlyNumericValue,
  getCurrencyByMoneyFormat,
} from '@/utils/common.util';
import { useComposeRef } from 'rc-util';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import { StyledRadio } from '@/components/atoms/ait-radio-button/style';
import AitText from '@/components/atoms/ait-text/aitText';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

function MakeAPurchaseForm({
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
  const selectRef = useRef(null);
  const activitiesData = useSelector(earnPointsData);
  const [loading, setLoading] = useState(false);
  const [SchedulePointsState, setSchedulePointState] = useState(false);
  const [advanceSetting, setAdvanceSetting] = useState(false);
  const [switchState, setSwitchState] = useState({
    excludeShipping: false,
    excludeProduct: false,
    orderCancellation: false,
    expiryDate: false,
  });
  const [showAppliedToField, setShowAppliedToField] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  const [searchApiLoading, setSearchApiLoading] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState('Etc/UTC');
  const [callFirstTime, setCallFirstTime] = useState(true);
  const [searchValue, setSearchValue] = useState();

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

  const handleUpdate = async (value) => {
    setLoading(true);
    value.rule_id = activityId;
    value.make_a_purchase = value?.language;
    value.schedule_loyalty_points =
      value?.schedule_loyalty_points === true ? '1' : '0';

    value.exclude_shipping === true
      ? (value.exclude_shipping = '1')
      : delete value.exclude_shipping;

    value.exclude_sales_product === true
      ? (value.exclude_sales_product = '1')
      : delete value.exclude_sales_product;

    value.order_cancel_redeem_point_back === true
      ? (value.order_cancel_redeem_point_back = '1')
      : delete value.order_cancel_redeem_point_back;

    value.update_point_expiry_date_on_reward_earning === true
      ? (value.update_point_expiry_date_on_reward_earning = '1')
      : delete value.update_point_expiry_date_on_reward_earning;

    value.schedule_lyt_start_date =
      value?.schedule_lyt_start_date?.format('MM/DD/YYYY HH:mm');
    value.schedule_lyt_end_date =
      value?.schedule_lyt_end_date?.format('MM/DD/YYYY HH:mm');
    value.reward_order_status = value?.order_status;
    value.reward_discount_code_status =
      value?.exclude_point_earning_discount_type;

    let obj = value;
    if (!advanceSetting) {
      obj = {
        ...value,
        approval_period: value?.approval_period,
        exclude_shipping:
          value?.exclude_shipping || rowData?.exclude_shipping || undefined,
        exclude_sales_product:
          value?.exclude_sales_product ||
          rowData?.exclude_sales_product ||
          undefined,
        order_cancel_redeem_point_back:
          value?.order_cancel_redeem_point_back ||
          rowData?.order_cancel_redeem_point_back ||
          undefined,
        update_point_expiry_date_on_reward_earning:
          value?.update_point_expiry_date_on_reward_earning ||
          rowData?.update_point_expiry_date_on_reward_earning ||
          undefined,
        order_status: value?.order_status || rowData?.order_status || '',
        exclude_point_earning_discount_type:
          value?.exclude_point_earning_discount_type ||
          rowData?.exclude_point_earning_discount_type,
      };
    }

    if (switchState?.excludeShipping === true) {
      obj.exclude_shipping = '1';
    } else {
      delete obj.exclude_shipping;
    }

    if (switchState?.orderCancellation === true) {
      obj.order_cancel_redeem_point_back = '1';
    } else {
      delete obj.order_cancel_redeem_point_back;
    }

    obj.exclude_sales_product =
      switchState?.excludeProduct === true ? '1' : '0';

    obj.update_point_expiry_date_on_reward_earning =
      switchState?.expiryDate === true ? '1' : '0';

    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined) {
        obj[key] = '';
      }
    });
    const formData = convertToFormDataCustom(obj);

    try {
      const response = rowData.hasOwnProperty('id')
        ? await updateActivitiesService(formData)
        : await saveActivitiesService(formData);
      if (response?.status === 'success') {
        let updatedFields = {
          points: value?.points,
          status: rowData.hasOwnProperty('id') ? rowData?.status : '1',
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
      formData.append('searchTerm', searchQuery);
      formData.append('all', false);

      const data = rowData?.exclude_applied_to_json
        ? JSON.parse(rowData?.exclude_applied_to_json)
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
    } catch (error) {
      logger(error?.response?.msg);
    } finally {
      setSearchApiLoading(false);
      setActivitiesLoading(false);
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

  const formatNumber = (value) => {
    if (value) {
      if (value % 1 === 0) {
        return parseFloat(value)?.toFixed(0);
      }
      return value?.toString();
    }
  };

  // disabledDate={(current) => {
  //   const endDate = form.getFieldValue(
  //     'schedule_lyt_end_date'
  //   );
  //   return (
  //     current &&
  //     (current.isBefore(dayjs(), 'day') ||
  //       (endDate && current.isAfter(endDate, 'day')))
  //   );
  // }}

  const getDisabledDate = ({
    current,
    type,
    startDate,
    endDate,
    timezoneKey,
  }) => {
    if (!current) return false;

    const today = dayjs().tz(timezoneKey).startOf('day');
    const currentDate = dayjs(current).tz(timezoneKey).startOf('day');

    if (currentDate.isBefore(today)) return true;

    if (type === 'start') {
      if (endDate) {
        const end = dayjs(endDate).tz(timezoneKey).startOf('day');
        if (currentDate.isAfter(end)) return true;
      }
    }

    if (type === 'end') {
      if (startDate) {
        const start = dayjs(startDate).tz(timezoneKey).startOf('day');
        if (currentDate.isBefore(start)) return true;
      }
    }

    return false;
  };

  const getDisabledTime = (currentDate, timezoneKey) => {
    if (!currentDate) return {};

    const now = dayjs().tz(timezoneKey);
    const current = dayjs(currentDate).tz(timezoneKey);

    const disabledHours = [];
    const disabledMinutes = [];
    const disabledSeconds = [];

    if (current.isSame(now, 'day')) {
      for (let h = 0; h < now.hour(); h++) {
        disabledHours.push(h);
      }

      if (current.hour() === now.hour()) {
        for (let m = 0; m < now.minute(); m++) {
          disabledMinutes.push(m);
        }

        if (current.minute() === now.minute()) {
          for (let s = 0; s < now.second(); s++) {
            disabledSeconds.push(s);
          }
        }
      }
    }

    return {
      disabledHours: () => disabledHours,
      disabledMinutes: () => disabledMinutes,
      disabledSeconds: () => disabledSeconds,
    };
  };

  useEffect(() => {
    if (rowData) {
      form.setFieldsValue({
        points: formatNumber(rowData.points) || '',
        language: rowData.language || 'Make a purchase',
        panel_msg:
          rowData?.panel_msg ||
          'You will earn {{points}} reward points for making a purchase per {{spend_amount}} spent',
        display_notification:
          rowData?.display_notification ||
          'You earned {{points}} reward points for making a purchase',
        schedule_loyalty_points:
          parseFloat(rowData?.schedule_loyalty_points) > 0 ? true : false,
        scheduled_points: formatNumber(rowData?.scheduled_points) || '',
        // schedule_lyt_end_date: dayjs(rowData?.schedule_lyt_end_date) || null,
        schedule_time_zone: rowData?.schedule_time_zone || 'Etc/UTC',
        points_per_text: rowData?.points_per_text || 'points per',
        redirection_url:
          rowData?.redirection_url || jwtState?.login_auth?.domain,
        approval_period: rowData?.approval_period || '0',

        exclude_shipping:
          parseFloat(rowData?.exclude_shipping_cost) > 0 ? true : false,
        exclude_sales_product:
          parseFloat(rowData?.exclude_sales_product) > 0 ? true : false,
        order_cancel_redeem_point_back:
          parseFloat(rowData?.order_cancel_redeem_point_back) > 0
            ? true
            : false,
        update_point_expiry_date_on_reward_earning:
          parseFloat(rowData?.update_point_expiry_date_on_reward_earning) > 0
            ? true
            : false,

        order_status: rowData?.order_status || 'markaspaid',
        exclude_point_earning_discount_type:
          rowData?.exclude_point_earning_discount_type || 'none',
        applied_to: rowData?.exclude_applied_to || '',
        applied_to_json: rowData?.exclude_applied_to_json
          ? JSON.parse(rowData?.exclude_applied_to_json)
          : [],
        schedule_lyt_start_date:
          rowData.schedule_lyt_start_date !== null
            ? dayjs(rowData.schedule_lyt_start_date)
            : null,
        schedule_lyt_end_date:
          rowData.schedule_lyt_end_date !== null
            ? dayjs(rowData.schedule_lyt_end_date)
            : null,
      });
      setSchedulePointState(
        parseFloat(rowData?.schedule_loyalty_points) > 0 ? true : false
      );
      setSwitchState({
        ...switchState,
        excludeShipping:
          parseFloat(rowData?.exclude_shipping_cost) > 0 ? true : false,
        excludeProduct:
          parseFloat(rowData?.exclude_sales_product) > 0 ? true : false,
        orderCancellation:
          parseFloat(rowData?.order_cancel_redeem_point_back) > 0
            ? true
            : false,
        expiryDate:
          parseFloat(rowData?.update_point_expiry_date_on_reward_earning) > 0
            ? true
            : false,
      });
      setShowAppliedToField(rowData?.exclude_applied_to);
    }
  }, [rowData]);

  const handleChange = (val) => {
    setSelectedTimezone(val);
    setTimeout(() => {
      if (selectRef.current) {
        selectRef.current.blur();
      }
    }, 50);
  };

  useEffect(() => {
    const data = rowData?.exclude_applied_to_json
      ? JSON.parse(rowData?.exclude_applied_to_json)
      : [];
    if (callFirstTime && showAppliedToField && data?.length > 0) {
      getProductAndCollectionData();
      setCallFirstTime(false);
    }
  }, [showAppliedToField]);

  // const temp = Object?.entries(rowData?.timezones).map(([key, value]) => ({
  //   label: value,
  //   value: key,
  // }));

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
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Flex>
          <Flex flex={'0 0 calc(50% - 20px)'} align="start">
            <Row gutter={24}>
              <Col span={24}>
                <AitText strong type="primary" bottommargin={16} size={16}>
                  General settings
                </AitText>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="points"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter points',
                    },
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
                  label={
                    <>
                      Points earned for every{' '}
                      {getCurrencyByMoneyFormat(
                        jwtState?.login_auth?.money_format
                      )}
                      1 spent
                    </>
                  }
                >
                  <AitInputBox
                    placeholder="1"
                    onKeyPress={enterOnlyNumericValue}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="redirection_url" label={<>Page URL</>}>
                  <AitInputBox rows={3} placeholder="Add redirection URL" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Label>
                  Campaign name{' '}
                  <span
                    className="field-required"
                    style={{ position: 'relative', top: '-2px' }}
                  >
                    *
                  </span>
                </Label>
                <HelperText>
                  The name as it will appear on your store.
                </HelperText>
                <Form.Item
                  name="language"
                  rules={[
                    { required: true, message: 'please enter campaign name' },
                  ]}
                >
                  <AitInputBox rows={3} placeholder="Make a purchase" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Label>Description</Label>
                <HelperText>
                  Your customers will see this description on your store.
                </HelperText>
                <Form.Item name="panel_msg">
                  <Input.TextArea
                    rows={3}
                    placeholder="You will earn {{points}} reward points for making a purchase per {{spend_amount}} spent"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Label>Reward text</Label>
                <HelperText>
                  Your customers will see this when they receive points.
                </HelperText>
                <Form.Item name="display_notification">
                  <Input.TextArea
                    rows={3}
                    placeholder="You earned {{points}} reward points for making a purchase"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Label>Points per heading</Label>
                <HelperText>
                  Change heading in different languages in shop loyalty tier
                  list.
                </HelperText>
                <Form.Item name="points_per_text">
                  <AitInputBox rows={3} placeholder="Points per" />
                </Form.Item>
              </Col>
            </Row>
          </Flex>
          <Flex flex={'1 1 auto'}>
            <Divider
              type="vertical"
              style={{
                marginLeft: 20,
                marginRight: 20,
                height: 'calc(100% - 24px)',
              }}
            />
          </Flex>

          <Flex flex={'0 0 calc(50% - 20px)'} align="start">
            <Row gutter={24}>
              <Col span={24}>
                <AitText strong type="primary" bottommargin={16} size={16}>
                  Earning rules & conditions
                </AitText>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="approval_period"
                  rules={[
                    // { required: true },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        // if (Number(value) <= 0) {
                        //   return Promise.reject(
                        //     'Approval period days must be greater than 0'
                        //   );
                        // }
                        if (!/^\d+$/.test(String(value))) {
                          return Promise.reject(
                            new Error(
                              'Only whole numbers are allowed (no decimals)'
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  label={
                    <>
                      Approval period (in days){' '}
                      <Tooltip
                        placement="right"
                        title="Delay points rewarding by a number of days"
                      >
                        <InfoCircleOutlined
                          style={{
                            marginLeft: '5px',
                            position: 'relative',
                            top: '1px',
                          }}
                        />
                      </Tooltip>
                    </>
                  }
                >
                  <AitInputBox
                    placeholder="0"
                    onKeyPress={enterOnlyNumericValue}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="schedule_loyalty_points"
                  // rules={[{ required: true }]}
                  label={
                    <>
                      Schedule points
                      <Tooltip
                        placement="right"
                        title="Assign specific loyalty points for purchases made during a defined period, and automatically revert to the default points once the period ends. (Ex: During the festive season, BFCM, or other special occasions)"
                      >
                        <InfoCircleOutlined
                          style={{
                            marginLeft: '5px',
                            position: 'relative',
                            top: '1px',
                          }}
                        />
                      </Tooltip>
                    </>
                  }
                >
                  <AitSwitch
                    onChange={(e) => setSchedulePointState(e)}
                    checked={SchedulePointsState}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                {SchedulePointsState && (
                  <div
                    style={{
                      background: '#F4F7F9',
                      padding: '15px',
                      paddingBottom: '0px',
                      marginBottom: '20px',
                      borderRadius: '10px',
                    }}
                  >
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item
                          name="scheduled_points"
                          label={`Schedule points earned for every ${getCurrencyByMoneyFormat(
                            jwtState?.login_auth?.money_format
                          )}1 spent`}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter points',
                            },
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
                            placeholder="1"
                            onKeyPress={enterOnlyNumericValue}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          label="Schedule points start date"
                          name="schedule_lyt_start_date"
                          rules={[
                            {
                              required: true,
                              message: 'Please select start date',
                            },
                          ]}
                          // initialValue={
                          //   rowData?.schedule_lyt_start_date
                          //     ? dayjs(rowData.schedule_lyt_start_date)
                          //     : null
                          // }
                        >
                          <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            placeholder="Start date"
                            style={{ width: '100%' }}
                            disabledDate={(current) =>
                              getDisabledDate({
                                current,
                                type: 'start',
                                otherDate: form.getFieldValue(
                                  'schedule_lyt_end_date'
                                ),
                                timezoneKey: selectedTimezone,
                              })
                            }
                            disabledTime={(current) =>
                              getDisabledTime(current, selectedTimezone)
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item
                          label="Schedule points end date"
                          name="schedule_lyt_end_date"
                          rules={[
                            {
                              required: true,
                              message: 'Please select end date',
                            },
                            {
                              validator: (_, value) => {
                                const startDate = form.getFieldValue(
                                  'schedule_lyt_start_date'
                                );
                                if (
                                  value &&
                                  startDate &&
                                  value.isBefore(startDate, 'second')
                                ) {
                                  return Promise.reject(
                                    new Error(
                                      'End date and time must be greater than the start date and time'
                                    )
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                          // initialValue={
                          //   rowData?.schedule_lyt_end_date
                          //     ? dayjs(rowData.schedule_lyt_end_date)
                          //     : null
                          // }
                        >
                          <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            placeholder="End date"
                            style={{ width: '100%' }}
                            disabledDate={(current) =>
                              getDisabledDate({
                                current,
                                type: 'start',
                                otherDate: form.getFieldValue(
                                  'schedule_lyt_start_date'
                                ),
                                timezoneKey: selectedTimezone,
                              })
                            }
                            disabledTime={(current) =>
                              getDisabledTime(current, selectedTimezone)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        {/* <Label>Schedule time zone</Label> */}
                        <Form.Item
                          label="Schedule time zone"
                          name="schedule_time_zone"
                          rules={[
                            {
                              required: true,
                              message: 'Please select Time zone',
                            },
                          ]}
                        >
                          <Select
                            ref={selectRef}
                            showSearch
                            value={selectedTimezone}
                            onChange={(e) => {
                              handleChange(e);
                              form.setFieldsValue({
                                schedule_lyt_start_date: null,
                                schedule_lyt_end_date: null,
                              });
                            }}
                            options={
                              rowData?.id
                                ? Object.entries(rowData?.timezones).map(
                                    ([key, value]) => ({
                                      label: value,
                                      value: key,
                                    })
                                  )
                                : []
                            }
                            getPopupContainer={(trigger) => trigger.parentNode}
                            autoFocus={false}
                            filterOption={(input, option) =>
                              // option.label is what we want to search
                              option.label
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
              </Col>
              <Col>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      name="order_status"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Plese select order status',
                      //   },
                      // ]}
                      label={<>Earn point rule</>}
                    >
                      <Radio.Group defaultValue={rowData?.order_status}>
                        <Flex vertical={true} gap={10}>
                          <StyledRadio value="markaspaid">
                            Order status is paid
                          </StyledRadio>
                          <StyledRadio value="onfulfilled">
                            Order status is fulfilled
                          </StyledRadio>
                        </Flex>
                      </Radio.Group>

                      {/* <AitRadioButton
                          name="whenToSend"
                          className="vertical"
                          // value={values.whenToSend}
                          // onChange={(e) =>
                          //   setFieldValue('whenToSend', e.target.value)
                          // }
                          options={[
                            { label: 'Send now', value: 'now' },
                            { label: 'Schedule', value: 'scheduled' },
                            { label: 'Keep in draft', value: 'draft' },
                          ]}
                        /> */}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="exclude_point_earning_discount_type"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please select discount type',
                      //   },
                      // ]}
                      label={
                        <>Prevent point earning when a discount is applied</>
                      }
                    >
                      <Radio.Group
                        defaultValue={
                          rowData?.exclude_point_earning_discount_type
                        }
                      >
                        <Flex vertical={true} gap={10}>
                          <StyledRadio value="none">None</StyledRadio>
                          <StyledRadio value="excludeorder">
                            Exclude loyalty points for discounted orders
                          </StyledRadio>
                          <StyledRadio value="excludeproduct">
                            Exclude loyalty points for discounted products and
                            gift card payments
                          </StyledRadio>
                        </Flex>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Label style={{ marginBottom: 8 }}>
                      Loyalty points conditions
                    </Label>
                    <Form.Item
                      name="exclude_shipping"
                      valuePropName="checked"
                      style={{ marginBottom: 12 }}
                    >
                      <AitSwitch
                        fontweight={400}
                        justify="space-between"
                        label={
                          <>
                            Exclude shipping cost and taxes
                            <Tooltip
                              placement="right"
                              title="Give points only for the actual product price and exclude shipping cost and taxes."
                            >
                              <InfoCircleOutlined
                                style={{
                                  marginLeft: '5px',
                                  position: 'relative',
                                  top: '1px',
                                }}
                              />
                            </Tooltip>
                          </>
                        }
                        checked={switchState?.excludeShipping}
                        onChange={(checked) =>
                          setSwitchState((prev) => ({
                            ...prev,
                            excludeShipping: checked,
                          }))
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name="exclude_sales_product"
                      valuePropName="checked"
                      style={{ marginBottom: 12 }}
                    >
                      <AitSwitch
                        fontweight={400}
                        justify="space-between"
                        label={
                          <>
                            Exclude sales product
                            <Tooltip
                              placement="right"
                              title="Give points only for the actual product price."
                            >
                              <InfoCircleOutlined
                                style={{
                                  marginBottom: '3px',
                                  marginLeft: '5px',
                                  // position: 'relative',
                                  // // top: '1px',
                                }}
                              />
                            </Tooltip>
                          </>
                        }
                        checked={switchState?.excludeProduct}
                        onChange={(checked) =>
                          setSwitchState((prev) => ({
                            ...prev,
                            excludeProduct: checked,
                          }))
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="order_cancel_redeem_point_back"
                      valuePropName="checked"
                      style={{ marginBottom: 12 }}
                    >
                      <AitSwitch
                        fontweight={400}
                        justify="space-between"
                        label={
                          <>
                            Revert redeemed points on order cancellation if any
                            <Tooltip
                              placement="right"
                              title="It will revert back redeemed loyalty points by which discount code is created and applied with order."
                            >
                              <InfoCircleOutlined
                                style={{
                                  marginLeft: '5px',
                                  position: 'relative',
                                  top: '2px',
                                }}
                              />
                            </Tooltip>
                          </>
                        }
                        checked={switchState?.orderCancellation}
                        onChange={(checked) =>
                          setSwitchState((prev) => ({
                            ...prev,
                            orderCancellation: checked,
                          }))
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      name="update_point_expiry_date_on_reward_earning"
                      valuePropName="checked"
                    >
                      <AitSwitch
                        fontweight={400}
                        label={
                          <>
                            Don’t extend point expiry when no points are earned
                          </>
                        }
                        justify="space-between"
                        checked={switchState?.expiryDate}
                        onChange={(checked) =>
                          setSwitchState((prev) => ({
                            ...prev,
                            expiryDate: checked,
                          }))
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    {/* <Label style={{ marginBottom: '10px' }}>
                        Exclude certain collections or products from earning points.
                        <Tooltip
                          placement="right"
                          title="Note: If any of the selected collection(s) or product(s) are included in an order, loyalty points will not be awarded for those items."
                        >
                          <InfoCircleOutlined
                            style={{
                              marginLeft: '5px',
                              position: 'relative',
                              top: '2px',
                            }}
                          />
                        </Tooltip>
                      </Label>
                      <Form.Item
                        name="applied_to"
                        rules={[
                          { required: true, message: 'Please select where to apply' },
                        ]}
                      >
                        <Select
                          placeholder="Select"
                          onChange={(e) => {
                            setSearchApiData([]);
                            setSelectedValues([]);
                            form.setFieldsValue({
                              applied_to_json: [], // Clear the specific field
                            });
                            setShowAppliedToField(e);
                          }}
                        >
                          <Option value="COLLECTIONS">Specific Collections</Option>
                          <Option value="PRODUCTS">Specific Products</Option>
                        </Select>
                      </Form.Item> */}
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      style={{ marginBottom: 10 }}
                      name="applied_to"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please select where to apply',
                      //   },
                      // ]}
                      label={
                        <>
                          Exclude certain collections or products from earning
                          points.
                          <Tooltip
                            placement="right"
                            title="Note: If any of the selected collection(s) or product(s) are included in an order, loyalty points will not be awarded for those items."
                          >
                            <InfoCircleOutlined style={{ marginLeft: 2 }} />
                          </Tooltip>
                        </>
                      }
                    >
                      <AitSelectBox
                        placeholder="Select"
                        onChange={(e) => {
                          setCallFirstTime(false);
                          setSelectedValues([]);
                          setSearchApiData([]);
                          setShowAppliedToField(e);
                          form.setFieldsValue({
                            applied_to_json: [], // Clear the specific field
                          });
                          form.validateFields(['applied_to_json']);
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
                </Row>

                {showAppliedToField !== '' &&
                  showAppliedToField !== undefined &&
                  showAppliedToField !== null && (
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item
                          // label={
                          //   showAppliedToField === 'COLLECTIONS'
                          //     ? 'Select collections'
                          //     : 'Select products'
                          // }
                          name="applied_to_json"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message:
                          //       showAppliedToField === 'COLLECTIONS'
                          //         ? 'Select at least one collection'
                          //         : 'Select at least one product',
                          //   },
                          // ]}
                          rules={[
                            {
                              validator: (_, value) => {
                                const appliedTo =
                                  form.getFieldValue('applied_to');

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
                                  {searchValue > 3 ? '0' : 3 - searchValue || 3}{' '}
                                  or more characters
                                </AitText>
                              )
                            }
                            options={searchApiData}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
              </Col>
            </Row>
          </Flex>
        </Flex>
        <Row gutter={[20, 15]} justify={'center'}>
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
}

export default MakeAPurchaseForm;
