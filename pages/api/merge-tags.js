export default async function handler(req, res) {
  const { token, shopId, isCreateTemplate, isMessagePage } = req.body;

  if (!token || !shopId) {
    return res.status(400).json({ error: 'Missing required params' });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}api/template/?act=get_short_code_data&is_message_page=${isMessagePage}&page=load_template_data&shop_id=${shopId}&is_create_template=${isCreateTemplate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );

    const data = await response.json();

    return res.status(200).json({
      mergeTags: data.mergeTags,
      socialNetworks: data?.socialNetworks ?? [],
    });
  } catch (err) {
    console.error('Merge Tags Fetch Error:', err.message);
    return res.status(500).json({ error: 'Failed to load merge tags' });
  }
}
