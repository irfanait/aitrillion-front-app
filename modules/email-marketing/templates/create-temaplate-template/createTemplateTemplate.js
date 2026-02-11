import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  EditorWrapper,
  LoaderContent,
  LoaderOverlay,
  NotificationZone,
  PreviewContainer,
  SettingsContainer,
} from './style';
import { DEFAULT_TEMPLATE } from '../../utils/default-template';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDecodedUrlApi,
  getMergeTagsApi,
  getTemplateByIdApi,
  getTemplateDataByCampaignIdApi,
  saveNewTemplateDataApi,
} from '@/redux/apis/stripo-api/stripoApi';
import {
  resetMergeTagsState,
  resetTemplateState,
  saveEmailTemplateReset,
  setFallbackTemplate,
} from '@/redux/stripo-slices/stripo-slice';
import EditorNavbar from '../../molecules/editor-navbar/editorNavbar';
import SaveEmailTemplateModal from '../../molecules/save-email-template-modal/saveEmailTemplateModal';
import { useRouter } from 'next/router';
import { App, Result, Spin } from 'antd';
import TemplatePreviewModal from '../../molecules/template-preview-modal/templatePreviewModal';
import SendTestModal from '../../molecules/send-test-modal/sendTestModal';
import { sendTestEmailPreviewMessageReset } from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { sendTestEmailApi } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';

