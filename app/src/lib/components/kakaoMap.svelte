<script>
    const {
        getAddress,
        phText = "여기여기",
        height = "400px",
    } = $props();
    let kakao;
    let kakaomapArea = $state();

    $effect(() => {
        kakao = window.kakao;
        console.log(kakao);
        createMap();
    });

    async function createMap() {
        if (getAddress) {
            kakao.maps.load(() => {
                console.log("여기는 들어감?");

                var options = {
                    center: new kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3,
                };

                var map = new kakao.maps.Map(kakaomapArea, options);

                // 주소-좌표 변환 객체를 생성합니다
                var geocoder = new kakao.maps.services.Geocoder();

                // 주소로 좌표를 검색합니다
                geocoder.addressSearch(getAddress, function (result, status) {
                    console.log(result);
                    console.log(result[0]);

                    // 정상적으로 검색이 완료됐으면
                    if (status === kakao.maps.services.Status.OK) {
                        var coords = new kakao.maps.LatLng(
                            result[0].y,
                            result[0].x,
                        );

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
        }
    }
</script>

<svelte:head>
    <script
        type="text/javascript"
        defer
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=72689d54e68abd94260d9284c64d7545&libraries=services&autoload=false`}
    ></script>
</svelte:head>

{#if getAddress}
    <div style="width:100%; height:{height}" bind:this={kakaomapArea} />
{/if}
