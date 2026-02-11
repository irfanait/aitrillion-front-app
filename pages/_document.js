import React, { use } from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="AiTrillion" />
        <meta name="apple-mobile-web-app-title" content="AiTrillion" />
        <meta name="msapplication-TileColor" content="#007BFF" />
        <link
          rel="icon"
          href="https://app.aitrillion.com/favicon.png"
          sizes="any"
        />
        <link
          rel="preconnect"
          href="https://app.aitrillion.com"
          crossOrigin="use-credentials"
        />
        <link rel="dns-prefetch" href="https://app.aitrillion.com" />
        <link
          rel="stylesheet"
          href="https://plugins.stripo.email/static/latest/settings.css"
        />
        <link
          rel="stylesheet"
          href="https://plugins.stripo.email/static/latest/stripo.css"
        />
        <link
          rel="stylesheet"
          href="https://static.aitrillion.com/assets/backend/css/style_templatev2_unminify.css"
        />
        {/* <link
          rel="stylesheet"
          href="https://static.aitrillion.com/assets/backend/css/bootstrap.min.css"
        /> */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/antd@5.13.0/dist/antd.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://static.aitrillion.com/assets/css/select2.min.css"
          media="screen"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://static.aitrillion.com/assets/js_2019/workflow_chart/angular-select2/select2.css"
          media="screen"
          rel="stylesheet"
          type="text/css"
        />
        {/* ✅ Flag icons (for translate dropdown styling) */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <Script
          src="https://code.jquery.com/jquery-3.1.1.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"
          strategy="beforeInteractive"
        />
        {/* <Script
          src="https://static.aitrillion.com/assets/js/bootstrap.min.js"
          strategy="beforeInteractive"
        /> */}
        <Script
          src="https://plugins.stripo.email/static/latest/stripo.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://auth.aitrillion.com/aiAuth.js?v=1.01"
          strategy="beforeInteractive"
        />
        {/* ✅ Custom block extensions (attach to window.*) */}
        <Script
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/backend/editorv2/extensions/extension-product-block/dist/main.452551d1040114e5aa5b.extension.js`}
        />
        <Script id="init-product-block">
          {`if (window.default && !window.ProductBlockExtension) window.ProductBlockExtension = window.default;`}
        </Script>
        <Script
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/backend/editorv2/extensions/extension-coupon-code-block/dist/main.6949633ee0494b17da44.extension.js`}
          strategy="beforeInteractive"
          onLoad={() => {
            if (window.default && !window.CouponCodeExtension) {
              window.CouponCodeExtension = window.default;
            }
          }}
        />
        <Script
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/backend/editorv2/extensions/extension-order-summary-block/dist/main.bb05551067bd9ec3d450.extension.js`}
        />
        <Script id="init-order-summary">
          {`if (window.default && !window.OrderSummeryExtension) window.OrderSummeryExtension = window.default;`}
        </Script>
        <Script
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/backend/editorv2/extensions/extension-order-shipping-block/dist/main.d1157b43c26c762c6f2c.extension.js`}
        />
        <Script id="init-order-shipping">
          {`if (window.default && !window.orderShippingSummeryExtension) window.orderShippingSummeryExtension = window.default;`}
        </Script>
        <Script
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/backend/editorv2/extensions/extension-optout-list-block/dist/main.1caf775eb86d8bae1115.extension.js`}
        />
        <Script id="init-optout">
          {`if (window.default && !window.optOutListExtension) window.optOutListExtension = window.default;`}
        </Script>
        <Script
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/backend/editorv2/extensions/extension-logo-block/dist/main.952f3180f72b5720fa46.extension.js`}
        />
        <Script id="init-logo-block">
          {`if (window.default && !window.LogoBlockExtension) window.LogoBlockExtension = window.default;`}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js"
          strategy="afterInteractive"
        />

        {/* Microsoft Clarity Analytics */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "q421zs7tc2");
          `}
        </Script>

        {/* Usertour.js - Product Tours */}
        <Script id="usertour-script" strategy="afterInteractive">
          {`
            !function(){var e="undefined"==typeof window?{}:window,r=e.usertour;if(!r){var t="https://js.usertour.io/";var n=null;r=e.usertour={_stubbed:!0,load:function(){return n||(n=new Promise((function(r,o){var s=document.createElement("script");s.async=!0;var a=e.USERTOURJS_ENV_VARS||{};"es2020"===(a.USERTOURJS_BROWSER_TARGET||function(e){for(var r=[[/Edg\\//,/Edg\\/(\\d+)/,80],[/OPR\\//,/OPR\\/(\\d+)/,67],[/Chrome\\//,/Chrome\\/(\\d+)/,80],[/CriOS\\//,/CriOS\\/(\\d+)/,100],[/Safari\\//,/Version\\/(\\d+)/,14],[/Firefox\\//,/Firefox\\/(\\d+)/,74]],t=0;t<r.length;t++){var n=r[t],o=n[0],s=n[1],a=n[2];if(e.match(o)){var i=e.match(new RegExp(s));if(i&&parseInt(i[1],10)>=a)return"es2020";break}}return"legacy"}(navigator.userAgent))?(s.type="module",s.src=a.USERTOURJS_ES2020_URL||t+"es2020/usertour.js"):s.src=a.USERTOURJS_LEGACY_URL||t+"legacy/usertour.iife.js",s.onload=function(){r()},s.onerror=function(){document.head.removeChild(s),n=null;var e=new Error("Could not load Usertour.js");console.warn(e.message),o(e)},document.head.appendChild(s)}))),n}};var o=e.USERTOURJS_QUEUE=e.USERTOURJS_QUEUE||[],s=function(e){r[e]=function(){var t=Array.prototype.slice.call(arguments);r.load(),o.push([e,null,t])}},a=function(e){r[e]=function(){var t,n=Array.prototype.slice.call(arguments);r.load();var s=new Promise((function(e,r){t={resolve:e,reject:r}}));return o.push([e,t,n]),s}},i=function(e,t){r[e]=function(){return t}};s("init"),s("off"),s("on"),s("reset"),s("setBaseZIndex"),s("setSessionTimeout"),s("setTargetMissingSeconds"),s("setCustomInputSelector"),s("setCustomNavigate"),s("setCustomScrollIntoView"),s("setInferenceAttributeFilter"),s("setInferenceAttributeNames"),s("setInferenceClassNameFilter"),s("setScrollPadding"),s("setServerEndpoint"),s("setShadowDomEnabled"),s("setPageTrackingDisabled"),s("setUrlFilter"),s("setLinkUrlDecorator"),a("endAll"),a("group"),a("identify"),a("identifyAnonymous"),a("start"),a("track"),a("updateGroup"),a("updateUser"),i("isIdentified",!1),i("isStarted",!1)}}();

            // Initialize Usertour with your token
            if (typeof window !== 'undefined' && window.usertour) {
              window.usertour.init('cmdsvvkd5000a11gnzlxnve0m');
            }
          `}
        </Script>

        <style>{`
    .collapse {
      visibility: visible !important;
    }
    /* Target ONLY the social icon dropdown inside stripoSettingsContainer */

    
#stripoSettingsContainer .esdev-social-icon-preview button.btn.dropdown-toggle img {
  height: 18px !important;
  max-width: none !important;
  display: inline !important;
}

#stripoSettingsContainer .esdev-social-icon-preview button.btn.dropdown-toggle small.text-muted {
  font-size: 12px;
  color: #666;
}
  
  `}</style>
      </Head>
      <body style={{ margin: 0 }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
