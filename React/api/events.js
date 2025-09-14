
export default async function handler(req, res) {
  const { keyword = '', size = 10 } = req.query
  const apiKey = process.env.TICKETMASTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured.' })
  }
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=${encodeURIComponent(keyword)}&size=${size}`
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch events')
    const data = await response.json()
    const events = (data._embedded?.events || []).map(event => ({
      id: event.id,
      name: event.name,
      date: event.dates?.start?.localDate,
      venue: event._embedded?.venues?.[0]?.name,
      url: event.url,
    }))
    res.status(200).json({ events })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
