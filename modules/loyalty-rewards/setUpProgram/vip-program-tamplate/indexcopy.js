/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import Link from 'next/link';
import {
  ChildrenText,
  CustomAitCard,
  HelperText,
  IconWrap,
  Label,
  Left,
  LeftSection,
  Right,
  RowItem,
  StyledRadioGroup,
  SyncLink,
  TextContainer,
  TitleWrap,
  TitleWrapper,
} from './style';
import {
  App,
  Button,
  Col,
  DatePicker,
  Divider,
  Empty,
  Flex,
  Form,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
  Tooltip,
  Typography,
  Grid,
} from 'antd';
import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  EditIcon,
  PointsText,
  StyledSelect,
} from '../earn-points-tamplate/style';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import dayjs from 'dayjs';
import logger from '@/utils/logger';
import {
  changeTierStatusService,
  deleteTierService,
  getVIPProgramDataService,
  saveMileStoneService,
  shortingTierService,
  statusChangeVIPProgramService,
  syncCustomerService,
} from '../../api/vipProgram';
import moment from 'moment';
import {
  checkValidCount,
  checkValidData,
  convertToFormDataCustom,
  convertToFormDataCustoms,
  textFormatter,
} from '@/utils/common.util';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import CreateTierTamplate from './create-tier-tamplate';
import { ShortingIcon } from '../../svg-icons';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import { useSelector } from 'react-redux';
import { StyledRadio } from '@/components/atoms/ait-radio-button/style';
import AitLink from '@/components/atoms/ait-link/aitLink';
import AitText from '@/components/atoms/ait-text/aitText';

const { Option } = Select;
const { useBreakpoint } = Grid;

