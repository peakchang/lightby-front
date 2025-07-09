<!-- 부모 창 (간단 버전) -->
<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    let popupWindow = null;
    let receivedData = null;

    onMount(() => {
        // postMessage 이벤트 리스너 등록
        if (browser) {
            window.addEventListener("message", handleMessage);
        }
    });

    onDestroy(() => {
        if (browser) {
            // 이벤트 리스너 정리
            window.removeEventListener("message", handleMessage);
        }

        // 팝업창이 열려있다면 닫기
        if (popupWindow && !popupWindow.closed) {
            popupWindow.close();
        }
    });

    function openPopup() {
        const popupUrl = "/testpop"; // 팝업 페이지 URL
        const popupOptions =
            "width=500,height=400,scrollbars=yes,resizable=yes";

        popupWindow = window.open(popupUrl, "popup", popupOptions);

        // 팝업이 닫혔는지 체크
        const checkClosed = setInterval(() => {
            if (popupWindow && popupWindow.closed) {
                clearInterval(checkClosed);
                popupWindow = null;
                console.log("팝업창이 닫혔습니다");
            }
        }, 1000);
    }

    function handleMessage(event) {
        // 보안을 위해 origin 체크 (개발 환경에서는 주석 처리)
        // if (event.origin !== 'http://localhost:5173') return;

        if (event.data && event.data.type === "POPUP_DATA") {
            receivedData = event.data.payload;
            console.log("팝업에서 받은 데이터:", receivedData);

            // 데이터 처리
            processData(receivedData);

            // 팝업창 닫기
            if (popupWindow && !popupWindow.closed) {
                popupWindow.close();
                popupWindow = null;
            }
        }

        if (event.data && event.data.type === "POPUP_CLOSED") {
            console.log("팝업이 닫혔습니다");
            popupWindow = null;
        }
    }

    function processData(data) {
        // 실제 데이터 처리 로직
        alert(`처리된 데이터: ${JSON.stringify(data)}`);
    }

    function sendMessageToPopup() {
        if (popupWindow && !popupWindow.closed) {
            popupWindow.postMessage(
                {
                    type: "PARENT_MESSAGE",
                    payload: { message: "부모에서 보낸 메시지" },
                },
                "*",
            );
        }
    }
</script>

<div>
    <h1>부모 페이지</h1>
    <button on:click={openPopup}>팝업 열기</button>
    <button
        on:click={sendMessageToPopup}
        disabled={!popupWindow || popupWindow.closed}
    >
        팝업에 메시지 보내기
    </button>

    {#if receivedData}
        <div class="result">
            <h3>받은 데이터:</h3>
            <pre>{JSON.stringify(receivedData, null, 2)}</pre>
        </div>
    {/if}
</div>

<style>
    .result {
        margin-top: 20px;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 5px;
    }

    pre {
        background: white;
        padding: 10px;
        border-radius: 3px;
        overflow-x: auto;
    }

    button {
        margin-right: 10px;
        padding: 10px 15px;
        cursor: pointer;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
