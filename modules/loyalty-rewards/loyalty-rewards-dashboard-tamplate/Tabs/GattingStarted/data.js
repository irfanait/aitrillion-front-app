import { moduleRoute } from '@/modules/layouts/routeControl/route';
import { getToken } from '@/utils/authHelpers';

const token = getToken();

export const setupStepsData = [
  {
    key: '1',
    id: 'enablelytModule',
    title: 'Enable loyalty program module',
    description:
      'Engage more customers with earn points and redeeming points set up in your reward program. This is a step-to-step guide to setting up the loyalty program of your store.',
    guideText: 'Guide to setup loyalty rewards program and enable module',
    guideUrl:
      'https://docs.aitrillion.com/portal/en/kb/articles/loyalty-reward-program-overview#Introduction',
    btnText: 'Setup loyalty rewards program',
    btnUrl: moduleRoute?.loyalty_rewards?.display_on_store,
    rightUrl: moduleRoute?.loyalty_rewards?.display_on_store,
    img: '',
    children: [],
  },
  {
    key: '2',
    id: 'createnew',
    title: 'Setup earn points',
    description:
      'Enable multiple different earn points activity and give points to your customers on their actions and purchases. This is a step-to-step guide to setting up the loyalty program of your store.',
    guideText: 'Guide to setup earn points',
    guideUrl:
      'https://docs.aitrillion.com/portal/en/kb/articles/set-up-the-method-by-which-customers-can-earn-points',
    btnText: 'Setup earn points',
    btnUrl: moduleRoute?.loyalty_rewards?.earn_points,
    rightUrl: moduleRoute?.loyalty_rewards?.earn_points,
    img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/getting-started/setupEarnRedeem.svg`,
    children: [],
  },
  {
    key: '3',
    id: 'createreward',
    title: 'Setup redeem points',
    description:
      'Setup different rewards to offer multiple ways to redeem the available points. This is a step-to-step guide to setting up the loyalty rewards on your store.',
    guideText: 'Guide to setup redeem points',
    guideUrl:
      'https://docs.aitrillion.com/portal/en/kb/articles/setup-reedem-points',
    btnText: 'Setup redeem points',
    btnUrl: moduleRoute?.loyalty_rewards?.redeem_points,
    rightUrl: moduleRoute?.loyalty_rewards?.redeem_points,
    img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/getting-started/reddem-points.svg`,
    children: [],
  },
  {
    key: '4',
    id: 'enableLytbtn',
    title: 'Enable loyalty button on store',
    description:
      'Elevate loyalty experience with loyalty button & popup at front store. Enable Instant access for rewards, personalized offers, and seamless engagement with loyalty program.',
    guideText: 'Guide to enable loyalty button',
    guideUrl:
      'https://docs.aitrillion.com/portal/en/kb/articles/configure-the-display-of-loyalty-rewards',
    btnText: 'Enable loyalty button',
    btnUrl: moduleRoute?.loyalty_rewards?.display_on_store,
    rightUrl: moduleRoute?.loyalty_rewards?.redeem_points,
    img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/getting-started/enable-loyalty-btn.svg`,
    children: [],
  },
  {
    key: '5',
    id: 'advance-setup',
    title: 'Advance setup',
    description: '',
    guideText: '',
    guideUrl: '',
    btnText: '',
    btnUrl: '',
    rightUrl: '',
    img: '',
    children: [
      {
        key: 'lytSetting2',
        title: 'Setup a custom loyalty rewards page',
        description:
          "AiTrillion now allows you to convert it's entire loyalty popup system with actionable buttons, into a custom page that can be accessed via your site's navigation.",
        guideText: 'Guide to setup custom loyalty page',
        guideUrl:
          'https://docs.aitrillion.com/portal/en/kb/articles/custom-loyalty-rewards-page',
        btnText: 'Setup custom loyalty page',
        btnUrl: moduleRoute?.loyalty_rewards?.display_on_store,
        rightUrl: moduleRoute?.loyalty_rewards?.display_on_store,
        img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/getting-started/custom-loyalty.svg`,
      },
      {
        key: 'tierlist',
        title: 'Setup exclusive VIP program',
        description:
          'Set up a VIP program based on the loyalty points earned by customers and provide them with additional benefits.',
        guideText: 'Guide to setup VIP tiers',
        guideUrl:
          'https://docs.aitrillion.com/portal/en/kb/articles/getting-started-with-vip-tier-program-rewards-and-perks',
        btnText: 'Setup VIP program',
        btnUrl: moduleRoute?.loyalty_rewards?.vip_program,
        rightUrl: moduleRoute?.loyalty_rewards?.vip_program,
        img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/getting-started/vip-program.svg`,
      },
      {
        key: 'createnew2',
        title: 'Setup refer a friends for encourage customers',
        description:
          'Enable refer a friends activity, and expand customer base, reward advocates, and increase sales with this powerful referral strategy.',
        guideText: 'Guide to setup refer a friend program',
        guideUrl:
          'https://docs.aitrillion.com/portal/en/kb/articles/enable-loyalty-refer-a-friend-popup-and-change-the-refer-a-friend-popup-image',
        btnText: 'Setup refer a friend',
        btnUrl: moduleRoute?.loyalty_rewards?.earn_points,
        rightUrl: moduleRoute?.loyalty_rewards?.earn_points,
        img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/getting-started/refer-friend.svg`,
      },
      {
        key: 'lyttemplates',
        title: 'Setup a loyalty point reminder in workflow automation',
        description:
          'Remind your customers to redeem their loyalty points with ease by using AiTrillion loyalty workflow automation.',
        guideText: 'Guide to setup loyalty workflow automation',
        guideUrl:
          'https://docs.aitrillion.com/portal/en/kb/articles/setup-a-loyalty-point-reminder-in-workflow-automation',
        btnText: 'Setup automation',
        btnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/templates?ai_v2=${token}`,
        rightUrl: `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/templates?ai_v2=${token}`,
        img: `${process.env.NEXT_PUBLIC_APP_URL}/assets/images/getting-started/loyalty-automation.svg`,
      },
    ],
  },
];
