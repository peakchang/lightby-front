<script>
    let {
        toastShow = 0,
        toastMessage = "토스트 메세지!!",
        toastAct,
    } = $props();
    // 토스트

    let toastArea = $state({});

    $effect(() => {
        setTimeout(() => {
            toastArea.classList.add("hidden");
        }, 3000);
        console.log(toastShow);
        if (toastShow == 1) {
            toastArea.classList.remove("hidden");
            setTimeout(() => {
                toastShow = 0;
                toastAct();
            }, 1800);

            setTimeout(() => {
                toastArea.classList.add("hidden");
            }, 2200);
        }
    });
</script>

<div
    id="toast"
    class="toast toast-center toast-bottom z-[9999999] opacity-{toastShow} suit-font"
    bind:this={toastArea}
>
    <div class="alert bg-red-500 text-white mb-20">
        <span>
            {toastMessage}
        </span>
    </div>
</div>
