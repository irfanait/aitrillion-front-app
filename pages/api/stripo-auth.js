// pages/api/stripo-auth.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const response = await fetch('https://plugins.stripo.email/api/v1/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pluginId: process.env.NEXT_PUBLIC_STRIPO_PLUGIN_ID,
        secretKey: process.env.STRIPO_SECRET_KEY,
      }),
    });

    const data = await response.json();

    // Stripo sometimes returns { token: ... }
    const accessToken = data.accessToken || data.token;

    if (!accessToken) {
      console.error('Unexpected Stripo response:', data);
      return res.status(400).json({ error: 'No token in response', data });
    }

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Stripo auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
