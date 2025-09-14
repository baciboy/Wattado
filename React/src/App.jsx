import { useState } from 'react'
import './App.css'
import { useEvents } from './useEvents'

// Ticketmaster events will be loaded from API


function App() {
	const [search, setSearch] = useState('')
	const { events, loading, error } = useEvents(search)

	return (
		<div className="wattado-container">
			<header className="wattado-header">
				<h1>Wattado</h1>
				<p className="subtitle">
					Find your next experience. Aggregated events & AI-powered recommendations.
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
				{loading && <div className="loading">Loading events...</div>}
				{error && <div className="error">{error}</div>}
				<ul className="event-list">
					{!loading && !error && events.length === 0 ? (
						<li className="no-events">No events found.</li>
					) : (
						events.map((event) => (
							<li key={event.id} className="event-card">
								<div className="event-title">{event.name}</div>
								<div className="event-details">
									<span>{event.date}</span> |{' '}
									<span>{event.venue}</span> |{' '}
									<a
										href={event.url}
										target="_blank"
										rel="noopener noreferrer"
										className="event-source"
									>
										View on Ticketmaster
									</a>
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
					Soon: Get personalized suggestions based on your interests and mood!
				</div>
			</section>
		</div>
	)
}

export default App
