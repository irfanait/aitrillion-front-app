/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import React, { useRef } from 'react';
import Script from 'next/script';
import { useSelector } from 'react-redux';
import { isProd, shouldTrack } from '@/utils/analyticsConditions';

export default function AnalyticsBootstrap() {
  const jwt = useSelector((s) => s?.jwtState?.login_auth) || {};
  const loadedRef = useRef(false);

  const trackingAllowed = shouldTrack({
    is_bkac: jwt?.is_bkac,
    is_dummey_shop: jwt?.is_dummey_shop,
    login_id: jwt?.login_id,
  });

  if (!trackingAllowed) return null;

  const ampKey = isProd()
    ? process.env.NEXT_PUBLIC_AMPLITUDE_KEY
    : process.env.NEXT_PUBLIC_AMPLITUDE_DEV_KEY;

  const envLabel = isProd() ? 'Production' : 'Development';

  return (
    <>
      {/* ✅ Load SDK from CDN */}
      <Script
        id="amplitude-loader"
        src="https://cdn.amplitude.com/libs/amplitude-8.17.0-min.gz.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (loadedRef.current) return;
          loadedRef.current = true;

          try {
            if (!window.amplitude?.getInstance) {
              console.error('[Amplitude] SDK not ready.');
              return;
            }

            const instance = window.amplitude.getInstance();
            instance.init(ampKey, jwt?.email || null);

            instance.setUserProperties({
              shop_name: jwt?.shop_name || null,
              Shop_id: jwt?.shop_id || null,
              Login_id: jwt?.login_id || null,
              plan_id: jwt?.plan_id || null,
              customer_email: jwt?.email || null,
              env: envLabel,
            });

            window.amplitudeInstance = instance;
          } catch (err) {
            console.error('[Amplitude Init Error]', err);
          }
        }}
      />

      {/* ✅ GTM */}
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
          `}
        </Script>
      )}

      {/* ✅ GA4 */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}

      {/* ✅ Facebook Pixel */}
      {process.env.NEXT_PUBLIC_FB_PIXEL && (
        <>
          <Script id="fbq-init" strategy="beforeInteractive">
            {`
        // Safe global fbq stub (runs before any other script)
        window.fbq = window.fbq || function() {
          window.fbq.callMethod ?
            window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
        };
        window.fbq.queue = window.fbq.queue || [];
        window.fbq.loaded = true;
        window.fbq.version = '2.0';
        window.fbq.queue = window.fbq.queue || [];
      `}
          </Script>

          <Script id="fbq-main" strategy="afterInteractive">
            {`
        !function(f,b,e,v,n,t,s){
          if(f.fbq)return;
          n=f.fbq=function(){n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;
          n.push=n;
          n.loaded=!0;
          n.version='2.0';
          n.queue=[];
          t=b.createElement(e);
          t.async=!0;
          t.src=v;
          s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL}');
        fbq('track', 'PageView');
      `}
          </Script>

          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}
