import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { trackEvent } from '@/utils/trackEvent';
import { useSelector } from 'react-redux';

/**
 * Global tracker hook
 *  - Listens to route changes (Page View)
 *  - Captures all button/link clicks
 *  - Automatically includes user/shop context
 */
export default function useGlobalAnalyticsTracker() {
  const router = useRouter();
  const jwt = useSelector((s) => s?.jwtState?.login_auth) || {};

  useEffect(() => {
    if (typeof window === 'undefined') return;

    /** 🔹 Page view tracking */
    const handleRouteChange = (url) => {
      trackEvent('Page View', {
        url,
        shop_name: jwt?.shop_name,
        login_id: jwt?.login_id,
        email: jwt?.email,
      });
    };

    /** 🔹 Click tracking for all interactive elements */
    const handleClick = (e) => {
      let el = e?.target?.closest(
        "button, a, [role='button'], [data-amp-event-name]"
      );
      if (el && !el.getAttribute('data-amp-event-name')) {
        // Check parent li if current element doesn't have event name
        const liParent = el?.closest('li[data-amp-event-name]');
        if (liParent) el = liParent;
      }

      const explicit = el?.getAttribute('data-amp-event-name');
      const fallback =
        el?.innerText?.trim() ||
        el?.getAttribute('aria-label') ||
        el?.getAttribute('title') ||
        'Unknown_Click';

      const eventName =
        explicit || `Click_${fallback.replace(/\s+/g, '_').slice(0, 80)}`;

      trackEvent(eventName, {
        page: window?.location?.pathname || '',
        shop_name: jwt?.shop_name,
        login_id: jwt?.login_id,
        email: jwt?.email,
      });
    };

    /** 🔹 Register listeners */
    router.events.on('routeChangeComplete', handleRouteChange);
    document?.addEventListener('click', handleClick);

    /** 🔹 Trigger initial page view */
    handleRouteChange(router.asPath);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      document?.removeEventListener('click', handleClick);
    };
  }, [router.asPath, jwt?.shop_name, jwt?.login_id, jwt?.email]);
}
