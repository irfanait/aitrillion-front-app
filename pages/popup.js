import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Spin } from 'antd'; // or any loader component

export default function Page() {
  const router = useRouter();
  const { act } = router.query;

  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  return (
    <>
      {/* You can also use Antd Spin or your own loader */}
      {iframeLoading && (
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9f9f9',
          }}
        >
          <Spin size="large" tip="Loading content..." />
        </div>
      )}

      {iframeError && (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <p>Failed to load content. Please try again later.</p>
        </div>
      )}

      <iframe
        src={`${process.env.NEXT_PUBLIC_APP_URL}/index/aclplanupgrade?acl=${act}`}
        title="HTML Preview"
        width="100%"
        height="100%"
        style={{
          border: 'none',
          display: iframeLoading ? 'none' : 'block', // hide until loaded
        }}
        onLoad={() => setIframeLoading(false)}
        onError={() => {
          console.error('Failed to load iframe content');
          setIframeLoading(false);
          setIframeError(true);
        }}
      />
    </>
  );
}
