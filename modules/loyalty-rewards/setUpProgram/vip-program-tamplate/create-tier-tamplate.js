/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { HelperText, Label, TextContainer, TierIconStyle } from './style';
import AitCard from '@/components/atoms/ait-card/aitCard';
import {
  App,
  Col,
  ColorPicker,
  Divider,
  Flex,
  Form,
  Row,
  Space,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import AitUpload from '@/components/atoms/ait-upload';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import TextEditor from '@/components/atoms/ait-text-editer';
import {
  convertToFormDataCustom,
  enterOnlyNumericValue,
  validateImageFile,
} from '@/utils/common.util';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { moduleRoute } from '@/modules/layouts/routeControl/route';
import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  saveTierRemoteService,
  updateTierRemoteService,
} from '../../api/vipProgram';
import logger from '@/utils/logger';
import { ModalAlertIcon } from '../../svg-icons';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import AitText from '@/components/atoms/ait-text/aitText';
import dynamic from 'next/dynamic';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

const { Text } = Typography;

function CreateTierTamplate({
  form,
  vipProgramData,
  getVipProgramData,
  setTierCreateModal,
  rowData,
  setDefualtLogo,
  defaultlogo,
  onCancel,
  setRowData,
  state,
  setState,
}) {
  const { notification } = App.useApp();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tierLogo, setTierLogo] = useState(null);

  // const TextEditor = dynamic(
  //   () => import('@/components/atoms/ait-text-editer'),
  //   {
  //     ssr: false,
  //   }
  // );

  useEffect(() => {
    if (rowData?.id) {
      const formValues = {
        tiername: rowData?.tier_name || '',
        tierdescription: decodeURIComponent(rowData?.tier_description) || '',
        pointlimit: rowData?.auto_upgrade || '',
        tier_color: `#${rowData?.tier_color}` || '#FFFFFF',
        tierlogo: '',
        customer_tag: rowData?.customer_tag || '',
        customer_bonus: rowData?.customer_bonus || '',
        customer_bithday: rowData?.birthday_point || '',
        tiernameemail: rowData?.tier_email_sub || '',
        enable_tier_additional_benifits:
          parseInt(rowData?.enable_tier_additional_benifits) === 1,
        hide_point_graph: parseInt(rowData?.hide_point_graph) === 1,
        hide_point_bar: parseInt(rowData?.hide_point_bar) === 1,
        customerpointearn: rowData?.customer_point || '',
      };

      form.setFieldsValue(formValues);
      setTierLogo(null);
      setDefualtLogo('');

      setState({
        customerpointearn: rowData?.customer_point || '',
        customer_bonus: rowData?.customer_bonus || '',
        customer_bithday: rowData?.birthday_point || '',
        customer_tag: rowData?.customer_tag || '',
        enable_tier_additional_benifits:
          parseInt(rowData?.enable_tier_additional_benifits) === 1,
        hide_point_graph: parseInt(rowData?.hide_point_graph) === 1,
        hide_point_bar: parseInt(rowData?.hide_point_bar) === 1,
        tierdescription: rowData?.tier_description || '',
      });
    } else if (
      vipProgramData?.lyt_milestone_setting?.milestone_type === 'tag_based'
    ) {
      // Reset all fields first, then set pointlimit for tag_based
      const emptyFormValues = {
        tiername: '',
        tierdescription: '',
        pointlimit: vipProgramData?.new_tier_level_for_tag_base || '',
        tier_color: '#FFFFFF',
        tierlogo: null,
        customer_tag: '',
        customer_bonus: '',
        customer_bithday: '',
        tiernameemail: '',
        tier_email_cont: '',
        enable_tier_additional_benifits: true,
        hide_point_graph: false,
        hide_point_bar: false,
        customerpointearn: '',
        tieremailenable: false,
      };
      form.setFieldsValue(emptyFormValues);
      setTierLogo(null);
      setDefualtLogo('');
      setEnabled(false);
      setState({
        customerpointearn: '',
        customer_bonus: '',
        customer_bithday: '',
        customer_tag: '',
        enable_tier_additional_benifits: true,
        hide_point_graph: false,
        hide_point_bar: false,
        tierdescription: '',
      });
    } else {
      // Reset all form fields to empty/default values when creating new tier
      const emptyFormValues = {
        tiername: '',
        tierdescription: '',
        pointlimit: '',
        tier_color: '#FFFFFF',
        tierlogo: null,
        customer_tag: '',
        customer_bonus: '',
        customer_bithday: '',
        tiernameemail: '',
        tier_email_cont: '',
        enable_tier_additional_benifits: true,
        hide_point_graph: false,
        hide_point_bar: false,
        customerpointearn: '',
        tieremailenable: false,
      };
      form.setFieldsValue(emptyFormValues);
      setTierLogo(null);
      setDefualtLogo('');
      setEnabled(false);
      setState({
        customerpointearn: '',
        customer_bonus: '',
        customer_bithday: '',
        customer_tag: '',
        enable_tier_additional_benifits: true,
        hide_point_graph: false,
        hide_point_bar: false,
        tierdescription: '',
      });
    }
  }, [rowData]);

  /* -------------------- SUBMIT -------------------- */
  const onSubmitTier = async (values) => {
    setLoading(true);

    try {
      values.customerpointearn = state?.customerpointearn;
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

      const colorValue = values?.tier_color;
      let color =
        typeof colorValue === 'string'
          ? colorValue
          : colorValue?.toHexString?.();

      let obj = {
        ...converted,
        id: rowData?.id || '',
        enable_tier_additional_benifits:
          state.enable_tier_additional_benifits === true ? '1' : '0',
        hide_point_graph: converted.hide_point_graph ? '1' : '0',
        hide_point_bar: converted.hide_point_bar ? '1' : '0',
        defaultlogo:
          rowData?.id && !tierLogo && !defaultlogo && !values?.tierlogo
            ? rowData?.tier_logo
            : defaultlogo || '',
        tierdescription:
          Object.prototype.toString.call(converted?.tierdescription) ===
          '[object Object]'
            ? rowData?.tier_description
            : encodeURIComponent(values?.tierdescription),

        tier_color: color?.replace('#', '') || 'FFFFFF',
        tieremailenable: '0',
        tiernameemail: '',
        tierAchievedDescription: '',
        tier_email_cont: '',
      };

      delete converted.tierdescription;

      const payload = convertToFormDataCustom(obj);

      const response = rowData?.id
        ? await updateTierRemoteService(payload)
        : await saveTierRemoteService(payload);

      if (response?.data?.status === 'success') {
        notification.success({ message: response?.data?.msg });
        setTierLogo(null);
        setDefualtLogo('');
        form.setFieldsValue({ tierlogo: null });
        setTierCreateModal(false);
        setRowData(undefined);
        getVipProgramData();
      } else {
        notification.error({ message: response?.data?.msg });
      }
    } catch (error) {
      logger(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <AitPageHeader
        title="Create new tier"
        subtitle="Increase your average customer lifetime value with a tier-based program."
        buttonLabel="Back"
        hideButton
        buttonIcon={<ArrowLeftOutlined />}
        onButtonClick={handleNavigate} */}
      {/* /> */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmitTier}
        initialValues={{
          enable_tier_additional_benifits:
            parseFloat(rowData?.enable_tier_additional_benifits) > 0
              ? true
              : false,
          hide_point_graph:
            parseFloat(rowData?.hide_point_graph) > 0 ? true : false,
          hide_point_bar:
            parseFloat(rowData?.hide_point_bar) > 0 ? true : false,
        }}
      >
        <AitCard
          style={{ marginTop: 20 }}
          borderless
          bodypadding={{ xs: '0px 0px', sm: '0px 0px', md: '0px 0px' }}
          bordercolor="transparent"
        >
          <AitText strong size={18} bottommargin={16}>
            Display
          </AitText>
          <Row gutter={24}>
            {' '}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="tiername"
                rules={[{ required: true, message: 'Please enter tier name' }]}
              >
                <AitInputBox
                  required
                  label="Tier name"
                  placeholder="Tier name"
                  labelSubText="This is the name of the tier that is visible to your customers"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Label>Tier description</Label>
              <Form.Item
                name="tierdescription"
                // rules={
                //   state?.tierdescription === undefined ||
                //   state?.tierdescription === ''
                //     ? [
                //         {
                //           required: true,
                //           message: 'Please enter tier description',
                //         },
                //       ]
                //     : []
                // }
              >
                <TextEditor
                  initialValue={
                    state?.tierdescription === ''
                      ? false
                      : decodeURIComponent(state?.tierdescription)
                  }
                  // onChangeValue={(e) => {

                  // setState({
                  //   ...state,
                  //   tierdescription: e,
                  // });
                  // form.setFieldValue('tierdescription', e);
                  // }}
                  onChange={(e) => {
                    // setState({
                    //   ...state,
                    //   tierdescription: e,
                    // });
                    form.setFieldValue('tierdescription', e);
                  }}
                  style={{ position: 'relative', zIndex: 0 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="pointlimit"
                label={
                  vipProgramData?.lyt_milestone_setting?.milestone_type ===
                  'points'
                    ? ' Milestone to achieve this tier'
                    : vipProgramData?.lyt_milestone_setting?.milestone_type ===
                        'amount'
                      ? 'Spent to achieve this tier'
                      : 'Tier Level'
                }
                rules={
                  vipProgramData?.lyt_milestone_setting?.milestone_type !==
                  'tag_based'
                    ? [
                        {
                          required: true,
                          message: 'This field is requierd',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const minValue =
                              vipProgramData?.new_tier_level_for_tag_base;

                            if (!value) {
                              return Promise.resolve(); // ignore empty, handled by 'required'
                            }

                            if (value < minValue && !rowData?.id) {
                              return Promise.reject(
                                new Error(
                                  `Value must be greater than the last tier milestone value ${minValue}`
                                )
                              );
                            }

                            return Promise.resolve();
                          },
                        }),
                      ]
                    : []
                }
              >
                <AitInputBox
                  placeholder="1000"
                  onKeyPress={enterOnlyNumericValue}
                  readOnly={
                    vipProgramData?.lyt_milestone_setting?.milestone_type ===
                    'tag_based'
                  }
                  required={
                    vipProgramData?.lyt_milestone_setting?.milestone_type ===
                      'amount' ||
                    vipProgramData?.lyt_milestone_setting?.milestone_type ===
                      'points'
                  }
                  disabled={
                    vipProgramData?.lyt_milestone_setting?.milestone_type ===
                      'tag_based' ||
                    parseFloat(rowData?.total_customers_count) > 0
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                label="Tier color"
                name="tier_color"
                tooltip={{
                  title: '(Use color code without #)',
                  icon: <InfoCircleOutlined />,
                }}
              >
                <ColorPicker defaultValue="#FFFFFF" size="large" showText />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            {' '}
            <Col span={24}>
              <Label>
                Tier icon{' '}
                <Tooltip
                  placement="right"
                  title="1MB file size limit, recommended dimension are 300X300 px"
                >
                  <InfoCircleOutlined
                    style={{
                      // marginLeft: '2px',
                      position: 'relative',
                      top: '1px',
                    }}
                  />{' '}
                  <span
                    className="field-required"
                    style={{ position: 'relative', top: '-2px' }}
                  >
                    *
                  </span>
                </Tooltip>
              </Label>
              <HelperText>Upload your own icon</HelperText>
              <Form.Item
                name="tierlogo"
                style={{ marginBottom: 20 }}
                rules={[
                  {
                    // Required only when there is no existing logo (create mode)
                    required: !rowData?.id && !rowData?.tier_logo,
                    message: 'This field is requierd',
                  },
                  {
                    // Run file validation only for newly uploaded files
                    validator: (_, value) => {
                      // If editing and we already have a logo, or we have a default logo
                      // (Bronze/Silver/Gold or existing path), skip validation
                      if (
                        typeof value === 'string' ||
                        (!value && rowData?.tier_logo) ||
                        defaultlogo
                      ) {
                        return Promise.resolve();
                      }

                      // If empty and no other rule catches it, treat as valid here
                      if (!value) {
                        return Promise.resolve();
                      }

                      return validateImageFile(_, value);
                    },
                  },
                ]}
              >
                <AitUpload
                  onImageChange={(e) => {
                    setDefualtLogo('');
                    form.setFieldsValue({
                      tierlogo: e,
                    });
                    setTierLogo(e);
                  }}
                  // showImage={false}
                  initalValue={tierLogo || null}
                  showImage
                />
              </Form.Item>
            </Col>
          </Row>
          <Text strong style={{ paddingLeft: 50 }}>
            Or
          </Text>
          <Row gutter={24} style={{ marginTop: 10 }}>
            {' '}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Label>Choose an exisiting icon</Label>
              <Form.Item style={{ marginBottom: 0 }}>
                <Flex>
                  <Space size="middle">
                    {rowData?.id && rowData?.tier_logo !== '' && (
                      <TierIconStyle>
                        <img
                          onClick={() => {
                            setDefualtLogo(rowData?.tier_logo);
                            form.validateFields(['tierlogo']);
                            form.setFieldsValue({
                              tierlogo: rowData?.tier_logo,
                            });
                          }}
                          src={`${process.env.NEXT_PUBLIC_IMAGE_S3_BASE_URL}/${rowData?.tier_logo}`}
                          alt="icon"
                          style={{
                            borderColor:
                              defaultlogo === rowData?.tier_logo
                                ? 'var(--ant-color-primary)'
                                : '#fff',
                          }}
                        />
                      </TierIconStyle>
                    )}
                    <TierIconStyle>
                      <img
                        onClick={() => {
                          setDefualtLogo('assets/loyalty/images/bronze.svg');
                          form.validateFields(['tierlogo']);
                          form.setFieldsValue({
                            tierlogo: 'assets/loyalty/images/bronze.svg',
                          });
                        }}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_S3_BASE_URL}/assets/loyalty/images/bronze.svg?v=1.6`}
                        alt="bronze"
                        style={{
                          borderColor:
                            defaultlogo === 'assets/loyalty/images/bronze.svg'
                              ? 'var(--ant-color-primary)'
                              : '#fff',
                        }}
                      />
                    </TierIconStyle>
                    <TierIconStyle>
                      <img
                        onClick={() => {
                          setDefualtLogo('assets/loyalty/images/silver.svg');
                          form.validateFields(['tierlogo']);
                          form.setFieldsValue({
                            tierlogo: 'assets/loyalty/images/silver.svg',
                          });
                        }}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_S3_BASE_URL}/assets/loyalty/images/silver.svg?v=1.6`}
                        alt="silver"
                        style={{
                          borderColor:
                            defaultlogo === 'assets/loyalty/images/silver.svg'
                              ? 'var(--ant-color-primary)'
                              : '#fff',
                        }}
                      />
                    </TierIconStyle>
                    <TierIconStyle>
                      <img
                        onClick={() => {
                          setDefualtLogo('assets/loyalty/images/gold.svg');
                          form.validateFields(['tierlogo']);
                          form.setFieldsValue({
                            tierlogo: 'assets/loyalty/images/gold.svg',
                          });
                        }}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_S3_BASE_URL}/assets/loyalty/images/gold.svg?v=1.6`}
                        alt="gold"
                        style={{
                          borderColor:
                            defaultlogo === 'assets/loyalty/images/gold.svg'
                              ? 'var(--ant-color-primary)'
                              : '#fff',
                        }}
                      />
                    </TierIconStyle>
                  </Space>
                </Flex>
              </Form.Item>
            </Col>
          </Row>
        </AitCard>

        <Divider />

        <AitCard
          margintop="24px"
          borderless
          bodypadding={{ xs: '0px 0px', sm: '0px 0px', md: '0px 0px' }}
          bordercolor="transparent"
        >
          <AitText strong size={18} bottommargin={16}>
            Tier settings
          </AitText>

          <Row gutter={24}>
            {' '}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="customerpointearn"
                label="Set earning ratio"
                // rules={[{ required: true, message: 'This field is required' }]}
                tooltip={{
                  title:
                    'You can choose to give more points to your VIP customers.',
                  icon: <InfoCircleOutlined />,
                  placement: 'top',
                }}
                rules={[
                  { required: true, message: 'This field is required' },
                  {
                    validator: (_, value) => {
                      if (
                        state?.customerpointearn === undefined ||
                        state?.customerpointearn === ''
                      ) {
                        return Promise.resolve();
                      }
                      if (
                        isNaN(state?.customerpointearn) ||
                        Number(state?.customerpointearn) <= 0
                      ) {
                        return Promise.reject(
                          'Earning ratio must be greater than 0'
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Flex gap={20} align="center">
                  <Text>1 Point =</Text>
                  <div style={{ flex: '1 1 auto' }}>
                    <AitInputBox
                      value={state?.customerpointearn}
                      onChange={(e) => {
                        setState({
                          ...state,
                          customerpointearn: e?.target?.value,
                        });
                      }}
                      placeholder="1.5"
                      onKeyPress={enterOnlyNumericValue}
                      addonAfter="Point"
                    />
                  </div>
                </Flex>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="customer_tag"
                label="Add tag"
                // rules={[{ required: true, message: 'This field is required' }]}
                tooltip={{
                  title:
                    'A new customer with this tag will be automatically assigned to this tier.',
                  icon: <InfoCircleOutlined />,
                  placement: 'top',
                }}
                rules={[{ required: true, message: 'This field is requierd' }]}
              >
                <AitInputBox
                  placeholder="Gold"
                  value={state?.customer_tag}
                  onChange={(e) => {
                    setState({
                      ...state,
                      customer_tag: e?.target?.value,
                    });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </AitCard>
        <Divider style={{ marginTop: 0 }} />
        <AitCollapse
          style={{
            //  marginTop: 24,
            marginBottom: 24,
            //  border: '1px solid #f0f0f0',
          }}
          bordered={false}
          colorBgContainer="transparent"
          itemSpacing="0px"
          firstItemTopspacing="0px"
          firstItemBottomspacing="0px"
          headerLeftRightTopSpacing="0px"
          itemHeaderPadding={{
            xs: '0px 0px',
            sm: '0px 0px',
            md: '0px 0px',
          }}
          collapseIconTopSpacing="0px"
          collapseIconBotSpacing="0px"
          borderTop="none"
          // borderBottom="none"
          firstitemtopborder="none"
          itemBodyPadding={{
            xs: '20px 0px 0px',
            sm: '20px 0px 0px',
            md: '24px 0px 0px',
          }}
          headericonalign="center"
          expandIcon={<DownOutlined />}
          panels={[
            {
              title: 'Additional benefits',
              key: '1',
              children: (
                <>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Form.Item
                        name="customer_bonus"
                        // rules={[
                        //   { required: true, message: 'This field is required' },
                        // ]}
                      >
                        <AitInputBox
                          label="One-time bonus points"
                          labelSubText="Give additional points on achieving this tier."
                          // required
                          onKeyPress={enterOnlyNumericValue}
                          style={{ width: '100%' }}
                          placeholder="0"
                          onChange={(e) =>
                            setState({
                              ...state,
                              customer_bonus: e?.target?.value,
                            })
                          }
                          value={state?.customer_bonus}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Form.Item
                        name="customer_bithday"
                        // rules={[
                        //   { required: true, message: 'This field is required' },
                        // ]}
                      >
                        <AitInputBox
                          // required
                          placeholder="0"
                          label="Birthday points"
                          labelSubText="Offer additional points on your customer's birthday."
                          onKeyPress={enterOnlyNumericValue}
                          style={{ width: '100%' }}
                          onChange={(e) =>
                            setState({
                              ...state,
                              customer_bithday: e?.target?.value,
                            })
                          }
                          value={state?.customer_bithday}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Label>
                        Showcase the advantages of tier benefits on the store
                        front
                      </Label>
                      <HelperText>
                        If tier benefits visibility are disabled, customers
                        won't be able to see them, but they will still receive
                        those benefits.
                      </HelperText>
                      <Form.Item name="enable_tier_additional_benifits">
                        <Switch
                          onChange={(checked) =>
                            setState({
                              ...state,
                              enable_tier_additional_benifits: checked,
                            })
                          }
                          checked={state?.enable_tier_additional_benifits}
                        />
                      </Form.Item>
                    </Col>
                    {vipProgramData?.lyt_milestone_setting?.milestone_type !==
                      'tag_based' && (
                      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                          label="Hide next tier needed points graph"
                          name="hide_point_graph"
                        >
                          <Switch
                            onChange={(checked) =>
                              setState({
                                ...state,
                                hide_point_graph: checked,
                              })
                            }
                            checked={state?.hide_point_graph}
                          />
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                  {vipProgramData?.lyt_milestone_setting?.milestone_type !==
                    'tag_based' && (
                    <Form.Item
                      label="Hide next tier needed points bar"
                      name="hide_point_bar"
                    >
                      <Switch
                        onChange={(checked) =>
                          setState({
                            ...state,
                            hide_point_bar: checked,
                          })
                        }
                        checked={state?.hide_point_bar}
                      />
                    </Form.Item>
                  )}
                </>
              ),
            },
          ]}
        ></AitCollapse>

        {vipProgramData?.lyt_milestone_setting?.is_prev_tier === '1' && (
          <AitCard
            style={{
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              marginBottom: 15,
            }}
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 500 }}>Email notification</span>
                <Form.Item name="tieremailenable">
                  <Switch checked={enabled} onChange={setEnabled} />
                </Form.Item>
              </div>
            }
          >
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
              message="This email will get triggered automatically when the customer upgrades/downgrades to this tier. So keep the email content accordingly."
              style={{ marginBottom: 12 }}
            />
            <Text type="secondary">
              Notify customers about their Tier upgrade via email.
            </Text>

            {enabled && (
              <>
                <Row style={{ marginTop: 10 }}>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                      // label="Subject"
                      name="tiernameemail"
                      rules={[
                        { required: true, message: 'This field is requierd' },
                      ]}
                    >
                      <AitInputBox
                        label="Subject"
                        required
                        placeholder="Tier name"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Label>Email body </Label>
                    <Form.Item name="tier_email_cont">
                      <TextEditor
                        initialValue={decodeURIComponent(
                          rowData?.tier_email_cont
                        )}
                        onChange={(value) =>
                          form.setFieldValue('tier_email_cont', value)
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </AitCard>
        )}
        <Row gutter={[12, 12]} justify={'center'} style={{ marginTop: 24 }}>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              type="primary"
              title={rowData?.id ? 'Update' : 'Create'}
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
              disabled={loading}
              onClick={() => {
                onCancel();
              }}
              block
            />
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default CreateTierTamplate;
