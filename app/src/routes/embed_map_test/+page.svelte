<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    let map;

    onMount(() => {
        if (!browser) return;

        const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS;

        // 카카오맵 스크립트 로드
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`;
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
                // 지도 옵션
                const options = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 좌표
                    level: 3, // 확대 레벨
                };

                const mapContainer = document.querySelector('.map-container')
                console.log(mapContainer);
                
                

                // 지도 생성
                map = new window.kakao.maps.Map(mapContainer, options);
            });
        };

        document.head.appendChild(script);

        // 클린업
        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    });
</script>

<div class="container">
    <h1>카카오맵 예제</h1>
    <div class="map map-container"></div>
</div>

<style>
    .container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    h1 {
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: bold;
    }

    .map {
        width: 100%;
        height: 500px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
</style>
