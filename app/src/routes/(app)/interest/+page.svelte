<script>
    import { goto } from "$app/navigation";

    let tempArr = $state([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16,
    ]);

    function goToDetail() {
        goto(`/sitedetail/gogo`);
    }
</script>

<div class="z-50 suit-font" style="padding-top: 50px; padding-bottom:70px">
    {#each tempArr as temp}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore event_directive_deprecated -->
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
</div>
