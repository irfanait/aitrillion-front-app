import React, { useEffect, useState } from 'react';
import { LeftSection, StyledCol } from './style';
import AitBlockWrapper from '@/components/atoms/ait-block-wrapper/aitBlockWrapper';
import { Alert, Col, Divider, Row, Spin, Tag, Tooltip, Typography } from 'antd';
import AitFieldWrapper from '@/components/atoms/ait-fiels-wrapper/AatFieldWrapper';
import { Field } from 'formik';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import AitAutocomplete from '@/components/atoms/ait-autocomplete/aitAutocomplete';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitDatePicker from '@/components/atoms/ait-date-picker/aitDatePicker';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import { useDispatch, useSelector } from 'react-redux';
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { fetchAudienceCount } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { validateFetchAudienceCounts } from '../../utils/validation';
import {
  resetCustomerCount,
  setAudienceCountFilter,
} from '@/redux/email-marketing-slices/campaignSlice/fetchAudienceCountSlice';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { disablePastDate, disablePastTime } from '../../utils/helper';
import InactiveCustomerAlertBar from '../../atoms/inactive-customer-alert-bar/inactiveCustomerAlertBar';

const { Title: AntTitle } = Typography;

const CreateCampaignLeftSectionNew = (props) => {
  const {
    formik,
    setCampaignInitialData,
    handleSendTestEmailModalOpen,
    handleCreateAbTest,
    isEditMode,
    setWasSubjectAutoFilled,
  } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    values,
    setFieldValue,
    errors,
    touched,
    validateForm,
    setFieldError,
  } = formik;

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );
  const { emailCampaignData, campaignDetailsData } = campaignState;

  const getAudienceCountState = useSelector(
    (state) => state.getAudienceCountState
  );

  const { login_auth } = useSelector((state) => state.jwtState);

  const [shortcodeList, setShortcodeList] = useState([]);
  const [includeAudienceList, setIncludeAudienceList] = useState([]);
  const [includeSegmentList, setIncludeSegmentList] = useState([]);
  const [showExcludeAudience, setShowExcludeAudience] = useState(false);
  const [textCopy, setTextCopy] = useState('Copy');

  useEffect(() => {
    if (!router.isReady) return;
    if (!router?.query?.segmentId || !isEditMode || !router?.query?.listId) {
      dispatch(resetCustomerCount());
    }
  }, [
    router?.query?.segmentId,
    router?.query?.listId,
    isEditMode,
    router.isReady,
    dispatch,
  ]);

  useEffect(() => {
    const {
      initCustomerApiState,
      createCampaignLists,
      audienceListApiState,
      audienceList,
      segmentListApiState,
      segmentList,
    } = campaignState;
    if (
      initCustomerApiState === 'success' &&
      createCampaignLists?.moduleFieldsRows?.length > 0
    ) {
      const shortcodeOptions = createCampaignLists?.moduleFieldsRows?.map(
        (item) => ({
          label: item.field_name, // for dropdown display
          value: item.id, // unique id
          alias: item.db_column_alias, // 👈 keep alias for copy
        })
      );
      setShortcodeList(shortcodeOptions);
    }

    if (audienceListApiState === 'success' && audienceList?.length > 0) {
      const includeAudienceList = audienceList?.map((item) => ({
        label: item.external_name,
        value: item.id,
      }));
      setIncludeAudienceList(includeAudienceList);
    }
    if (segmentListApiState === 'success' && segmentList?.length > 0) {
      const includeSegment = segmentList?.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      setIncludeSegmentList(includeSegment);
    }
  }, [
    campaignState?.audienceListApiState,
    campaignState?.initCustomerApiState,
    campaignState?.segmentListApiState,
  ]);

  const [hasFetchedAudience, setHasFetchedAudience] = useState(false);

  useEffect(() => {
    const isCloneCampaign = router?.query?.from === 'clone-campaign';

    // ✅ Skip fetching if it's a cloned campaign
    if (isCloneCampaign) {
      handleCliearAudienceFilter(setFieldValue);
      setHasFetchedAudience(false);
      return;
    }

    if (
      isEditMode &&
      campaignDetailsData?.campaignInfo &&
      !hasFetchedAudience
    ) {
      setShowExcludeAudience(true);

      const include_lists =
        campaignDetailsData?.campaignInfo?.include_lists
          ?.split(',')
          .filter(Boolean) || [];
      const include_segments =
        campaignDetailsData?.campaignInfo?.include_segments
          ?.split(',')
          .filter(Boolean) || [];

      const hasAudience =
        include_lists.length > 0 || include_segments.length > 0;

      if (hasAudience) {
        handleFetchAudienceCounts(
          {
            ...values,
            include_lists,
            include_segments,
          },
          validateForm,
          setFieldError
        );
        setHasFetchedAudience(true);
      }
    }
  }, [
    isEditMode,
    campaignDetailsData,
    hasFetchedAudience,
    router?.query?.from,
  ]);

  // when segmentId and listId in the query from the all customer or list page
  useEffect(() => {
    if (!router.isReady) return;

    const listId = router.query.listId;
    const segId = router.query.segmentId;

    // Wait until dropdown data is loaded
    if (
      (listId && includeAudienceList.length === 0) ||
      (segId && includeSegmentList.length === 0)
    ) {
      return;
    }

    // Prevent re-running after API updates
    if (hasFetchedAudience) return;

    // Auto select listId
    if (listId) {
      const matchedList = includeAudienceList.find(
        (l) => String(l.value) === String(listId)
      );

      if (matchedList) {
        // Set Formik value
        setFieldValue('include_lists', [matchedList.value]);

        // Trigger fetch AFTER formik sets value
        setTimeout(() => {
          handleFetchAudienceCounts(
            {
              include_lists: [matchedList.value],
            },
            setFieldError
          );
        }, 50);

        setHasFetchedAudience(true);
        return;
      }
    }

    // Auto select segmentId
    if (segId) {
      const matchedSeg = includeSegmentList.find(
        (s) => String(s.value) === String(segId)
      );

      if (matchedSeg) {
        setFieldValue('include_segments', [matchedSeg.value]);

        setTimeout(() => {
          handleFetchAudienceCounts(
            {
              include_segments: [matchedSeg.value],
            },
            setFieldError
          );
        }, 50);

        setHasFetchedAudience(true);
      }
    }

    if (
      (router.query.segmentId && includeSegmentList.length > 0) ||
      (router.query.listId && includeAudienceList.length > 0)
    ) {
      setHasFetchedAudience(false);
    }
  }, [
    router.isReady,
    router.query.listId,
    router.query.segmentId,
    includeAudienceList,
    includeSegmentList,
  ]);

  const handleFetchAudienceCounts = async (values, setFieldError) => {
    //  Run validation using your fixed validator
    const fetchErrors = validateFetchAudienceCounts(values);

    //  If validation fails → set field errors and stop
    if (Object.keys(fetchErrors).length > 0) {
      Object.entries(fetchErrors).forEach(([field, message]) => {
        formik.setFieldTouched(field, true, false);
        setFieldError(field, message);
      });
      return;
    }

    //  Build payload dynamically based on selected include/exclude
    const {
      include_lists = [],
      include_segments = [],
      exclude_lists = [],
      exclude_segments = [],
    } = values ?? {};

    const payload = {
      act: 'get_customers_count',
      act_module: 'email',
      returnType: 'count',
    };

    if (include_lists?.length > 0) payload.include_lists = include_lists;
    if (include_segments?.length > 0)
      payload.include_segments = include_segments;
    if (exclude_lists?.length > 0) payload.exclude_lists = exclude_lists;
    if (exclude_segments?.length > 0)
      payload.exclude_segments = exclude_segments;

    //  final clean-up: drop keys if they are empty
    Object.keys(payload).forEach((k) => {
      if (Array.isArray(payload[k]) && payload[k].length === 0) {
        delete payload[k];
      }
    });

    dispatch(setAudienceCountFilter(payload));
    dispatch(fetchAudienceCount());
  };

  const handleCliearAudienceFilter = (setFieldValue) => {
    setFieldValue('include_lists', []);
    setFieldValue('include_segments', []);
    setFieldValue('exclude_lists', []);
    setFieldValue('exclude_segments', []);
    if (!router?.query?.segmentId) {
      dispatch(resetCustomerCount());
    }
  };

  return (
    <LeftSection style={{ paddingTop: '20px' }}>
      <AitBlockWrapper padding="0px 25px 10px 25px">
        <Row gutter={16}>
          <Col span={24}>
            <AntTitle
              level={3}
            >{`${isEditMode ? `Edit` : `Create`} email campaign`}</AntTitle>
          </Col>
        </Row>
      </AitBlockWrapper>
      <AitBlockWrapper padding="0px 25px 10px 25px">
        <Row gutter={16}>
          <Col span={24}>
            <AitFieldWrapper>
              <Field
                as={AitInputBox}
                name="campaignName"
                label="Campaign name"
                value={values?.campaignName}
                onChange={(e) => {
                  setFieldValue('campaignName', e.target.value);
                  setCampaignInitialData({
                    ...formik.values,
                    campaignName: e.target.value,
                  });
                }}
                placeholder="Enter campaign name"
                required
                error={touched.campaignName && !!errors.campaignName}
                errorMessage={errors.campaignName}
              />
            </AitFieldWrapper>
          </Col>

          <Col span={24}>
            <AitFieldWrapper>
              <Field
                as={AitInputBox}
                name="EmailNotificationfromSubject"
                label="Subject"
                value={values?.EmailNotificationfromSubject}
                onChange={(e) => {
                  setFieldValue('EmailNotificationfromSubject', e.target.value);
                  setWasSubjectAutoFilled(false);
                }}
                placeholder="Subject"
                required
                error={
                  touched.EmailNotificationfromSubject &&
                  Boolean(errors.EmailNotificationfromSubject)
                }
                errorMessage={
                  touched.EmailNotificationfromSubject
                    ? errors.EmailNotificationfromSubject
                    : ''
                }
              />
            </AitFieldWrapper>
          </Col>
          <Col span={24}>
            <AitFieldWrapper margin="0px 0px 10px 0px">
              <Field
                as={AitSelectBox}
                name="shortcode"
                label="Shortcode"
                placeholder="Select shortcode"
                value={values?.shortcode}
                onChange={(value) => setFieldValue('shortcode', value)}
                options={shortcodeList}
                noDataMessage="No results found"
                error={touched.shortcode && !!errors.shortcode}
                errorMessage={errors.shortcode}
              />
            </AitFieldWrapper>
          </Col>

          {values?.shortcode && (
            <Col span={24}>
              <AitFieldWrapper margin="0px 0px 10px 0px">
                <Field name="shortcode">
                  {() => {
                    const selected = shortcodeList.find(
                      (item) => item.value === values.shortcode
                    );

                    const alias = selected?.alias || '';

                    return (
                      <AitInputBox
                        disabled
                        value={`{{${alias}}}`} // 👈 use alias in input
                        style={{
                          color: 'var(--ant-color-text-contol) !important',
                          opacity: 0.7,
                        }}
                        suffix={
                          <Tooltip title={textCopy}>
                            <CopyOutlined
                              onClick={() => {
                                navigator.clipboard.writeText(`{{${alias}}}`);
                                setTextCopy('Copied!');
                                setTimeout(() => {
                                  setTextCopy('Copy');
                                }, 1000);
                              }}
                              style={{
                                cursor: 'pointer',
                                color: '#000',
                                fontSize: '18px',
                                transition: 'color 0.3s',
                              }}
                            />
                          </Tooltip>
                        }
                      />
                    );
                  }}
                </Field>
              </AitFieldWrapper>
            </Col>
          )}
        </Row>
      </AitBlockWrapper>

      <AitCollapse
        itemHeaderPadding="15px 25px"
        itemBodyPadding={{ xs: '0px 0px', sm: '0px 0px', md: '0px 0px' }}
        defaultActiveKey={['1', '2', '3']}
        minimumCustomerCount={0}
        itemSpacing="0px"
        firstItemTopspacing="0px"
        collapseIconTopSpacing="0px"
        collapseIconBotSpacing="0px"
        headerLeftRightTopSpacing="0px"
        bodyBorderTop="none"
        panels={[
          {
            key: '1',
            title: 'Target audience',
            extra: (
              <>
                <>
                  {getAudienceCountState?.fetchAudienceLoading ? (
                    <Spin />
                  ) : values?.include_lists?.length > 0 ||
                    values?.include_segments?.length > 0 ? (
                    getAudienceCountState?.fetchAudienceCountApiState ===
                    'success' ? (
                      `${getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers} customers`
                    ) : null
                  ) : null}
                </>
              </>
            ),
            children: (
              <AitBlockWrapper padding="0px 25px">
                <Row gutter={[16]}>
                  {/* {getAudienceCountState?.fetchAudienceCounts
                    ?.totalinactiverecord > 0 && (
                    <Alert
                      message={
                        <>
                          You have total{' '}
                          <b>
                            {' '}
                            {
                              getAudienceCountState?.fetchAudienceCounts
                                ?.totalinactiverecord
                            }{' '}
                            inactive contact
                          </b>{' '}
                          in your account, currently excluded from your email
                          marketing. Want to include them? Just mark them as
                          active!{' '}
                          <Link
                            target="_blank"
                            href={`${process.env.NEXT_PUBLIC_APP_URL}/customers#/list`}
                          >
                            Click Here
                          </Link>
                        </>
                      }
                      type="warning"
                      showIcon
                      banner
                      style={{ marginBottom: 16 }}
                    />
                  )} */}
                  <StyledCol span={24}>
                    <InactiveCustomerAlertBar
                      getAudienceCountState={getAudienceCountState}
                    />
                  </StyledCol>
                  <StyledCol span={24}>
                    <AitFieldWrapper margin="0px 0px 10px 0px">
                      <Field
                        as={AitAutocomplete}
                        name="include_lists"
                        placeholder="Choose list"
                        label="Include audience"
                        value={values?.include_lists}
                        onChange={(value) => {
                          if (
                            !value ||
                            (Array.isArray(value) && value.length === 0)
                          ) {
                            setFieldValue('include_lists', []);
                          } else {
                            setFieldValue('include_lists', value);
                          }
                        }}
                        labelIcon={<InfoCircleOutlined />}
                        tooltipText='Exclude audience would not work If you will select  "All" in "Choose segment". In the case of selecting "All" all active customers will include.'
                        options={includeAudienceList}
                        noDataMessage="No results found"
                        error={
                          touched.include_lists && Boolean(errors.include_lists)
                        }
                        errorMessage={
                          touched.include_lists ? errors.include_lists : ''
                        }
                      />
                    </AitFieldWrapper>
                  </StyledCol>
                  <Col span={24}>
                    <AitFieldWrapper>
                      <Field
                        as={AitAutocomplete}
                        name="include_segments"
                        placeholder="Choose segment"
                        value={values?.include_segments}
                        onChange={(value) => {
                          // setFieldValue(
                          //   'include_segments',
                          //   Array.isArray(value) && value.length > 0
                          //     ? value
                          //     : []
                          // );
                          if (
                            !value ||
                            (Array.isArray(value) && value.length === 0)
                          ) {
                            setFieldValue('include_segments', []);
                          } else {
                            setFieldValue('include_segments', value);
                          }
                        }}
                        options={includeSegmentList}
                        noDataMessage="No results found"
                        error={
                          touched.include_segments &&
                          Boolean(errors.include_segments)
                        }
                        errorMessage={
                          touched.include_segments
                            ? errors.include_segments
                            : ''
                        }
                      />
                    </AitFieldWrapper>
                  </Col>

                  <Divider
                    plain
                    orientation="center"
                    style={{
                      borderTopStyle: 'solid',
                      borderTopColor: '#d9d9d9',
                      margin: '10px 0px 20px 0px',
                    }}
                  >
                    <Tag
                      color="blue"
                      style={{
                        cursor: 'pointer',
                        fontWeight: 500,
                        padding: '4px 12px',
                        marginInlineEnd: '0px',
                      }}
                      onClick={() => setShowExcludeAudience((prev) => !prev)}
                    >
                      + Exclude audience (optional)
                    </Tag>
                  </Divider>

                  {showExcludeAudience && (
                    <>
                      <Col span={24}>
                        <AitFieldWrapper margin="0px 0px 10px 0px">
                          <Field
                            as={AitAutocomplete}
                            name="exclude_lists"
                            label="Exclude audience"
                            placeholder="Choose list"
                            value={values?.exclude_lists}
                            onChange={(value) =>
                              setFieldValue(
                                'exclude_lists',
                                Array.isArray(value) && value.length > 0
                                  ? value
                                  : []
                              )
                            }
                            options={includeAudienceList}
                            noDataMessage="No results found"
                            error={
                              touched.exclude_lists &&
                              Boolean(errors.exclude_lists)
                            }
                            errorMessage={
                              touched.exclude_lists ? errors.exclude_lists : ''
                            }
                          />
                        </AitFieldWrapper>
                      </Col>
                      <Col span={24}>
                        <AitFieldWrapper>
                          <Field
                            as={AitAutocomplete}
                            name="exclude_segments"
                            placeholder="Choose segment"
                            value={values?.exclude_segments}
                            onChange={(value) =>
                              setFieldValue(
                                'exclude_segments',
                                Array.isArray(value) && value.length > 0
                                  ? value
                                  : []
                              )
                            }
                            options={includeSegmentList}
                            noDataMessage="No results found"
                            error={
                              touched.exclude_segments &&
                              Boolean(errors.exclude_segments)
                            }
                            errorMessage={
                              touched.exclude_segments
                                ? errors.exclude_segments
                                : ''
                            }
                          />
                        </AitFieldWrapper>
                      </Col>
                    </>
                  )}

                  <Col span={24}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <AitFieldWrapper>
                          <AitButton
                            title="Fetch audience"
                            htmlType="button"
                            type="primary"
                            onClick={() => {
                              handleFetchAudienceCounts(values, setFieldError);
                            }}
                            loading={
                              getAudienceCountState?.fetchAudienceCountApiState ===
                              'pending'
                            }
                            style={{
                              width: '100%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                            }}
                          />
                        </AitFieldWrapper>
                      </Col>
                      <Col span={12}>
                        <AitButton
                          variant="outlined"
                          color="primary"
                          title="Clear"
                          onClick={() => {
                            handleCliearAudienceFilter(setFieldValue);
                          }}
                          style={{ width: '100%' }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </AitBlockWrapper>
            ),
          },
          {
            key: '2',
            title: 'Email settings',
            children: (
              <AitBlockWrapper padding="0px 25px">
                <Row gutter={16}>
                  <Col span={24}>
                    <AitFieldWrapper>
                      <Field
                        as={AitInputBox}
                        name="emailNotificationfromEmail"
                        label="Sender's email address"
                        placeholder="Email address"
                        addonAfter={emailCampaignData?.email_data?.domain_name}
                        value={values?.emailNotificationfromEmail}
                        error={
                          touched.emailNotificationfromEmail &&
                          !!errors.emailNotificationfromEmail
                        }
                        errorMessage={errors.emailNotificationfromEmail}
                      />
                      {emailCampaignData?.email_data?.dkim_status === 0 && (
                        <Alert
                          style={{
                            border: 'none',
                            marginTop: '5px',
                            borderRadius: '0px',
                          }}
                          message={
                            <>
                              If you want to change email, please set DKIM from{' '}
                              <Link href="/email-marketing/settings/dkimsetting">
                                here
                              </Link>
                              .
                            </>
                          }
                          type="warning"
                          showIcon
                        />
                      )}
                    </AitFieldWrapper>
                  </Col>

                  <Col span={24}>
                    <AitFieldWrapper>
                      <Field
                        as={AitInputBox}
                        name="emailNotificationfromName"
                        label="Sender's name"
                        placeholder="Enter Sender's name"
                        value={values?.emailNotificationfromName}
                        error={
                          touched.emailNotificationfromName &&
                          Boolean(errors.emailNotificationfromName)
                        }
                        errorMessage={
                          touched.emailNotificationfromName
                            ? errors.emailNotificationfromName
                            : ''
                        }
                      />
                    </AitFieldWrapper>
                  </Col>
                  <Col span={24}>
                    <AitFieldWrapper>
                      <Field
                        as={AitInputBox}
                        name="emailNotificationfromReplyTo"
                        required
                        label="Reply to email"
                        placeholder="Enter Reply to email"
                        value={values?.emailNotificationfromReplyTo}
                        error={
                          touched.emailNotificationfromReplyTo &&
                          !!errors.emailNotificationfromReplyTo
                        }
                        errorMessage={errors.emailNotificationfromReplyTo}
                      />
                    </AitFieldWrapper>
                  </Col>
                </Row>
              </AitBlockWrapper>
            ),
          },
          {
            key: '3',
            title: 'When to send',
            children: (
              <AitBlockWrapper padding="0px 25px">
                <AitRadioButton
                  name="whenToSend"
                  className="vertical"
                  value={values?.whenToSend}
                  onChange={(e) => setFieldValue('whenToSend', e.target.value)}
                  options={[
                    { label: 'Send now', value: 'now' },
                    { label: 'Schedule', value: 'scheduled' },
                    { label: 'Keep in draft', value: 'draft' },
                  ]}
                />
                {values?.whenToSend === 'scheduled' && (
                  <Row gutter={16}>
                    <Col span={24}>
                      <AitFieldWrapper>
                        <Field
                          as={AitDatePicker}
                          name="sentDate"
                          label="Select date"
                          placeholder="mm-dd-yyyy"
                          disabledDate={disablePastDate}
                          // disabledTime={disablePastTime}
                          value={values?.sentDate} // now stored as moment, not string
                          onChange={(val) => setFieldValue('sentDate', val)} // val is moment
                          error={touched.sentDate && !!errors.sentDate}
                          errorMessage={errors.sentDate}
                        />
                      </AitFieldWrapper>
                    </Col>

                    <Col span={24}>
                      <AitFieldWrapper>
                        <Field
                          as={AitSelectBox}
                          name="selectedTimezone"
                          label="Select time zone"
                          placeholder="Select time zone"
                          options={emailCampaignData?.timeZone?.map((tz) => ({
                            label: tz.value,
                            value: tz.name,
                          }))}
                          value={values?.selectedTimezone}
                          onChange={(val) => {
                            setFieldValue('selectedTimezone', val);
                          }}
                          error={
                            touched.selectedTimezone &&
                            !!errors.selectedTimezone
                          }
                          errorMessage={errors.selectedTimezone}
                        />
                      </AitFieldWrapper>
                    </Col>
                  </Row>
                )}
              </AitBlockWrapper>
            ),
          },
        ]}
      />
      <AitBlockWrapper padding="0px 25px">
        <AitCheckboxButton
          name="customUtm"
          label="Custom UTM parameters"
          value={values?.customUtm}
          onChange={(e) => setFieldValue('customUtm', e.target.checked)}
          error={touched.customUtm && Boolean(errors.customUtm)}
          errorMessage={touched.customUtm && errors.customUtm}
        />
        {values?.customUtm && (
          <Row gutter={16}>
            <Col span={24}>
              <AitFieldWrapper>
                <Field
                  as={AitInputBox}
                  name="utm_source"
                  label="UTM source "
                  values={values?.utm_source}
                  placeholder="Enter UTM source"
                  onChange={(e) => setFieldValue('utm_source', e.target.value)}
                  required
                  error={touched.utm_source && !!errors.utm_source}
                  errorMessage={errors.utm_source}
                />
              </AitFieldWrapper>
            </Col>

            <Col span={24}>
              <AitFieldWrapper>
                <Field
                  as={AitInputBox}
                  name="utm_medium"
                  label="UTM medium"
                  value={values?.utm_medium}
                  onChange={(e) => setFieldValue('utm_medium', e.target.value)}
                  placeholder="Enter UTM medium"
                  required
                  error={touched.utm_medium && !!errors.utm_medium}
                  errorMessage={errors.utm_medium}
                />
              </AitFieldWrapper>
            </Col>

            <Col span={24}>
              <AitFieldWrapper>
                <Field
                  as={AitInputBox}
                  name="utm_campaign"
                  label="UTM campaign"
                  value={values?.utm_campaign}
                  placeholder="Enter UTM campaign"
                  onChange={(e) =>
                    setFieldValue('utm_campaign', e.target.value)
                  }
                  required
                  error={touched.utm_campaign && !!errors.utm_campaign}
                  errorMessage={errors.utm_campaign}
                />
              </AitFieldWrapper>
            </Col>
            <Col span={24}>
              <AitFieldWrapper>
                <Field
                  as={AitInputBox}
                  name="utm_term"
                  label="UTM term"
                  value={values?.utm_term}
                  placeholder="Enter UTM term"
                  onChange={(e) => setFieldValue('utm_term', e.target.value)}
                  error={touched.utm_term && !!errors.utm_term}
                  errorMessage={errors.utm_term}
                />
              </AitFieldWrapper>
            </Col>
            <Col span={24}>
              <AitFieldWrapper>
                <Field
                  as={AitInputBox}
                  name="utm_content"
                  label="UTM content"
                  onChange={(e) => setFieldValue('utm_content', e.target.value)}
                  value={values?.utm_content}
                  placeholder="Enter UTM content"
                  error={touched.utm_content && !!errors.utm_content}
                  errorMessage={errors.utm_content}
                />
              </AitFieldWrapper>
            </Col>
          </Row>
        )}
      </AitBlockWrapper>
      <AitBlockWrapper padding="0px 25px 25px">
        <Row gutter={[0, 10]}>
          <Col span={24}>
            <AitFieldWrapper margin="0px">
              <AitButton
                htmlType="button"
                variant="outlined"
                color="primary"
                title="Send a test message"
                disabled={login_auth?.is_email_campaign_suspicious === '1'}
                onClick={() => {
                  handleSendTestEmailModalOpen(values, setFieldError);
                }}
                style={{
                  width: '100%',
                  color: '#1A73E8',
                  fontWeight: 500,
                }}
              />
            </AitFieldWrapper>
          </Col>
          <Col span={24}>
            <AitButton
              variant="outlined"
              color="primary"
              htmlType="button"
              title="Create A/B test"
              rightTagLabel="NEW"
              rightTagColor="#e3fbf1"
              style={{
                width: '100%',
              }}
              loading={
                (campaignState?.sendEmailApiState === 'pending' ||
                  campaignState?.sendEmailLoading) &&
                campaignState?.currentEmailAct === 'campaign_ab_test'
              }
              onClick={() => {
                handleCreateAbTest(values);
              }}
            />
          </Col>
          <Col span={24}>
            <AitButton
              htmlType="submit"
              type="primary"
              title={
                values?.whenToSend === 'draft'
                  ? 'Save draft'
                  : values?.whenToSend === 'scheduled'
                    ? 'Schedule'
                    : 'Send now'
              }
              loading={
                campaignState?.aiShopSettingApiState === 'pending' ||
                ((campaignState?.sendEmailApiState === 'pending' ||
                  campaignState?.sendEmailLoading) &&
                  (campaignState?.currentEmailAct ===
                    'insert_email_message_log' ||
                    campaignState?.currentEmailAct ===
                      'insert_email_log_with_draft' ||
                    campaignState?.currentEmailAct === 'save_draft'))
              }
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </AitBlockWrapper>
    </LeftSection>
  );
};

export default CreateCampaignLeftSectionNew;
