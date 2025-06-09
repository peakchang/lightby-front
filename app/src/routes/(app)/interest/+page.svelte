<script>
    import { goto } from "$app/navigation";

    let tabArea = $derived({});

    function changeTab(e) {
        for (const el of tabArea.children) {
            el.classList.remove("tab-active");
        }
        tabArea.children[e.target.dataset.num].classList.add("tab-active");
    }

</script>

<div class="pt-16 pb-32 suit-font">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore event_directive_deprecated -->
    <!-- <div class="tab-area cursor-pointer" bind:this={tabArea}>
        <div class="tab-active" data-num="0" on:click={changeTab}>관심 지역</div>
        <div data-num="1" on:click={changeTab}>찜한 목록</div>
        <div data-num="2" on:click={changeTab}>내 주변 현장</div>
    </div> -->
</div>

<!-- <div class="z-50 suit-font" style="padding-top: 50px; padding-bottom:70px">
    {#each tempArr as temp}
        <div
            class="flex gap-3 w-full px-3 py-2 cursor-pointer bg-white mb-1.5 rounded-md"
            on:click={goToDetail}
        >
            <div class="w-1/2">
                <img src="/sample_img1.jpg" alt="" />
            </div>
            <div class="w-1/2 flex flex-col justify-center items-center">
                <span class="bg-red-500 py-0.5 px-3 text-white font-bold"
                    >파격혜택제공!</span
                >
                <span>지젤라이프그라피서초</span>
                <span>경기 | 아파트 | 직원</span>
                <span>수수료 : 4,000</span>
            </div>
        </div>
    {/each}
</div> -->

<style>
    .tab-area {
        display: flex;
        justify-content: center;
        gap: 10%;
        color: #939393;
    }
    .tab-active {
        color: black;
        border-bottom: 3px solid black;
        padding-bottom: 5px;
    }
</style>
