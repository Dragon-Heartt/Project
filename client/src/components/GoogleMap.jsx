import React, { useEffect, useRef, useState } from 'react';
import x651 from '../assets/65-1.png';
import NLoca from '../assets/NowLocation.png';
import './GoogleMap.css'; // 기존 스타일 재사용

// API 키를 직접 설정 (임시 해결책)
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

const GoogleMap = () => {
	const mapRef = useRef(null);
	const mapInstance = useRef(null);
	const markerRef = useRef(null);
	const pulseRef = useRef(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [error, setError] = useState(null);

	// smoking zones state
	const [smokingZones, setSmokingZones] = useState([]); // DB에서 불러온 흡연구역 목록
	const [zoneMarkers, setZoneMarkers] = useState([]); // 지도에 표시된 마커 객체들

	// 현재 위치 pulse overlay 관리
	const [pulsePos, setPulsePos] = useState(null);

	useEffect(() => {
		if (!GOOGLE_MAP_API_KEY) {
			setError('Google Maps API 키가 설정되지 않았습니다.');
			return;
		}

		console.log('API Key:', GOOGLE_MAP_API_KEY); // API 키 확인용 로그

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

				// 기본 마커 (AdvancedMarkerElement 사용)
				if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
					markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
						map: mapInstance.current,
						position: DEFAULT_CENTER,
					});
				} else {
					// fallback: 기존 Marker (구버전 브라우저 호환)
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

		// cleanup
		return () => {
			window.initMap = undefined;
		};
	}, []);

	// 지도 뷰포트(화면) 변경 시마다 마커 fetch
	useEffect(() => {
		if (!mapLoaded || !mapInstance.current) return;
		const fetchAndRender = () => {
			const bounds = mapInstance.current.getBounds();
			if (!bounds) return;
			const ne = bounds.getNorthEast();
			const sw = bounds.getSouthWest();
			// TODO: 실제 백엔드 엔드포인트/파라미터에 맞게 수정
			// ex) /api/smoking-zones?nelat=...&nelng=...&swlat=...&swlng=...
			fetch(`http://localhost:8000/map/pins`)
				.then((res) => res.json())
				.then((data) => {
					setSmokingZones(data); // [{id, lat, lng, inside, chair, shadow, ...}]
				});
		};
		fetchAndRender();
		const listener = mapInstance.current.addListener('idle', fetchAndRender);
		return () => window.google.maps.event.removeListener(listener);
	}, [mapLoaded]);

	// smokingZones가 바뀔 때마다 마커 렌더링
	useEffect(() => {
		if (!mapInstance.current) return;
		// 기존 마커 제거
		zoneMarkers.forEach((m) => m.setMap(null));
		// 새 마커 생성
		const newMarkers = smokingZones.map((zone) => {
			const color = getMarkerColor(zone); // zone: {inside, chair, shadow, ...}
			const marker = new window.google.maps.Marker({
				position: { lat: zone.latitude, lng: zone.longitude }, // DB 필드명에 맞게 수정
				map: mapInstance.current,
				icon: {
					path: window.google.maps.SymbolPath.CIRCLE,
					scale: 10,
					fillColor: color,
					fillOpacity: 1,
					strokeWeight: 1,
					strokeColor: '#333',
				},
			});
			// 마커 클릭 시 info window 등 추가 가능
			const infoWindow = new window.google.maps.InfoWindow({
				content: `
					<div class="info-window-content">
						<div class="place-title">${zone.name}</div>
						<div class="place-type">
							<div>• 장소 유형: ${zone.type}</div>
							<div>• 의자: ${zone.hasChair ? '있음' : '없음'}</div>
							<div>• 차양막: ${zone.hasShade ? '있음' : '없음'}</div>
						</div>
						<div class="button-row">
							<button id="navigate-button-${zone.id}" class="navigate-btn">길찾기</button>
							<button id="cancel-button-${zone.id}" class="cancel-btn">신청 취소하기</button>
						</div>
					</div>
				`,
			});

			marker.addListener("click", () => {
				infoWindow.open({
					anchor: marker,
					map: mapInstance.current,
					shouldFocus: false,
				});

				window.google.maps.event.addListenerOnce(infoWindow, "domready", () => {
					const navigateButton = document.getElementById(`navigate-button-${zone.id}`);
					const cancelButton = document.getElementById(`cancel-button-${zone.id}`);

					if (navigateButton) {
						navigateButton.addEventListener("click", () => {
							if (!navigator.geolocation) {
								alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
								return;
							}

							const options = {
								enableHighAccuracy: true,
								timeout: 10000,
								maximumAge: 0
							};

							navigator.geolocation.getCurrentPosition(
								(position) => {
									const origin = {
										lat: position.coords.latitude,
										lng: position.coords.longitude,
									};
									const destination = {
										lat: zone.latitude,
										lng: zone.longitude,
									};

									const directionsService = new window.google.maps.DirectionsService();
									const directionsRenderer = new window.google.maps.DirectionsRenderer({
										map: mapInstance.current,
										suppressMarkers: true,
										polylineOptions: {
											strokeColor: "#FF0000",
											strokeWeight: 5,
										},
									});

									directionsService.route(
										{
											origin,
											destination,
											travelMode: window.google.maps.TravelMode.WALKING,
										},
										(result, status) => {
											if (status === "OK") {
												directionsRenderer.setDirections(result);
											} else {
												alert("경로를 찾을 수 없습니다: " + status);
											}
										}
									);
								},
								(error) => {
									switch(error.code) {
										case error.PERMISSION_DENIED:
											alert("위치 정보 접근 권한이 거부되었습니다. 브라우저 설정에서 위치 정보 접근을 허용해주세요.");
											break;
										case error.POSITION_UNAVAILABLE:
											alert("위치 정보를 사용할 수 없습니다.");
											break;
										case error.TIMEOUT:
											alert("위치 정보 요청 시간이 초과되었습니다.");
											break;
										default:
											alert("위치 정보를 가져오는 중 오류가 발생했습니다.");
											break;
									}
								},
								options
							);
						});
					}

					if (cancelButton) {
						cancelButton.addEventListener("click", () => {
							infoWindow.close();
						});
					}
				});
			});
			return marker;
		});
		setZoneMarkers(newMarkers);
	}, [smokingZones]);

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
		</div>
	);
};

export default GoogleMap; 