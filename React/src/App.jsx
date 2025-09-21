import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './App.css'



function App() {
	const [search, setSearch] = useState('')
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	// Filter states
	const [city, setCity] = useState('London')
	const [date, setDate] = useState(null)
	const [type, setType] = useState('')

	useEffect(() => {
		const fetchEvents = async () => {
			setLoading(true)
			setError(null)
			let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${import.meta.env.VITE_TICKETMASTER_API_KEY}`
			if (city) url += `&city=${encodeURIComponent(city)}`
			if (date) {
				// Format date to YYYY-MM-DDT00:00:00Z
				const isoDate = date.toISOString().split('T')[0] + 'T00:00:00Z'
				url += `&startDateTime=${isoDate}`
			}
			if (type) url += `&classificationName=${encodeURIComponent(type)}`
			try {
				const res = await fetch(url)
				const data = await res.json()
				const apiEvents = data._embedded?.events?.map((event) => ({
					id: event.id,
					title: event.name,
					date: event.dates.start.localDate,
					source: 'Ticketmaster',
					location: event._embedded?.venues?.[0]?.name || 'Unknown',
					url: event.url,
					type: event.classifications?.[0]?.segment?.name || '',
				})) || []
				setEvents(apiEvents)
			} catch {
				setError('Failed to fetch events')
			} finally {
				setLoading(false)
			}
		}
		fetchEvents()
	}, [city, date, type])

	const filteredEvents = events.filter((e) =>
		e.title.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div className="wattado-container">
			<header className="wattado-header">
				<h1>Wattado</h1>
				<p className="subtitle">
					Find your next experience. Aggregated events & AI-powered
					recommendations.
				</p>
			</header>
			<div className="main-content">
				<aside className="filter-sidebar">
					<div>
						<label className="filter-label" htmlFor="city">City</label>
						<select
							id="city"
							className="filter-select"
							value={city}
							onChange={e => setCity(e.target.value)}
						>
							<option value="London">London</option>
							<option value="New York">New York</option>
							<option value="Los Angeles">Los Angeles</option>
							<option value="Chicago">Chicago</option>
							<option value="Las Vegas">Las Vegas</option>
							<option value="San Francisco">San Francisco</option>
							<option value="Miami">Miami</option>
							<option value="Toronto">Toronto</option>
							<option value="Sydney">Sydney</option>
							<option value="Melbourne">Melbourne</option>
							<option value="">Other</option>
						</select>
					</div>
					<div>
						<label className="filter-label" htmlFor="date">Date</label>
						<DatePicker
							id="date"
							className="filter-input"
							selected={date}
							onChange={date => setDate(date)}
							dateFormat="yyyy-MM-dd"
							placeholderText="Select date"
							isClearable
						/>
					</div>
					<div>
						<label className="filter-label" htmlFor="type">Type</label>
						<select
							id="type"
							className="filter-select"
							value={type}
							onChange={e => setType(e.target.value)}
						>
							<option value="">All</option>
							<option value="Music">Music</option>
							<option value="Sports">Sports</option>
							<option value="Arts & Theatre">Arts & Theatre</option>
							<option value="Film">Film</option>
							<option value="Miscellaneous">Miscellaneous</option>
						</select>
					</div>
				</aside>
				<div style={{ flex: 1 }}>
					<section className="search-section">
						<input
							type="text"
							placeholder="Search events..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="search-bar"
						/>
					</section>
					<section className="events-section">
						<h2>Upcoming Events</h2>
						<ul className="event-list">
							{loading ? (
								<li className="no-events">Loading events...</li>
							) : error ? (
								<li className="no-events">{error}</li>
							) : filteredEvents.length === 0 ? (
								<li className="no-events">No events found.</li>
							) : (
								filteredEvents.map((event) => (
									<li key={event.id} className="event-card">
										<div className="event-title">{event.title}</div>
										<div className="event-details">
											<span>{event.date}</span> |{' '}
											<span>{event.location}</span> |{' '}
											{event.type && <span>{event.type}</span>} |{' '}
											{event.source === 'Ticketmaster' && event.url ? (
												<a className="event-source" href={event.url} target="_blank" rel="noopener noreferrer">
													Ticketmaster
												</a>
											) : (
												<span className="event-source">{event.source}</span>
											)}
										</div>
									</li>
								))
							)}
						</ul>
					</section>
					<section className="ai-section">
						<h2>AI Recommendations</h2>
						<div className="ai-hint">
							<span role="img" aria-label="sparkles">
								✨
							</span>{' '}
							Soon: Get personalized suggestions based on your interests and
							mood!
						</div>
					</section>
				</div>
			</div>
		</div>
	)
}

export default App
