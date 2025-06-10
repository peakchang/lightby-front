<script>
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { goto } from "$app/navigation";
    import { back_api, public_img_bucket } from "$lib/const.js";
    import PdButton from "$lib/components/PdButton.svelte";

    let { data } = $props();

    let siteList = $state(data.siteList);

    let selectedSite = $state("전국");
    let locationList = $derived([
        "전국",
        "서울/경기/인천",
        "충청/전라",
        "강원/경상/제주",
    ]);

    let loading = $state(true);

    const businessReplaceDict = $derived({
        도시형생활주택: "도생",
        지식산업센터: "지산",
    });

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

    function goToDetail(idx) {
        goto(`/detail/${idx}`);
    }

    $effect(() => {
        setTimeout(() => {
            loading = false;
        }, 0);

        return () => {};
    });

    function multiReplace(str, map) {
        const regex = new RegExp(Object.keys(map).join("|"), "g");
        return str.replace(regex, (match) => map[match]);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class="pt-20 pb-32 suit-font px-3">
    <div>
        <ul
            class="grid grid-cols-3 md:grid-cols-4 gap-x-5 md:gap-x-2 gap-y-1"
        >
            {#each locationList as site}
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <li
                    class="text-center text-xs py-1.5 px-2 rounded-full border border-gray-500 text-gray-500 cursor-pointer"
                    class:bg-[#0669f8]={selectedSite == site}
                    class:text-white={selectedSite == site}
                    class:border-white={selectedSite == site}
                    data-site={site}
                    on:click={(e) => {
                        selectedSite = e.target.dataset.site;
                        console.log(selectedSite);
                    }}
                >
                    {site}
                </li>
            {/each}
        </ul>
    </div>

    <div class="my-3 border border-gray-300 rounded-lg p-2">
        배너배너~~~~~
    </div>

    {#if loading}
        <div class="mt-20 text-center">
            <div>로딩중</div>
            <span class="loading loading-dots loading-xl"></span>
        </div>
    {:else}
        {#each siteList as site}
            <a
                href="/detail/{site.idx}"
                on:click|preventDefault={() => {
                    goToDetail(site.idx);
                }}
            >
                <div
                    class="border border-gray-300 rounded-lg p-2 shadow-sm cursor-pointer relative"
                >
                    <div class="absolute bottom-0 right-0 p-3 max-w-1/3">
                        <div class="w-full flex gap-1">
                            <div class="w-1/3 max-w-[30px] md:max-w-[45px]">
                                <img src="/icons/icon-change.png" alt="" />
                            </div>
                            <div class="w-1/3 max-w-[30px] md:max-w-[45px]">
                                <img src="/icons/icon-new.png" alt="" />
                            </div>
                            <div class="w-1/3 max-w-[30px] md:max-w-[45px]">
                                <img src="/icons/icon-one.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div
                        class="flex gap-3 md:gap-5 items-center border-b-gray-300"
                    >
                        <div
                            class="w-32 h-[100px] md:w-36 md:h-28 rounded-lg overflow-hidden flex-shrink-0"
                        >
                            {#if site.thumbnail}
                                <img
                                    src={`${public_img_bucket}${site.thumbnail}`}
                                    alt=""
                                    class="w-full h-full object-cover"
                                />
                            {/if}
                        </div>
                        <div
                            class="flex flex-col justify-around overflow-hidden"
                        >
                            <div
                                class="text-xs md:text-sm text-amber-800 truncate"
                            >
                                {site.point}
                            </div>

                            <div class="text-sm md:text-base truncate">
                                <span>{site.subject}</span>
                            </div>

                            <div>
                                <div>
                                    <div class="mb-1">
                                        <span
                                            class=" bg-[#0a0078] text-xs md:text-sm px-2 py-0.5 text-white rounded-md font-bold"
                                        >
                                            {site.fee_type}
                                            {site.fee}
                                        </span>
                                    </div>

                                    <div
                                        class="text-[10px] md:text-xs flex flex-wrap"
                                    >
                                        <span
                                            class="bg-[#3a86ff] px-1.5 py-0.5 text-white rounded-md mr-1"
                                        >
                                            {multiReplace(
                                                site.business,
                                                businessReplaceDict,
                                            )}
                                        </span>

                                        <span
                                            class="bg-[#3a86ff] px-2 py-0.5 text-white rounded-md mr-1"
                                        >
                                            {site.occupation}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        {/each}

        <a
            href="/detail/test"
            on:click|preventDefault={() => {
                // goToDetail(site.idx);
            }}
        >
            <div
                class="mt-5 mx-2 relative border border-gray-300 rounded-lg p-2 shadow-sm cursor-pointer"
            >
                <div class="flex justify-between items-center">
                    <div class="pl-4 max-w-[55%]">
                        <div class="text-xs md:text-sm text-amber-800 truncate">
                            청라 푸르지오 스타셀라 49 마지막 10세대
                        </div>
                        <div class="text-sm md:text-base">
                            청라 푸르지오 스타셀라 49
                        </div>
                    </div>

                    <div class=" max-w-[45%]">
                        <div class="mb-1 text-[10px]">
                            <span
                                class=" bg-[#0a0078] px-2 py-1 text-white rounded-md font-bold mr-1 inline-block"
                            >
                                팀 500
                            </span>
                            <span
                                class="bg-[#3a86ff] px-1.5 py-1 text-white rounded-md mr-1 inline-block"
                            >
                                아파트,오피스텔
                            </span>

                            <span
                                class="bg-[#3a86ff] px-2 py-1 text-white rounded-md mr-1 inline-block"
                            >
                                팀장,직원
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    {/if}
</div>

<style>
</style>
