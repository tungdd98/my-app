import logo from './logo.svg'
import './App.css'
import { Helmet } from 'react-helmet'

function App() {
	return (
		<div className='App'>
			<Helmet>
				<title>My Title</title>
				<link
			        	rel="apple-touch-icon"
			        	sizes="192x192"
			        	href="./icons8-camera-192.png"
			        />
			</Helmet>
			<header className='App-header'>
				<img
					src={logo}
					className='App-logo'
					alt='logo'
				/>
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className='App-link'
					href='https://reactjs.org'
					target='_blank'
					rel='noopener noreferrer'>
					Learn React
				</a>
			</header>
		</div>
	)
}

export default App
