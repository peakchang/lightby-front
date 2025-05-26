<script>
    import PdButton from "$lib/components/PdButton.svelte";
    let selectedSite = $state("전국");
    let siteList = $derived([
        "전국",
        "서울/경기/인천",
        "충청/전라",
        "강원/경상/제주",
    ]);

    let loading = $state(true);

    $effect(() => {
        setTimeout(() => {
            loading = false;
        }, 0);
    });
</script>

<div class="pt-16 suit-font">
    <div>
        <ul
            class="grid grid-cols-3 md:grid-cols-4 gap-x-5 md:gap-x-2 gap-y-1 px-4"
        >
            {#each siteList as site}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <!-- svelte-ignore event_directive_deprecated -->
                <li
                    class="text-center text-xs py-1.5 px-2 rounded-full border border-gray-500 text-gray-500 cursor-pointer"
                    class:bg-[#62C15B]={selectedSite == site}
                    class:text-white={selectedSite == site}
                    class:border-white={selectedSite == site}
                    data-site={site}
                    on:click={(e) => {
                        console.log(e.target.getAttribute("data-site"));
                        selectedSite = e.target.getAttribute("data-site");
                    }}
                >
                    {site}
                </li>
            {/each}
        </ul>
    </div>

    {#if loading}
        <div class="mt-20 text-center">
            <div>로딩중</div>
            <span class="loading loading-dots loading-xl"></span>
        </div>
    {:else}
        <div class="mt-5 px-3">
            <div class="flex gap-5 pb-3 border-b border-b-gray-300">
                <div class=" w-36 h-32 rounded-lg overflow-hidden">
                    <img src="/sample_thumbnail-1.jpg" alt="" />
                </div>
                <div class="flex flex-col justify-around">
                    <div>
                        <span
                            class=" bg-green-600 text-xs px-2 py-1 text-white rounded-md"
                        >
                            아파트
                        </span>
                    </div>
                    <div>
                        <span>지젤 라이프 그라피 서초</span>
                    </div>
                    <div class="text-sm text-amber-800">
                        분양가 상한제 적용 / 최고 위치 및 입지
                    </div>

                    <div class="text-xs">
                        <span class="bg-amber-600 px-2 py-1 text-white">
                            팀장
                        </span>
                        <span class="bg-amber-600 px-2 py-1 text-white">
                            프로모션 20
                        </span>
                        <span class="bg-amber-600 px-2 py-1 text-white">
                            일비/숙소비
                        </span>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
</style>
