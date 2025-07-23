<script>
    import { untrack } from 'svelte';
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { back_api, public_img_bucket } from "$lib/const.js";
    import PdButton from "$lib/components/PdButton.svelte";
    import {
        main_location,
        loadingStore,
        site_load_status,
        free_start_num,
        main_list,
    } from "$lib/stores/stores.js";
    import { browser } from "$app/environment";
    import { navigating } from "$app/stores";
    import { onDestroy, onMount } from "svelte";
    import JobPostItem from "$lib/components/JobPostItem.svelte";
    import { prev } from "$lib/stores/stores.js";

    let { data } = $props();
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

    const bannerList = $state(
        data.baseEnv.banners ? data.baseEnv.banners.split(",") : [],
    );

    let bannerInterval;
    let nowBanner = $state(bannerList[0]);

    onMount(() => {
        if (bannerList.length > 0) {
            bannerInterval = setInterval(() => {
                const currentIndex = bannerList.indexOf(nowBanner);
                const nextIndex = (currentIndex + 1) % bannerList.length;
                nowBanner = bannerList[nextIndex];
            }, 2500); // 예: 3초마다 변경
        }
    });

    onDestroy(() => {
        clearInterval(bannerInterval);
    });

    let loopBlock = true;
    // $effect(() => {
    //     console.log(data);

    //     if (data.currentStatus == "premium") {
    //         $main_list["premium"] = data.mainList;
    //     } else if (data.currentStatus == "top") {
    //         $main_list["top"] = data.mainList;
    //     } else if (
    //         data.currentStatus == "free" &&
    //         $main_list["free"].length == 0
    //     ) {
    //         $main_list["free"] = data.mainList;
    //     } else if (
    //         data.currentStatus == "free" &&
    //         $main_list["free"].length > 0
    //     ) {
    //         $main_list["free"] = [...$main_list["free"], ...data.mainList];
    //     }

    //     if ($loadingStore == true) {
    //         console.log("요기로!");

    //         setTimeout(() => {
    //             $loadingStore = false;
    //         }, 500);
    //     }
    // });

    let lastDataStatus = "";

    $effect.pre(() => {
        console.log(data);

        if (data.currentStatus == "premium") {
            $main_list["premium"] = data.mainList;
        } else if (data.currentStatus == "top") {
            $main_list["top"] = data.mainList;
        } else if (data.currentStatus == "free") {
            const currentFreeList = untrack(() => $main_list["free"]);
            $main_list["free"] = [...currentFreeList, ...data.mainList];
        }

        // if ($loadingStore == true) {
        //     console.log("요기로!");
        //     setTimeout(() => {
        //         $loadingStore = false;
        //     }, 500);
        // }
    });

    function multiReplace(str, map) {
        const regex = new RegExp(Object.keys(map).join("|"), "g");
        return str.replace(regex, (match) => map[match]);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class="pt-20 suit-font px-3">
    <button
        on:click={() => {
            invalidateAll();
        }}
    >
        gogogo
    </button>
    {#if bannerList.length > 0}
        <div class=" border border-gray-300 rounded-lg p-2">
            <img src={`${public_img_bucket}${nowBanner}`} alt="" />
        </div>
    {/if}

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
                        $site_load_status = "premium";
                        $free_start_num = 0;
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
        {#each $main_list["premium"] as value}
            <JobPostItem {value}></JobPostItem>
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
        {#each $main_list["top"] as value}
            <JobPostItem {value}></JobPostItem>
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

        {#each $main_list["free"] as value}
            <JobPostItem {value}></JobPostItem>
        {/each}
    </div>
</div>

<style>
</style>
