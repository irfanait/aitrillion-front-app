export function trackEvent(eventName, eventData = {}) {
  if (typeof window === 'undefined' || !eventName) return;

  const payload = {
    ...eventData,
    timestamp: new Date().toISOString(),
  };

  try {
    // ✅ Amplitude
    if (window.amplitude?.getInstance) {
      const amp = window.amplitude.getInstance();
      amp.logEvent(eventName, payload);
    }
  } catch (err) {
    console.warn('[Amplitude] Tracking error:', err);
  }

  try {
    // ✅ Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...payload });
  } catch (err) {
    console.warn('[GTM] Push error:', err);
  }

  try {
    // ✅ Facebook Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, payload);
    } else if (window.fbq && window.fbq.queue) {
      // fbq is still a stub, queue event manually
      window.fbq.queue.push(['trackCustom', eventName, payload]);
    } else {
      console.debug('[FB Pixel] Not yet ready, event queued:', eventName);
    }
  } catch (err) {
    console.warn('[FB Pixel] Tracking error:', err);
  }

  // ✅ Debug log in all environments
  if (
    ['production', 'staging', 'development'].includes(
      process.env.NEXT_PUBLIC_APPLICATION_ENV
    )
  ) {
    // console.log('🔍 [TrackEvent]', eventName, payload);
  }
}
