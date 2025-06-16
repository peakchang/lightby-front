<!-- 메인 페이지 (+page.svelte) -->
<script>
    import { browser } from "$app/environment";

    let testval = $state("gogo");
    let popup;

    const user_id = "14";
    let amount = $state(11000);
    let order_name = $state("프리미엄 상품");

    function openPopup() {
        // URL 파라미터로 데이터 전달 (가장 심플!)
        popup = window.open(
            `/payments?user_id=${user_id}&order_name=${order_name}&amount=${amount}`,
            "popup",
            "width=550,height=670",
        );
    }

    let loading = $state(true);

    $effect(() => {
        if (loading) {
            window.addEventListener("message", (e) => {
                if (e.data.type === "PAYMENT_SUCCESS") {
                    console.log(e.data);
                }
            });

            loading = false;
        }
    });
</script>

<h1>메인 페이지</h1>
<p>전달할 데이터: {testval}</p>
<!-- svelte-ignore event_directive_deprecated -->
<button on:click={openPopup}>팝업 열기</button>
