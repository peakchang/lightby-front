<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { page } from "$app/stores";

    console.log($page);

    let { data } = $props();
    const clientKey = "test_gck_ex6BJGQOVDKvLWdjenWO3W4w2zNb"; // 상점을 특정하는 키

    let customerKey = $state("");
    let orderId = $state("");

    let amount = $state(0);
    let orderName = $state("");
    let customerName = $state("");

    let paymentWidget;

    const userId = $page.url.searchParams.get("user_id");
    orderId = `order_${userId}`;
    customerKey = data.customer_key;

    amount = $page.url.searchParams.get("amount");
    orderName = $page.url.searchParams.get("order_name");
    customerName = data.user_name;

    $effect(() => {
        if (browser) {
            paymentWidget = PaymentWidget(clientKey, customerKey); // 회원 결제
            // const paymentWidget = PaymentWidget(clientKey, PaymentWidget.ANONYMOUS) // 비회원 결제
            const paymentMethods = paymentWidget.renderPaymentMethods(
                "#payment-method",
                amount,
            );

            const paymentAgreement =
                paymentWidget.renderAgreement("#agreement");
        }
    });

    async function tossPay() {
        paymentWidget
            .requestPayment({
                orderId: orderId,
                orderName: orderName,
                // successUrl: "http://localhost:5173/payments/success",
                // failUrl: "http://localhost:5173/payments/fail",
                successUrl: `${$page.url.origin}/payments/success`,
                failUrl: `${$page.url.origin}/payments/fail`,
                // customerEmail: "customer123@gmail.com",
                customerName: customerName,
            })
            .catch(function (error) {
                if (error.code === "USER_CANCEL") {
                    // 결제 고객이 결제창을 닫았을 때 에러 처리
                    console.log("어디에 나올까?");
                }
                if (error.code === "INVALID_CARD_COMPANY") {
                    // 유효하지 않은 카드 코드에 대한 에러 처리
                }
            });
    }
</script>

<svelte:head>
    <script src="https://js.tosspayments.com/v1/payment-widget"></script>
</svelte:head>

<!-- 결제 방법 영역-->

<div class=" max-w-680 px-2 mt-5 suit-font">
    <div class="title">결제 방법</div>
    <div id="payment-method"></div>
    <div id="agreement"></div>
    <!-- svelte-ignore event_directive_deprecated -->
    <button id="payment-button" class="cursor-pointer" on:click={tossPay}>
        결제하기
    </button>
</div>

<style>
    #payment-button {
        width: 100%;
        padding: 15px;
        background-color: #3065ac;
        color: white;
        border-radius: 10px;
        font-size: 18px;
        border: none;
        margin-top: 10px;
    }
    .title {
        text-align: center;
        margin: 0 0 4px;
        font-size: 24px;
        font-weight: 600;
        color: #4e5968;
    }
</style>
