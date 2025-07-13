<script>
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { back_api, public_img_bucket } from "$lib/const.js";
    import PdButton from "$lib/components/PdButton.svelte";
    import { main_location, loadingStore } from "$lib/stores/stores.js";
    import { browser } from "$app/environment";

    import { navigating } from "$app/stores";
    import { onDestroy, onMount } from "svelte";

    let { data } = $props();

    let premiumList = $state([]);
    let topList = $state([]);
    let siteList = $state([]);
    let searchModal = $state(false);

    let locationList = $derived([
        "전국",
        "서울/경기/인천",
        "충청/전라",
        "강원/경상/제주",
    ]);

    const businessReplaceDict = $derived({
        도시형생활주택: "도생",
        지식산업센터: "지산",
        "상가/쇼핑몰": "상가",
    });

    const bannerList = ["banner-1.jpg", "banner-2.jpg", "banner-3.jpg"];

    let bannerInterval;
    let nowBanner = $state(bannerList[0]);

    onMount(() => {
        bannerInterval = setInterval(() => {
            const currentIndex = bannerList.indexOf(nowBanner);
            const nextIndex = (currentIndex + 1) % bannerList.length;
            nowBanner = bannerList[nextIndex];
        }, 2500); // 예: 3초마다 변경
    });

    onDestroy(() => {
        clearInterval(bannerInterval);
    });

    $effect(() => {
        premiumList = data.premiumList;
        topList = data.topList;
        siteList = data.siteList;

        setTimeout(() => {
            $loadingStore = false;
        }, 500);

        return () => {};
    });

    function goToDetail(idx) {
        goto(`/detail/${idx}`);
    }

    function multiReplace(str, map) {
        const regex = new RegExp(Object.keys(map).join("|"), "g");
        return str.replace(regex, (match) => map[match]);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class="pt-20 pb-32 suit-font px-3">
    <div class=" border border-gray-300 rounded-lg p-2">
        <img src={`/banners/${nowBanner}`} alt="" />
    </div>

    <div class="my-3">
        <ul class="grid grid-cols-3 md:grid-cols-4 gap-x-5 md:gap-x-2 gap-y-1">
            {#each locationList as location}
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <li
                    class="text-center text-xs py-1.5 px-2 rounded-full border border-gray-500 text-gray-500 cursor-pointer"
                    class:bg-[#0669f8]={$main_location == location}
                    class:text-white={$main_location == location}
                    class:border-white={$main_location == location}
                    data-location={location}
                    on:click={(e) => {
                        $main_location = e.target.dataset.location;
                        $main_location = $main_location;
                        localStorage.setItem("location", $main_location);
                        invalidateAll();
                        $loadingStore = true;
                    }}
                >
                    {location}
                </li>
            {/each}
        </ul>
    </div>

    <div class="premium-area mb-10">
        <!-- 프리미엄 영역 -->
        <div
            class="mb-3 ml-6 text-lg font-bold text-cyan-700 flex items-center"
        >
            <span class="mr-2">
                <i class="fa fa-bell" aria-hidden="true"></i>
            </span>
            <span class="mr-4">프리미엄</span>
            <div
                class=" w-[50%] md:w-[40%] rounded-full"
                style="height: 2px; background-color: #007595;"
            ></div>
        </div>
        {#each premiumList as value}
            <a
                href="/detail/{value.idx}"
                on:click|preventDefault={() => {
                    goToDetail(value.idx);
                }}
            >
                <div
                    class="border border-gray-300 rounded-lg p-2 mb-3 shadow-sm cursor-pointer relative"
                >
                    <div class="absolute bottom-0 right-0 p-3">
                        {#if value.icons}
                            <div class="w-full flex justify-end gap-1">
                                {#each value.icons.split(",") as icon}
                                    <div
                                        class="w-1/3 max-w-[45px] md:max-w-[55px]"
                                    >
                                        <img
                                            src="/icons/icon-{icon}.png"
                                            alt=""
                                        />
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                    <div
                        class="flex gap-3 md:gap-5 items-center border-b-gray-300"
                    >
                        <div
                            class="w-32 h-[100px] md:w-36 md:h-28 rounded-lg overflow-hidden flex-shrink-0"
                        >
                            {#if value.thumbnail}
                                <img
                                    src={`${public_img_bucket}${value.thumbnail}`}
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
                                {value.point}
                            </div>

                            <div class="text-sm md:text-base truncate">
                                <span>{value.subject}</span>
                            </div>

                            <div>
                                <div>
                                    <div class="mb-1">
                                        <span
                                            class=" bg-[#0a0078] text-xs md:text-sm px-2 py-0.5 text-white rounded-md font-bold"
                                        >
                                            {value.fee_type}
                                            {value.fee}
                                        </span>
                                    </div>

                                    <div
                                        class="text-[10px] md:text-xs flex flex-wrap"
                                    >
                                        <span
                                            class="bg-[#3a86ff] px-1.5 py-0.5 text-white rounded-md mr-1"
                                        >
                                            {multiReplace(
                                                value.business,
                                                businessReplaceDict,
                                            )}
                                        </span>

                                        <span
                                            class="bg-[#3a86ff] px-2 py-0.5 text-white rounded-md mr-1"
                                        >
                                            {value.occupation}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>

    <div class="top-area mb-10">
        <!-- 지역탑 영역 -->
        <div
            class="mb-3 ml-6 text-lg font-bold text-cyan-700 flex items-center"
        >
            <span class="mr-2">
                <i class="fa fa-bell" aria-hidden="true"></i>
            </span>
            <span class="mr-4">지역 TOP</span>
            <div
                class=" w-[50%] md:w-[40%] rounded-full"
                style="height: 2px; background-color: #007595;"
            ></div>
        </div>
        {#each topList as value}
            <a
                href="/detail/{value.idx}"
                on:click|preventDefault={() => {
                    goToDetail(value.idx);
                }}
            >
                <div
                    class="border border-gray-300 rounded-lg p-2 mb-3 shadow-sm cursor-pointer relative"
                >
                    <div class="absolute bottom-0 right-0 p-3 max-w-1/3">
                        {#if value.icons}
                            <div class="w-full flex justify-end gap-1">
                                {#each value.icons.split(",") as icon}
                                    <div
                                        class="w-1/3 max-w-[45px] md:max-w-[55px]"
                                    >
                                        <img
                                            src="/icons/icon-{icon}.png"
                                            alt=""
                                        />
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                    <div
                        class="flex gap-3 md:gap-5 items-center border-b-gray-300"
                    >
                        <div
                            class="w-32 h-[100px] md:w-36 md:h-28 rounded-lg overflow-hidden flex-shrink-0"
                        >
                            {#if value.thumbnail}
                                <img
                                    src={`${public_img_bucket}${value.thumbnail}`}
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
                                {value.point}
                            </div>

                            <div class="text-sm md:text-base truncate">
                                <span>{value.subject}</span>
                            </div>

                            <div>
                                <div>
                                    <div class="mb-1">
                                        <span
                                            class=" bg-[#0a0078] text-xs md:text-sm px-2 py-0.5 text-white rounded-md font-bold"
                                        >
                                            {value.fee_type}
                                            {value.fee}
                                        </span>
                                    </div>

                                    <div
                                        class="text-[10px] md:text-xs flex flex-wrap"
                                    >
                                        <span
                                            class="bg-[#3a86ff] px-1.5 py-0.5 text-white rounded-md mr-1"
                                        >
                                            {multiReplace(
                                                value.business,
                                                businessReplaceDict,
                                            )}
                                        </span>

                                        <span
                                            class="bg-[#3a86ff] px-2 py-0.5 text-white rounded-md mr-1"
                                        >
                                            {value.occupation}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>

    <div>
        <!-- 지역탑 영역 -->
        <div
            class="mb-3 ml-6 text-lg font-bold text-cyan-700 flex items-center"
        >
            <span class="mr-2">
                <i class="fa fa-bell" aria-hidden="true"></i>
            </span>
            <span class="mr-4">일반 공고</span>
            <div
                class=" w-[50%] md:w-[40%] rounded-full"
                style="height: 2px; background-color: #007595;"
            ></div>
        </div>

        {#each siteList as value}
            <a
                href="/detail/test"
                on:click|preventDefault={() => {
                    goToDetail(value.idx);
                }}
            >
                <div
                    class="mt-5 relative border border-gray-300 rounded-lg p-2 shadow-sm cursor-pointer"
                >
                    <div class="flex justify-between items-center">
                        <div class="pl-4 max-w-[55%]">
                            <div
                                class="text-xs md:text-sm text-amber-800 truncate"
                            >
                                {value.point}
                            </div>
                            <div class="text-sm md:text-base">
                                {value.subject}
                            </div>
                        </div>

                        <div class=" max-w-[45%]">
                            <div class="mb-1 text-[10px] flex flex-wrap gap-1">
                                <span
                                    class=" bg-[#0a0078] px-2 py-1 text-white rounded-md font-bold inline-block"
                                >
                                    {value.fee_type}
                                    {value.fee}
                                </span>
                                <span
                                    class="bg-[#3a86ff] px-1.5 py-1 text-white rounded-md inline-block"
                                >
                                    {multiReplace(
                                        value.business.split(",")[0],
                                        businessReplaceDict,
                                    )}
                                </span>

                                <span
                                    class="bg-[#3a86ff] px-2 py-1 text-white rounded-md inline-block"
                                >
                                    {value.occupation.split(",")[0]}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>

<style>
</style>
