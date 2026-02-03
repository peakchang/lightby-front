<script>
    /* 기존 import 및 로직 유지 */
    import { fly, fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { untrack, onMount, onDestroy } from "svelte";
    import { invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import { public_img_bucket } from "$lib/const.js";
    import {
        search_val,
        loadingStore,
        main_list,
        sort_val,
        pageScrollStatus,
    } from "$lib/stores/stores.js";

    import JobPostItemList from "$lib/components/JobPostItemList.svelte";

    let { data, goToDetail, containerClass = "max-w-5xl" } = $props();

    let mainSearchHistory = $state([]);
    let searchInput;
    let searchFocus = $state(false);
    let bannerInterval;
    let nowBannerIdx = $state(0);

    // 필터 관련
    let showFilter = $state(false);
    const sortOptions = [
        { name: "기본순", value: "base" },
        { name: "수수료 높은순", value: "high_fee" },
        { name: "최신등록순", value: "latest" },
        { name: "조회많은순", value: "popular" },
    ];

    function selectSort(opt) {
        $sort_val = opt.value;
        showFilter = false;
        console.log($sort_val);
        sessionStorage.setItem("sort_val", $sort_val);
        invalidateAll();
        $loadingStore = true;

        // 여기서 정렬 로직 실행 (invalidateAll 등)
    }

    const bannerList = $derived(
        data.baseEnv?.banners ? data.baseEnv.banners.split(",") : [],
    );
    const bannerLinkList = $derived(
        data.baseEnv?.banner_links ? data.baseEnv.banner_links.split(",") : [],
    );

    onMount(() => {
        $pageScrollStatus = true;
        if (bannerList.length > 0) {
            bannerInterval = setInterval(() => {
                nowBannerIdx = (nowBannerIdx + 1) % bannerList.length;
            }, 3500); // 간격을 조금 더 여유있게 조정
        }
    });

    onDestroy(() => clearInterval(bannerInterval));

    function searchFunc() {
        sessionStorage.setItem("search_val", $search_val);
        // if (!$search_val.trim()) return;

        if (!mainSearchHistory.includes($search_val)) {
            mainSearchHistory.unshift($search_val);
            if (mainSearchHistory.length > 5) mainSearchHistory.pop();
            localStorage.setItem("msh", JSON.stringify(mainSearchHistory));
        }

        searchInput.blur();
        invalidateAll();
        $loadingStore = true;
    }

    $effect(() => {
        if ($loadingStore === true) {
            const timer = setTimeout(() => {
                $loadingStore = false;
            }, 500);
            return () => clearTimeout(timer);
        }
    });
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore slot_element_deprecated -->
<div class="{containerClass} mx-auto pt-6 pb-20 antialiased">
    <div class="mb-1 px-2 relative">
        <!-- svelte-ignore event_directive_deprecated -->
        <form on:submit|preventDefault={searchFunc} class="relative z-30">
            <div
                class="flex items-center bg-gray-100 rounded-2xl px-4 py-1 transition-all duration-300 border-2"
                class:border-cyan-500={searchFocus}
                class:bg-white={searchFocus}
                class:shadow-xl={searchFocus}
                class:border-transparent={!searchFocus}
            >
                <i class="fa fa-search text-gray-400 mr-2"></i>
                <input
                    type="text"
                    placeholder="어떤 현장을 찾으시나요?"
                    class="w-full py-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
                    bind:value={$search_val}
                    bind:this={searchInput}
                    on:focusin={() => {
                        searchFocus = true;
                        mainSearchHistory = JSON.parse(
                            localStorage.getItem("msh") || "[]",
                        );
                    }}
                    on:focusout={() =>
                        setTimeout(() => (searchFocus = false), 200)}
                />

                {#if $search_val}
                    <button
                        type="button"
                        class="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        on:click={() => {
                            $search_val = "";
                            sessionStorage.removeItem("search_val");
                            invalidateAll();
                        }}
                    >
                        <i class="fa fa-times-circle text-gray-400"></i>
                    </button>
                {/if}

                <div class="w-[1px] h-4 bg-gray-200 mx-1"></div>
                <button
                    type="button"
                    class="pl-2 pr-1 py-1 text-gray-500 hover:text-cyan-500 transition-colors flex justify-center items-center gap-1 flex-shrink-0"
                    on:click={() => (showFilter = true)}
                >
                    <span
                        class="text-[12px] whitespace-nowrap tracking-tighter"
                    >
                        필터
                    </span>
                    <i class="fa fa-filter text-xs"></i>
                </button>
            </div>
        </form>

        {#if searchFocus && mainSearchHistory.length > 0}
            <div
                class="absolute left-4 right-4 top-full mt-2 z-40 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            >
                <div
                    class="p-4 border-b border-gray-50 flex justify-between items-center"
                >
                    <span
                        class="text-xs font-bold text-gray-400 uppercase tracking-wider"
                        >최근 검색어</span
                    >

                    <button
                        class="text-[10px] text-gray-300 hover:text-gray-500"
                        on:click={() => {
                            localStorage.removeItem("msh");
                            mainSearchHistory = [];
                        }}>전체삭제</button
                    >
                </div>
                <div class="p-2">
                    {#each mainSearchHistory as val}
                        <button
                            class="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 rounded-xl transition-colors flex items-center"
                            on:mousedown={() => {
                                $search_val = val;
                                searchFunc();
                            }}
                        >
                            <i class="fa fa-clock-o mr-3 text-gray-300"></i>
                            {val}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
    </div>

    {#if bannerList.length > 0}
        <div class="px-4 mb-1">
            <div
                class="relative overflow-hidden rounded-2xl shadow-md bg-white border border-gray-100"
            >
                <a
                    href={bannerLinkList[nowBannerIdx]}
                    target={bannerLinkList[nowBannerIdx]?.includes(
                        $page.url.hostname,
                    )
                        ? "_self"
                        : "_blank"}
                    class="block w-full"
                >
                    <img
                        class="w-full h-auto block transition-opacity duration-500"
                        src={`${public_img_bucket}${bannerList[nowBannerIdx]}`}
                        alt="광고 배너"
                    />
                </a>

                {#if bannerList.length > 1}
                    <div
                        class="absolute bottom-2 right-3 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full flex gap-1 items-center"
                    >
                        <span class="text-[10px] text-white font-medium mr-1"
                            >{nowBannerIdx + 1} / {bannerList.length}</span
                        >
                        {#each bannerList as _, i}
                            <div
                                class="w-1 h-1 rounded-full transition-all {i ===
                                nowBannerIdx
                                    ? 'bg-white w-2'
                                    : 'bg-white/50'}"
                            ></div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    {/if}

    <div class="mb-4">
        <slot name="location" />
    </div>

    <div class="px-4 space-y-12">
        {#each ["premium", "top", "free"] as type}
            {#if $main_list[type].length > 0}
                <div class="{type}-section">
                    <div class="flex items-center justify-between mb-5 px-1">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-2xl flex items-center justify-center
                                {type === 'premium'
                                    ? 'bg-amber-100 text-amber-600'
                                    : type === 'top'
                                      ? 'bg-blue-100 text-blue-600'
                                      : 'bg-gray-100 text-gray-600'} shadow-sm"
                            >
                                <i
                                    class="fa {type === 'premium'
                                        ? 'fa-star'
                                        : type === 'top'
                                          ? 'fa-trophy'
                                          : 'fa-list-ul'} text-lg"
                                ></i>
                            </div>
                            <div>
                                <h3
                                    class="text-xl font-black text-gray-900 tracking-tight"
                                >
                                    {type === "premium"
                                        ? "프리미엄 현장"
                                        : type === "top"
                                          ? "우리동네 TOP"
                                          : "신규 일반 공고"}
                                </h3>
                                <p
                                    class="text-[11px] font-medium text-gray-400 uppercase tracking-widest"
                                >
                                    {type === "premium"
                                        ? "ADPEAK PREMIUM"
                                        : type === "top"
                                          ? "LOCAL BEST"
                                          : "LATEST JOBS"}
                                </p>
                            </div>
                        </div>
                        <div
                            class="h-px flex-1 bg-gradient-to-r from-transparent to-gray-100 ml-6 hidden md:block"
                        ></div>
                    </div>

                    <div class="bg-white rounded-3xl p-1 transition-all">
                        <JobPostItemList {type} {goToDetail} />
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
{#if showFilter}
    <div
        class="fixed inset-0 bg-black/60 z-[99]"
        transition:fade={{ duration: 200 }}
        on:click={() => (showFilter = false)}
    ></div>

    <div
        class="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-[100] p-6 shadow-2xl"
        transition:fly={{ y: 500, duration: 400, easing: cubicOut }}
    >
        <div
            class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6"
            on:click={() => (showFilter = false)}
        ></div>

        <h3 class="text-base font-bold text-gray-900 mb-5 text-center">
            정렬 옵션
        </h3>

        <div class="grid grid-cols-1 gap-2 overflow-auto text-sm">
            {#each sortOptions as opt}
                <button
                    class="w-full text-left p-2 rounded-xl font-medium transition-all
                    {$sort_val === opt.value
                        ? 'bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100'
                        : 'bg-white text-gray-600 border border-gray-100'}"
                    on:click={() => selectSort(opt)}
                >
                    {opt.name}
                </button>
            {/each}
        </div>
    </div>
{/if}

<style>
    /* 스무스한 폰트 렌더링 */
    :global(body) {
        background-color: #f9fafb;
    }

    /* 배너 애니메이션 느낌을 위한 미세 조정 */
    img {
        -webkit-user-drag: none;
    }

    /* 바텀 시트 애니메이션 보조 */
    .translate-y-full {
        transform: translateY(100%);
    }
    .translate-y-0 {
        transform: translateY(0);
    }

    /* 배경 스크롤 방지 (필요시) */
    :global(body.modal-open) {
        overflow: hidden;
    }
</style>
