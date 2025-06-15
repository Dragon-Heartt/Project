import React, { useEffect, useRef, useState } from 'react';
import x651 from '../assets/65-1.png';
import NLoca from '../assets/NowLocation.png';
import './GoogleMap.css';
import { createRoot } from 'react-dom/client';
import { RiMapPin2Fill } from "react-icons/ri";
import ReactDOMServer from "react-dom/server";
import { useNavigate } from 'react-router-dom';

const GOOGLE_MAP_API_KEY = 'AIzaSyATsGagEoK00aTqhbJuVKpGGKjNJdSM06Q';

function getMarkerColor({ space_type, has_chair, has_shade }) {
	if (space_type && has_chair && has_shade) return 'blue';
	if (space_type && has_chair && !has_shade) return 'yellow';
	if (space_type && !has_chair && has_shade) return 'green';
	if (space_type && !has_chair && !has_shade) return 'red';
	if (!space_type && !has_chair && !has_shade) return 'purple';
	if (!space_type && !has_chair && has_shade) return 'orange';
	if (!space_type && has_chair && !has_shade) return 'pink';
	if (!space_type && has_chair && has_shade) return 'brown';
	return 'gray';
}

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
	script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
	script.async = true;
	script.defer = true;
	script.onerror = () => {
		console.error('Google Maps API 스크립트 로드 실패');
		alert('지도를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.');
	};
	script.onload = () => {
		if (window.google && window.google.maps) {
			callback();
		} else {
			console.error('Google Maps API가 정상적으로 로드되지 않았습니다.');
			alert('지도를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.');
		}
	};
	document.body.appendChild(script);
}

const DEFAULT_CENTER = { lat: 36.6283, lng: 127.457 };

const InfoWindowContent = ({ title, inside, has_chair, has_shade, onNavigate, onClose, photo_url }) => (
	<div className="info-window-content">
		{photo_url && (
			<div className="place-image">
				<img src={`http://localhost:8000${photo_url}`} alt={title} />
			</div>
		)}
		<div className="place-title">{title}</div>
		<div className="place-type">
			{inside ? '실내' : '실외'} / {has_chair ? '의자 있음' : '의자 없음'} / {has_shade ? '차양막 있음' : '차양막 없음'}
		</div>
		<div className="button-row">
			<button className="navigate-btn" onClick={onNavigate}>길찾기</button>
			<button className="cancel-btn" onClick={onClose}>취소</button>
		</div>
	</div>
);

const svgString = (color, stroke = '#222') =>
	encodeURIComponent(
		ReactDOMServer.renderToString(
			<RiMapPin2Fill color={color} size={36} style={{ stroke: stroke, strokeWidth: 1 }} />
		)
	);

const MarkerLegend = () => (
	<div className="marker-legend">
		<h3>마커 색상 설명</h3>
		<div className="legend-items">
			<div className="legend-item">
				<RiMapPin2Fill color="blue" size={24} />
				<span>실내 + 의자 + 차양막</span>
			</div>
			<div className="legend-item">
				<RiMapPin2Fill color="yellow" size={24} />
				<span>실내 + 의자</span>
			</div>
			<div className="legend-item">
				<RiMapPin2Fill color="green" size={24} />
				<span>실내 + 차양막</span>
			</div>
			<div className="legend-item">
				<RiMapPin2Fill color="red" size={24} />
				<span>실내</span>
			</div>
			<div className="legend-item">
				<RiMapPin2Fill color="purple" size={24} />
				<span>실외</span>
			</div>
			<div className="legend-item">
				<RiMapPin2Fill color="orange" size={24} />
				<span>실외 + 차양막</span>
			</div>
			<div className="legend-item">
				<RiMapPin2Fill color="pink" size={24} />
				<span>실외 + 의자</span>
			</div>
			<div className="legend-item">
				<RiMapPin2Fill color="brown" size={24} />
				<span>실외 + 의자 + 차양막</span>
			</div>
		</div>
	</div>
);

