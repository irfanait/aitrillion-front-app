/* eslint-disable react/no-unescaped-entities */
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import {
  Alert,
  App,
  Col,
  Flex,
  Form,
  Row,
  Spin,
  Tag,
  Typography,
  Grid,
} from 'antd';
import { AlertBox, SyncLink } from '../style';
import AitLink from '@/components/atoms/ait-link/aitLink';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import { SyncOutlined } from '@ant-design/icons';
import TextEditor from '@/components/atoms/ait-text-editer';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { useEffect, useRef, useState } from 'react';
import logger from '@/utils/logger';
import {
  blockCustomersService,
  getBlockCustomerCountryTagService,
  getGeneralSettingDataService,
  getSegmentListService,
  getUnBlockCustomersService,
  syncCustomerBirthdayService,
  updateCustomerBlockTagService,
  updateLytDiscountSettings,
  updateSegmentBsdLytParticipation,
  updateSettingService,
} from '../../api/settings';
import { useSelector } from 'react-redux';
import {
  convertToFormDataCustom,
  convertToFormDataCustoms,
  enterOnlyNumericValue,
} from '@/utils/common.util';
import { LockIcon, ModalAlertIcon } from '../../svg-icons';
import { moduleRoute } from '@/modules/layouts/routeControl/route';
import parse from 'html-react-parser';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import AitText from '@/components/atoms/ait-text/aitText';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import { getToken } from '@/utils/authHelpers';

const { Text } = Typography;
const { useBreakpoint } = Grid;

