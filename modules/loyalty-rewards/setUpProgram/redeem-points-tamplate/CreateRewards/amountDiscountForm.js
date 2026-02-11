import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  enterOnlyNumericValue,
  getCurrencyByMoneyFormat,
} from '@/utils/common.util';
import {
  Col,
  Empty,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Tooltip,
} from 'antd';
import { AlertBox, HelperText, Label, StyledSelect } from '../style';
import { useEffect, useState } from 'react';
import { getProductAndCollectionService } from '../../../api/earnPoints';
import logger from '@/utils/logger';
import { debounce } from 'lodash';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ModalAlertIcon } from '../../../svg-icons';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import AitAutocomplete from '@/components/atoms/ait-autocomplete/aitAutocomplete';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitText from '@/components/atoms/ait-text/aitText';
import { useSelector } from 'react-redux';

const { Option } = Select;

function AmountDiscountForm({
  handleCancel,
  rowData,
  handleSubmit,
  formLoading,
  isEdit = true,
  setFormLoading,
  setActivitiesLoading,
}) {
  const jwtState = useSelector((state) => state?.jwtState);
  const [form] = Form.useForm();
  const [showAppliedToField, setShowAppliedToField] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  const [searchApiLoading, setSearchApiLoading] = useState(false);
  const [minimumPurchaseAmt, setMinimumPurchaseAmt] = useState();
  const [pointsAndDisAmt, setMPointsAndDisAmt] = useState({
    discountAmt: '',
    pointsToClaim: '',
  });
  const [callFirstTime, setCallFirstTime] = useState(true);
  const [showPOS, setShowPOSExpiry] = useState(true);
  const [firstTimeLoading, setFirstTimeLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();

  const getProductAndCollectionData = async (searchQuery) => {
    if (searchQuery?.length < 3 && !callFirstTime) {
      setSearchApiData([]);
      return;
    }
    if (callFirstTime && isEdit) {
      setActivitiesLoading(true);
    }
    setSearchApiLoading(true);
    // setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append('searchTerm', searchQuery);
      formData.append('all', false);

      const data = rowData?.applied_to_json
        ? JSON.parse(rowData?.applied_to_json)
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
          console.log('response', { response, arr });
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
      if (isEdit) {
        setActivitiesLoading(false);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      if (isEdit) {
        setActivitiesLoading(false);
      }
      setSearchApiLoading(false);
      setFirstTimeLoading(false);
      // setFormLoading(false);
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
    if (rowData && rowData !== null) {
      setShowAppliedToField(rowData?.applied_to || undefined);
      setShowPOSExpiry(parseFloat(rowData?.show_in_pos) > 0 ? true : false);

      const formValues = {
        discount_amount:
          parseFloat(rowData?.discount_amount?.replace(/[^0-9.-]+/g, '')) || '',
        points_to_claim: rowData?.points_to_claim || '',
        reward_heading:
          rowData?.language ||
          `${rowData?.reward_name === 'Amount discount' ? '{{MONEY_OFF}} Off' : '{{PERCENTAGE_DISCOUNT}} discount'}` ||
          '',
        language: rowData?.language || '',
        heading_bottom_statement:
          rowData?.bottom_statement || 'Redeem {{POINTS}} points',
        cost_to_redeem:
          rowData?.reward_name === 'Amount discount'
            ? rowData?.cost_to_redeem
            : rowData?.minimum_spend,
        heading_bottom_sub_statement:
          rowData?.bottom_sub_statement ||
          rowData?.bottom_statement_down ||
          'With minimum purchase of {{MINSPENT}}',
        show_in_pos: parseFloat(rowData?.show_in_pos) > 0 ? true : false,
        applied_to: rowData?.applied_to,
        applied_to_json: rowData?.applied_to_json
          ? JSON.parse(rowData?.applied_to_json)
          : [],
      };

      form.setFieldsValue(formValues);
    }
  }, [rowData]);

  useEffect(() => {
    const data = rowData?.applied_to_json
      ? JSON.parse(rowData?.applied_to_json)
      : [];

    if (rowData && rowData !== null) {
      if (callFirstTime && showAppliedToField && data?.length > 0) {
        setFirstTimeLoading(true);
        getProductAndCollectionData();
        setCallFirstTime(false);
      }
    }
  }, [showAppliedToField]);

  const onFinish = (values) => {
    values.reward_id = rowData?.reward_id || rowData?.id;

    if (isEdit) {
      values.reward_setting_id = rowData?.id;
    } else {
      values.shop_reward_points = rowData?.points;
    }
    if (rowData?.reward_name !== 'Amount discount') {
      values.minimum_spend = values?.cost_to_redeem;
      values.show_in_pos_two = values?.show_in_pos === true ? '1' : '0';
    } else {
      values.cost_to_redeem = values?.cost_to_redeem;
      values.show_in_pos = values?.show_in_pos === true ? '1' : '0';
    }

    const converted = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [
        k,
        v === undefined || v === null
          ? ''
          : typeof v === 'boolean'
            ? Number(v)
            : v,
      ])
    );

    handleSubmit(converted);
  };

  return (
    // <FullPageLoader loading={isEdit && firstTimeLoading}>
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={24}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Form.Item
            name="discount_amount"
            rules={[
              {
                required: true,
                message: `Please enter discount ${rowData?.reward_name === 'Amount discount' ? 'amount' : ''} `,
              },
              {
                validator: (_, value) => {
                  if (value === undefined || value === '') {
                    return Promise.resolve();
                  }
                  if (isNaN(value) || Number(value) <= 0) {
                    return Promise.reject(
                      'Discount amount must be greater than 0'
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <AitInputBox
              label={`Discount ${rowData?.reward_name === 'Amount discount' ? `amount  (${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)})` : ' (%)'}`}
              required
              placeholder="5"
              onChange={(e) =>
                setMPointsAndDisAmt((prev) => ({
                  ...prev,
                  discountAmt: e?.target?.value,
                }))
              }
              onKeyPress={enterOnlyNumericValue}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Form.Item
            name="points_to_claim"
            rules={[
              { required: true, message: 'Please enter points to claim' },
              {
                validator: (_, value) => {
                  if (value === undefined || value === '') {
                    return Promise.resolve();
                  }
                  if (isNaN(value) || Number(value) <= 0) {
                    return Promise.reject('Points must be greater than 0');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <AitInputBox
              label="Points to claim"
              required
              placeholder="500"
              onKeyPress={enterOnlyNumericValue}
              onChange={(e) =>
                setMPointsAndDisAmt((prev) => ({
                  ...prev,
                  pointsToClaim: e?.target?.value,
                }))
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Form.Item
            name="reward_heading"
            // rules={[
            //   { required: true, message: 'Please enter reward title!' },
            // ]}
          >
            <AitInputBox
              label="Reward title"
              // required
              // placeholder="{{MONEY_OFF}} Off"
              placeholder={`${rowData?.reward_name === 'Amount discount' ? '{{MONEY_OFF}} Off' : 'Percentage discount'}`}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Form.Item
            name="heading_bottom_statement"
            // rules={[{ required: true, message: 'Please enter reward text!' }]}
          >
            <AitInputBox
              label="Reward text"
              // required
              placeholder="Redeem {{POINTS}} points"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          {/* <Label style={{ marginBottom: '10px' }}>
              Minimum purchase amount
              <Tooltip
                placement="right"
                title="This minimum spent condition would not be applicable in POS."
              >
                <InfoCircleOutlined
                  style={{
                    marginLeft: '2px',
                    position: 'relative',
                    //   top: '1px',
                  }}
                />
              </Tooltip>
            </Label> */}
          <Form.Item
            name="cost_to_redeem"
            rules={[
              {
                required: true,
                message: 'Please enter minimum purchase amount',
              },
            ]}
          >
            <AitInputBox
              required
              label="Minimum purchase amount"
              tooltipText="This minimum spent condition would not be applicable in POS."
              labelIcon={<InfoCircleOutlined />}
              iconMarginLeft={0}
              placeholder="100"
              onKeyPress={enterOnlyNumericValue}
              onChange={(e) => setMinimumPurchaseAmt(e.target.value)}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Form.Item
            name="heading_bottom_sub_statement"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter minimum purchase amount text!',
            //   },
            // ]}
          >
            <AitInputBox
              label="Minimum purchase amount text"
              // required
              placeholder="With minimum purchase of {{MINSPENT}}"
            />
          </Form.Item>
        </Col>
      </Row>
      {rowData?.reward_name === 'Amount discount' &&
        minimumPurchaseAmt &&
        minimumPurchaseAmt !== '' && (
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
            message={
              <>
                A customer should have {pointsAndDisAmt?.pointsToClaim} points
                to claim the{' '}
                {getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)}
                {pointsAndDisAmt?.discountAmt} reward. So for eg if points are
                getting earn from purchase so min{' '}
                {getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)}
                {minimumPurchaseAmt} purchase is needed to claim the award.
              </>
            }
            style={{ marginBottom: 24 }}
          />
        )}
      <Row gutter={24}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Flex justify="space-between">
            <Label>
              Show in POS{' '}
              <Tooltip
                placement="right"
                title="Enabling this setting makes the reward visible in Shopify POS"
              >
                <InfoCircleOutlined
                  style={{
                    marginLeft: '2px',
                    position: 'relative',
                    //   top: '1px',
                  }}
                />
              </Tooltip>
            </Label>
            <Form.Item
              //   label=""
              name="show_in_pos"
              valuePropName="checked"
            >
              <AitSwitch
                onChange={(checked) => setShowPOSExpiry(checked)}
                checked={showPOS}
              />
            </Form.Item>
          </Flex>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Label style={{ marginBottom: '10px' }}>Applies to</Label>
          <HelperText>
            Note: if nothing is selected, it will apply to all products.
          </HelperText>
          <Form.Item
            style={{ marginBottom: '10px' }}
            name="applied_to"
            // rules={[
            //   { required: true, message: 'Please select where to apply' },
            // ]}
          >
            {/* <StyledSelect
              width="100%"
              style={{ height: 39 }}
              placeholder="Select"
              onChange={(e) => {
                setSearchApiData([]);
                setSelectedValues([]);
                form.setFieldsValue({
                  applied_to_json: [],
                });
                setShowAppliedToField(e);
              }}
            >
              <Option value="SELECT">Select</Option>
              <Option value="COLLECTIONS">Specific Collections</Option>
              <Option value="PRODUCTS">Specific Products</Option>
            </StyledSelect> */}
            <AitSelectBox
              placeholder="Select"
              onChange={(e) => {
                // setSearchApiData([]);
                // setSelectedValues([]);
                // form.setFieldsValue({
                //   applied_to_json: [], // Clear the specific field
                // });
                // setShowAppliedToField(e);
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
        {showAppliedToField !== 'SELECT' &&
          showAppliedToField !== undefined && (
            <Col xs={24} sm={24} md={24} lg={24}>
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
                      const appliedTo = form.getFieldValue('applied_to');

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
                  // size="medium"
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
                        {searchValue > 3 ? '0' : 3 - searchValue || 3} or more
                        characters
                      </AitText>
                    )
                  }
                  options={searchApiData}
                />
              </Form.Item>
            </Col>
          )}
      </Row>

      <Row gutter={[12, 12]} justify={'center'}>
        <Col xs={24} sm={8} md={6}>
          <AitButton
            type="primary"
            title={isEdit ? 'Update' : 'Save'}
            htmlType="submit"
            disabled={formLoading}
            loading={formLoading}
            block
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <AitButton
            title="Cancel"
            variant="filled"
            color="default"
            onClick={handleCancel}
            disabled={formLoading}
            block
          />
        </Col>
      </Row>
    </Form>
    // </FullPageLoader>
  );
}

export default AmountDiscountForm;
