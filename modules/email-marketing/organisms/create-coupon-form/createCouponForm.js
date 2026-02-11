import React, { useEffect, useState } from 'react';
import { Col, Divider, Row, Typography } from 'antd';
import { FieldWrapper, HeadingWrapper, StyleSpan } from './style';
import { Field } from 'formik';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitDatePicker from '@/components/atoms/ait-date-picker/aitDatePicker';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitAutocomplete from '@/components/atoms/ait-autocomplete/aitAutocomplete';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import {
  disablePastDate,
  disablePastTime,
  getCurrencyParts,
} from '../../utils/helper';
const { Title, Text } = Typography;

const CreateCouponForm = (props) => {
  const router = useRouter();
  const {
    values,
    setFieldValue,
    errors,
    touched,
    isViewMode = false,
    isEditMode = false,
  } = props;

  const couponsState = useSelector((state) => state.emailMarketingCouponState);
  const getTimeZoneListState = useSelector(
    (state) => state.getTimeZoneListState
  );

  const { login_auth } = useSelector((state) => state.jwtState);
  const { prefix, suffix } = getCurrencyParts(login_auth?.money_format);

  const [productListOptions, setProductListOptions] = useState([]);
  const [collectionListOptions, setCollectionListOptions] = useState([]);
  const [timeZoneList, settimeZoneList] = useState([]);

  // load initial lists
  useEffect(() => {
    const {
      productListApiState,
      productList,
      collectionListApiState,
      collectionList,
    } = couponsState;

    if (productListApiState === 'success') {
      const productListOptions = productList?.map((item) => ({
        label: item.title,
        value: item.shopify_product_id,
      }));
      setProductListOptions(productListOptions);
    }

    if (collectionListApiState === 'success') {
      const collectionListOptions = collectionList?.map((item) => ({
        label: item.text,
        value: item.collection_id,
      }));
      setCollectionListOptions(collectionListOptions);
    }
  }, [couponsState?.productListApiState, couponsState?.collectionListApiState]);

  useEffect(() => {
    if (getTimeZoneListState?.timeZoneListApiState === 'success') {
      settimeZoneList(getTimeZoneListState?.timeZoneList);
    }
  }, [getTimeZoneListState?.timeZoneListApiState]);

  useEffect(() => {
    if (values.discount_generator_type === '2') {
      // set checkbox checked + numeric value
      setFieldValue('is_discount_code_limit', 1);
      setFieldValue('usage_limit', 1);
    }
  }, [values.discount_generator_type]);

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs={24}>
          <Row style={{ marginTop: '10px' }} align="middle" gutter={[16, 8]}>
            {/* Left Radio - Bulk discount generator */}
            <Col xs={24} md={12}>
              <AitRadioButton
                name="discount_generator_type"
                value={values.discount_generator_type}
                onChange={(e) => {
                  setFieldValue('discount_generator_type', e.target.value);
                }}
                options={[
                  {
                    label: (
                      <div>
                        <label>Bulk discount generator</label>
                        <div>
                           <Text 
                          type='secondary'
                          style={{
                            fontSize: 13,
                          }}
                        >
                          Generate discount codes in bulk and use them anytime
                          in email campaigns or workflows.
                        </Text>
                        </div>                       
                      </div>
                    ),
                    value: '1',
                  },
                ]}
              />
            </Col>

            {/* Right Radio - Real-time discount generation */}
            <Col xs={24} md={12}>
              <AitRadioButton
                name="discount_generator_type"
                value={values.discount_generator_type}
                onChange={(e) =>
                  setFieldValue('discount_generator_type', e.target.value)
                }
                options={[
                  {
                    label: (
                      <div>
                        <label>Real-time discount generation</label>
                         <div>
                         <Text 
                          type='secondary'
                          style={{
                            fontSize: 13,
                          }}
                         >
                          Create real-time discount codes for campaigns and
                          workflows, and set an expiry if needed.
                        </Text>
                         </div>
                      </div>
                    ),
                    value: '2',
                  },
                ]}
              />
            </Col>
          </Row>
        </Col>
        {/* Section Heading */}
        <Col xs={24}>
          <HeadingWrapper>
            <Title className="outer-collapse-title" level={4} type="primary">
              General coupon info
            </Title>
          </HeadingWrapper>
        </Col>
        {/* Coupon Name */}
        <Col xs={24} md={12}>
          <FieldWrapper>
            <Field
              as={AitInputBox}
              disabled={isViewMode}
              name="coupon_code"
              label="Coupon name"
              value={values?.coupon_code}
              placeholder="e.g. Welcome Coupon"
              required
              error={Boolean(errors.coupon_code && touched.coupon_code)}
              errorMessage={touched.coupon_code && errors.coupon_code}
            />
          </FieldWrapper>
          <StyleSpan style={{ fontSize: 12 }}>
            The name you specify can consist of only letters and numbers up to
            32 characters long.
          </StyleSpan>
        </Col>
        {/* Coupon Prefix */}
        <Col xs={24} md={12}>
          <FieldWrapper>
            <Field
              as={AitInputBox}
              disabled={isViewMode}
              name="coupon_prefix"
              label="Prefix (optional)"
              value={values?.coupon_prefix}
              placeholder="e.g. Welcome Coupon"
            />
          </FieldWrapper>
          <StyleSpan style={{ fontSize: 12 }}>
            Coupon prefixes can contain letters, numbers and hyphens. Coupon
            codes will be generated by adding 6 random letters and numbers to
            the end of your prefix. If you don't specify a prefix, the coupon
            code will be 8 random letters and numbers. We don't include{' '}
            <strong>I</strong>, <strong>O</strong>, <strong>0</strong>, and{' '}
            <strong>1</strong>.
          </StyleSpan>
        </Col>
        {/* Divider */}
        <Col span={24}>
          <Divider />
        </Col>
        <Col xs={24}>
          <Row gutter={[16, 16]}>
            {/* Discount Type Select */}
            <Col xs={24} md={4}>
              <Field
                as={AitSelectBox}
                disabled={isViewMode}
                name="discount_type"
                label="Discount type"
                value={values?.discount_type}
                onChange={(value) => {
                  setFieldValue('discount_type', value);
                }}
                required
                options={[
                  { label: 'Fixed Amount', value: 'fixed' },
                  { label: 'Percentage off', value: 'percentage' },
                  {
                    label: 'Free Shipping',
                    value: 'freeshipping',
                  },
                ]}
                error={Boolean(errors.discount_type && touched.discount_type)}
                errorMessage={touched.discount_type && errors.discount_type}
              />
            </Col>

            {/* Details Text */}
            <div
              style={{
                display: 'flex',
                marginTop: '26px',
              }}
            >
              <Col xs="auto" style={{ marginTop: 9, marginBottom: 'auto' }}>
                <label style={{ whiteSpace: 'nowrap' }}>
                  {values?.discount_type === 'fixed'
                    ? `Details: ${prefix}`
                    : values?.discount_type === 'percentage'
                      ? 'Details:'
                      : values?.discount_type === 'freeshipping'
                        ? 'Details:'
                        : ''}
                </label>
              </Col>

              {/* Discount Amount Input */}
              <Col xs={24} md={12}>
                <Field
                  as={AitInputBox}
                  disabled={isViewMode}
                  name="discount_amount"
                  value={values?.discount_amount}
                  placeholder="0"
                  error={Boolean(
                    errors.discount_amount && touched.discount_amount
                  )}
                  errorMessage={
                    touched.discount_amount && errors.discount_amount
                  }
                />
              </Col>

              {/* Suffix Text */}
              <Col
                xs={24}
                md={4}
                style={{ marginTop: 9, marginBottom: 'auto' }}
              >
                <label style={{ whiteSpace: 'nowrap' }}>
                  {values?.discount_type === 'fixed'
                    ? `Off${suffix}`
                    : values?.discount_type === 'percentage'
                      ? '% Off'
                      : values?.discount_type === 'freeshipping'
                        ? `For any shipping rate that is less than or equal to ${prefix}`
                        : ''}
                </label>
              </Col>
            </div>
          </Row>
        </Col>
        {/* Optional: Minimum Purchase */}
        <Col xs={24}>
          <HeadingWrapper>
            <Field
              disabled={isViewMode}
              name="minimum_purchase_status"
              as={AitCheckboxButton}
              value={values?.minimum_purchase_status}
              label="This discount requires a minimum purchase"
            />
          </HeadingWrapper>
        </Col>
        {values?.minimum_purchase_status && (
          <Col xs={24} md={6}>
            <Field
              as={AitInputBox}
              disabled={isViewMode}
              name="minimum_purchase"
              value={values?.minimum_purchase}
              placeholder={`${prefix}${suffix}`}
              error={Boolean(
                errors.minimum_purchase && touched.minimum_purchase
              )}
              errorMessage={touched.minimum_purchase && errors.minimum_purchase}
            />
          </Col>
        )}
        {/* Optional Additional Fields (Commented for now) */}
        <Col xs={24}>
          <Divider />
        </Col>
        {(values?.discount_type === 'fixed' ||
          values?.discount_type === 'percentage') && (
          <>
            <Col xs={24}>
              <Title style={{ fontWeight: 500, fontSize: '14px' }}>
                Applies To
              </Title>
            </Col>

            <Col xs={24}>
              <Field
                as={AitRadioButton}
                disabled={isViewMode}
                name="discount_apply_to"
                className="vertical"
                value={values?.discount_apply_to}
                options={[
                  { label: 'Entire order', value: 'entireorder' },
                  { label: 'Select products', value: 'selectedProduct' },
                  { label: 'Select collections', value: 'selectedCollection' },
                ]}
              />
            </Col>
            {values?.discount_apply_to === 'selectedProduct' && (
              <Col xs={24} md={6}>
                <FieldWrapper>
                  <Field
                    as={AitAutocomplete}
                    disabled={isViewMode}
                    name="discount_apply_to_product"
                    value={values?.discount_apply_to_product}
                    label="Select product"
                    placeholder="Select your products"
                    options={productListOptions}
                    onChange={(value) => {
                      setFieldValue('discount_apply_to_product', value);
                    }}
                  />
                </FieldWrapper>
              </Col>
            )}
            {values?.discount_apply_to === 'selectedCollection' && (
              <Col xs={24} md={6}>
                <FieldWrapper>
                  <Field
                    as={AitAutocomplete}
                    disabled={isViewMode}
                    name="discount_apply_to_collection"
                    label="Select collection"
                    value={values?.discount_apply_to_collection}
                    placeholder="Select your collection"
                    options={collectionListOptions}
                    onChange={(value) => {
                      setFieldValue('discount_apply_to_collection', value);
                    }}
                  />
                </FieldWrapper>
              </Col>
            )}
          </>
        )}
        {values?.discount_type === 'freeshipping' && (
          <>
            <Col xs={24}>
              <Title style={{ fontWeight: 500, fontSize: '14px' }}>
                Country Eligibility
              </Title>
            </Col>
            <Col xs={24}>
              <Field
                as={AitRadioButton}
                disabled={isViewMode}
                name="freeshiping_countries_type"
                className="vertical"
                value={values.freeshiping_countries_type}
                onChange={(e) =>
                  setFieldValue('freeshiping_countries_type', e.target.value)
                }
                options={[
                  {
                    label: 'All Countries',
                    value: 'allcountry',
                  },
                  // {
                  //   label: 'Selected Countries',
                  //   value: 'selectedcountries',
                  // },
                ]}
              />
            </Col>
            {/* this code has been replicated in existing live application */}

            {/* {values?.freeshiping_countries_type === 'selectedcountries' && (
              <Col xs={24} md={4}>
                <Field
                  as={AitSelectBox}
                   disabled={isViewMode}
                  name="freeshiping_selected_country"
                  label="Select country"
                  value={values.freeshiping_selected_country}
                  required
                  options={[
                    { label: 'Fixed Amount', value: 'fixed' },
                    { label: 'Percentage off', value: 'percentage' },
                    {
                      label: 'Free Shipping',
                      value: 'freeShipping',
                    },
                  ]}
                  // option=countryList
                  onChange={(value) => {
                    setFieldValue('freeshiping_selected_country', value);
                  }}
                  error={Boolean(
                    errors.freeshiping_selected_country &&
                      touched.freeshiping_selected_country
                  )}
                  errorMessage={
                    touched.freeshiping_selected_country &&
                    errors.freeshiping_selected_country
                  }
                />
              </Col>
            )} */}
          </>
        )}
        <Col xs={24}>
          <HeadingWrapper>
            <Title type="primary" style={{ fontSize: '14px' }}>
              Activation
            </Title>
          </HeadingWrapper>
        </Col>
        {/* Bulk generator → show both options */}
        {values.discount_generator_type === '1' && (
          <Col xs={24}>
            <Field
              as={AitRadioButton}
              disabled={isViewMode}
              name="discount_activation_type"
              className="vertical"
              value={values.discount_activation_type}
              onChange={(e) =>
                setFieldValue('discount_activation_type', e.target.value)
              }
              options={[
                {
                  label:
                    'Generated coupon codes will become active when they are sent out',
                  value: 'instant',
                },
                {
                  label:
                    'This discount has a defined start date, after which generated codes will become active',
                  value: 'selectedDate',
                },
              ]}
            />
          </Col>
        )}
        {/* Real-time generator → only show info text (and force instant type) */}
        {values.discount_generator_type === '2' && (
          <Col xs={24}>
            <Field
              as={AitRadioButton}
              disabled={isViewMode}
              name="discount_activation_type"
              className="vertical"
              value={values.discount_activation_type}
              onChange={(e) =>
                setFieldValue('discount_activation_type', 'instant')
              }
              options={[
                {
                  label:
                    'Generated coupon codes will become active when they are sent out',
                  value: 'instant',
                },
              ]}
            />
          </Col>
        )}
        {/* Show date picker only if “selectedDate” selected AND generator = bulk */}
        {values.discount_generator_type === '1' &&
          values.discount_activation_type === 'selectedDate' && (
            <Col xs={24} md={6}>
              <FieldWrapper>
                <Field
                  as={AitDatePicker}
                  disabled={isViewMode}
                  name="discount_activation_date"
                  placeholder="Select date"
                  value={
                    values.discount_activation_date
                      ? dayjs(
                          values.discount_activation_date,
                          'DD-MM-YYYY HH:mm'
                        )
                      : null
                  }
                  format="DD-MM-YYYY HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  disabledDate={disablePastDate}
                  disabledTime={disablePastTime}
                  onChange={(date) =>
                    setFieldValue('discount_activation_date', date)
                  }
                  error={Boolean(
                    errors.discount_activation_date &&
                      touched.discount_activation_date
                  )}
                  errorMessage={
                    touched.discount_activation_date &&
                    errors.discount_activation_date
                  }
                />
              </FieldWrapper>
            </Col>
          )}
        <Col xs={24}>
          <HeadingWrapper>
            <Title type="primary" style={{ fontWeight: 500, fontSize: '14px' }}>
              Usage limits
            </Title>
          </HeadingWrapper>
        </Col>
        <Col xs={24}>
          <HeadingWrapper>
            <Field
              disabled={isViewMode}
              name="is_discount_code_limit"
              as={AitCheckboxButton}
              value={values.is_discount_code_limit}
              label="Limit number of times this discount can be used in total"
            />
          </HeadingWrapper>
        </Col>
        {values?.is_discount_code_limit && (
          <Col xs={24} sm={6} style={{ marginBottom: 20 }}>
            <FieldWrapper>
              <Field
                as={AitInputBox}
                disabled={isViewMode}
                name="usage_limit"
                value={values.usage_limit}
                placeholder="1"
                label="" // remove label to avoid spacing
                error={Boolean(errors.usage_limit && touched.usage_limit)}
                errorMessage={touched.usage_limit && errors.usage_limit}
              />
            </FieldWrapper>
          </Col>
        )}
        <Col xs={24}>
          <Field
            as={AitCheckboxButton}
            disabled={isViewMode}
            name="once_per_customer"
            value={values.once_per_customer}
            label="Limit to one use per customer's"
          />
        </Col>
        {/* Expiration Section */}
        <Col xs={24}>
          <HeadingWrapper>
            <Title type="primary" style={{ fontWeight: 500, fontSize: '14px' }}>
              Expiration
            </Title>
          </HeadingWrapper>
        </Col>
        <Col xs={24}>
          <Field
            as={AitRadioButton}
            disabled={isViewMode}
            name="discount_expiration_type"
            className="vertical"
            value={values.discount_expiration_type}
            onChange={(e) =>
              setFieldValue('discount_expiration_type', e.target.value)
            }
            options={
              values.discount_generator_type === '2'
                ? [
                    {
                      label: 'Generated coupon codes will never expire',
                      value: 'never',
                    },
                    {
                      label:
                        'Generated coupon codes for this discount will expire after a certain number of days',
                      value: 'daysHours',
                    },
                  ]
                : [
                    {
                      label: 'Generated coupon codes will never expire',
                      value: 'never',
                    },
                    {
                      label:
                        'This discount has a defined end date, after which generated codes will expire',
                      value: 'selectedDate',
                    },
                  ]
            }
          />
        </Col>
        {/* Conditionally render input or date picker */}
        {values.discount_expiration_type === 'daysHours' && (
          <Col xs={24} md={6}>
            <FieldWrapper>
              <Field
                as={AitInputBox}
                disabled={isViewMode}
                name="discount_expiration_days_hrs_val"
                // label="Generated coupon codes for this discount will expire after a certain number of days"
                placeholder="Days"
                value={values.discount_expiration_days_hrs_val}
                onChange={(e) =>
                  setFieldValue(
                    'discount_expiration_days_hrs_val',
                    e.target.value
                  )
                }
                error={Boolean(
                  errors.discount_expiration_days_hrs_val &&
                    touched.discount_expiration_days_hrs_val
                )}
                errorMessage={
                  touched.discount_expiration_days_hrs_val &&
                  errors.discount_expiration_days_hrs_val
                }
              />
            </FieldWrapper>
          </Col>
        )}

        {values.discount_expiration_type === 'selectedDate' && (
          <Col xs={24} md={6}>
            <FieldWrapper>
              <Field
                as={AitDatePicker}
                disabled={isViewMode}
                name="discount_expiration_date"
                placeholder="Select date"
                value={
                  values.discount_expiration_date
                    ? dayjs(values.discount_expiration_date, 'DD-MM-YYYY HH:mm')
                    : null
                }
                format="DD-MM-YYYY HH:mm"
                showTime={{ format: 'HH:mm' }}
                disabledDate={disablePastDate}
                disabledTime={disablePastTime}
                onChange={(date) => {
                  setFieldValue('discount_expiration_date', date);
                }}
                error={Boolean(
                  errors.discount_expiration_date &&
                    touched.discount_expiration_date
                )}
                errorMessage={
                  touched.discount_expiration_date &&
                  errors.discount_expiration_date
                }
              />
            </FieldWrapper>
          </Col>
        )}
        <Col xs={24}>
          <Divider />
        </Col>
        <Col xs={24} md={6}>
          <FieldWrapper>
            <Field
              as={AitSelectBox}
              disabled={isViewMode}
              name="selected_time_zone"
              label="Select time zone"
              value={values.selected_time_zone}
              placeholder="Select your"
              options={timeZoneList?.map((tz) => ({
                label: tz.value,
                value: tz.name,
              }))}
              onChange={(value) => {
                setFieldValue('selected_time_zone', value);
              }}
              error={Boolean(
                errors.selected_time_zone && touched.selected_time_zone
              )}
              errorMessage={
                touched.selected_time_zone && errors.selected_time_zone
              }
            />
          </FieldWrapper>
        </Col>
        {!isViewMode && (
          <Col
            xs={24}
            style={{
              marginTop: '10px',
              padding: '10px',
              display: 'flex',
              gap: '12px', // 👈 sets spacing between buttons
              flexWrap: 'wrap',
            }}
          >
            <AitButton
              htmlType="submit"
              title={isEditMode ? 'Update coupon' : 'Add coupon'}
              type="primary"
              loading={couponsState?.createCouponLoading}
            />
            {isEditMode && (
              <AitButton
                htmlType="button"
                variant="outlined"
                color="primary"
                title="Cancel"
                onClick={() => {
                  router.push('/email-marketing/coupons/list');
                }}
              />
            )}
          </Col>
        )}
      </Row>
    </>
  );
};

export default CreateCouponForm;