const { Text, Paragraph } = Typography;
function VIPProgramTamplate() {
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const jwtState = useSelector((state) => state?.jwtState);
  const { notification } = App.useApp();
  const [vipBasis, setVipBasis] = useState('points');
  const [vipDuration, setVipDuration] = useState('lifetime');
  const [vipProgramData, setVipProgramData] = useState();
  const [pageLoading, setPageLoading] = useState(false);
  const [monthValue, setMonthValue] = useState('1');
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [programConfModal, setProgramconModal] = useState(false);
  const [milestoneBtnLoading, setMileStoneBtnLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [tierCreateModal, setTierCreateModal] = useState(false);
  const [dragTierLoading, setDragTierLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [reorderedItems, setReorderedItems] = useState();
  const [tierDropErrorModal, setTierDropErrorModal] = useState(false);
  const [rowData, setRowData] = useState();
  const [defaultlogo, setDefualtLogo] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [syncCustomerLoading, setSyncCustomerLoading] = useState(false);
  const [changeTierStatus, setChnageTierStatus] = useState(false);
  const [state, setState] = useState({
    customerpointearn: '',
    customer_bonus: '',
    customer_bithday: '',
    enable_tier_additional_benifits: true,
    hide_point_graph: false,
    hide_point_bar: false,
    tierdescription: undefined,
    customer_tag: '',
  });

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const shortingTier = async (arr) => {
    setDragTierLoading(true);
    try {
      const payload = convertToFormDataCustoms(
        { obj: arr?.map((i) => i.id) },
        new FormData(),
        'order'
      );

      const response = await shortingTierService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setReorderedItems(arr);
      } else {
        setTierDropErrorModal(true);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setDragTierLoading(false);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const draggedItemIndex = Number(e.dataTransfer.getData('text/plain'));
    if (draggedItemIndex === index) return;

    const newItems = [...reorderedItems];
    const [draggedItem] = newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, draggedItem);

    if (
      JSON.stringify(newItems.map((i) => i.id)) !==
      JSON.stringify(reorderedItems.map((i) => i.id))
    ) {
      shortingTier(newItems);
    }

    setDraggedIndex(null);
  };

  const months = [
    { label: 'January', id: '1' },
    { label: 'February', id: '2' },
    { label: 'March', id: '3' },
    { label: 'April', id: '4' },
    { label: 'May', id: '5' },
    { label: 'June', id: '6' },
    { label: 'July', id: '7' },
    { label: 'August', id: '8' },
    { label: 'September', id: '9' },
    { label: 'October', id: '10' },
    { label: 'November', id: '11' },
    { label: 'December', id: '12' },
  ];

  const getVipProgramData = async () => {
    try {
      let payload = {};
      const response = await getVIPProgramDataService(payload);
      if (response?.data?.status === 'success') {
        setVipProgramData(response?.data);
        setVipBasis(
          parseFloat(response?.data?.lyt_milestone_setting) !== 0
            ? response?.data?.lyt_milestone_setting?.milestone_type
            : 'points'
        );
        setVipDuration(
          parseFloat(response?.data?.lyt_milestone_setting) !== 0
            ? response?.data?.lyt_milestone_setting?.milestone_period
            : 'calendar_year'
        );
        setMonthValue(
          parseFloat(
            response?.data?.lyt_milestone_setting
              ?.milestone_calendar_year_start_month
          ) === 0
            ? '1'
            : response?.data?.lyt_milestone_setting
                ?.milestone_calendar_year_start_month
        );
        setReorderedItems(response?.data?.tier_list);
        setStartDate(
          parseFloat(response?.data?.lyt_milestone_setting) !== 0
            ? dayjs(
                response?.data?.lyt_milestone_setting?.program_start_date,
                'YYYY-MM-DD'
              )
            : dayjs()
        );
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setPageLoading(false);
    }
  };

  const changeProgramStatus = async () => {
    setPageLoading(true);
    try {
      let obj = {};
      obj.tierstatus = vipProgramData?.tier_status === '1' ? '0' : '1';
      let payload = convertToFormDataCustom(obj);
      const response = await statusChangeVIPProgramService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setRowData();
        setVisible(false);
        setVipProgramData({
          ...vipProgramData,
          tier_status: vipProgramData?.tier_status === '1' ? '0' : '1',
        });
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setPageLoading(false);
    }
  };

  const handleChangeTierStatus = async () => {
    setDeleteLoading(true);
    try {
      let obj = {};
      obj.id = rowData?.id;
      obj.tierstatus = rowData?.tier_status === '1' ? '0' : '1';
      let payload = convertToFormDataCustom(obj);
      const response = await changeTierStatusService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setChnageTierStatus(false);
        setRowData();
        let arr = vipProgramData?.tier_list?.map((item) => {
          let obj = { ...item };
          if (item?.id === rowData?.id) {
            obj.tier_status = rowData?.tier_status === '1' ? '0' : '1';
            return obj;
          } else {
            return obj;
          }
          return obj;
        });

        setVipProgramData({
          ...vipProgramData,
          tier_list: arr,
        });
        setReorderedItems(arr);
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setDeleteLoading(false);
    }
  };

  const onDeleteTier = async () => {
    setDeleteLoading(true);
    try {
      let obj = {};
      obj.tierid = rowData?.id;
      let payload = convertToFormDataCustom(obj);
      const response = await deleteTierService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        let arr = vipProgramData?.tier_list?.filter(
          (item) => item?.id !== rowData?.id && item
        );

        setVipProgramData({
          ...vipProgramData,
          tier_list: arr,
        });
        setReorderedItems(arr);
        setRowData();
        setDeleteModal(false);
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setDeleteLoading(false);
    }
  };

  const onSubmitVIPProgram = async () => {
    setMileStoneBtnLoading(true);
    try {
      if (parseFloat(vipProgramData?.total_customers_in_tiers) > 0) {
        setProgramconModal(true);
        return;
      }

      if (vipBasis === 'amount') {
        if (vipProgramData?.make_a_purchase_enable !== 1) {
          notification.error({
            message:
              'To utilize the tier milestone type of total spent, make sure to enable the make a purchase activity',
          });
          return;
        }
      }

      if (startDate === null) {
        notification.error({
          message: 'Please select start calendar year month.',
        });
        return;
      }

      let payload = {
        program_start_date: dayjs(startDate)?.format('MM/DD/YYYY'),
        milestone_type: vipBasis,
        milestone_period: vipDuration,
        milestone_calendar_year_start_month: monthValue,
      };
      const formData = convertToFormDataCustom(payload);
      const response = await saveMileStoneService(formData);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        getVipProgramData();
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setMileStoneBtnLoading(false);
    }
  };

  const handleCustomerSync = async () => {
    setSyncCustomerLoading(true);
    try {
      let payload = {};
      const response = await syncCustomerService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        getVipProgramData();
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setSyncCustomerLoading(false);
    }
  };

  const openEdit = (item) => {
    setRowData(item);
    setTierCreateModal(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const handleNavigate = () => {
  //   router.push(moduleRoute?.loyalty_rewards?.create_tier);
  // };

  const onCancel = () => {
    setRowData();
    setDeleteModal(false);
    setDefualtLogo('');
    setTierCreateModal(false);
    setState({
      customerpointearn: '',
      customer_bonus: '',
      customer_bithday: '',
      enable_tier_additional_benifits: false,
      hide_point_graph: false,
      hide_point_bar: false,
      tierdescription: '',
      customer_tag: '',
    });
  };

  useEffect(() => {
    const shouldPoll =
      vipProgramData?.lyt_milestone_setting?.milestone_type === 'tag_based' &&
      vipProgramData?.tag_based_tier_syncing_status !== 0;

    let interval;

    if (shouldPoll) {
      interval = setInterval(() => {
        getVipProgramData();
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    vipProgramData?.lyt_milestone_setting?.milestone_type,
    vipProgramData?.tag_based_tier_syncing_status,
  ]);

  useEffect(() => {
    setPageLoading(true);
    getVipProgramData();
  }, []);

  return (
    <>
      {vipProgramData?.tag_based_tier_syncing_status === 1 && (
        <AitAlert
          type="warning"
          hascustomicon={false}
          bgcolor="#2f80ed"
          color="#ffffff"
          message="VIP tier assignment to the customer is in progress."
        />
      )}
      <div
        style={
          vipProgramData?.tag_based_tier_syncing_status === 1
            ? { opacity: '0.7', pointerEvents: 'none' }
            : {}
        }
      >
        <AitPageHeader
          disabled={pageLoading}
          buttonLabel="Create"
          onButtonClick={() =>
            vipProgramData?.lyt_milestone_setting?.hasOwnProperty('id')
              ? setTierCreateModal(true)
              : notification.error({
                  message: 'Please create milestone first',
                })
          }
          title="VIP program"
          subtitle={
            <TextContainer>
              Segment customers in different tiers to provide exclusive
              benefits. Use loyalty points to set different tiers. <br />
              <a
                href="https://docs.aitrillion.com/portal/en/kb/articles/vip-program-tier-system"
                target="blank"
              >
                Click here
              </a>{' '}
              to understand what is VIP tier.
            </TextContainer>
          }
        />

        {pageLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh', // full viewport height
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            <AitCard
              style={{
                boxSizing: 'border-box',
                marginBottom: '24px',
              }}
            >
              <Flex
                justify="space-between"
                align="flex-start"
                wrap="wrap"
                style={{ gap: 16 }}
              >
                <div
                  style={{
                    flex: `${screens.md ? '1 1 auto' : '0 0 100%'}`,
                    minWidth: '250px',
                  }}
                >
                  <Text
                    strong
                    style={{
                      fontSize: 18,
                      marginBottom: 8,
                      color: 'var(--ant-color-text-primary)',
                    }}
                  >
                    Program status
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    Enable or disable your VIP program
                  </Text>
                </div>

                <div className="status-right">
                  <Flex
                    gap={10}
                    justify={screens.md ? 'end' : 'start'}
                    alignItems="center"
                  >
                    <AitSwitch
                      style={{ marginBottom: 8 }}
                      checked={parseFloat(vipProgramData?.tier_status) > 0}
                      onChange={() => setVisible(true)}
                    />
                  </Flex>

                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {/* <Text
                      style={{
                        color: 'var(--ant-color-primary)',
                        fontSize: 14,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() =>
                        window.open(
                          jwtState?.login_auth?.no_cache_domain,
                          '_blank'
                        )
                      }
                    >
                      View changes
                    </Text> */}
                    <AitLink
                      href={jwtState?.login_auth?.no_cache_domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {' '}
                      View changes
                    </AitLink>

                    <Tooltip title="New changes take up to 15 minutes to appear on your site, use this link to view them now.">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </div>
                </div>
              </Flex>
            </AitCard>

            {vipProgramData?.tier_status === '1' && (
              <>
                <AitCard
                  style={{
                    boxSizing: 'border-box',
                    marginBottom: '24px',
                  }}
                  bodypadding={{
                    xs: '20px',
                    sm: '20px 24px',
                    md: '24px',
                  }}
                >
                  {' '}
                  {/* Title */}
                  {/* <Title level={4} style={{ marginBottom: 16 }}>
                    VIP program milestone
                  </Title> */}
                  <Text
                    strong
                    style={{
                      fontSize: 18,
                      color: 'var(--ant-color-text-primary)',
                    }}
                  >
                    VIP program milestone
                  </Text>
                  {vipBasis !== 'tag_based' && (
                    <>
                      <div style={{ marginBottom: 24, marginTop: 10 }}>
                        <Text type="secondary" style={{ fontWeight: 500 }}>
                          Program start date
                        </Text>
                        {/* <br /> */}
                        <div style={{ marginTop: 8 }}>
                          <Text type="secondary" style={{ fontSize: 14 }}>
                            A member’s VIP tier is based on their activity
                            starting from this date. The program start date must
                            be between today’s date and the date you created
                            your AiTrillion account.
                          </Text>
                        </div>
                        <div style={{ marginTop: 12, maxWidth: 250 }}>
                          <DatePicker
                            style={{ width: '100%', height: 39 }}
                            placeholder="Select start date"
                            format="MM/DD/YYYY"
                            value={startDate}
                            onChange={(date, dateString) => setStartDate(date)}
                          />
                        </div>

                        <Text
                          type="secondary"
                          style={{
                            display: 'block',
                            marginTop: 12,
                            fontSize: 12,
                            color: '#999',
                          }}
                        >
                          Important: If you select a program date from the past,
                          please be aware that it may take approximately 1 hour
                          to calculate the points/amount spent and assign tiers
                          to customers.
                        </Text>
                      </div>
                      <Divider />
                    </>
                  )}
                  <StyledRadioGroup
                    onChange={(e) => setVipBasis(e.target.value)}
                    value={vipBasis}
                    style={{ marginTop: 12 }}
                  >
                    <Row gutter={[0, 8]}>
                      <Col span={24}>
                        <label>A member enters a VIP tier based on their</label>
                        <StyledRadio value="points" style={{ marginTop: 12 }}>
                          <Text
                            style={{
                              color: 'var(--ant-color-text-label-primary)',
                            }}
                          >
                            Points earned
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 14 }}>
                            Tier will be assigned based on the loyalty points
                            earned.
                          </Text>
                        </StyledRadio>
                      </Col>

                      <Col span={24}>
                        <StyledRadio value="amount">
                          <Text
                            style={{
                              color: 'var(--ant-color-text-label-primary)',
                            }}
                          >
                            Amount spent
                          </Text>
                          <br />
                          <Text type="secondary">
                            Spent will be calculated based on purchase activity
                            dates.
                          </Text>
                        </StyledRadio>
                      </Col>

                      <Col span={24}>
                        <StyledRadio value="tag_based">
                          <Text
                            style={{
                              color: 'var(--ant-color-text-label-primary)',
                            }}
                          >
                            Tag based
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 14 }}>
                            Tier will be assigned based on the Shopify customer
                            tags.
                          </Text>
                        </StyledRadio>
                      </Col>
                    </Row>
                  </StyledRadioGroup>
                  {vipBasis !== 'tag_based' && (
                    <>
                      <Divider />
                      <div style={{ marginBottom: 24 }}>
                        {/* <Text>
                          A member has the following amount of time to achieve a
                          VIP tier:
                        </Text> */}
                        <Paragraph type="primary">
                          <strong>
                            {' '}
                            A member has the following amount of time to achieve
                            a VIP tier:
                          </strong>
                        </Paragraph>
                        {/* <br /> */}

                        <StyledRadioGroup
                          onChange={(e) => setVipDuration(e.target.value)}
                          value={vipDuration}
                          // style={{ marginTop: 12 }}
                        >
                          <Row gutter={[0, 8]}>
                            <Col span={24}>
                              <StyledRadio value="lifetime">
                                <Text
                                  style={{
                                    color:
                                      'var(--ant-color-text-label-primary)',
                                  }}
                                >
                                  Their lifetime as a rewards member
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                  Once a member achieves a tier, they can enjoy
                                  its benefits for their lifetime.
                                </Text>
                              </StyledRadio>
                            </Col>

                            <Col span={24}>
                              <StyledRadio
                                value="calendar_year"
                                style={{ marginBottom: 10 }}
                              >
                                <Text
                                  style={{
                                    color:
                                      'var(--ant-color-text-label-primary)',
                                  }}
                                >
                                  One calendar year
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                  Once a member achieves VIP tier, they can
                                  enjoy its benefits for the current and next
                                  calendar year.
                                </Text>
                                <br />
                              </StyledRadio>
                              {vipDuration === 'calendar_year' && (
                                <div style={{ marginLeft: 30 }}>
                                  <Text
                                    strong
                                    style={{
                                      color:
                                        'var(--ant-color-text-label-primary)',
                                    }}
                                  >
                                    Select start calendar year month
                                  </Text>
                                  <br />{' '}
                                  <StyledSelect
                                    defaultValue="January"
                                    value={monthValue}
                                    style={{ width: 250, height: 40 }}
                                    onChange={(e) => setMonthValue(e)}
                                  >
                                    {months.map((month, index) => (
                                      <Option key={index} value={month?.id}>
                                        {month?.label}
                                      </Option>
                                    ))}
                                  </StyledSelect>
                                </div>
                              )}
                            </Col>

                            <Col span={24}>
                              <StyledRadio value="user_tier_achive">
                                <Text
                                  style={{
                                    color:
                                      'var(--ant-color-text-label-primary)',
                                  }}
                                >
                                  365 days from last tier upgrade
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                  Once a member achieves VIP tier, they can
                                  enjoy its benefits for the next 365 days.
                                </Text>
                              </StyledRadio>
                            </Col>
                          </Row>
                        </StyledRadioGroup>
                      </div>
                      <Divider style={{ marginBottom: 0 }} />
                    </>
                  )}
                  <AitButton
                    style={{ width: 100, marginTop: 24 }}
                    title="Save"
                    htmlType="submit"
                    variant="solid"
                    color="primary"
                    // block
                    onClick={() => onSubmitVIPProgram()}
                    //  disabled={milestoneBtnLoading}
                    loading={milestoneBtnLoading}
                    disabled={true}
                  />
                </AitCard>

                {vipProgramData?.lyt_milestone_setting?.milestone_type !==
                'tag_based' ? (
                  <AitCard
                    title="VIP tiers"
                    bodypadding={{
                      xs: '10px 16px 20px 16px',
                      sm: '10px 20px 20px 20px',
                      md: '14px 24px 24px 24px',
                    }}
                  >
                    {vipProgramData?.tier_list?.length > 0 ? (
                      deleteLoading ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh', // full viewport height
                          }}
                        >
                          <Spin size="large" />
                        </div>
                      ) : (
                        // <div style={{ marginTop: 15 }}>
                        vipProgramData?.tier_list?.map((item) => (
                          <>
                            <RowItem onClick={() => openEdit(item)}>
                              <Left>
                                <IconWrap>
                                  <img
                                    style={{
                                      objectFit: 'contain',
                                      maxHeight: '100%',
                                    }}
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_S3_BASE_URL}/${item?.tier_logo}`}
                                    alt=""
                                  />
                                </IconWrap>
                                <TitleWrap>
                                  <AitText size={15} type="primary" strong>
                                    {checkValidData(
                                      textFormatter(item.tier_name)
                                    )}{' '}
                                  </AitText>
                                  {item?.store_credit_approve_permission_msg && (
                                    <AitText size={12} type="primary">
                                      {
                                        item?.store_credit_approve_permission_msg
                                      }
                                    </AitText>
                                  )}
                                  <Link href="#">
                                    {' '}
                                    {moment(item?.create_date)?.format(
                                      'MM/DD/YYYY'
                                    )}
                                  </Link>
                                  <AitText size={12} type="secondary">
                                    {checkValidCount(
                                      item?.total_customers_count
                                    )}{' '}
                                    customers
                                  </AitText>
                                </TitleWrap>
                              </Left>
                              <Right onClick={(e) => e.stopPropagation()}>
                                {screenWidth >= 768 && (
                                  <EditIcon onClick={() => openEdit(item)}>
                                    <img
                                      src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/edit_icon.svg`}
                                      alt="edit-icon"
                                    />
                                  </EditIcon>
                                )}

                                <EditIcon
                                  onClick={() => {
                                    setDeleteModal(true);
                                    setRowData(item);
                                  }}
                                >
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/delete_icon.svg`}
                                    alt="edit-icon"
                                  />
                                </EditIcon>

                                <AitSwitch
                                  checked={parseFloat(item.tier_status) > 0}
                                  onChange={(e) => {
                                    setRowData(item);
                                    setChnageTierStatus(true);
                                  }}
                                  defaultChecked={parseFloat(item.status) > 0}
                                />
                              </Right>
                            </RowItem>
                          </>
                        ))
                        // </div>
                      )
                    ) : (
                      <Flex
                        vertical
                        justify="center"
                        align="center"
                        style={{
                          width: '100%',
                          minHeight: '25vh',
                          textAlign: 'center',
                          padding: '1rem',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 'clamp(14px, 2vw, 16px)',
                            color: 'var(--ant-color-text-secondary)',
                            marginBottom: 10,
                          }}
                        >
                          You haven't created any VIP tier yet!
                        </Text>

                        <AitButton
                          type="primary"
                          title="Add VIP tier"
                          onClick={() =>
                            vipProgramData?.lyt_milestone_setting?.hasOwnProperty(
                              'id'
                            )
                              ? setTierCreateModal(true)
                              : notification.error({
                                  message: 'Please create milestone first',
                                })
                          }
                        />
                      </Flex>
                    )}
                  </AitCard>
                ) : (
                  <AitCard
                    bodypadding={{
                      xs: '10px 16px 20px 16px',
                      sm: '10px 20px 20px 20px',
                      md: '14px 24px 24px 24px',
                    }}
                    title={
                      <TitleWrapper>
                        <LeftSection>
                          {/* <label>VIP tiers</label> */}
                          <Text
                            strong
                            style={{
                              fontSize: 18,
                              color: 'var(--ant-color-text-primary)',
                            }}
                          >
                            VIP tiers
                          </Text>
                          {/* <p>
                            You have the option to adjust the tier level by
                            simply dragging between them.
                          </p> */}
                          <div style={{ lineHeight: '16px' }}>
                            <AitText type="secondary" size={14} lineheight={16}>
                              You have the option to adjust the tier level by
                              simply dragging between them.
                            </AitText>
                          </div>
                        </LeftSection>

                        <SyncLink
                          disabled={
                            syncCustomerLoading ||
                            vipProgramData?.tag_based_tier_syncing_status === 1
                          }
                          hovered={isHovered}
                          onMouseEnter={() =>
                            syncCustomerLoading ||
                            (vipProgramData?.tag_based_tier_syncing_status ===
                              1 &&
                              setIsHovered(true))
                          }
                          onMouseLeave={() =>
                            syncCustomerLoading ||
                            (vipProgramData?.tag_based_tier_syncing_status ===
                              1 &&
                              setIsHovered(false))
                          }
                          onClick={() => handleCustomerSync()}
                        >
                          <SyncOutlined />{' '}
                          {vipProgramData?.tag_based_tier_syncing_status === 0
                            ? 'Sync all customers'
                            : 'Syncing...'}
                        </SyncLink>
                      </TitleWrapper>
                    }
                  >
                    {dragTierLoading ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '50vh',
                        }}
                      >
                        <Spin />
                      </div>
                    ) : reorderedItems && reorderedItems.length > 0 ? (
                      deleteLoading ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh', // full viewport height
                          }}
                        >
                          <Spin size="large" />
                        </div>
                      ) : (
                        reorderedItems.map((item, index) => (
                          <RowItem
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onClick={() => openEdit(item)}
                            style={{
                              // opacity: draggedIndex === index ? 0.5 : 1,
                              // cursor: 'move',
                              borderRadius: '10px',
                              border: '1px solid #E9F0FF',
                              background: '#FFF',
                              padding: '10px 12px',
                              marginTop: 10,
                            }}
                          >
                            <Left>
                              <ShortingIcon style={{ cursor: 'move' }} />
                              <IconWrap>
                                <img
                                  style={{
                                    objectFit: 'contain',
                                    maxWidth: '100%',
                                  }}
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_S3_BASE_URL}/${item?.tier_logo}`}
                                  alt=""
                                />
                              </IconWrap>
                              <TitleWrap>
                                <AitText size={15} type="primary" strong>
                                  {checkValidData(
                                    textFormatter(item.tier_name)
                                  )}{' '}
                                </AitText>
                                {item?.store_credit_approve_permission_msg && (
                                  <AitText size={12} type="primary">
                                    {item?.store_credit_approve_permission_msg}
                                  </AitText>
                                )}
                                <Link href="#">
                                  {moment(item?.create_date)?.format(
                                    'MM/DD/YYYY'
                                  )}
                                </Link>
                                <AitText size={12} type="secondary">
                                  {checkValidCount(item?.total_customers_count)}{' '}
                                  customers
                                </AitText>
                              </TitleWrap>
                            </Left>
                            <Right onClick={(e) => e.stopPropagation()}>
                              {screenWidth >= 768 && (
                                <EditIcon onClick={() => openEdit(item)}>
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/edit_icon.svg`}
                                    alt="edit-icon"
                                  />
                                </EditIcon>
                              )}
                              <EditIcon
                                onClick={() => {
                                  setDeleteModal(true);
                                  setRowData(item);
                                }}
                              >
                                <img
                                  src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/delete_icon.svg`}
                                  alt="delete-icon"
                                />
                              </EditIcon>

                              <AitSwitch
                                checked={parseFloat(item.tier_status) > 0}
                                onChange={(e) => {
                                  setRowData(item);
                                  setChnageTierStatus(true);
                                }}
                                defaultChecked={parseFloat(item.status) > 0}
                              />
                            </Right>
                          </RowItem>
                        ))
                      )
                    ) : (
                      <Flex
                        vertical
                        justify="center"
                        align="center"
                        style={{
                          width: '100%',
                          minHeight: '25vh',
                          textAlign: 'center',
                          padding: '1rem',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 'clamp(14px, 2vw, 16px)',
                            color: 'var(--ant-color-text-secondary)',
                            marginBottom: 10,
                          }}
                        >
                          You haven't created any VIP tier yet!
                        </Text>

                        <AitButton
                          type="primary"
                          title="Add VIP tier"
                          onClick={() =>
                            vipProgramData?.lyt_milestone_setting?.hasOwnProperty(
                              'id'
                            )
                              ? setTierCreateModal(true)
                              : notification.error({
                                  message: 'Please create milestone first',
                                })
                          }
                        />
                      </Flex>
                    )}
                  </AitCard>
                )}
              </>
            )}
          </>
        )}

        <AitConfirmationModal
          visible={visible || changeTierStatus}
          setVisible={() => {
            setRowData();
            setVisible(false);
            setChnageTierStatus(false);
          }}
          confirmText={`Yes, ${changeTierStatus ? (rowData?.tier_status === '1' ? 'disable' : 'enable') : vipProgramData?.tier_status === '1' ? 'disable' : 'enable'} it!`}
          description={`You want to ${changeTierStatus ? (rowData?.tier_status === '1' ? 'disable' : 'enable') : vipProgramData?.tier_status === '1' ? 'disable' : 'enable'} ${changeTierStatus ? 'tier status' : 'VIP program'}?`}
          onConfirm={() => {
            if (changeTierStatus) {
              handleChangeTierStatus();
            } else {
              changeProgramStatus();
            }
          }}
          confirmButtonLoading={pageLoading || deleteLoading}
        />

        <AitModal
          open={programConfModal}
          setVisible={setProgramconModal}
          width={500}
          centered
          closable={false}
        >
          {' '}
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <CloseCircleOutlined
              style={{ fontSize: 60, color: '#ff4d4f', marginBottom: 16 }}
            />
            <h4 style={{ marginBottom: 12 }}>
              VIP program configuration can not modified
            </h4>
            <p style={{ color: '#666', marginBottom: 24 }}>
              As there are current customer(s) in your loyalty tier, you are
              unable to modify the configuration. To proceed with updating the
              configuration, it's necessary to first remove all customers from
              the loyalty tier. Kindly reach out to our support team to assist
              you in removing the customer(s) from the loyalty tier.
            </p>

            <AitButton
              type="primary"
              title="Ok"
              onClick={() => setProgramconModal(false)}
            />
          </div>
        </AitModal>
        <AitModal
          maskClosable={false}
          open={tierCreateModal}
          setVisible={() => {
            onCancel();
            form.setFieldsValue({
              customer_bonus: '',
              customer_bithday: '',
              tiername: '',
              tierdescription: '',
              customerpointearn: '',
              customer_tag: '',
              tier_color: '#FFFFFF',
            });
          }}
          width="auto"
          centered
          closable={false}
          title={
            <>
              <AitText strong size={22}>
                {!rowData?.id ? 'Create new tier' : 'Edit customer tier'}
              </AitText>
              <br />
              {!rowData?.id && (
                <AitText size={13} type="secondary" bottommargin={20}>
                  Increase your average customer lifetime value with a
                  tier-based program.
                </AitText>
              )}
            </>
          }
          // destroyOnClose={false}
        >
          {' '}
          <CreateTierTamplate
            form={form}
            rowData={rowData?.id ? rowData : undefined}
            vipProgramData={vipProgramData}
            getVipProgramData={getVipProgramData}
            setTierCreateModal={setTierCreateModal}
            setDefualtLogo={setDefualtLogo}
            defaultlogo={defaultlogo}
            onCancel={onCancel}
            setRowData={setRowData}
            setState={setState}
            state={state}
          />
        </AitModal>

        <AitModal
          open={tierDropErrorModal}
          setVisible={setTierDropErrorModal}
          width={500}
          centered
          closable={false}
        >
          {' '}
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <CloseCircleOutlined
              style={{ fontSize: 60, color: '#ff4d4f', marginBottom: 16 }}
            />
            {/* <h4 style={{ marginBottom: 12 }}>
            VIP program configuration can not modify
          </h4> */}
            <p style={{ color: '#666', marginBottom: 24 }}>
              You can not switch the tag based tier level, since you have an
              active customer(s) on your loyalty tier. You need to remove all
              customers from the tier only then you can change this setting.
              Please contact support to remove customers from the tiers.
            </p>

            <AitButton
              type="primary"
              title="Ok"
              onClick={() => setTierDropErrorModal(false)}
            />
          </div>
        </AitModal>

        <AitConfirmationModal
          visible={deleteModal}
          setVisible={() => {
            setRowData();
            setDeleteModal(false);
          }}
          confirmText="Yes, use it!"
          description={`you want to delete this tier?`}
          onConfirm={() => {
            onDeleteTier();
          }}
          confirmButtonLoading={deleteLoading}
        />
      </div>
    </>
  );
}
export default VIPProgramTamplate;
