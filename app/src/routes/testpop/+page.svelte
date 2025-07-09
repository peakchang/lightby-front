<script>
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let message = $state("??????");

    onMount(() => {
        if (browser) {
            // 부모 창이 존재하는지 확인
            if (window.opener && !window.opener.closed) {
                console.log("부모 페이지 있음!!!");
                message = "부모 페이지 있음!!!";

                setTimeout(() => {
                    // 부모 페이지로 메시지 전송
                    window.opener.postMessage(
                        {
                            status: true,
                            message: "씨발 메세지 보냈다고!!!!!!!!!",
                        },
                        window.location.origin,
                    ); // 같은 도메인이면 origin 사용
                },500);
            }
        }
    });

    function testFunc() {
        console.log("aslfdjaslidfj");
    }
</script>

sadfjliasjdflajsdflijasdf

<div>
    <button on:click={testFunc}> {message}</button>
</div>
