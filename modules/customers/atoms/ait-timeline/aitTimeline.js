import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';

import {
  TimelineWrapper,
  LeftLine,
  DateGroup,
  DateChip,
  ArrowIcon,
  ItemRow,
  IconWrap,
  TextWrap,
  EngagedBadge,
  LoaderWrap,
  TimelineWrapperInner,
} from './style';

import { Spin, Typography } from 'antd';

import {
  MailOutlined,
  EyeOutlined,
  SendOutlined,
  StopOutlined,
  GiftOutlined,
  FileTextOutlined,
  StarFilled,
} from '@ant-design/icons';
import AitText from '@/components/atoms/ait-text/aitText';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
const { Text } = Typography;

/* ICON STYLES */
const getTimelineIconConfig = (css) => {
  switch (css) {
    case 'bg-workflow_email_click':
    case 'bg-workflow_email_open':
    case 'bg-workflow_email_send':
    case 'bg-workflow_push_click':
    case 'bg-workflow_push_send':
    case 'bg-workflow_email_subscribed':
    case 'bg-workflow_email_unsubscribed':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/workflow-email-click.png?v=101`}
          />
        ),
        bg: '#27C7CC',
        badge: '#EAFEFF',
      };
    case 'bg-chat_bot':
    case 'bg-chatbot_external_customer_creat':
    case 'bg-chatbot_external_customer_update':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/chat-bot.png?v=101`}
          />
        ),
        bg: '#22DEE4',
        badge: '#E7FEFF',
      };

    case 'bg-sms_campaign':
    case 'bg-sms_workflow':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/sms-campaign.png?v=101`}
          />
        ),
        bg: '#9575F2',
        badge: '#F6F3FF',
      };

    case 'bg-create_order':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/create-order.png?v=101`}
          />
        ),
        bg: '#FFAD31',
        badge: '#FFF9EF',
      };
    case 'bg-membership':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/Membership.png?v=101`}
          />
        ),
        bg: '#FFAD31',
        badge: '#FFF9EF',
      };
    case 'bg-email_clicked_loyalty':
    case 'bg-email_opened_loyalty':
    case 'bg-email_sent_loyalty':
    case 'bg-email_clicked_review':
    case 'bg-email_opened_review':
    case 'bg-email_sent_review':
    case 'bg-email_clicked_marketing':
    case 'bg-email_opened_marketing':
    case 'bg-email_sent_marketing':
    case 'bg-review_email_subscribed':
    case 'bg-review_email_unsubscribed':
    case 'bg-loyalty_email_subscribed':
    case 'bg-loyalty_email_unsubscribed':
    case 'bg-reminder_email_clicked':
    case 'bg-review_email_sent_notification':
    case 'bg-email_open_reminder':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/email-clicked-loyalty.png?v=101`}
          />
        ),
        bg: '#FF57AA',
        badge: '#FFF3F9',
      };

    case 'bg-marketing_email_subscribed':
    case 'bg-marketing_email_unsubscribed':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/marketing-email-subscribed.png?v=101`}
          />
        ),
        bg: '#F67173',
        badge: '#FFF2F2',
      };

    case 'bg-loyalty_email_unsubscribed':
    case 'bg-loyalty_tag_pt':
    case 'bg-loyalty_becomeaffiliate':
    case 'bg-loyalty_coupon_code':
    case 'bg-loyalty_eggviews_review':
    case 'bg-loyalty_goal_spend':
    case 'bg-loyalty_punch_card':
    case 'bg-loyalty_refer_friend':
    case 'bg-loyalty_redeem_points':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/loyalty_becomeaffiliate.png?v=101`}
          />
        ),
        bg: '#B67CE8',
        badge: '#FBF5FF',
      };
    case 'bg-sent_inapp_notification':
    case 'bg-sent_outside_app_notification':
    case 'bg-sent_push_notification':
    case 'bg-push_allowed':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/allow-push?v=101`}
          />
        ),
        bg: '#FF6FB5',
        badge: '#FFF1F8',
      };
    case 'bg-recently_visit_with_loyalty_point':
    case 'bg-visit':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/recently-visit-with-loyalty-point.png?v=101`}
          />
        ),
        bg: '#22A565',
        badge: '#E9FFF4',
      };

    case 'bg-whatsappchat':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/whatsappchat.png?v=101`}
          />
        ),
        bg: '#39ae41',
        badge: '#c2f7c56e',
      };

    case 'bg-newsletter_email_unsubscribed':
    case 'bg-newsletter_email_subscribed':
    case 'bg-newsletter_external_customer_create':
    case 'bg-newsletter_external_customer_update':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/newsletter-email-unsubscribed.png?v=101`}
          />
        ),
        bg: '#2B7CBF',
        badge: '#E8F3FC',
      };

    case 'bg-visited_products':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/product_visit.png?v=101`}
          />
        ),
        bg: '#F9A825',
        badge: '#FFF3C0',
      };
    case 'bg-loyalty_facebook_share':
    case 'bg-loyalty_follow_on_facebook':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/loyalty-follow-on-facebook.png.png?v=101`}
          />
        ),
        bg: '#0F95F4',
        badge: '#E9F6FF',
      };
    case 'bg-loyalty_follow_on_instagram':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/loyalty-follow-on-instagram.png?v=101`}
          />
        ),
        bg: '#FB3892',
        badge: '#FFEAF4',
      };
    case 'bg-loyalty_follow_on_pinterest':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/loyalty-follow-on-pinterest.png?v=101`}
          />
        ),
        bg: '#E7485A',
        badge: '#FFEDEF',
      };

    case 'bg-loyalty_follow_on_twitter':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/loyalty-follow-on-twitter.png.png?v=101`}
          />
        ),
        bg: '#0F95F4',
        badge: '#E9F6FF',
      };
    case 'bg-sign_up':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/sign-up.png?v=101?v=101`}
          />
        ),
        bg: '#5F84E1',
        badge: ' #F0F4FF',
      };
    case 'bg-submit_product_review':
    case 'bg-submit_site_review':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/submit-site-review.png?v=101`}
          />
        ),
        bg: '#FC9701',
        badge: '#FFF8ED',
      };
    case 'bg-happy_birthday':
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/happy-birthday.png.png?v=101`}
          />
        ),
        bg: '#504B82',
        badge: '#F6F5FF',
      };

    default:
      return {
        icon: (
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/backend/images/activity-icons/workflow-email-open.png?v=101`}
          />
        ),
        bg: '#27C7CC',
        badge: '#EAFEFF',
      };
  }
};

/* GROUP DATA BY DATE */
const groupByDate = (logs) => {
  return logs.reduce((acc, item) => {
    const d = item.created_date_default;
    if (!acc[d]) acc[d] = [];
    acc[d].push(item);
    return acc;
  }, {});
};

const getShopZonedDate = (log) => {
  const shopTz = log?.shops_time_zone || 'UTC';
  const datePart = log?.created_date_default || '';
  const timePart = (log?.time || '12:00am').trim().toLowerCase();

  // parse as local time string first (no timezone)
  const parsedLocal = dayjs(
    `${datePart} ${timePart}`,
    ['YYYY-MM-DD hh:mma', 'YYYY-MM-DD h:mma'],
    true
  );

  if (!parsedLocal.isValid()) return null;

  // interpret that local time in shop timezone
  return dayjs.tz(parsedLocal.format('YYYY-MM-DD HH:mm:ss'), shopTz);
};

const groupByShopDate = (logs) => {
  return (logs || []).reduce((acc, log) => {
    const shopZoned = getShopZonedDate(log);
    const dateKeyStr = shopZoned
      ? shopZoned.format('YYYY-MM-DD')
      : log?.created_date_default || 'unknown';

    if (!acc[dateKeyStr]) acc[dateKeyStr] = [];
    acc[dateKeyStr].push(log);
    return acc;
  }, {});
};

const AitTimeline = ({
  activityLog = [],
  today,
  yesterday,
  currentPage,
  totalPages,
  onLoadMore,
  loadingMore = false,
}) => {
  const containerRef = useRef(null);

  const isFetchingRef = useRef(false);

  /* GROUPED DATA */
  const grouped = useMemo(() => groupByShopDate(activityLog), [activityLog]);

  const sortedDates = useMemo(
    () => Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)),
    [grouped]
  );

  /* OPEN ALL BY DEFAULT */
  const [openDates, setOpenDates] = useState({});

  useEffect(() => {
    setOpenDates((prev) => {
      const update = { ...prev };
      sortedDates.forEach((d) => (update[d] = true)); // all true
      return update;
    });
  }, [sortedDates]);

  const toggleDate = (d) => setOpenDates((p) => ({ ...p, [d]: !p[d] }));

  const formatGroupLabel = (dateKeyStr, logsForDay) => {
    const tzLabel = logsForDay?.[0]?.timezone || '';

    if (dateKeyStr === today) return `Today ${tzLabel}`;
    if (dateKeyStr === yesterday) return `Yesterday ${tzLabel}`;

    if (dateKeyStr === 'unknown') return `Unknown date ${tzLabel}`;

    return `${dayjs(dateKeyStr).format('DD MMM YYYY')} ${tzLabel}`;
  };

  const formatLogTime = (log) => {
    const shopTz = log?.shops_time_zone || 'UTC';
    const tzLabel = log?.timezone || '';

    const shopZoned = getShopZonedDate(log);

    if (!shopZoned) {
      return `${log?.created_date_full || ''} ${tzLabel}`;
    }

    return `${shopZoned.format('MMM DD, YYYY hh:mm A')} ${tzLabel}`;
  };

  /* SCROLL LOAD MORE */
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const reachedBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 80;

    if (loadingMore || isFetchingRef.current || currentPage >= totalPages)
      return;

    if (reachedBottom) {
      isFetchingRef.current = true;

      onLoadMore(currentPage + 1, () => {
        isFetchingRef.current = false; // unlock after loading ends
      });
    }
  }, [currentPage, totalPages, loadingMore, onLoadMore]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <TimelineWrapper ref={containerRef}>
      {sortedDates.map((dateKeyStr) => {
        const isOpen = openDates[dateKeyStr];
        const logsForDay = grouped[dateKeyStr] || [];

        return (
          <TimelineWrapperInner key={dateKeyStr}>
            <div style={{ width: '100%' }}>
              <DateGroup onClick={() => toggleDate(dateKeyStr)}>
                <ArrowIcon opened={isOpen} />
                <DateChip>{formatGroupLabel(dateKeyStr, logsForDay)}</DateChip>
              </DateGroup>
            </div>

            {isOpen &&
              logsForDay.map((log) => {
                const { icon, bg, badge } = getTimelineIconConfig(
                  log.icon_bg_css
                );

                return (
                  <ItemRow key={log.id}>
                    <IconWrap style={{ background: bg }}>{icon}</IconWrap>

                    <TextWrap>
                      <div className="row-head">
                        <AitText
                          type="theme"
                          style={{ textTransform: 'capitalize' }}
                          strong
                          bottommargin={6}
                        >
                          {log.customer_name}
                        </AitText>
                        <AitText
                          size={12}
                          type="secondary"
                          style={{ fontStyle: 'italic' }}
                        >
                          {formatLogTime(log)}
                        </AitText>
                      </div>

                      <AitText bottommargin={10} type={'default'}>
                        {log.object_text}
                      </AitText>

                      <EngagedBadge style={{ background: badge, color: bg }}>
                        {log.Engaged_by}
                      </EngagedBadge>
                    </TextWrap>
                  </ItemRow>
                );
              })}
          </TimelineWrapperInner>
        );
      })}
      {loadingMore && (
        <LoaderWrap>
          <Spin size="default" />
        </LoaderWrap>
      )}

      {currentPage >= totalPages && !loadingMore && (
        <LoaderWrap style={{ fontSize: 14 }}>All records loaded</LoaderWrap>
      )}
    </TimelineWrapper>
  );
};

export default AitTimeline;