const CreateTemplateTemplate = (props) => {
  const { allowNavigationRef, isNavigatingRef, onSafeNavigate } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const formikRef = useRef(null);
  const loadedRef = useRef(false);
  const initializedRef = useRef(false);
  const shouldReinitRef = useRef(true);

  // const templateName = formikRef?.current?.values?.title || '';

  const { notification } = App.useApp();
  const { login_auth } = useSelector((state) => state.jwtState);
  const {
    mergeTags,
    socialNetworks,
    currentTemplate,
    getDecodedUrlData,
    templateData,
    saveEmailTemplateState,
    saveEmailTemplateMessage,
    saveEmailTemplateError,
    templateDataByCampaignId,
    savedEmailTemplateData,
  } = useSelector((state) => state.stripoState);

  const { email_data } = getDecodedUrlData;

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const shop_type = login_auth?.shop_type;
  const custom_collection_name =
    shop_type && shop_type !== 'shopify'
      ? 'WooCommerce collection products'
      : 'Shopify collection products';

  const [loading, setLoading] = useState(true);
  const [saveTemplateModalVisible, setSaveTemplateModalVisible] =
    useState(false);
  const [actionButtonType, setActionButtonType] = useState('');
  const [compiledTemplate, setCompiledTemplate] = useState('');
  const [templatePreviewModalVisible, setTemplatePreviewModalVisible] =
    useState(false);
  const [sendTestModalVisible, setSendTestModalVisible] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [discardAndBackModalVisible, setDiscardAndBackModalVisible] =
    useState(false);
  const [progress, setProgress] = useState(0);
  const [templateName, setTemplateName] = useState('');
  const [isStripoReady, setIsStripoReady] = useState(false);

  const saveAndExitInitialState = useMemo(
    () => ({
      title: router?.query?.etid ? templateData?.templateRow?.title || '' : '',
      subject: router?.query?.etid
        ? templateData?.templateRow?.subject || ''
        : '',
      customUtm: false,
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      utm_medium: 'Marketing_Email',
      utm_source: 'AiTrillion.com',
      prev_action_type: '',
      EmailNotificationfromEmail: getDecodedUrlData.decoded_data || '',
      EmailNotificationfromName: email_data?.from_name || '',
      action_type: '',
      change_only_template_name: 0,
      template_html: '',
      template_css: '',
      content: '',
      template_id: '0',
      campaign_id: '0',
      editorType: '',
    }),
    [router?.query?.etid, templateData, getDecodedUrlData, email_data]
  );

  // Product groups
  const grpArr = [
    {
      id: 'new_arrival',
      name: 'New arrival products',
      image_url:
        process.env.NEXT_PUBLIC_SITE_URL + '/images/product-preview-image.png',
      price: '$999.95',
      count: 15,
    },
    {
      id: 'product_recommendations_bestseller_products',
      name: 'Trending products',
      image_url:
        process.env.NEXT_PUBLIC_SITE_URL + '/images/product-preview-image.png',
      price: '$1499.95',
      count: 15,
    },
    {
      id: 'email_marketing_recent_view',
      name: 'Recent view products',
      image_url:
        process.env.NEXT_PUBLIC_SITE_URL + '/images/product-preview-image.png',
      price: '$1499.95',
      count: 15,
    },
    {
      id: 'email_marketing_collection_dropdown',
      name: custom_collection_name,
      image_url:
        process.env.NEXT_PUBLIC_SITE_URL + '/images/product-preview-image.png',
      price: '$1499.95',
      count: 15,
    },
  ];

  // Extensions config
  const loadExtArr = [
    {
      globalName: 'ProductBlockExtension',
      url:
        process.env.NEXT_PUBLIC_SITE_URL +
        '/assets/backend/editorv2/extensions/extension-product-block/dist/main.452551d1040114e5aa5b.extension.js',
    },
    {
      globalName: 'CouponCodeExtension',
      url:
        process.env.NEXT_PUBLIC_SITE_URL +
        '/assets/backend/editorv2/extensions/extension-coupon-code-block/dist/main.6949633ee0494b17da44.extension.js',
    },
    {
      globalName: 'OrderSummeryExtension',
      url:
        process.env.NEXT_PUBLIC_SITE_URL +
        '/assets/backend/editorv2/extensions/extension-order-summary-block/dist/main.bb05551067bd9ec3d450.extension.js',
    },
    {
      globalName: 'orderShippingSummeryExtension',
      url:
        process.env.NEXT_PUBLIC_SITE_URL +
        '/assets/backend/editorv2/extensions/extension-order-shipping-block/dist/main.d1157b43c26c762c6f2c.extension.js',
    },
    {
      globalName: 'optOutListExtension',
      url:
        process.env.NEXT_PUBLIC_SITE_URL +
        '/assets/backend/editorv2/extensions/extension-optout-list-block/dist/main.1caf775eb86d8bae1115.extension.js',
    },
    {
      globalName: 'LogoBlockExtension',
      url:
        process.env.NEXT_PUBLIC_SITE_URL +
        '/assets/backend/editorv2/extensions/extension-logo-block/dist/main.952f3180f72b5720fa46.extension.js',
    },
  ];

  useEffect(() => {
    const { type, type2 } = router.query;

    if (!login_auth?.shop_id) return;

    if (type === 'create-template' || type2 === 'createfromscratch') {
      // 🔄 Reset progress/loader
      setProgress(0);
      setLoading(true);

      // 🔥 Reset redux state
      dispatch(resetTemplateState());

      // 🔥 Force fallback empty template
      dispatch(
        setFallbackTemplate({
          html: DEFAULT_TEMPLATE.html,
          css: DEFAULT_TEMPLATE.css,
        })
      );

      // 🔥 Allow Stripo re-init
      loadedRef.current = false;
      initializedRef.current = false;

      // Run loader again
      // loadDemoTemplate();
    }
  }, [router.query?.type, router.query?.type2, dispatch]);

  // ---------- loadDemoTemplate (converted to React + Redux) ----------

  async function loadDemoTemplate() {
    try {
      // Always reset before loading fresh template
      dispatch(resetTemplateState());

      // 1. Fetch merge tags first
      await dispatch(
        getMergeTagsApi({
          shop_id: login_auth.shop_id,
          is_message_page: 1,
          is_create_template: 1,
        })
      ).unwrap();

      await dispatch(
        getDecodedUrlApi({
          act: 'get_decoded_data',
          encodedData: login_auth.email,
        })
      ).unwrap();

      // 2. Parse URL
      const urlParams = new URLSearchParams(window.location.search);
      const etid = urlParams.get('etid');
      const camp_id = urlParams.get('camp_id');
      const message_id = urlParams.get('message_id');
      const type = urlParams.get('type');
      const type2 = urlParams.get('type2');

      switch (true) {
        case !!camp_id && type === 'campaign' && type2 === 'createfromscratch':
          // await dispatch({
          //   type: 'stripo/fallbackTemplate',
          //   payload: {
          //     html: DEFAULT_TEMPLATE.html,
          //     css: DEFAULT_TEMPLATE.css,
          //     socialNetworks: [],
          //     couponBlock: { enabled: true },
          //   },
          // });
          dispatch(
            setFallbackTemplate({
              html: DEFAULT_TEMPLATE.html,
              css: DEFAULT_TEMPLATE.css,
            })
          );
          break;
        case (camp_id && type === 'campaign' && type2 === 'edit-email') ||
          type2 === 'createAb' ||
          type2 === 'html_editor_create_campaign' ||
          type2 === 'html_editor_from_edit' ||
          type2 === 'change-template':
          await dispatch(
            getTemplateDataByCampaignIdApi({
              shop_id: login_auth.shop_id,
              load_type: 'campaign',
              page: 'edit',
              message_id: camp_id,
            })
          ).unwrap();
          break;

        case etid && etid !== '0' && etid !== 'null':
          await dispatch(
            getTemplateByIdApi({
              page: 'template',
              shop_id: login_auth.shop_id,
              etid,
            })
          ).unwrap();
          break;

        case message_id && message_id !== '0' && message_id !== 'null':
          // await dispatch(
          //   getMessageByIdApi({
          //     shop_id: login_auth.shop_id,
          //     message_id,
          //   })
          // ).unwrap();
          break;

        default:
          dispatch(
            setFallbackTemplate({
              html: DEFAULT_TEMPLATE.html,
              css: DEFAULT_TEMPLATE.css,
            })
          );
          break;

          break;
      }

      // setTemplateData(template);
    } catch (err) {
      console.error('Error loading template in loadDemoTemplate:', err);
    }
  }

  // ---------- Effect: Load Data ----------

  useEffect(() => {
    if (!login_auth?.shop_id || loadedRef.current) return;
    loadedRef.current = true;
    loadDemoTemplate();
  }, [login_auth?.shop_id]);

  // useEffect(() => {
  //   if (!login_auth?.shop_id || loadedRef.current) return;
  //   loadedRef.current = true;

  //   loadDemoTemplate().then(() => {
  //     setDataLoaded(true); // ✅ only when API/template fetch is done
  //   });
  // }, [login_auth?.shop_id]);

  // ---------- Cleanup on unmount ----------

  useEffect(() => {
    return () => {
      if (!isNavigatingRef.current) {
        // ✅ only reset if not navigating
        dispatch(resetTemplateState());
        dispatch(saveEmailTemplateReset());
        dispatch(resetMergeTagsState());
      }
      initializedRef.current = false;
      loadedRef.current = false;
    };
  }, [dispatch]);

  // ---------- Effect: Initialize Stripo ----------

  useEffect(() => {
    if (initializedRef.current) return;
    // 🧠 Skip reinit if we just did a save & continue
    if (!shouldReinitRef.current) {
      shouldReinitRef.current = true; // reset for next time
      return;
    }

    if (!window.Stripo) {
      return;
    }
    if (!mergeTags?.length) return;

    const { etid, camp_id, type2 } = router.query;

    const isApiTemplate =
      currentTemplate?.html &&
      currentTemplate.html.trim() !== '' &&
      currentTemplate.html.trim() !== DEFAULT_TEMPLATE.html.trim();

    // ⏸ Only wait if expecting API data (edit/email/template), not for createfromscratch
    if (
      !isApiTemplate &&
      (etid || (camp_id && type2 !== 'createfromscratch'))
    ) {
      return;
    }

    setLoading(true);
    initializedRef.current = true;

    const safeHtml = isApiTemplate
      ? currentTemplate.html
      : DEFAULT_TEMPLATE.html;
    const safeCss =
      currentTemplate?.css || JSON.stringify(DEFAULT_TEMPLATE.css);

    const isEcomShop = !login_auth.is_nonecom_shop;

    if (typeof window !== 'undefined' && window.Stripo) {
      window.site_url = process.env.NEXT_PUBLIC_SITE_URL;

      window.Stripo.init({
        settingsId: 'stripoSettingsContainer',
        previewId: 'stripoPreviewContainer',
        codeEditorButtonId: 'codeEditor',
        undoButtonId: 'undoButton',
        redoButtonId: 'redoButton',
        disableAdaptDesign: false,
        locale: 'en',
        enableNativeSpellChecker: false,
        enableTextEmojis: true,
        selectBlockAfterDropFromSettingsPanel: true,
        messageSettingsEnabled: true,
        html: safeHtml,
        css: safeCss,
        pluginId: process.env.NEXT_PUBLIC_STRIPO_PLUGIN_ID,

        // comment for html_editor

        // callbacks: {
        //   onReady: function () {
        //     // ✅ If slug is "html", auto-open Code Editor
        //     if (router?.query?.type2 === 'html_editor') {
        //       document.getElementById('codeEditor')?.click();
        //     }
        //     // ✅ Otherwise, nothing special (stays in Block Editor)
        //     // user can still use the button to switch manually
        //   },
        // },

        getAuthToken: async (callback) => {
          const res = await fetch('/api/stripo-auth', { method: 'POST' });
          const { accessToken } = await res.json();
          callback(accessToken);
        },

        apiRequestData: { emailId: login_auth?.encoded_shop_id },

        couponBlock: { enabled: true },

        // ✅ Extensions
        extensions: loadExtArr,
        // forceRecrate: true,

        orderSummery: { enabled: isEcomShop },

        orderShippingSummery: { enabled: isEcomShop },

        optoutList: {
          enabled: true,
          text: 'Opt-Out List',
          title: 'Opt-Out List',
          href: "{%optout_link,'LIST_ID','REDIRECT_LINK'%}",
        },

        logoBlock: {
          enabled: true,
          src:
            login_auth?.profile_image ||
            process.env.NEXT_PUBLIC_SITE_URL + '/images/logo-dummy.png',
          altText: '',
          logoLinkUrl:
            login_auth?.domain ||
            process.env.NEXT_PUBLIC_SITE_URL + '/images/logo-dummy.png',
          width: '80px',
        },

        productDemoBlock: {
          enabled: isEcomShop,
          loginDetails: { shop_id: login_auth?.shop_id },
          site_url: process.env.NEXT_PUBLIC_SITE_URL,
          groups: grpArr,
          subgroups: [
            {
              id: 'new_arrival2',
              name: 'New arrival products2',
              image_url:
                process.env.NEXT_PUBLIC_SITE_URL +
                'images/product-preview-image.png',
              price: 999.95,
              count: 15,
            },
            {
              id: 'trending_product2',
              name: 'Trending products2',
              image_url:
                process.env.NEXT_PUBLIC_SITE_URL +
                'images/product-preview-image.png',
              price: 1499.95,
              count: 15,
            },
            {
              id: 'shopify_collection_products2',
              name: 'Shopify collection products2',
              image_url:
                process.env.NEXT_PUBLIC_SITE_URL +
                'images/product-preview-image.png',
              price: 1499.95,
              count: 15,
            },
          ],
        },

        settingsPanelBlockSortFunc: function (names) {
          const customOrder = [
            'imgBlockHandler',
            'textElementHandler',
            'btnBlockHandler',
            'spacerBlockHandler',
            'videoBlockHandler',
            'socialBlockHandler',
            'bannerBlockHandler',
            'menuBlockHandler',
            'htmlBlockHandler',
            'esd-extension-LogoBlock',
            'esd-extension-DemoProductBlock',
            'esd-extension-optOutListBlock',
            'esd-extension-LogoDemoBlock',
            'esd-extension-orderSummeryBlock',
            'esd-extension-orderShippingSummeryBlock',
          ]; // desired order

          return names.sort((a, b) => {
            const indexA = customOrder.indexOf(a);
            const indexB = customOrder.indexOf(b);
            // If not found in customOrder, push to the end
            return (
              (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
            );
          });
        },
        mergeTags: mergeTags,
        socialNetworks: socialNetworks,

        settingsPanelBlocksTooltips: {
          imgBlock: 'Image Block',
          textElement: 'Text Element',
          btnBlock: 'Button Block',
          spacerBlock: 'Spacer Block',
          videoBlock: 'Video Block',
          socialBlock: 'Social Block',
          bannerBlock: 'Banner Block',
          timerBlock: 'Timer Block',
          menuBlock: 'Menu Block',
          htmlBlock: 'HTML Block',
          couponBlock: 'Set Tooltip',
          'esd-extension-LogoDemoBlock': 'Coupon',
          'esd-extension-LogoBlock': 'LOGo',
        },

        localePatch: {
          'settingsPanel.accordion.structures': {
            en: 'Layouts',
          },
          'previewPanel.label.structure': {
            en: 'Layout',
          },
          'previewPanel.dialog.delete.structure': {
            en: 'Delete the Layout',
          },
          'settingsPanel.blockLibrary.myBlocks.tab.structures': {
            en: 'Layouts',
          },
          'settingsPanel.toStructure': {
            en: 'to layouts',
          },
          'settingsPanel.accordion.blockLibrary': {
            en: 'Saved Sections',
          },
          'settingsPanel.tabs.decoration': {
            en: 'Style',
          },
          'dynamicBlock.view': {
            en: 'Style',
          },
          'colorBGStructureControl.label': {
            en: 'Background color of layout',
          },
          'dynamic.containers.validation.error': {
            en: 'An invalid container width value or value is not valid for the Layout.',
          },
          'generatedBlock.settingsPanel.block.library': {
            en: 'Saved Sections',
          },
          'generatedBlock.previewPanel.doubleClickMessage': {
            en: 'Double click to set content from the saved sections',
          },
          'generatedBlock.previewEditor.repeatableSectionHint': {
            en: 'Here you specify what saved sections should be included in a cycle (loop) and set respective rules.',
          },
          'generatedBlock.previewEditor.tailSectionHint': {
            en: 'Here you specify what saved section/sections should go at the very bottom of your dynamic element if some items still remain in the data source after the cycles, specified above, have been completed.',
          },
          'previewPanel.block.actions.saveCustomBlock': {
            en: 'Save as section',
          },
          'settingsPanel.blockLibrary.myBlocks': {
            en: 'My saved section',
          },
          'settingsPanel.blockLibrary.myBlocks.empty': {
            en: 'There are no saved section',
          },
          'settingsPanel.blockLibrary.myBlocks.save.success': {
            en: 'The section has been saved successfully',
          },
          'settingsPanel.blockLibrary.myBlocks.save.error': {
            en: 'Can`t save the section',
          },
          'settingsPanel.blockLibrary.myBlocks.save.error.notUniqueUid': {
            en: 'The section with this ID already exists. Please change the ID and try again.',
          },
          'settingsPanel.blockLibrary.myBlocks.update.success': {
            en: 'The section has been updated successfully',
          },
          'settingsPanel.blockLibrary.myBlocks.update.error': {
            en: 'Can`t update the section',
          },
          'settingsPanel.blockLibrary.myBlocks.delete.success': {
            en: 'The section has been deleted successfully',
          },
          'settingsPanel.blockLibrary.myBlocks.restore.success': {
            en: 'The section has been restored successfully',
          },
          'settingsPanel.blockLibrary.myBlocks.delete.error': {
            en: 'Can`t restore the section',
          },
          'settingsPanel.blockLibrary.groupBlocks.empty': {
            en: 'No saved section available',
          },
          'settingsPanel.blockLibrary.search.empty': {
            en: 'No saved section found for',
          },
          'settingsPanel.blockLibrary.search.searchPlaceholder': {
            en: 'enter section name or #tag for search',
          },
          'addCustomBlockForm.errorMessage': {
            en: 'Please enter the name of the saved section',
          },
          'addCustomBlockForm.errorMessage.name.number': {
            en: 'Symbol "#" is denied in the section name',
          },
          'addCustomBlockForm.errorMessage.uid': {
            en: 'Please enter the Id of the saved section',
          },
          'addCustomBlockForm.blockName': {
            en: 'Section name',
          },
          'mergeTags.label': {
            en: 'Personalization',
          },
        },

        editorFonts: {
          showDefaultStandardFonts: true,
          showDefaultNotStandardFonts: true,
          customFonts: [
            {
              name: 'Century Gothic',
              fontFamily: 'Century Gothic, Arial, sans-serif',
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/external-fonts/CenturyGothic/Century-Gothic.woff2`,
            },
            {
              name: 'Montserrat',
              fontFamily: "'Montserrat', sans-serif",
              url: 'https://fonts.googleapis.com/css?family=Montserrat&display=swap',
            },
            {
              name: 'Montserrat SemiBold',
              fontFamily: "'Montserrat', Helvetica, Arial, sans-serif",
              url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap',
            },
            {
              name: 'Montserrat Bold',
              fontFamily: "'Montserrat', sans-serif",
              url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap',
            },
          ],
        },

        callbacks: {
          onLoad: () => {
            console.log('⚡ Stripo assets loaded');
          },
          onReady: () => {
            console.log('✅ Stripo fully ready');
            setIsStripoReady(true);
            setLoading(false);
            setProgress(100);
          },
          onError: (err) => {
            console.error('❌ Stripo init error', err);
            setLoading(false);
          },
        },
      });
    }
  }, [
    mergeTags?.length,
    currentTemplate,
    router.query.camp_id,
    router.query.etid,
    router.query.type2,
    login_auth?.shop_id,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (loading && !isStripoReady) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + 2 : prev));
      }, 150);
      return () => clearInterval(interval);
    }
    if (isStripoReady) {
      setProgress(100);
      const t = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(t);
    }
  }, [loading, isStripoReady]);

  useEffect(() => {
    const maxWait = setTimeout(() => {
      if (!isStripoReady) {
        console.warn('⚠️ Stripo took too long, forcing ready state.');
        setIsStripoReady(true);
        setLoading(false);
      }
    }, 10000); // 10 seconds max wait

    return () => clearTimeout(maxWait);
  }, [isStripoReady]);

  useEffect(() => {
    if (saveEmailTemplateState === 'success') {
      // --- Avoid reruns ---
      if (actionButtonType === 'save_and_continue_done') return;

      const { type, type2, camp_id, etid, pcid } = router.query || {};
      let redirectUrl = null;

      // ✅ --- SAVE & CONTINUE ---
      if (actionButtonType === 'save_and_continue') {
        const newTemplateId = savedEmailTemplateData?.template_id;

        if (newTemplateId) {
          shouldReinitRef.current = false; // ✅ skip next Stripo init
          requestAnimationFrame(() => {
            dispatch(
              getTemplateByIdApi({
                page: 'template',
                shop_id: login_auth.shop_id,
                etid: newTemplateId,
              })
            );
            allowNavigationRef.current = true;
            router.replace(
              {
                pathname: router.pathname,
                query: { ...router.query, etid: newTemplateId },
              },
              undefined,
              { shallow: true }
            );
          });
        }

        notification.success({ message: saveEmailTemplateMessage });
        setSaveTemplateModalVisible(false);

        // 🔥 Reset redux success flag
        dispatch(saveEmailTemplateReset());

        // ✅ Mark done so it won’t rerun again
        setActionButtonType('save_and_continue_done');

        setLoading(false);

        // ✅ Exit early – NO redirect
        return;
      }

      // ✅ Block redirect if user was in any “continue” flow
      if (
        actionButtonType === 'save_and_continue' ||
        actionButtonType === 'save_and_continue_done'
      ) {
        console.log('Skipping redirect for Save & Continue');
        return;
      }

      // --- TEMPLATE FLOW ---
      if (
        (type === 'template' || type === 'create-template') &&
        actionButtonType !== 'save_and_continue'
      ) {
        redirectUrl = '/email-marketing/templates/list?tab=pre_made_template';
      }

      // --- CAMPAIGN FLOWS ---
      if (type === 'campaign') {
        if (
          camp_id &&
          [
            'createfromscratch',
            'edit-email',
            'change-template',
            'html_editor_create_campaign',
            'html_editor_from_edit',
          ].includes(type2)
        ) {
          redirectUrl = `/email-marketing/campaign/${camp_id}/edit-campaign`;
        }
        if (
          camp_id &&
          etid &&
          [
            'use_template_create_campaign',
            'use-now',
            'change-template',
          ].includes(type2)
        ) {
          redirectUrl = `/email-marketing/campaign/${camp_id}/edit-campaign`;
        }
        if (type2?.toLowerCase() === 'createab') {
          redirectUrl = `/email-marketing/campaign/${pcid}/createAB`;
        }
      }

      // --- COMMON SUCCESS ACTIONS ---
      notification.success({ message: saveEmailTemplateMessage });
      setSaveTemplateModalVisible(false);

      dispatch(saveEmailTemplateReset());
      dispatch(resetTemplateState());

      if (redirectUrl) {
        // isNavigatingRef.current = true;
        // allowNavigationRef.current = true;
        onSafeNavigate(redirectUrl);
      }

      // ✅ Delay clearing to prevent premature reruns
      setTimeout(() => setActionButtonType(''), 1000);
    }

    if (saveEmailTemplateState === 'error') {
      notification.error({ message: saveEmailTemplateError });
      dispatch(saveEmailTemplateReset());
      setTimeout(() => setActionButtonType(''), 500);
    }
  }, [saveEmailTemplateState, actionButtonType]);

  useEffect(() => {
    if (campaignState?.sendTestEmailApiState === 'success') {
      // notification.success({ message: campaignState.sendTestEmailMessage });
      setSendTestModalVisible(false); // close local modal
      // handleTestModalVisible?.(false); // ✅ close parent modal if present
      setTestEmail('');
      setActionButtonType('');
      dispatch(sendTestEmailPreviewMessageReset());
    }
    if (campaignState?.sendTestEmailApiState === 'error') {
      // notification.error({ message: campaignState.sendTestEmailMessage });
      dispatch(sendTestEmailPreviewMessageReset());
    }
  }, [campaignState?.sendTestEmailApiState]);

  const handleSendTestEmailMessage = (passedEmail) => {
    const { pathname, query } = router || {};
    const finalEmail = passedEmail || testEmail;
    const isEdit = pathname === '/email-marketing/campaign/[id]/edit-campaign';
    const isTpl = pathname === '/email-marketing/templates/list';

    // decide which id/key to send
    const idKey = isTpl ? 'template_id' : 'campaign_id';
    const idValue = isTpl ? templateId : isEdit ? query?.id : undefined;

    const payload = {
      [idKey]: idValue ?? '', // avoid undefined
      src: 'marketing',
      act: 'send_test_mail_notification_by_id',
      template_type: 'new',
      sendRecepientEmail: finalEmail,
      content: compiledTemplate,
      subject: '',
      EmailNotificationfromSubject: '',
    };

    dispatch(sendTestEmailApi(payload));
  };

  const handleSave = async () => {
    setSaveTemplateModalVisible(true);
  };

  const handleSaveAndExitClickwhenCampId = async () => {
    if (!window.StripoApi) {
      console.warn('⚠️ Stripo not ready');
      return;
    }

    try {
      // Optional: local loading flag (optional visual feedback)
      setLoading(true);

      // Step 1: Get HTML + CSS from Stripo
      window.StripoApi.getTemplate((html, css) => {
        // Step 2: Compile the email
        window.StripoApi.compileEmail(async (error, compiledHtml, ampHtml) => {
          if (error) {
            console.error('❌ Error compiling template', error);
            setLoading(false);
            return;
          }

          const actHtml = ampHtml || compiledHtml;

          // Step 3: Construct payload
          const payload = {
            EmailNotificationfromEmail: getDecodedUrlData?.decoded_data,
            EmailNotificationfromName: email_data?.from_name,
            action_type: router?.query?.type || '',
            editorType: router?.query?.type || '',
            prev_action_type: router?.query?.type || '',
            act: 'save_new_template_data',
            change_only_template_name: 0,
            campaign_id: router?.query?.camp_id ? router?.query?.camp_id : '0',
            template_id: router?.query?.etid ? router?.query?.etid : '0',
            template_html: html,
            template_css: css,
            content: actHtml,
            customUtm: 0,
            utm_medium: 'Marketing_Email',
            utm_source: 'AiTrillion.com',
          };

          // Step 4: Save and wait for Redux thunk result
          const result = await dispatch(saveNewTemplateDataApi(payload));
          const { type2, pcid } = router.query || {};

          // Step 5: If success → redirect to edit-campaign page
          if (result?.meta?.requestStatus === 'fulfilled') {
            const campId = router?.query?.camp_id;
            // ✅ make navigation safe
            allowNavigationRef.current = true;
            isNavigatingRef.current = true;

            // ✅ Redirect immediately to edit-campaign page
            if (type2?.toLowerCase() === 'createab' && pcid) {
              onSafeNavigate(`/email-marketing/campaign/${pcid}/createAB`);
            } else if (campId) {
              onSafeNavigate(
                `/email-marketing/campaign/${campId}/edit-campaign`
              );
            } else {
              onSafeNavigate('/email-marketing/campaign/list');
            }
          } else {
            notification.error({
              message: 'Failed to save template. Please try again.',
            });
          }

          setLoading(false);
        });
      });
    } catch (err) {
      console.error('❌ Error in handleSaveAndExitClickwhenCampId:', err);
      notification.error({
        message: 'Unexpected error while saving template.',
      });
      setLoading(false);
    }
  };

  const handleCompileTemplate = (action) => {
    if (!window.StripoApi) {
      return;
    }

    window.StripoApi.getTemplate((html, css) => {
      // Step 2: Compile the email
      window.StripoApi.compileEmail(
        (error, compiledHtml, ampHtml, ampErrors) => {
          if (error) {
            return;
          }

          const actHtml = ampHtml || compiledHtml;
          setCompiledTemplate(actHtml);
        }
      );
    });

    if (action === 'preview') {
      setTemplatePreviewModalVisible(true);
    }

    if (action === 'send_test') {
      setSendTestModalVisible(true);
    }
  };

  const getDiscardRedirectUrl = (query) => {
    const { type, type2, camp_id, etid, pcid } = query || {};
    let redirectUrl = '/email-marketing/templates/list'; // default fallback

    // --- TEMPLATE FLOW ---
    if (type === 'template' || type === 'create-template') {
      redirectUrl = '/email-marketing/templates/list?tab=pre_made_template';
    }
    if (type === 'template' && etid) {
      redirectUrl = '/email-marketing/templates/list?tab=pre_made_template';
    }

    // --- CAMPAIGN FLOWS ---
    if (type === 'campaign') {
      if (
        camp_id &&
        [
          'createfromscratch',
          'edit-email',
          'change-template',
          'html_editor_create_campaign',
          'html_editor_from_edit',
        ].includes(type2)
      ) {
        redirectUrl = `/email-marketing/campaign/${camp_id}/edit-campaign`;
      }

      if (
        camp_id &&
        etid &&
        ['use_template_create_campaign', 'use-now', 'change-template'].includes(
          type2
        )
      ) {
        redirectUrl = `/email-marketing/campaign/${camp_id}/edit-campaign`;
      }

      if (type2?.toLowerCase() === 'createab') {
        if (camp_id) {
          redirectUrl = `/email-marketing/campaign/${pcid}/createAB`;
        } else if (pcid) {
          redirectUrl = `/email-marketing/campaign/${pcid}/createAB`;
        }
      }
    }

    return redirectUrl;
  };

  return (
    <>
      <NotificationZone />
      <EditorNavbar
        handleSave={handleSave}
        templateName={templateName}
        handleSaveAndExitClickwhenCampId={handleSaveAndExitClickwhenCampId}
        handleCompileTemplate={(action) => {
          handleCompileTemplate(action);
        }}
        handleDiscardAndBack={(value) => {
          setDiscardAndBackModalVisible(value);
        }}
        loading={loading}
      />
      <EditorWrapper id="stripoEditorCont" style={{ position: 'relative' }}>
        <SettingsContainer id="stripoSettingsContainer">
          Loading…
        </SettingsContainer>
        <PreviewContainer id="stripoPreviewContainer" />
        {/* Loader overlay tied to styled-components */}
        <LoaderOverlay visible={loading && !isNavigatingRef.current}>
          <LoaderContent>
            <Result
              icon={<Spin size="default" />}
              title={
                <div style={{ fontSize: 16 }}>
                  {progress < 100
                    ? 'Email Editor Getting Ready...'
                    : 'Almost done, launching editor!'}
                </div>
              }
              subTitle={
                progress < 100 && (
                  <div style={{ fontSize: 16 }}>({progress}%)</div>
                )
              }
            />
          </LoaderContent>
        </LoaderOverlay>
      </EditorWrapper>
      {/* Save Template Modal */}
      <SaveEmailTemplateModal
        formikRef={formikRef}
        visible={saveTemplateModalVisible}
        setVisible={setSaveTemplateModalVisible}
        saveAndExitInitialState={saveAndExitInitialState}
        setActionButtonType={setActionButtonType}
        onTitleChange={(name) => {
          setTemplateName(name);
        }}
      />
      <TemplatePreviewModal
        visible={templatePreviewModalVisible}
        setVisible={(value) => {
          setTemplatePreviewModalVisible(value);
        }}
        htmlString={compiledTemplate}
        isActionButtonShow={true}
      />
      <SendTestModal
        visible={sendTestModalVisible}
        setVisible={setSendTestModalVisible}
        handleSendTestEmail={(email) => {
          handleSendTestEmailMessage(email);
        }}
        setEmailValue={(value) => {
          setTestEmail(value);
        }}
        previewModalOpen={sendTestModalVisible}
        loading={campaignState?.sendTestEmailLoading}
      />
      <AitConfirmationModal
        visible={discardAndBackModalVisible}
        setVisible={setDiscardAndBackModalVisible}
        description="Changes you made may not be saved."
        onConfirm={() => {
          allowNavigationRef.current = true;
          dispatch(resetTemplateState());
          dispatch(resetMergeTagsState());
          const redirectUrl = getDiscardRedirectUrl(router.query);
          router.push(redirectUrl);
        }}
        onCancel={() => {
          setDiscardAndBackModalVisible(false);
        }}
        confirmText={'Done'}
      />
    </>
  );
};

export default CreateTemplateTemplate;
