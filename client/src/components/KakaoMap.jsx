

import { useEffect } from "react";

function KakaoMap() {
  useEffect(() => {
    const scriptId = "kakao-map-sdk";

    const initMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(36.6283, 127.457), // 충북대 근처 좌표
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(36.6283, 127.457),
      });
      marker.setMap(map);
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=263c5feade5ae20228f44bb2d4079e62";
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(initMap);
        }
      };
      document.head.appendChild(script);
    } else {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initMap);
      }
    }
  }, []);

  return (
    <div style={{ flex: 1 }}>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
}

export default KakaoMap;