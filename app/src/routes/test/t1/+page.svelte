<!-- 메인 페이지 (+page.svelte) -->
<script>
    import { browser } from "$app/environment";
    import { goto, beforeNavigate } from "$app/navigation";

    $effect(() => {
        console.log('t1 페이지에 들어오는 거잖아?!');
        
        if (browser) {
            window.addEventListener("testfunc", testFunc);
        }

        return () => {
            console.log("t1 페이지 빠져나감!!");
            window.removeEventListener("testfunc", testFunc);
        };
    });

    beforeNavigate(() => {
        console.log('빠져나가기 전처리?!?!');
        
    })

    

    function testFunc() {
        console.log("asldifjlasjdflajfFD");
    }
</script>

<button
    on:click={() => {
        console.log("saldijfalsidjf");
    }}
>
    gogogogo
</button>
