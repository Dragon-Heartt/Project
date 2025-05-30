import React, { useEffect, useRef, useState } from 'react';
import x651 from '../assets/65-1.png';
import NLoca from '../assets/NowLocation.png';
import './GoogleMap.css'; // 기존 스타일 재사용

const GOOGLE_MAP_API_KEY = 'AIzaSyBT31eeF-xHLjznEqCvfxSxbTbWRIY7IHo';

function loadGoogleMapsScript(callback) {
	if (window.google && window.google.maps) {
		callback();
		return;
	}
	const existingScript = document.getElementById('google-maps');
	if (existingScript) {
		existingScript.onload = callback;
		return;
	}
	const script = document.createElement('script');
	script.id = 'google-maps';
	script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&callback=initMap`;
	script.async = true;
	window.initMap = callback;
	document.body.appendChild(script);
}

const DEFAULT_CENTER = { lat: 36.6283, lng: 127.457 };

const GoogleMap = () => {
	const mapRef = useRef(null);
	const mapInstance = useRef(null);
	const markerRef = useRef(null);
	const pulseRef = useRef(null);
	const [mapLoaded, setMapLoaded] = useState(false);

	// 현재 위치 pulse overlay 관리
	const [pulsePos, setPulsePos] = useState(null);

	useEffect(() => {
		loadGoogleMapsScript(() => {
			if (!mapRef.current) return;
			mapInstance.current = new window.google.maps.Map(mapRef.current, {
				center: DEFAULT_CENTER,
				zoom: 18, // 더 확대
			});
			// 기본 마커
			markerRef.current = new window.google.maps.Marker({
				position: DEFAULT_CENTER,
				map: mapInstance.current,
			});
			setMapLoaded(true);
		});
		// cleanup
		return () => {
			window.initMap = undefined;
		};
	}, []);

	const handleCurrentLocation = () => {
		if (!window.google || !window.google.maps || !mapInstance.current) return;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					mapInstance.current.setCenter(pos);
					if (markerRef.current) {
						markerRef.current.setMap(null);
					}
					markerRef.current = new window.google.maps.Marker({
						position: pos,
						map: mapInstance.current,
						icon: {
							url: NLoca,
							scaledSize: new window.google.maps.Size(18, 18),
						},
						animation: window.google.maps.Animation.DROP,
					});
					// pulse 효과 위치 저장
					setPulsePos(pos);
				},
				() => {
					alert('위치 정보를 가져올 수 없습니다.');
				}
			);
		} else {
			alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
		}
	};

	// pulse overlay 렌더링
	useEffect(() => {
		if (!pulsePos || !mapInstance.current) return;
		const overlay = new window.google.maps.OverlayView();
		overlay.onAdd = function () {
			const div = document.createElement('div');
			div.className = 'pulse-marker';
			div.style.position = 'absolute';
			pulseRef.current = div;
			const panes = this.getPanes();
			panes.overlayMouseTarget.appendChild(div);
		};
		overlay.draw = function () {
			if (!pulseRef.current) return;
			const projection = this.getProjection();
			const point = projection.fromLatLngToDivPixel(new window.google.maps.LatLng(pulsePos.lat, pulsePos.lng));
			if (point) {
				pulseRef.current.style.left = `${point.x - 20}px`;
				pulseRef.current.style.top = `${point.y - 20}px`;
			}
		};
		overlay.onRemove = function () {
			if (pulseRef.current && pulseRef.current.parentNode) {
				pulseRef.current.parentNode.removeChild(pulseRef.current);
			}
			pulseRef.current = null;
		};
		overlay.setMap(mapInstance.current);
		return () => overlay.setMap(null);
	}, [pulsePos, mapLoaded]);

	return (
		<div className="map-container" style={{ position: 'relative' }}>
			<div ref={mapRef} id="map" className="map" style={{ zIndex: 1 }} />
			<button
				className="current-place-wrapper"
				onClick={handleCurrentLocation}
				disabled={!mapLoaded}
				style={{ zIndex: 1001 }}
			>
				<img src={x651} alt="현재 위치 아이콘" className="element" />
			</button>
		</div>
	);
};

export default GoogleMap; 