const GoogleMap = () => {
	const navigate = useNavigate();
	const mapRef = useRef(null);
	const mapInstance = useRef(null);
	const markerRef = useRef(null);
	const pulseRef = useRef(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [error, setError] = useState(null);

	const [smokingZones, setSmokingZones] = useState([]); 
	const [zoneMarkers, setZoneMarkers] = useState([]);

	const [pulsePos, setPulsePos] = useState(null);

	useEffect(() => {
		if (!GOOGLE_MAP_API_KEY) {
			setError('Google Maps API 키가 설정되지 않았습니다.');
			return;
		}

		console.log('API Key:', GOOGLE_MAP_API_KEY); 

		loadGoogleMapsScript(() => {
			if (!mapRef.current) {
				console.error('mapRef가 없습니다.');
				return;
			}
			try {
				console.log('지도 초기화 시도...');
				mapInstance.current = new window.google.maps.Map(mapRef.current, {
					center: DEFAULT_CENTER,
					zoom: 18,
					mapTypeControl: true,
					streetViewControl: true,
					fullscreenControl: true,
					zoomControl: true,
				});

				console.log('지도 초기화 성공');

				if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
					markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
						map: mapInstance.current,
						position: DEFAULT_CENTER,
					});
				} else {
					markerRef.current = new window.google.maps.Marker({
						position: DEFAULT_CENTER,
						map: mapInstance.current,
					});
				}
				setMapLoaded(true);
			} catch (err) {
				console.error('지도 초기화 실패:', err);
				setError('지도를 초기화하는데 실패했습니다.');
			}
		});

		return () => {
			window.initMap = undefined;
		};
	}, []);

	useEffect(() => {
		if (!mapLoaded || !mapInstance.current) return;
		const fetchAndRender = () => {
			const bounds = mapInstance.current.getBounds();
			if (!bounds) return;
			fetch(`http://localhost:8000/map/pins`)
				.then((res) => res.json())
				.then((data) => {
					setSmokingZones(data); 
				});
		};
		fetchAndRender();
		const listener = mapInstance.current.addListener('idle', fetchAndRender);
		return () => window.google.maps.event.removeListener(listener);
	}, [mapLoaded]);

	useEffect(() => {
		if (!mapInstance.current) return;
		zoneMarkers.forEach((m) => m.setMap(null));
		const newMarkers = smokingZones.map((zone) => {
			const color = getMarkerColor(zone);
			const marker = new window.google.maps.Marker({
				position: { lat: zone.latitude, lng: zone.longitude },
				map: mapInstance.current,
				icon: {
					url: `data:image/svg+xml;charset=UTF-8,${svgString(color)}`,
					scaledSize: new window.google.maps.Size(36, 36),
					anchor: new window.google.maps.Point(18, 36),
				},
			});
			const infoWindow = new window.google.maps.InfoWindow({
				content: document.createElement('div'),
				maxWidth: 320,
			});
			const infoContent = document.createElement('div');
			infoWindow.setContent(infoContent);
			const handleNavigate = () => {
				window.open(`https://map.naver.com/v5/directions/-/-/-/walk?c=15.00,0,0,0,dh`, '_blank');
			};
			const handleClose = () => {
				infoWindow.close();
				navigate('/cancelApplication');
			};
			const root = createRoot(infoContent);
			root.render(
				<InfoWindowContent
					title={zone.title}
					inside={zone.inside}
					has_chair={zone.chair}
					has_shade={zone.shade}
					onNavigate={handleNavigate}
					onClose={handleClose}
					photo_url={zone.photo_url}
				/>
			);

			let isOpen = false;
			marker.addListener('click', () => {
				if (isOpen) {
					infoWindow.close();
					isOpen = false;
				} else {
					infoWindow.open({ anchor: marker, map: mapInstance.current });
					isOpen = true;
					window.google.maps.event.addListenerOnce(infoWindow, 'closeclick', () => {
						isOpen = false;
					});
				}
			});
			return marker;
		});
		setZoneMarkers(newMarkers);
	}, [smokingZones, navigate]);

	const handleCurrentLocation = () => {
		if (!window.google || !window.google.maps || !mapInstance.current) {
			console.error('Google Maps가 아직 로드되지 않았습니다.');
			return;
		}
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					console.log('위치 정보 획득 성공:', position);
					const pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					mapInstance.current.setCenter(pos);
					if (markerRef.current) {
						if (markerRef.current.setMap) markerRef.current.setMap(null);
						if (markerRef.current.map) markerRef.current.map = null;
					}
					if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
						markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
							map: mapInstance.current,
							position: pos,
							content: (() => {
								const img = document.createElement('img');
								img.src = NLoca;
								img.style.width = '18px';
								img.style.height = '18px';
								return img;
							})(),
						});
					} else {
						markerRef.current = new window.google.maps.Marker({
							position: pos,
							map: mapInstance.current,
							icon: {
								url: NLoca,
								scaledSize: new window.google.maps.Size(18, 18),
							},
							animation: window.google.maps.Animation.DROP,
						});
					}
					setPulsePos(pos);
				},
				(error) => {
					console.error('위치 정보 획득 실패:', error);
					switch (error.code) {
						case error.PERMISSION_DENIED:
							alert('위치 정보 사용이 거부되었습니다.');
							break;
						case error.POSITION_UNAVAILABLE:
							alert('위치 정보를 사용할 수 없습니다.');
							break;
						case error.TIMEOUT:
							alert('위치 정보 요청이 시간 초과되었습니다.');
							break;
						default:
							alert('알 수 없는 오류로 위치 정보를 가져올 수 없습니다.');
							break;
					}
				}
			);
		} else {
			console.error('이 브라우저는 위치 정보를 지원하지 않습니다.');
			alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
		}
	};

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
		<div className="map-container">
			{error && (
				<div className="map-error">
					<p>{error}</p>
					<p>API Key: {GOOGLE_MAP_API_KEY ? '설정됨' : '설정되지 않음'}</p>
				</div>
			)}
			<div 
				ref={mapRef} 
				id="map" 
				className="map" 
				style={{ 
					width: '100%', 
					height: '100%',
					position: 'absolute',
					top: 0,
					left: 0
				}} 
			/>
			<button
				className="current-place-wrapper"
				onClick={handleCurrentLocation}
				disabled={!mapLoaded}
				style={{ zIndex: 1001 }}
			>
				<img src={x651} alt="현재 위치 아이콘" className="element" />
			</button>
			<MarkerLegend />
		</div>
	);
};

export default GoogleMap; 