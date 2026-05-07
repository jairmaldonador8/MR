// /api/property-detail.js

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.EASYBROKER_API_KEY;
  const { id } = req.query;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Property ID is required' });
  }

  try {
    const response = await fetch(
      `https://api.easybroker.com/v1/properties/${id}`,
      {
        headers: {
          'X-Authorization': apiKey,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Property not found' });
      }
      return res.status(response.status).json({
        error: 'EasyBroker API error',
        status: response.status
      });
    }

    const data = await response.json();

    // Cache de 10 minutos
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');

    return res.status(200).json(data);

  } catch (error) {
    console.error('Property detail API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
