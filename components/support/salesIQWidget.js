'use client';
import React from 'react';
import Script from 'next/script';
import { useSelector } from 'react-redux';
import { checkIsActivatedContact, isProd } from '@/utils/analyticsConditions';

export default function SalesIQWidget() {
  const jwt = useSelector((s) => s?.jwtState?.login_auth) || {};
  const userDetails =
    useSelector((s) => s?.loggedInUserDetailsState?.userDetails) || {};

  const plan_id = jwt?.plan_id || 0;
  const customer_count = userDetails?.customer_count || 0;
  const action =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/').pop()
      : '';
  const enabled =
    isProd() && checkIsActivatedContact(plan_id, customer_count, action);

  if (!enabled) return null;

  return (
    <>
      <Script id="zoho-salesiq-init" strategy="afterInteractive">
        {`window.$zoho=window.$zoho||{};$zoho.salesiq=$zoho.salesiq||{ready:function(){}};`}
      </Script>
      <Script
        id="zoho-salesiq-script"
        src="https://salesiq.zohopublic.com/widget?wc=siqd431e189fb9ec4f8eda18f5509c10349"
        defer
        strategy="afterInteractive"
      />
      <Script id="zoho-salesiq-config" strategy="afterInteractive">
        {`
          $zoho.salesiq.ready = function () {
            try {
              $zoho.salesiq.visitor.name("${(jwt?.first_name || '') + ' ' + (jwt?.last_name || '')}");
              $zoho.salesiq.visitor.email("${jwt?.email || ''}");
              $zoho.salesiq.visitor.info({
                "StoreURLV": "${jwt?.shop_name || ''}",
                "PlanAmountV": "${jwt?.estimated_price || ''}",
                "ShopifyPlanV": "${jwt?.plan_name || ''}"
              });
              $zoho.salesiq.set("home.widgets", [
                {
                  type: "list",
                  data: {
                    title: "Talk to our experts - If you need any assistance",
                    body: [
                      { label: "Book a meeting!", action: { invoke: "open.url",
                        url: "https://www.aitrillion.com/support?utm_source=support&utm_medium=popup&utm_campaign=support_meeting" } }
                    ]
                  }
                }
              ]);
            } catch(e) { console.warn('SalesIQ config error', e); }
          };
        `}
      </Script>
    </>
  );
}
