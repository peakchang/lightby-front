<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    let {
        getAddress,
        phText = "여기여기",
        height = "400px",
        tudeAct,
    } = $props();
    let mapStatus = $state(true);

    onMount(() => {
        if (!browser) return;

        const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS;

        // 카카오맵 스크립트 로드
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services&autoload=false`;
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
                // 지도 옵션
                var options = {
                    center: new kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3,
                };
                const mapContainer = document.querySelector("#map-area");

                // 지도 생성
                const map = new window.kakao.maps.Map(mapContainer, options);

                const geocoder = new window.kakao.maps.services.Geocoder();

                geocoder.addressSearch(getAddress, function (result, status) {
                    // 정상적으로 검색이 완료됐으면
                    if (status === kakao.maps.services.Status.OK) {
                        var coords = new kakao.maps.LatLng(
                            result[0].y,
                            result[0].x,
                        );

                        try {
                            tudeAct({ coords });
                        } catch (error) {}

                        // 결과값으로 받은 위치를 마커로 표시합니다
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: coords,
                        });

                        // 인포윈도우로 장소에 대한 설명을 표시합니다
                        var infowindow = new kakao.maps.InfoWindow({
                            content:
                                '<div style="width:150px;text-align:center;padding:3px 0; border-radius:10px;">' +
                                phText +
                                "</div>",
                        });
                        infowindow.open(map, marker);

                        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                        map.setCenter(coords);
                    } else {
                        mapStatus = false;
                    }
                });
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

<div class="">
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <div id="map-area" style="width:100%; height:{height}" />
</div>

<style>
</style>
