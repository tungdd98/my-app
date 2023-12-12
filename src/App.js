/* eslint-disable no-undef */
import { useCallback, useEffect, useRef } from "react"

const App = () => {
	const videoRef = useRef()
	const adsRef = useRef()
	const adsManagerRef = useRef()
	const adDisplayContainerRef = useRef()
	const adsLoadedRef = useRef(false)

	const playVideo = () => {
		videoRef.current.play()
	}

	const pauseVideo = () => {
		videoRef.current.pause()
	}

	const onAdsManagerLoaded = useCallback((adsManagerLoadedEvent) => {
		// Instantiate the AdsManager from the adsLoader response and pass it the video element
		adsManagerRef.current = adsManagerLoadedEvent.getAdsManager(
			videoRef.current
		)

		adsManagerRef.current.addEventListener(
			google.ima.AdErrorEvent.Type.AD_ERROR,
			onAdError
		)

		adsManagerRef.current.addEventListener(
			google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
			onContentPauseRequested
		)
		adsManagerRef.current.addEventListener(
			google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
			onContentResumeRequested
		)
	}, [])

	const onContentPauseRequested = () => {
		videoRef.current.pause()
	}

	const onContentResumeRequested = () => {
		videoRef.current.play()
	}

	const onAdError = (adErrorEvent) => {
		// Handle the error logging.
		console.log(adErrorEvent.getError())
		if (adsManagerRef.current) {
			adsManagerRef.current.destroy()
		}
	}

	const initializeIMA = useCallback(() => {
		console.log("initializing IMA")
		adDisplayContainerRef.current = new google.ima.AdDisplayContainer(
			adsRef.current,
			videoRef.current
		)
		const adsLoader = new google.ima.AdsLoader(
			adDisplayContainerRef.current
		)

		// Let the AdsLoader know when the video has ended
		videoRef.current.addEventListener("ended", function () {
			adsLoader.contentComplete()
		})

		const adsRequest = new google.ima.AdsRequest()
		adsRequest.adTagUrl =
			"https://pubads.g.doubleclick.net/gampad/ads?" +
			"iu=/21775744923/external/single_ad_samples&sz=640x480&" +
			"cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&" +
			"gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator="

		// Specify the linear and nonlinear slot sizes. This helps the SDK to
		// select the correct creative if multiple are returned.
		adsRequest.linearAdSlotWidth = videoRef.current.clientWidth
		adsRequest.linearAdSlotHeight = videoRef.current.clientHeight
		adsRequest.nonLinearAdSlotWidth = videoRef.current.clientWidth
		adsRequest.nonLinearAdSlotHeight = videoRef.current.clientHeight / 3

		// Pass the request to the adsLoader to request ads
		adsLoader.requestAds(adsRequest)
		adsLoader.addEventListener(
			google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
			onAdsManagerLoaded,
			false
		)
		adsLoader.addEventListener(
			google.ima.AdErrorEvent.Type.AD_ERROR,
			onAdError,
			false
		)
	}, [onAdsManagerLoaded])

	const loadAds = useCallback((event) => {
		if (adsLoadedRef.current) {
			return
		}

		adsLoadedRef.current = true
		event.preventDefault()

		console.log("loading ads")

		// Initialize the container. Must be done via a user action on mobile devices.
		videoRef.current.load()
		adDisplayContainerRef.current.initialize()

		const width = videoRef.current.clientWidth
		const height = videoRef.current.clientHeight
		try {
			adsManagerRef.current.init(
				width,
				height,
				google.ima.ViewMode.NORMAL
			)
			adsManagerRef.current.start()
		} catch (adError) {
			// Play the video without ads, if an error occurs
			console.log("AdsManager could not be started")
			videoRef.current.play()
		}
	}, [])

	useEffect(() => {
		initializeIMA()
	}, [initializeIMA])

	useEffect(() => {
		videoRef.current.addEventListener("play", (event) => {
			loadAds(event)
		})
	}, [loadAds])

	return (
		<div id='page-content'>
			<div id='video-container'>
				<video
					ref={videoRef}
					id='video-element'>
					<source src='https://storage.googleapis.com/interactive-media-ads/media/android.mp4' />
					<source src='https://storage.googleapis.com/interactive-media-ads/media/android.webm' />
				</video>
				<div
					ref={adsRef}
					id='ad-container'></div>
			</div>
			<button onClick={playVideo}>Play</button>
			<button onClick={pauseVideo}>Pause</button>
		</div>
	)
}

export default App