function GeneralSettingTamplate() {
  const token = getToken();
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const jwtState = useSelector((state) => state?.jwtState);
  const sectionRef = useRef(null);
  const legacySection = useRef(null);
  const [callfirstTime, setCallFirstTime] = useState(false);
  const { notification } = App.useApp();
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [apiData, setAPIData] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [blockModal, setBlockModal] = useState({
    modal: false,
    tagID: '',
  });

  const [segmentBasedLyt, setSegmentBasedLyt] = useState({
    btnLoading: false,
    disabled: true,
    selected_segment: undefined,
    enable_segment_based_loyalty_participation: false,
    newAndLegacy: 'legacy',
    includeExcludeSegment: 'include_a_segment',
    segmentList: [],
    segementListLoading: false,
    enable_non_loyalty_participants_redeem_points: false,
    editor_heading_text: 'Join Our Loyalty Program',
    editor_subheading_text:
      'Turn every purchase into points and unlock exciting rewards. Be the first to hear about exclusive deals, surprise gifts, and VIP-only perks!',
    editor_listitem_1_text: '🎁 Earn points on every order',
    editor_listitem_2_text: '💸 Get exclusive member-only discounts',
    editor_listitem_3_text: '🎂 Enjoy a special gift on your birthday',
    editor_listitem_4_text: '🚀 Early access to sales & new arrivals',
    editor_listitem_5_text: '🔒 Priority support and insider updates',
    editor_btn_text: 'Become a Member',
    editor_btn_link: '',
    custom_html_content: '',
  });
  const [blockCustomerForLytProgram, setBlockCustomerForLytProgram] = useState({
    disabled: true,
    viewUnblockCustomerBtn: false,
    loading: false,
    btnLoading: false,
    removeTag: '',
  });
  const [customerBirthDay, setCustomerBirthday] = useState({
    enable_map_dob_with_loyalty_from_general_forms: false,
    map_dob_with_loyalty_from_general_forms_meta_type: '0',
    map_dob_with_loyalty_from_general_forms_key: '',
    disabled: true,
    map_dob_with_loyalty_from_general_forms_type: '1',
    map_dob_with_loyalty_from_general_forms_meta_key: '',
    loading: false,
  });
  const [programParticipants, setProgramParticipants] = useState({
    value: 'all',
    disabled: true,
    programLoading: false,
  });
  const [applyDiscountPurchaseType, setApplyDiscontPurchaseType] = useState({
    purchase_type: false,
    disabled: true,
    btnLoading: false,
  });
  const [combineDisSetting, setCombineDisSetting] = useState({
    is_product_discount: false,
    is_order_discount: false,
    is_shipping_discount: false,
    disabled: true,
    btnLoading: false,
  });
  const [actionRequierd, setActionRequierd] = useState({
    alertShow: false,
    data: '',
  });

  const [displaySetting, setDisplaySetting] = useState({
    show_pending_points: false,
    disabled: true,
    btnLoading: false,
  });
  const [prefixDiscountCodes, setPrefixDiscountCodes] = useState({
    shop_discount_code_prefix: '',
    disabled: true,
    btnLoading: false,
  });
  const [blogVisitActivity, setBlogVisitActivity] = useState({
    enable_blog_activity: false,
    disabled: true,
    btnLoading: false,
  });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if ((e.key === 'Enter' || e === 'save') && inputValue.trim() !== '') {
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
      if (e !== 'save') {
        e.preventDefault();
      }
      setBlockCustomerForLytProgram((prev) => ({
        ...prev,
        disabled: false,
      }));
    }
  };

  const getSegmentList = async () => {
    setSegmentBasedLyt((prev) => ({
      ...prev,
      segementListLoading: true,
    }));
    try {
      const response = await getSegmentListService();
      if (response?.data?.status === 'success') {
        let arr = response?.data?.data?.map((item) => {
          return {
            value: item?.id,
            label: item?.title,
          };
        });

        setSegmentBasedLyt((prev) => ({
          ...prev,
          segmentList: arr,
        }));
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setSegmentBasedLyt((prev) => ({
        ...prev,
        segementListLoading: false,
      }));
    }
  };

  const onHandleSegmentBsdLyt = async (value) => {
    setSegmentBasedLyt((prev) => ({
      ...prev,
      btnLoading: true,
    }));
    try {
      let obj = {
        ...value,
        customer_account_type: segmentBasedLyt?.newAndLegacy,
        enable_segment_based_loyalty_participation:
          segmentBasedLyt?.enable_segment_based_loyalty_participation === true
            ? '1'
            : '0',
        enable_non_loyalty_participants_redeem_points:
          segmentBasedLyt?.enable_non_loyalty_participants_redeem_points ===
          true
            ? 1
            : '0',
        custom_html_content: segmentBasedLyt?.custom_html_content || '',
        segment_based_loyalty_participation_segment_type:
          segmentBasedLyt?.includeExcludeSegment,
        selected_segment: segmentBasedLyt?.selected_segment,
      };
      let payload = convertToFormDataCustom(obj);

      const response = await updateSegmentBsdLytParticipation(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setSegmentBasedLyt((prev) => ({
          ...prev,
          disabled: true,
          btnLoading: false,
        }));
      } else {
        notification.error({
          message: response?.data?.msg,
        });
        setSegmentBasedLyt((prev) => ({
          ...prev,
          btnLoading: false,
        }));
      }
    } catch (error) {
      logger(error?.response);
      setSegmentBasedLyt((prev) => ({
        ...prev,
        btnLoading: false,
      }));
    }
  };

  const getSettingDetails = async () => {
    setLoading(true);
    try {
      let payload = {
        shop_id: jwtState?.login_auth?.shop_id || '',
      };
      const response = await getGeneralSettingDataService(payload);
      if (response?.data?.status === 'success') {
        form.setFieldsValue({
          ...response?.data?.data,
          enable_blog_activity:
            parseFloat(response?.data?.data?.enable_blog_activity) > 0
              ? true
              : false,
          max_number_of_visit_per_day:
            parseFloat(response?.data?.data?.max_number_of_visit_per_day) > 0
              ? response?.data?.data?.max_number_of_visit_per_day
              : '',
          points_for_visiting_a_blog:
            parseFloat(response?.data?.data?.points_for_visiting_a_blog) > 0
              ? response?.data?.data?.points_for_visiting_a_blog
              : '',
        });
        setBlogVisitActivity((prev) => ({
          enable_blog_activity:
            parseFloat(response?.data?.data?.enable_blog_activity) > 0
              ? true
              : false,
        }));
        setBlockCustomerForLytProgram((prev) => ({
          ...prev,
          viewUnblockCustomerBtn:
            response?.data?.data?.existing_tags !== '' ||
            response?.data?.data?.existing_tags
              ? true
              : false,
        }));
        setAPIData(response?.data?.data);
        setPrefixDiscountCodes((prev) => ({
          ...prev,
          shop_discount_code_prefix:
            response?.data?.data?.shop_discount_code_prefix,
        }));
        setProgramParticipants((prev) => ({
          ...prev,
          value: response?.data?.data?.loyalty_participation_customer_type,
        }));
        setCombineDisSetting((prev) => ({
          ...prev,
          is_product_discount:
            response?.data?.data?.discountSettings?.is_product_discount === '1'
              ? true
              : false,
          is_order_discount:
            response?.data?.data?.discountSettings?.is_order_discount === '1'
              ? true
              : false,
          is_shipping_discount:
            response?.data?.data?.discountSettings?.is_shipping_discount === '1'
              ? true
              : false,
        }));
        setDisplaySetting((prev) => ({
          ...prev,
          show_pending_points:
            response?.data?.data?.showPendingPoints === '1' ? true : false,
        }));
        setApplyDiscontPurchaseType((prev) => ({
          ...prev,
          purchase_type: response?.data?.data?.isEligible
            ? response?.data?.data?.discountSettings?.purchase_type
            : 'appliesOnOneTimePurchase',
        }));
        setCustomerBirthday((prev) => ({
          ...prev,
          enable_map_dob_with_loyalty_from_general_forms:
            response?.data?.data
              ?.enable_map_dob_with_loyalty_from_general_forms === '1'
              ? true
              : false,
          map_dob_with_loyalty_from_general_forms_key:
            response?.data?.data?.map_dob_with_loyalty_from_general_forms_key,
          map_dob_with_loyalty_from_general_forms_meta_type:
            response?.data?.data
              ?.map_dob_with_loyalty_from_general_forms_meta_type === '1'
              ? '1'
              : '0',
          map_dob_with_loyalty_from_general_forms_type:
            response?.data?.data?.map_dob_with_loyalty_from_general_forms_type,
        }));

        let arr =
          response?.data?.data?.existing_tags !== ''
            ? response?.data?.data?.existing_tags?.split(',')
            : [];
        setTags(arr);
        setSegmentBasedLyt((prev) => ({
          ...prev,
          selected_segment:
            parseFloat(response?.data?.data?.selected_segment) > 0
              ? response?.data?.data?.selected_segment
              : undefined,
          editor_heading_text:
            response?.data?.data?.editor_heading_text === null
              ? prev?.editor_heading_text
              : response?.data?.data?.editor_heading_text,
          editor_subheading_text:
            response?.data?.data?.editor_subheading_text === null
              ? prev?.editor_subheading_text
              : response?.data?.data?.editor_subheading_text,
          editor_listitem_1_text:
            response?.data?.data?.editor_listitem_1_text === null
              ? prev?.editor_listitem_1_text
              : response?.data?.data?.editor_listitem_1_text,
          editor_listitem_2_text:
            response?.data?.data?.editor_listitem_2_text === null
              ? prev?.editor_listitem_2_text
              : response?.data?.data?.editor_listitem_2_text,
          editor_listitem_3_text:
            response?.data?.data?.editor_listitem_3_text === null
              ? prev?.editor_listitem_3_text
              : response?.data?.data?.editor_listitem_3_text,
          editor_listitem_4_text:
            response?.data?.data?.editor_listitem_4_text === null
              ? prev?.editor_listitem_4_text
              : response?.data?.data?.editor_listitem_4_text,
          editor_listitem_5_text:
            response?.data?.data?.editor_listitem_5_text === null
              ? prev?.editor_listitem_5_text
              : response?.data?.data?.editor_listitem_5_text,
          editor_btn_text:
            response?.data?.data?.editor_btn_text === null
              ? prev?.editor_btn_text
              : response?.data?.data?.editor_btn_text,
          editor_btn_link:
            response?.data?.data?.editor_btn_link === null
              ? prev?.editor_btn_link
              : response?.data?.data?.editor_btn_link,

          enable_segment_based_loyalty_participation:
            response?.data?.data?.enable_segment_based_loyalty_participation ===
            '1'
              ? true
              : false,
          includeExcludeSegment:
            response?.data?.data
              ?.segment_based_loyalty_participation_segment_type === null
              ? 'include_a_segment'
              : response?.data?.data
                  ?.segment_based_loyalty_participation_segment_type,
          enable_non_loyalty_participants_redeem_points:
            response?.data?.data
              ?.enable_non_loyalty_participants_redeem_points === '1'
              ? true
              : false,
          newAndLegacy:
            response?.data?.data?.customer_account_type === null
              ? 'legacy'
              : response?.data?.data?.customer_account_type,
        }));
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setLoading(false);
    }
  };

  const updateGeneralSetting = async (value, type) => {
    if (type === 'blogActivity') {
      value.enable_blog_activity =
        blogVisitActivity?.enable_blog_activity === true ? '1' : '0';
      setBlogVisitActivity((prev) => ({
        ...prev,
        btnLoading: true,
      }));
    }

    setProgramParticipants((prev) => ({
      ...prev,
      programLoading: type === 'program' ? true : false,
    }));
    setDisplaySetting((prev) => ({
      ...prev,
      btnLoading: type !== 'program' ? true : false,
    }));
    setPrefixDiscountCodes((prev) => ({
      ...prev,
      btnLoading: type === 'shop_discount_code_prefix' ? true : false,
    }));

    try {
      let payload = convertToFormDataCustom(value);
      const response = await updateSettingService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setDisplaySetting((prev) => ({
          ...prev,
          disabled: true,
          btnLoading: false,
        }));
        setProgramParticipants((prev) => ({
          ...prev,
          disabled: true,
          programLoading: false,
        }));
        setPrefixDiscountCodes((prev) => ({
          ...prev,
          btnLoading: false,
        }));
        setBlogVisitActivity((prev) => ({
          ...prev,
          btnLoading: false,
        }));
      } else {
        notification.error({
          message: response?.data?.msg,
        });
        setProgramParticipants((prev) => ({
          ...prev,
          programLoading: false,
        }));
        setDisplaySetting((prev) => ({
          ...prev,
          btnLoading: false,
        }));
        setPrefixDiscountCodes((prev) => ({
          ...prev,
          btnLoading: false,
        }));
        setBlogVisitActivity((prev) => ({
          ...prev,
          btnLoading: false,
        }));
      }
    } catch (error) {
      logger(error?.response);
      setProgramParticipants((prev) => ({
        ...prev,
        programLoading: false,
      }));
      setDisplaySetting((prev) => ({
        ...prev,
        btnLoading: false,
      }));
      setPrefixDiscountCodes((prev) => ({
        ...prev,
        btnLoading: false,
      }));
      setBlogVisitActivity((prev) => ({
        ...prev,
        btnLoading: false,
      }));
    }
  };

  const updateLytDiscountSetting = async (type) => {
    setCombineDisSetting((prev) => ({
      ...prev,
      btnLoading: type === 'popupSection' ? true : false,
    }));
    setApplyDiscontPurchaseType((prev) => ({
      ...prev,
      btnLoading: type !== 'popupSection' ? true : false,
    }));
    try {
      let obj = {};
      if (type === 'popupSection') {
        obj = {
          is_product_discount:
            combineDisSetting?.is_product_discount === true ? '1' : '0',
          is_order_discount:
            combineDisSetting?.is_order_discount === true ? '1' : '0',
          is_shipping_discount:
            combineDisSetting?.is_shipping_discount === true ? '1' : '0',
        };
      } else {
        obj = { purchase_type: applyDiscountPurchaseType?.purchase_type };
      }

      let payload = convertToFormDataCustom(obj);
      const response = await updateLytDiscountSettings(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setCombineDisSetting((prev) => ({
          ...prev,
          btnLoading: false,
        }));
        setApplyDiscontPurchaseType((prev) => ({
          ...prev,
          disabled: true,
          btnLoading: false,
        }));
        setDisplaySetting((prev) => ({
          ...prev,
          disabled: true,
        }));
      } else {
        notification.error({
          message: response?.data?.msg,
        });
        setCombineDisSetting((prev) => ({
          ...prev,
          btnLoading: false,
        }));
        setApplyDiscontPurchaseType((prev) => ({
          ...prev,
          btnLoading: false,
        }));
      }
    } catch (error) {
      logger(error?.response);
      setCombineDisSetting((prev) => ({
        ...prev,
        btnLoading: false,
      }));
      setApplyDiscontPurchaseType((prev) => ({
        ...prev,
        btnLoading: false,
      }));
    }
  };

  const getUnblockCustomerData = async (val, type) => {
    setBlockCustomerForLytProgram((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const res = await getUnBlockCustomersService();
      if (res?.data?.status === 'success') {
        setActionRequierd((prev) => ({
          ...prev,
          alertShow: val?.length > 0 ? true : false,
          data: JSON.parse(res?.data?.unblock_customer_html || '') || [],
        }));
        setBlockCustomerForLytProgram((prev) => ({
          ...prev,
          viewUnblockCustomerBtn: false,
          loading: false,
        }));

        if (type === 'delete') {
          setTags(val);
        }
      } else {
        setActionRequierd((prev) => ({
          ...prev,
          alertShow: true,
          data: [],
        }));
        setBlockCustomerForLytProgram((prev) => ({
          ...prev,
          viewUnblockCustomerBtn: false,
          loading: false,
        }));
        if (type === 'delete') {
          setTags(val);
        }
      }
    } catch (error) {
      logger(error?.response);
      setBlockCustomerForLytProgram((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const handleBlockCustomerByTag = async (val) => {
    setBlockCustomerForLytProgram((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      let payload = convertToFormDataCustom({ tag: val });
      const res = await blockCustomersService(payload);
      if (res?.data?.status === 'success') {
        setActionRequierd((prev) => ({
          ...prev,
          alertShow: val?.length > 0 ? true : false,
          // data: JSON?.parse(res?.data?.unblock_customer_html || ''),
        }));
        setBlockCustomerForLytProgram((prev) => ({
          ...prev,
          viewUnblockCustomerBtn: false,
          loading: false,
        }));
        // const updatedTags = tags.filter((tag) => tag !== val);
        // setTags(updatedTags);
        getUnblockCustomerData(val);
      } else {
        setActionRequierd((prev) => ({
          ...prev,
          alertShow: val?.length > 0 ? true : false,
          data: [],
        }));
        setBlockCustomerForLytProgram((prev) => ({
          ...prev,
          viewUnblockCustomerBtn: false,
          loading: false,
        }));
      }
    } catch (error) {
      logger(error?.response);
      setBlockCustomerForLytProgram((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const updateCustomerBlockTagSetting = async (tag, type, val) => {
    setBlockCustomerForLytProgram((prev) => ({
      ...prev,
      loading: type === 'delete' ? true : false,
      btnLoading: type === 'save' ? true : false,
      disabled: true,
    }));

    try {
      let value = {
        tags: tag?.join(','),
        remove_tag: val === 2 ? blockCustomerForLytProgram?.removeTag : '',
        remove_tag_req: tag?.length > 0 ? '1' : '0',
      };
      let payload = convertToFormDataCustom(value);
      const response = await updateCustomerBlockTagService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setVisible(false);
        let obj = apiData;
        obj.existing_tags = tag?.join(',');
        setAPIData(obj);

        setBlockCustomerForLytProgram((prev) => ({
          ...prev,
          viewUnblockCustomerBtn: false,
          btnLoading: false,
          disabled: true,
        }));
        if (type === 'delete') {
          // setTags(tag);

          getUnblockCustomerData(tag, 'delete');
        } else {
          getUnblockCustomerData(tag?.join(','));
        }
      } else {
        setBlockCustomerForLytProgram((prev) => ({
          ...prev,
          loading: false,
          btnLoading: false,
          disabled: false,
        }));
      }
    } catch (error) {
      logger(error?.response);
      setBlockCustomerForLytProgram((prev) => ({
        ...prev,
        loading: false,
        btnLoading: false,
        disabled: false,
      }));
    }
  };

  const removeTag = async (val) => {
    // const updatedTags = tags.filter((tag) => tag !== val);

    if (apiData?.existing_tags !== '') {
      setBlockCustomerForLytProgram((prev) => ({
        ...prev,
        loading: true,
        disabled: true,
      }));
      try {
        const obj = convertToFormDataCustoms(
          { obj: tags, tag: val },
          new FormData(),
          'remaining_tags'
        );

        const response = await getBlockCustomerCountryTagService(obj);

        if (response?.data?.status === 'success') {
          let currentTag = tags.filter((tag) => tag !== val);

          // setTags(updatedTags);
          updateCustomerBlockTagSetting(currentTag, 'delete', 1);
          setTags(currentTag.filter((tag) => tag !== val));
        } else {
          // notification.error({
          //   message: response?.data?.msg || 'Failed to remove tag',
          // });

          setVisible(true);
          setBlockCustomerForLytProgram((prev) => ({
            ...prev,
            loading: false,
            disabled: false,
            removeTag: val,
            block_customer_count: response?.data?.block_customer_count || '',
          }));
        }
      } catch (error) {
        logger(error?.response);
        notification.error({
          message: 'Something went wrong. Tag not removed.',
        });
        setBlockCustomerForLytProgram((prev) => ({
          ...prev,
          loading: false,
          disabled: false,
        }));
      }
    } else {
      setTags(tags.filter((tag) => tag !== val));
    }
  };

  const onHandleSyncCustomerBirthday = async (value) => {
    setCustomerBirthday((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      let obj = {
        enable_map_dob_with_loyalty_from_general_forms:
          !customerBirthDay?.enable_map_dob_with_loyalty_from_general_forms &&
          customerBirthDay?.map_dob_with_loyalty_from_general_forms_meta_type ===
            '0'
            ? '0'
            : '1',
        map_dob_with_loyalty_from_general_forms_type:
          customerBirthDay?.map_dob_with_loyalty_from_general_forms_type,
        map_dob_with_loyalty_from_general_forms_key:
          customerBirthDay?.enable_map_dob_with_loyalty_from_general_forms ===
          true
            ? value?.map_dob_with_loyalty_from_general_forms_key
            : '',
        map_dob_with_loyalty_from_general_forms_meta_type:
          customerBirthDay?.map_dob_with_loyalty_from_general_forms_meta_type,
        map_dob_with_loyalty_from_general_forms_meta_key:
          customerBirthDay?.map_dob_with_loyalty_from_general_forms_meta_type ===
          '0'
            ? ''
            : value?.map_dob_with_loyalty_from_general_forms_meta_key ||
              apiData?.map_dob_with_loyalty_from_general_forms_meta_key,
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
      const response = await syncCustomerBirthdayService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setCustomerBirthday((prev) => ({
          ...prev,
          disabled: true,
          loading: false,
        }));

        if (converted?.map_dob_with_loyalty_from_general_forms_type === '2') {
          getSettingDetails();
          form.setFieldsValue({
            map_dob_with_loyalty_from_general_forms_key: '',
          });
        }
      } else {
        notification.error({
          message: response?.data?.msg,
        });
        setCustomerBirthday((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    } catch (error) {
      logger(error?.response);
      setCustomerBirthday((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    if (sectionRef?.current && segmentBasedLyt?.newAndLegacy === 'new') {
      sectionRef?.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (
      callfirstTime &&
      legacySection?.current &&
      segmentBasedLyt?.newAndLegacy === 'legacy'
    ) {
      legacySection?.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setCallFirstTime(true);
    }
  }, [segmentBasedLyt]);

  useEffect(() => {
    getSettingDetails();
    getSegmentList();
  }, []);

  return (
    <>
      <AitPageHeader
        title="General setting"
        subtitle="General settings for loyalty program."
        hideButton
      />
      {loading ? (
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
          <AitCard margintop="24px">
            <AitText strong type="primary" size={18}>
              Program participants
            </AitText>
            <>
              <div style={{ marginBottom: 20, marginTop: 5 }}>
                <AitText type="secondary">
                  Manage who can participate in your loyalty program.
                </AitText>
              </div>

              <Row gutter={8}>
                <Col span={24}>
                  <AitRadioButton
                    isRowCol
                    name="discount_generator_type"
                    value={programParticipants?.value}
                    onChange={(e) => {
                      setProgramParticipants((prev) => ({
                        ...prev,
                        value: e.target.value,
                        disabled: false,
                      }));
                    }}
                    options={[
                      {
                        label: 'All customers',
                        helpertext: `Every customer including guests can earn points,
                            refer friends, and participate in your VIP
                            incentives. Customers will need to create a store
                            account in order to access their rewards.`,
                        value: 'all',
                        colSpan: 24,
                      },
                      {
                        label: 'Only customers who have a store account',
                        helpertext: `Customers must create a store account before their
                            purchase in order to participate in your loyalty
                            program.`,
                        value: 'registered',
                        colSpan: 24,
                      },
                    ]}
                  />
                </Col>
                <Col span={24}>
                  <AitAlert
                    type="warning"
                    barfontsize="13"
                    barpadding="8px 10px"
                    justify="start"
                    textAlign="left"
                    border
                    borderradius
                    note
                    color="var(--ant-color-text-default)"
                    message="This configuration is intended for use with legacy
                        customers and is not applicable to stores using the new
                        customer account system."
                  />
                </Col>
              </Row>
            </>
            <AitButton
              type="primary"
              style={{ marginTop: 15 }}
              title="Save settings"
              htmlType="submit"
              disabled={programParticipants?.disabled}
              loading={programParticipants?.programLoading}
              onClick={() =>
                updateGeneralSetting(
                  {
                    loyalty_participation_customer_type:
                      programParticipants?.value,
                  },
                  'program'
                )
              }
            />
          </AitCard>

          <AitCard margintop="24px">
            <AitText strong type="primary" size={18}>
              Segment-based loyalty participation
            </AitText>

            <div style={{ marginBottom: 20, marginTop: 5 }}>
              <AitText type="secondary">
                You can choose which customer segments can be a part of loyalty
                program. You can either include a segment to allow them to
                participate or exclude a segment to prevent them from
                participating. For a detailed overview and setup instructions,{' '}
                <AitLink
                  size={13}
                  weight={500}
                  // color="priamry"
                  href="https://docs.aitrillion.com/portal/en/kb/articles/include-or-exclude-customers-from-loyalty-program-participation#Introduction"
                  target="_blank"
                >
                  Click here{' '}
                </AitLink>
                to learn more.
              </AitText>
            </div>

            <Form
              initialValues={segmentBasedLyt}
              onFinish={onHandleSegmentBsdLyt}
              onValuesChange={(changedValues, allValues) => {
                setSegmentBasedLyt((prev) => ({
                  ...prev,
                  disabled: false,
                }));
              }}
            >
              <>
                <Row gutter={[24, 0]}>
                  <Col span={24} xs={24} ms={12} md={12}>
                    <AitCheckboxButton
                      label="Enable segment-based loyalty participation"
                      value={
                        segmentBasedLyt?.enable_segment_based_loyalty_participation
                      }
                      onChange={(e) => {
                        setSegmentBasedLyt((prev) => ({
                          ...prev,
                          enable_segment_based_loyalty_participation:
                            e?.target?.checked,
                          disabled: false,
                        }));
                      }}
                    />
                  </Col>
                </Row>
                {segmentBasedLyt?.enable_segment_based_loyalty_participation && (
                  <Row gutter={24} style={{ marginTop: 6 }}>
                    <Col xs={24} sm={24}>
                      <AitRadioButton
                        isRowCol
                        xs={24}
                        sm={24}
                        md={12}
                        lg={12}
                        // style={{ display: 'flex', flexDirection: 'column' }}
                        name="discount_generator_type"
                        value={segmentBasedLyt?.includeExcludeSegment}
                        columns={2}
                        onChange={(e) => {
                          setSegmentBasedLyt((prev) => ({
                            ...prev,
                            includeExcludeSegment: e?.target?.value,
                            disabled: false,
                          }));
                        }}
                        fontweight="500"
                        options={[
                          {
                            label: 'Include a segment',
                            helpertext: `Customers from the chosen segment will be able
                                to participate into loyalty program.`,
                            value: 'include_a_segment',
                          },
                          {
                            label: 'Exclude a segment',
                            helpertext: `Customers from the chosen segment will not be
                                able to participate into loyalty program.`,
                            value: 'exclude_a_segment',
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                )}
                {segmentBasedLyt?.enable_segment_based_loyalty_participation && (
                  <Row gutter={24}>
                    <Col span={12} xs={24} ms={12} md={12} lg={24}>
                      <Form.Item>
                        <Row gutter={24}>
                          <Col span={21} xs={24} ms={12} md={12}>
                            <Flex gap={10}>
                              <div style={{ flex: '1 1 auto' }}>
                                <AitSelectBox
                                  label={
                                    <>
                                      Select segment or{' '}
                                      <AitLink
                                        size={14}
                                        weight={500}
                                        color="priamry"
                                        // href={`${process.env.NEXT_PUBLIC_SITE_URL}/customers/all-customers/list`}
                                        href={`${process.env.NEXT_PUBLIC_APP_URL}/customers#/list?ai_v2=${token}`}
                                        target="_blank"
                                      >
                                        Create a new segment
                                      </AitLink>
                                    </>
                                  }
                                  name="peopleType"
                                  loading={segmentBasedLyt?.segementListLoading}
                                  options={segmentBasedLyt?.segmentList}
                                  placeholder="Select segment"
                                  disabled={
                                    segmentBasedLyt?.segementListLoading
                                  }
                                  // style={{ width: '350%' }}
                                  value={segmentBasedLyt?.selected_segment}
                                  onChange={(e) =>
                                    setSegmentBasedLyt((prev) => ({
                                      ...prev,
                                      selected_segment: e,
                                      disabled: false,
                                    }))
                                  }
                                />
                              </div>
                              <SyncLink
                                onClick={() => getSegmentList()}
                                style={{ marginBottom: 18, alignSelf: 'end' }}
                              >
                                <SyncOutlined />{' '}
                              </SyncLink>
                            </Flex>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item style={{ marginBottom: 5 }}>
                        <AitCheckboxButton
                          checked={
                            segmentBasedLyt?.enable_non_loyalty_participants_redeem_points
                          }
                          onChange={(e) =>
                            setSegmentBasedLyt((prev) => ({
                              ...prev,
                              enable_non_loyalty_participants_redeem_points:
                                e?.target?.checked,
                              disabled: false,
                            }))
                          }
                          label="Allow non-loyalty participants to redeem previously earned points on the Cart/Customer account and CheckoutX pages."
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item style={{ marginBottom: 5 }}>
                        <AitRadioButton
                          isRowCol
                          xs={24}
                          ms={12}
                          md={12}
                          lg={12}
                          // name="discount_generator_type"
                          value={segmentBasedLyt?.newAndLegacy}
                          columns={2}
                          onChange={(e) => {
                            setSegmentBasedLyt((prev) => ({
                              ...prev,
                              newAndLegacy: e?.target?.value,
                              disabled: false,
                            }));
                          }}
                          fontweight="500"
                          options={[
                            {
                              label: 'Legacy',
                              helpertext:
                                'Customers log in with email and password.',
                              value: 'legacy',
                            },
                            {
                              label: 'New',
                              helpertext: `Customer log in with one-time code sent to
                                    their email (no passwords).`,
                              value: 'new',
                            },
                          ]}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <span ref={legacySection}>
                        <label>
                          Show custom content on the loyalty popup for
                          non-participating customers.
                        </label>
                        <Form.Item style={{ marginTop: 10 }}>
                          <TextEditor
                            initialValue={decodeURIComponent(
                              apiData?.custom_html_content || ''
                            )}
                            // onChangeValue={(val) =>
                            //   setSegmentBasedLyt((prev) => ({
                            //     ...prev,
                            //     custom_html_content: val,
                            //     disabled: false,
                            //   }))
                            // }
                            onChange={(e) => {
                              // form.setFieldValue('help_text', e);
                              setSegmentBasedLyt((prev) => ({
                                ...prev,
                                custom_html_content: e,
                                disabled: false,
                              }));
                            }}
                            // value={}
                          />
                        </Form.Item>
                      </span>
                    </Col>

                    <span
                      ref={sectionRef}
                      style={{
                        display:
                          segmentBasedLyt?.newAndLegacy === 'new' ? '' : 'none',
                      }}
                    >
                      <Col
                        span={24}
                        xs={24}
                        ms={12}
                        md={12}
                        lg={24}
                        style={{ marginBottom: '10px' }}
                      >
                        <label>
                          Show custom content inside Loyalty rewards and Refer a
                          friend section on new customer account for
                          non-participating customers.
                        </label>
                      </Col>
                      <Col span={24} xs={24} ms={12} md={12} lg={24}>
                        <AitCard
                          bodypadding={{
                            xs: '16px 16px 0px 16px',
                            sm: '20px 20px 5px 20px',
                            md: '20px 24px 5px 24px',
                          }}
                          style={{
                            marginBottom: 16,
                          }}
                          token={{
                            colorBgContainer: '#F6F7F8',
                            colorBorderSecondary: '#ddd',
                          }}
                        >
                          <Row gutter={24}>
                            <Col span={24} xs={24} ms={12} md={12}>
                              <Form.Item name="editor_heading_text">
                                <AitInputBox
                                  label="Heading text"
                                  placeholder="Join Our Loyalty Program"
                                  style={{ backgroundColor: '#fff' }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={24} xs={24} ms={12} md={12}>
                              <Form.Item name="editor_subheading_text">
                                <AitInputBox
                                  label="Subheading text"
                                  placeholder="100"
                                  style={{ backgroundColor: '#fff' }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} xs={24} ms={12} md={12}>
                              <Form.Item name="editor_listitem_1_text">
                                <AitInputBox
                                  label="List item 1 text"
                                  placeholder="100"
                                  style={{ backgroundColor: '#fff' }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} xs={24} ms={12} md={12}>
                              <Form.Item name="editor_listitem_2_text">
                                <AitInputBox
                                  label="List item 2 text"
                                  placeholder="100"
                                  style={{ backgroundColor: '#fff' }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} xs={24} ms={12} md={12}>
                              <Form.Item name="editor_listitem_3_text">
                                <AitInputBox
                                  label="List item 3 text"
                                  placeholder="100"
                                  style={{ backgroundColor: '#fff' }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} xs={24} ms={12} md={12}>
                              <Form.Item name="editor_listitem_4_text">
                                <AitInputBox
                                  label="List item 4 text"
                                  placeholder="100"
                                  style={{ backgroundColor: '#fff' }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} xs={24} ms={12} md={12}>
                              <Form.Item name="editor_listitem_5_text">
                                <AitInputBox
                                  label="List item 5 text"
                                  placeholder="100"
                                  style={{ backgroundColor: '#fff' }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} xs={24} ms={12} md={12}>
                              <Form.Item name="editor_btn_text">
                                <AitInputBox
                                  label="Button text"
                                  placeholder="100"
                                  style={{ backgroundColor: '#fff' }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12} xs={24} ms={12} md={12}>
                              <Form.Item name="editor_btn_link">
                                <AitInputBox
                                  label="Button link"
                                  placeholder="100"
                                  style={{ backgroundColor: '#fff' }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </AitCard>
                      </Col>
                    </span>
                  </Row>
                )}
                {/* <Row gutter={24}> */}
                {/* </Row> */}
              </>
              <div>
                <AitButton
                  type="primary"
                  style={{ marginTop: 15 }}
                  title="Save settings"
                  htmlType="submit"
                  loading={segmentBasedLyt?.btnLoading}
                  disabled={segmentBasedLyt?.disabled}
                />
              </div>
            </Form>
          </AitCard>

          <AitCard margintop="24px">
            <AitText strong type="primary" size={18}>
              Block customers from loyalty program
            </AitText>
            <>
              <div style={{ marginBottom: 20, marginTop: 5 }}>
                <AitText type="secondary">
                  Please note that customers you have blocked or that have not
                  created an account for your store will not be eligible for
                  your rewards program.
                </AitText>
              </div>

              <Row gutter={[8, 8]} style={{ marginTop: '15px' }}>
                <Col span={24}>
                  <Flex gap={10}>
                    <Form.Item style={{ flex: '1 1 auto', marginBottom: 10 }}>
                      <AitInputBox
                        label="Block customers with any of the following tags"
                        //   placeholder="100"
                        value={inputValue}
                        onChange={handleInputChange}
                        // onChange={(e) => setInputValue(e?.target?.value)}
                        onKeyDown={handleInputKeyDown}
                      />
                    </Form.Item>
                    <div
                      style={{
                        flex: !screens?.sm ? '0 0 60px' : '0 0 90px',
                        marginBottom: 10,
                        alignSelf: 'end',
                      }}
                    >
                      <AitButton
                        type="primary"
                        title="+ Add"
                        htmlType="submit"
                        onClick={() => handleInputKeyDown('save')}
                        padding={!screens?.sm && '8px 10px'}
                      />
                    </div>
                  </Flex>

                  {/* <br /> */}
                  <Col span={24} style={{ marginBottom: '10px' }}>
                    {tags?.map((tag) => (
                      <Tag
                        key={tag}
                        closable
                        onClose={() => removeTag(tag)}
                        style={{
                          marginBottom: 2,
                          padding: 5,
                          position: 'relative',
                          top: '0px',
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Col>
                </Col>
              </Row>
            </>
            <Flex
              wrap // enables responsiveness
              gap={12}
              align="center"
            >
              <AitButton
                style={{ marginTop: '14px' }}
                type="primary"
                title="Save settings"
                htmlType="submit"
                disabled={blockCustomerForLytProgram?.disabled}
                loading={blockCustomerForLytProgram?.btnLoading}
                onClick={() => updateCustomerBlockTagSetting(tags, 'save')}
              />

              {/* {(apiData?.existing_tags === '' || !apiData?.existing_tags) && ( */}
              {blockCustomerForLytProgram?.viewUnblockCustomerBtn && (
                <div style={{ marginTop: 14 }}>
                  <Flex align="center" gap={6}>
                    <LockIcon />
                    <AitLink
                      onClick={(e) => {
                        e.preventDefault();
                        getUnblockCustomerData(tags);
                      }}
                    >
                      Show unblock customers with above tags
                    </AitLink>
                  </Flex>
                </div>
              )}
              {/* )} */}
            </Flex>

            {blockCustomerForLytProgram?.loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spin />
              </div>
            ) : (
              actionRequierd?.alertShow && (
                <>
                  {actionRequierd?.data?.length > 0 && (
                    <div
                      style={{
                        marginTop: 24,
                      }}
                    >
                      <AitText strong size={18} color="primary">
                        Action required
                      </AitText>
                    </div>
                  )}
                  {actionRequierd?.data?.length > 0 ? (
                    actionRequierd?.data?.map((item, index) => (
                      // <AlertBox backgroundColor="#F0F6FF" key={index}>
                      //   {' '}
                      //   <span
                      //     style={{
                      //       marginTop: 4,
                      //       marginLeft: 3,
                      //       fontSize: '13px',
                      //     }}
                      //   >
                      //     {' '}
                      //     We have found{' '}
                      //     {parse(item?.unblock_customer_count || '')} existing
                      //     unblocked customers who have the{' '}
                      //     <AitText>{parse(item?.tag || '')}</AitText> tag. Do
                      //     you want to block them?{' '}
                      //     <AitButton
                      //       type="primary"
                      //       title="Yes, I want to block"
                      //       size="small"
                      //       padding="5px 8px"
                      //       onClick={() => handleBlockCustomerByTag(item?.tag)}
                      //     />
                      //   </span>{' '}
                      // </AlertBox>
                      <>
                        <AitAlert
                          style={{ marginTop: '10px' }}
                          type="info"
                          barfontsize="13"
                          barpadding="8px 10px"
                          justify="start"
                          textAlign="left"
                          border
                          borderradius
                          block="block"
                          color="var(--ant-color-text-default)"
                          message={
                            <>
                              We have found{' '}
                              {parse(item?.unblock_customer_count || '')}{' '}
                              existing unblocked customers who have the{' '}
                              <span
                                style={{
                                  fontWeight: 500,
                                }}
                              >
                                {parse(item?.tag || '')}
                              </span>{' '}
                              tag. Do you want to block them? &nbsp;
                              <AitButton
                                type="primary"
                                title="Yes, I want to block"
                                size="small"
                                padding="5px 8px"
                                onClick={
                                  () =>
                                    setBlockModal((prev) => ({
                                      ...prev,
                                      modal: true,
                                      tagID: item?.tag,
                                    }))
                                  // handleBlockCustomerByTag(item?.tag)
                                }
                              />{' '}
                            </>
                          }
                        />{' '}
                      </>
                    ))
                  ) : (
                    <div style={{ marginTop: 10 }}>
                      <AitAlert
                        type="info"
                        justify="start"
                        //hascustomicon={false}
                        barfontsize="13"
                        barpadding="8px 10px"
                        alignicon="start"
                        textAlign="left"
                        icontopspacing="2"
                        border
                        borderradius
                        showIcon={false}
                        bgcolor="#F0F6FF"
                        color="var(--ant-color-text-default)"
                        message="No existing unblock customer found with the above blocking tag(s)."
                        style={{ marginBottom: 16 }}
                      />
                    </div>
                  )}
                </>
              )
            )}
          </AitCard>

          <AitCard margintop="24px">
            <AitText strong type="primary" size={18}>
              Combine discount code settings
            </AitText>

            {!apiData?.is_lyt_discount_write_access &&
            apiData?.permission_url === 0 ? (
              <>
                <div>
                  <AitText type="secondary">
                    Loyalty discount can be combined with:
                  </AitText>
                </div>
                <div style={{ marginTop: 20, marginBottom: 16 }}>
                  <AitText type="secondary">
                    You need to also mark other discount code which is created
                    on shop.
                  </AitText>
                </div>

                <Col span={24}>
                  <AitAlert
                    type="warning"
                    barfontsize="13"
                    barpadding="8px 10px"
                    justify="start"
                    textAlign="left"
                    border
                    borderradius
                    note
                    block="block"
                    color="var(--ant-color-text-default)"
                    message="To combine a discount with the
                      AiTrillion discount code, you must also enable the
                      corresponding discounts in Shopify."
                    link={{
                      href: 'https://docs.aitrillion.com/portal/en/kb/articles/create-multiple-discounts-on-product-with-discount-type#h_d9c8394795',
                      target: '_blank',
                      text: 'Click here to learn more.',
                    }}
                    linkfontwight="500"
                  />
                </Col>
                <Col span={24} style={{ marginTop: '20px' }}>
                  {/* <Form.Item> */}
                  <AitCheckboxButton
                    label="Product discount code."
                    name="is_product_discount"
                    value={combineDisSetting?.is_product_discount}
                    onChange={(e) =>
                      setCombineDisSetting((prev) => ({
                        ...prev,
                        is_product_discount: e?.target?.checked,
                        disabled: false,
                      }))
                    }
                  />
                  {/* </Form.Item> */}
                </Col>
                <Col span={24}>
                  {/* <Form.Item> */}
                  <AitCheckboxButton
                    label="Order discount code."
                    name="is_order_discount"
                    value={combineDisSetting?.is_order_discount}
                    onChange={(e) =>
                      setCombineDisSetting((prev) => ({
                        ...prev,
                        is_order_discount: e?.target?.checked,
                        disabled: false,
                      }))
                    }
                  />
                  {/* </Form.Item> */}
                </Col>
                <Col span={24}>
                  {/* <Form.Item> */}
                  <AitCheckboxButton
                    label="Shipping discount code."
                    name="is_shipping_discount"
                    value={combineDisSetting?.is_shipping_discount}
                    onChange={(e) =>
                      setCombineDisSetting((prev) => ({
                        ...prev,
                        is_shipping_discount: e?.target?.checked,
                        disabled: false,
                      }))
                    }
                  />
                  {/* </Form.Item> */}
                </Col>
                <AitButton
                  type="primary"
                  style={{ marginTop: 15 }}
                  title="Save settings"
                  htmlType="submit"
                  loading={combineDisSetting?.btnLoading}
                  disabled={combineDisSetting?.disabled}
                  onClick={() => updateLytDiscountSetting('popupSection')}
                />
              </>
            ) : (
              <>
                <div style={{ marginBottom: 20, marginTop: 5 }}>
                  <AitText type="secondary">
                    To enable the discount combine feature in Shopify,
                    additional permissions are required. These permissions allow
                    the system to effectively combine discounts for customers.
                    Therefore, please allow permission to use the discount
                    combine feature.
                  </AitText>
                </div>

                <AitButton
                  type="primary"
                  title="Allow Permission"
                  htmlType="submit"
                  onClick={() => window.open(apiData?.permission_url, '_blank')}
                />
              </>
            )}
          </AitCard>

          <AitCard margintop="24px">
            <AitText strong type="primary" size={18}>
              Display settings for loyalty popup sections
            </AitText>

            <div style={{ marginBottom: 20, marginTop: 5 }}>
              <AitText type="secondary">
                Enabling this option displays pending points in the loyalty
                popup.
              </AitText>
            </div>
            <>
              <Col span={24} style={{ marginTop: '15px' }}>
                {/* <Form.Item name="show_pending_points"> */}
                <AitCheckboxButton
                  name="show_pending_points"
                  label="Show pending points"
                  value={displaySetting?.show_pending_points}
                  onChange={(e) =>
                    setDisplaySetting((prev) => ({
                      ...prev,
                      show_pending_points: e?.target?.checked,
                      disabled: false,
                    }))
                  }
                />
                {/* </Form.Item> */}
              </Col>
            </>
            <AitButton
              type="primary"
              title="Save settings"
              htmlType="submit"
              disabled={displaySetting?.disabled}
              loading={displaySetting?.btnLoading}
              onClick={() =>
                updateGeneralSetting(
                  {
                    showPendingPoints:
                      displaySetting?.show_pending_points === true ? '1' : '0',
                  },
                  'display'
                )
              }
            />
          </AitCard>

          <AitCard margintop="24px">
            <AitText strong type="primary" size={18}>
              Apply discount on purchase type
            </AitText>

            <div style={{ marginBottom: 20, marginTop: 5 }}>
              <AitText type="secondary">
                You can apply a discount based on the purchase type:
              </AitText>
            </div>

            <div>
              {!apiData?.isEligible && (
                <AitAlert
                  type="warning"
                  barfontsize="13"
                  barpadding="8px 10px"
                  justify="start"
                  textAlign="left"
                  border
                  borderradius
                  note
                  color="var(--ant-color-text-default)"
                  message="Your store is currently not eligible to
                    modify this setting. For further assistance, please contact
                    support."
                />
              )}
            </div>
            <>
              <Col span={24} style={{ marginTop: '15px' }}>
                <Form.Item>
                  <AitSelectBox
                    name="purchase_type"
                    onChange={(e) =>
                      setApplyDiscontPurchaseType((prev) => ({
                        ...prev,
                        purchase_type: e,
                        disabled: false,
                      }))
                    }
                    options={[
                      // { label: 'Select purchase type', value: '' },
                      { label: 'One time', value: 'appliesOnOneTimePurchase' },
                      { label: 'Subscription', value: 'appliesOnSubscription' },
                      { label: 'Both', value: 'both' },
                    ]}
                    placeholder="Select purchase type"
                    disabled={!apiData?.isEligible}
                    // style={{ width: '350%' }}
                    value={applyDiscountPurchaseType?.purchase_type}
                  />
                </Form.Item>
              </Col>
            </>
            <AitButton
              type="primary"
              title="Save settings"
              htmlType="submit"
              disabled={applyDiscountPurchaseType?.disabled}
              loading={applyDiscountPurchaseType?.btnLoading}
              onClick={() => updateLytDiscountSetting('purchaseType')}
            />
          </AitCard>

          <AitCard margintop="24px">
            <AitText strong type="primary" size={18}>
              Sync customer birthday to AiTrillion from Shopify notes and
              metafields
            </AitText>

            <div style={{ marginBottom: 20, marginTop: 5 }}>
              <AitText type="secondary">
                Easily capture and sync your customers' birthdates from Shopify
                into AiTrillion using the customer's note field or metafields.
                This ensures customers receive all birthday-related benefits,
                such as birthday points or any activity points, if applicable
              </AitText>
            </div>
            <Form
              // form={form}
              initialValues={{
                map_dob_with_loyalty_from_general_forms_key:
                  apiData?.map_dob_with_loyalty_from_general_forms_key ===
                    'undefined' ||
                  apiData?.map_dob_with_loyalty_from_general_forms_key ===
                    'null'
                    ? ''
                    : apiData?.map_dob_with_loyalty_from_general_forms_key,
                map_dob_with_loyalty_from_general_forms_meta_key:
                  apiData?.map_dob_with_loyalty_from_general_forms_meta_key ===
                    'null' ||
                  apiData?.map_dob_with_loyalty_from_general_forms_meta_key ===
                    'undefined'
                    ? ''
                    : apiData?.map_dob_with_loyalty_from_general_forms_meta_key,
              }}
              onFinish={onHandleSyncCustomerBirthday}
              onValuesChange={(changedValues, allValues) => {
                setCustomerBirthday((prev) => ({
                  ...prev,
                  disabled: false,
                }));
              }}
            >
              <div>
                {apiData?.activeRulesforBirthday === '1' && (
                  <AlertBox>
                    <ModalAlertIcon />{' '}
                    <span
                      style={{ marginTop: 4, marginLeft: 3, fontSize: '13px' }}
                    >
                      {' '}
                      Your birthday point allotment activity is currently turned
                      off. To start awarding points to your customer on their
                      birthday,{' '}
                      <AitLink
                        size={13}
                        weight={500}
                        // color="priamry"
                        href={`${window.location.origin}/${moduleRoute?.loyalty_rewards?.earn_points}`}
                        target="_blank"
                      >
                        Click here{' '}
                      </AitLink>
                      to enable it.
                    </span>{' '}
                  </AlertBox>
                )}
              </div>
              <>
                <Row gutter={[24, 10]} style={{ marginTop: '15px' }}>
                  <Col span={12} xs={24} ms={12} md={12}>
                    <AitCheckboxButton
                      marginbottom={0}
                      label="Map with Shopify's customer note attribute."
                      value={
                        customerBirthDay?.enable_map_dob_with_loyalty_from_general_forms
                      }
                      onChange={(e) => {
                        setCustomerBirthday((prev) => ({
                          ...prev,
                          enable_map_dob_with_loyalty_from_general_forms:
                            e?.target?.checked,
                          disabled: false,
                        }));
                      }}
                    />
                    <Row gutter={24}>
                      <Col span={24}>
                        {customerBirthDay?.enable_map_dob_with_loyalty_from_general_forms && (
                          <AitRadioButton
                            style={{ marginTop: 16 }}
                            gap={0}
                            isRowCol
                            value={
                              customerBirthDay?.map_dob_with_loyalty_from_general_forms_type ===
                              '1'
                                ? '1'
                                : '2'
                            }
                            onChange={(e) => {
                              setCustomerBirthday((prev) => ({
                                ...prev,
                                map_dob_with_loyalty_from_general_forms_type:
                                  e?.target?.value,
                                disabled: false,
                              }));
                            }}
                            options={[
                              {
                                label: `Map with Shopify's note attribute using a
                                  key-value format.`,
                                helpertext: (
                                  <Row
                                    gutter={[16, 0]}
                                    style={{ marginTop: 10 }}
                                  >
                                    <Col xs={24} sm={12}>
                                      {customerBirthDay?.map_dob_with_loyalty_from_general_forms_type ===
                                        '1' && (
                                        <Form.Item
                                          name="map_dob_with_loyalty_from_general_forms_key"
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                'Enter the note attribute key name.',
                                            },
                                          ]}
                                        >
                                          <AitInputBox placeholder="Enter key name" />
                                        </Form.Item>
                                      )}
                                    </Col>
                                  </Row>
                                ),
                                value: '1',
                                colSpan: 24,
                              },
                              {
                                label: `Map with Shopify's note attribute as one
                                  continuous string.`,
                                value: '2',
                                colSpan: 24,
                              },
                            ]}
                          />
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12} xs={24} ms={12} md={12}>
                    <AitCheckboxButton
                      label="Map with Shopify's customer metafield."
                      value={
                        customerBirthDay?.map_dob_with_loyalty_from_general_forms_meta_type ===
                        '1'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setCustomerBirthday((prev) => ({
                          ...prev,
                          map_dob_with_loyalty_from_general_forms_meta_type:
                            e?.target?.checked === true ? '1' : '0',
                          disabled: false,
                        }));
                      }}
                    />
                    {customerBirthDay?.map_dob_with_loyalty_from_general_forms_meta_type ===
                      '1' && (
                      <div
                        style={{
                          fontWeight: 400,
                          color: '#666',
                          fontSize: 13,
                          width: '65%',
                          marginLeft: 25,
                        }}
                      >
                        <Form.Item
                          name="map_dob_with_loyalty_from_general_forms_meta_key"
                          rules={[
                            {
                              required: true,
                              message: 'Enter metafield name.',
                            },
                          ]}
                        >
                          <AitInputBox placeholder="Enter metafield name" />
                        </Form.Item>
                      </div>
                    )}
                  </Col>
                </Row>
              </>
              <AitButton
                type="primary"
                style={{ marginTop: 15 }}
                title="Save settings"
                htmlType="submit"
                disabled={customerBirthDay?.disabled}
                loading={customerBirthDay?.loading}
                // onClick={() => onHandleSyncCustomerBirthday()}
              />
            </Form>
          </AitCard>

          <AitCard margintop="24px">
            <AitText strong type="primary" size={18}>
              Apply prefix on discount code
            </AitText>

            <div style={{ marginBottom: 20, marginTop: 5 }}>
              <AitText type="secondary">You can apply discount prefix:</AitText>
            </div>

            <>
              <Col
                span={8}
                xs={24}
                ms={12}
                md={12}
                style={{ marginTop: '15px', marginBottom: 24 }}
              >
                {/* <Form.Item name="show_pending_points"> */}
                <AitInputBox
                  name="shop_discount_code_prefix"
                  // label="Show pending points"
                  value={prefixDiscountCodes?.shop_discount_code_prefix}
                  onChange={(e) =>
                    setPrefixDiscountCodes((prev) => ({
                      ...prev,
                      shop_discount_code_prefix: e?.target?.value,
                      disabled: false,
                    }))
                  }
                  placeholder="Enter discount code prefix"
                />
                {/* </Form.Item> */}
              </Col>
            </>
            <AitButton
              type="primary"
              title="Save settings"
              htmlType="submit"
              disabled={prefixDiscountCodes?.disabled}
              loading={prefixDiscountCodes?.btnLoading}
              onClick={() =>
                updateGeneralSetting(
                  {
                    shop_discount_code_prefix:
                      prefixDiscountCodes?.shop_discount_code_prefix,
                  },
                  'shop_discount_code_prefix'
                )
              }
            />
          </AitCard>
          {jwtState?.login_auth?.shop_id === '164117' && (
            <AitCard margintop="24px">
              <AitText strong type="primary" size={18}>
                Setup blog visit activity
              </AitText>

              <div style={{ marginBottom: 20, marginTop: 5 }}>
                <AitText type="secondary">
                  {' '}
                  You can set up a blog activity for your customers, allowing
                  them to earn points when they click on a particular blog.
                </AitText>
              </div>

              <Form
                form={form}
                onFinish={(e) => updateGeneralSetting(e, 'blogActivity')}
              >
                <Col
                  span={8}
                  xs={24}
                  ms={12}
                  md={12}
                  style={{ marginBottom: '24px' }}
                >
                  {/* <Form.Item
                  // name="enable_blog_activity"
                  style={{ marginBottom: '5px' }}
                > */}
                  <AitCheckboxButton
                    label="Enable blog activity"
                    value={blogVisitActivity?.enable_blog_activity}
                    onChange={(e) => {
                      setBlogVisitActivity((prev) => ({
                        ...prev,
                        enable_blog_activity: e?.target?.checked,
                        // disabled: false,
                      }));
                    }}
                  />
                  {/* </Form.Item> */}
                </Col>
                <div
                  style={{
                    display:
                      blogVisitActivity?.enable_blog_activity === false
                        ? 'none'
                        : '',
                  }}
                >
                  <Row gutter={[24, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="points_for_visiting_a_blog">
                        <AitInputBox
                          label="Enter the number of points customers will earn for visiting a blog."
                          onKeyPress={enterOnlyNumericValue}
                          placeholder="Enter the number of points customers will earn for visiting a blog."
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="max_number_of_visit_per_day">
                        <AitSelectBox
                          name="max_number_of_visit_per_day"
                          label="Maximum number of times points can be earned per day."
                          options={[
                            {
                              label:
                                'Maximum number of times points can be earned per day',
                              value: '',
                            },
                            {
                              label: '1',
                              value: '1',
                            },
                            {
                              label: '2',
                              value: '2',
                            },
                            {
                              label: '3',
                              value: '3',
                            },
                            {
                              label: '4',
                              value: '4',
                            },
                            {
                              label: '5',
                              value: '5',
                            },
                            {
                              label: '6',
                              value: '6',
                            },
                            {
                              label: '7',
                              value: '7',
                            },
                            {
                              label: '8',
                              value: '8',
                            },
                            {
                              label: '9',
                              value: '9',
                            },
                            {
                              label: '10',
                              value: '10',
                            },
                          ]}
                          placeholder="Enter discount code prefix"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="blog_url">
                        <AitInputBox
                          label="Enter Blog url"
                          placeholder="Enter Blog url."
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="blog_activity_title">
                        <AitInputBox
                          label="Activity title (Visit Blog)"
                          placeholder="Visit Blog"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="blog_activity_description">
                        <AitInputBox
                          label="Activity Description (Get {points} points when you visit the blog)"
                          placeholder="blog_activity_description"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="blog_activity_button_text">
                        <AitInputBox
                          label="Visit blog button text (Visit now)"
                          placeholder="blog_activity_button_text"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <AitButton
                  type="primary"
                  // style={{ marginTop: 15 }}
                  title="Save settings"
                  htmlType="submit"
                  // disabled={blogVisitActivity?.disabled}
                  loading={blogVisitActivity?.btnLoading}
                  // onClick={() =>
                  //   updateGeneralSetting(
                  //     {
                  //       shop_discount_code_prefix:
                  //         prefixDiscountCodes?.shop_discount_code_prefix,
                  //     },
                  //     'shop_discount_code_prefix'
                  //   )
                  // }
                />
              </Form>
            </AitCard>
          )}

          <AitConfirmationModal
            visible={visible}
            setVisible={() => {
              setVisible(false);
              setTags([...tags, blockCustomerForLytProgram?.removeTag]);
            }}
            confirmText="Yes, delete it!"
            description={`${blockCustomerForLytProgram?.block_customer_count} members have been blocked with the ${blockCustomerForLytProgram?.removeTag} tag. Deleting this tag will unblock the users.`}
            onConfirm={() => {
              updateCustomerBlockTagSetting(
                tags?.filter(
                  (tag) => tag !== blockCustomerForLytProgram?.removeTag
                ),
                'delete',
                2
              );
              // setTags(
              //   tags?.filter(
              //     (tag) => tag !== blockCustomerForLytProgram?.removeTag
              //   )
              // );
            }}
            confirmButtonLoading={blockCustomerForLytProgram?.loading}
          />
          <AitConfirmationModal
            visible={blockModal?.modal}
            setVisible={() => {
              setBlockModal((prev) => ({
                ...prev,
                modal: false,
                tagID: '',
              }));
            }}
            confirmText="Yes, block it!"
            description=""
            onConfirm={() => {
              handleBlockCustomerByTag(blockModal?.tagID);
              setBlockModal((prev) => ({
                ...prev,
                modal: false,
                tagID: '',
              }));
            }}
            confirmButtonLoading={blockCustomerForLytProgram?.loading}
          />
        </>
      )}
    </>
  );
}

export default GeneralSettingTamplate;
