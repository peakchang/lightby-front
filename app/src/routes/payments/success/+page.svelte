<script>
    import { browser } from "$app/environment";
    import { page } from "$app/stores";

    let countdown = $state(3);
    let paymentKey = $state("");
    paymentKey = $page.url.searchParams.get("paymentKey");

    $effect(() => {
        console.log("페이지는 들어옴?!?!");

        if (browser) {
            // 부모 창이 존재하는지 확인
            if (window.opener && !window.opener.closed) {
                console.log("부모 페이지 있음!!!");

                // 결제 정보 수집 (URL 파라미터, 서버에서 전달된 데이터 등)
                const paymentInfo = {
                    payment_key: paymentKey,
                };

                console.log("보내자고!!!!!!!!!!!!!!!");

                // 부모 페이지로 메시지 전송
                window.opener.postMessage(
                    {
                        status: true,
                        paymentInfo: paymentInfo,
                    },
                    window.location.origin,
                ); // 같은 도메인이면 origin 사용

                // 잠시 후 팝업 닫기 (사용자가 확인할 시간 제공)
                const countdownInterval = setInterval(() => {
                    countdown--;
                    console.log(countdown);

                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        window.close();
                    }
                }, 1000);

                // orderId=order_12&paymentKey=taedp20250615162321MXTw8&amount=11000
            } else {
                alert("에러에러에러!!!");
                console.log("부모 페이지 없음 ㅠㅠ");
            }
        }
    });

    function getOrderIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("orderId");
    }
</script>

<div class="suit-font pt-18 text-center">

    <div class=" text-3xl font-bold">결제가 완료 되었습니다.</div>
    <div class=" text-7xl mt-8 text-green-600">
        <i class="fa fa-check-circle" aria-hidden="true"></i>
    </div>
    <div class="text-lg mt-8">
        {countdown}초 뒤 결제 완료 페이지로 돌아갑니다.
    </div>
    <span class="loading loading-ring loading-xl mt-8"></span>
</div>
