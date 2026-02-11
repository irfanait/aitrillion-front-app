import React, { useEffect, useState, useRef, useCallback } from 'react';
import CreateTemplateTemplate from '@/modules/email-marketing/templates/create-temaplate-template/createTemplateTemplate';
import { useRouter } from 'next/router';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import {
  clearStripoState,
  resetTemplateState,
} from '@/redux/stripo-slices/stripo-slice';
import { useDispatch } from 'react-redux';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const pendingUrlRef = useRef(null);
  const allowNavigationRef = useRef(false); // 🔥 skip guard after confirm
  const isNavigatingRef = useRef(false);

  // Warn on tab close / refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!allowNavigationRef.current && !isNavigatingRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleRouteChangeStart = useCallback(
    (url) => {
      // ✅ Allow intentional navigations
      if (allowNavigationRef.current || isNavigatingRef.current) return;

      // 🚫 Show modal for accidental navigation
      if (url !== router.asPath) {
        pendingUrlRef.current = url;
        setWarningModalOpen(true);
        router.events.emit('routeChangeError');
        throw 'Navigation aborted due to unsaved changes';
      }
    },
    [router]
  );

  // ✅ Reset flags once navigation completes
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      allowNavigationRef.current = false;
      isNavigatingRef.current = false;
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router, handleRouteChangeStart]);

  const handleConfirmLeave = async () => {
    setWarningModalOpen(false);

    if (pendingUrlRef.current) {
      allowNavigationRef.current = true;
      isNavigatingRef.current = true;

      // ✅ Wait a tick to clear the aborted transition
      await new Promise((r) => setTimeout(r, 50));

      // ✅ Use replace() instead of push() to bypass the aborted route state
      router.replace(pendingUrlRef.current);

      pendingUrlRef.current = null;
    }
  };

  // ✅ Safe programmatic navigation (e.g., Save & Exit)
  const handleSafeNavigation = (url) => {
    // set flags synchronously *before* triggering Next.js navigation
    allowNavigationRef.current = true;
    isNavigatingRef.current = true;

    // delay to ensure flag registration before Next router fires events
    setTimeout(() => {
      router.push(url);
    }, 0);
  };

  useEffect(() => {
    return () => {
      dispatch(resetTemplateState());
      dispatch(clearStripoState());
    };
  }, [dispatch]);

  return (
    <>
      <CreateTemplateTemplate
        allowNavigationRef={allowNavigationRef}
        isNavigatingRef={isNavigatingRef}
        onSafeNavigate={handleSafeNavigation}
      />

      <AitConfirmationModal
        visible={warningModalOpen}
        setVisible={setWarningModalOpen}
        description="Changes you made may not be saved."
        onConfirm={handleConfirmLeave}
        onCancel={() => setWarningModalOpen(false)}
        confirmText="Leave Page"
      />
    </>
  );
}
