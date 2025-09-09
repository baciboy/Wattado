import { useState } from 'react'
import './App.css'

const sampleEvents = [
	{
		id: 1,
		title: 'Live Jazz Night',
		date: '2025-09-12',
		source: 'Eventbrite',
		location: 'Downtown Club',
	},
	{
		id: 2,
		title: 'Art & Wine Festival',
		date: '2025-09-15',
		source: 'Meetup',
		location: 'City Park',
	},
	{
		id: 3,
		title: 'Tech Innovators Meetup',
		date: '2025-09-18',
		source: 'Eventbrite',
		location: 'Tech Hub',
	},
]

function App() {
	const [search, setSearch] = useState('')
	const filteredEvents = sampleEvents.filter((e) =>
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
					{filteredEvents.length === 0 ? (
						<li className="no-events">No events found.</li>
					) : (
						filteredEvents.map((event) => (
							<li key={event.id} className="event-card">
								<div className="event-title">{event.title}</div>
								<div className="event-details">
									<span>{event.date}</span> |{' '}
									<span>{event.location}</span> |{' '}
									<span className="event-source">
										{event.source}
									</span>
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
	)
}

export default App
