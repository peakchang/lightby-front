<script>
    import { goto } from "$app/navigation";
    import PdButton from "$lib/components/PdButton.svelte";

    let { data } = $props();

    let siteList = $state(data.siteList);

    console.log(siteList);

    let selectedSite = $state("전국");
    let locationList = $derived([
        "전국",
        "서울/경기/인천",
        "충청/전라",
        "강원/경상/제주",
    ]);

    let loading = $state(true);

    // let siteList = $state([
    //     {
    //         one: "민간임대 3주 한방현장 OPEN",
    //         subject: "정읍 월드메르디앙 더 브리온",
    //         fee: "팀 700만원",
    //         types: ["팀장", "아파트", "일비,숙소"],
    //     },

    //     {
    //         one: "작년 완판된 장안 대방보다 저렴한 APT",
    //         subject: "장안 우미린 프리미어",
    //         fee: "직원 440만원",
    //         types: ["직원", "아파텔", "일비"],
    //     },
    //     {
    //         one: "일비 10만원 월300가능 계약금0원 다구좌가능",
    //         subject: "반달섬 아르네브 큐브",
    //         fee: "팀 1500",
    //         types: ["직원", "오피스텔", "일비"],
    //     },
    // ]);

    function goToDetail(){
        goto(`/detail/test`)
    }

    $effect(() => {
        setTimeout(() => {
            loading = false;
        }, 0);

        return () => {};
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class="pt-16 pb-32 suit-font" on:click={goToDetail}>
    <div>
        <ul
            class="grid grid-cols-3 md:grid-cols-4 gap-x-5 md:gap-x-2 gap-y-1 px-4"
        >
            {#each locationList as site}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <!-- svelte-ignore event_directive_deprecated #62C15B -->
                <li
                    class="text-center text-xs py-1.5 px-2 rounded-full border border-gray-500 text-gray-500 cursor-pointer"
                    class:bg-[#0669f8]={selectedSite == site}
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
        {#each siteList as site}
            <div class="mt-5 px-3 relative">
                <div class="absolute bottom-0 right-0 p-3 max-w-1/3">
                    <div class="w-full flex gap-1">
                        <div class="w-1/3 max-w-[45px]">
                            <img src="/icons/icon-change.png" alt="" />
                        </div>
                        <div class="w-1/3 max-w-[45px]">
                            <img src="/icons/icon-new.png" alt="" />
                        </div>
                        <div class="w-1/3 max-w-[45px]">
                            <img src="/icons/icon-one.png" alt="" />
                        </div>
                    </div>
                </div>
                <div class="flex gap-5 pb-3 border-b border-b-gray-300">
                    <div class=" w-36 h-32 rounded-lg overflow-hidden">
                        {#if site.thumbnail}
                            <img
                                src={`https://storage.cloud.google.com/img-bucket1-250525/${site.thumbnail}`}
                                alt=""
                            />
                        {/if}
                    </div>
                    <div class="flex flex-col justify-around">
                        <div class="text-sm text-amber-800">
                            {site.point}
                        </div>

                        <div>
                            <span>{site.subject}</span>
                        </div>

                        <div class="mb-1">
                            <span
                                class=" bg-[#0a0078] text-sm px-2 py-1 text-white rounded-md font-bold"
                            >
                                {site.fee_type}
                                {site.fee}
                            </span>
                        </div>

                        <div class="text-xs">
                            <span
                                class="bg-[#3a86ff] px-2 py-1 text-white rounded-sm mr-1"
                            >
                                {site.business}
                            </span>

                            <span
                                class="bg-[#3a86ff] px-2 py-1 text-white rounded-sm mr-1"
                            >
                                {site.occupation}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    {/if}
</div>

<style>
</style>
