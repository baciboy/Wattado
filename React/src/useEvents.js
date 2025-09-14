import { useEffect, useState } from 'react'

export function useEvents(search = '') {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
  fetch(`http://localhost:3001/api/events?keyword=${encodeURIComponent(search)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch events')
        return res.json()
      })
      .then((data) => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [search])

  return { events, loading, error }
}
