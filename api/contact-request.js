// /api/contact-request.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.EASYBROKER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const {
    name,
    email,
    phone,
    message,
    property_id,
    source = 'Sitio web Montana Realty'
  } = req.body;

  // Validación básica
  if (!name || !email) {
    return res.status(400).json({
      error: 'Name and email are required'
    });
  }

  try {
    const contactData = {
      name,
      email,
      phone: phone || '',
      message: message || '',
      source,
      ...(property_id && { property_id })
    };

    const response = await fetch(
      'https://api.easybroker.com/v1/contact_requests',
      {
        method: 'POST',
        headers: {
          'X-Authorization': apiKey,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('EasyBroker API error:', errorData);
      return res.status(response.status).json({
        error: 'Failed to create contact request',
        details: errorData
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Lead enviado exitosamente',
      data
    });

  } catch (error) {
    console.error('Contact request error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
