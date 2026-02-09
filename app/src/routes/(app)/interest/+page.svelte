<script>
    import { user_info } from "$lib/stores/stores";
    import { goto, invalidateAll, afterNavigate } from "$app/navigation";
    import { navigating, page } from "$app/stores";
    import { onMount } from "svelte";
    import InterestPostItem from "$lib/components/InterestPostItem.svelte";

    import {
        interestTabNum,
        scrollY,
        scrollVal,
        pageScrollStatus,
    } from "$lib/stores/stores.js";

    let { data } = $props();

    let interestStatus = $state(false);
    let postList = $state([]);
    let statusMessage = $state("");

    // 하단 메인 메뉴 내 페이지들 끼리는 무조건 최상단에 위치! ($scrollVal 을 0으로 초기화)
    afterNavigate((e) => {
        if (e.from && e.from.route.id.includes("(app)")) {
            $scrollVal = 0; // 페이지 진입시 스크롤 위치 초기화
        }
    });

    onMount(() => {
        $pageScrollStatus = true; // 페이지 진입시 저장된 스크롤로 이동
    });

    $effect(() => {
        $scrollVal = $scrollY; // 현재 스크롤 위치 저장 (페이지 벗어 날 때 까지 유지)

        // 관심 지역, 찜한 목록 상태 초기화
        interestStatus = data.interestStatus;
        postList = data.postList;
        statusMessage = data.statusMessage;
    });

    let tabArea = $derived({});

    function changeTab(e) {
        $interestTabNum = e.target.dataset.num;

        for (const el of tabArea.children) {
            el.classList.remove("tab-active");
        }
        tabArea.children[e.target.dataset.num].classList.add("tab-active");

        invalidateAll();
    }
</script>

<!-- svelte-ignore event_directive_deprecated -->
<div class="pb-32 suit-font">
    {#if $user_info.idx}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore event_directive_deprecated -->
        <div class="tab-area cursor-pointer pt-20" bind:this={tabArea}>
            <div
                class:tab-active={$interestTabNum == 0}
                data-num="0"
                on:click={changeTab}
            >
                관심 지역
            </div>
            <div
                data-num="1"
                class:tab-active={$interestTabNum == 1}
                on:click={changeTab}
            >
                찜한 목록
            </div>
            <!-- <div
                data-num="2"
                class:tab-active={$interestTabNum == 2}
                on:click={changeTab}
            >
                내 주변 현장
            </div> -->
        </div>

        <!-- svelte-ignore event_directive_deprecated -->

        {#if $interestTabNum == 0 || $interestTabNum == 1}
            {#if interestStatus}
                <div
                    class="z-50 suit-font px-3 mt-5"
                    style="padding-bottom:70px"
                >
                    {#each postList as post}
                        <InterestPostItem {post}></InterestPostItem>
                    {/each}
                </div>
            {:else if !interestStatus}
                <div class="text-center mt-20">
                    <div class=" text-6xl text-blue-500">
                        <i class="fa fa-frown-o" aria-hidden="true"></i>
                    </div>
                    <div class="mt-3 whitespace-pre-line">
                        {statusMessage}
                    </div>
                </div>
            {/if}
        {/if}
    {:else}
        <div
            class="flex flex-col items-center justify-center pt-32 px-6 suit-font"
        >
            <div class="relative flex items-center justify-center mb-8">
                <div
                    class="absolute w-24 h-24 bg-blue-50 rounded-full animate-pulse"
                ></div>
                <div
                    class="relative w-20 h-20 bg-white shadow-xl shadow-blue-100 rounded-3xl flex items-center justify-center border border-blue-50"
                >
                    <i
                        class="fa fa-user-circle-o text-4xl text-blue-500"
                        aria-hidden="true"
                    ></i>
                </div>
                <div
                    class="absolute -top-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm"
                >
                    <i class="fa fa-lock text-white text-[10px]"></i>
                </div>
            </div>

            <div class="text-center mb-10">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">
                    로그인이 필요한 페이지입니다
                </h2>

                <div
                    class="text-[15px] text-gray-500 leading-relaxed space-y-1"
                >
                    <p>관심 지역 설정과 찜한 목록은</p>
                    <p>
                        <span class="text-blue-600 font-semibold text-sm"
                            >마이페이지</span
                        >에서 지역을 설정하시거나
                    </p>
                    <p>
                        상세페이지에서 <span
                            class="text-pink-500 font-semibold text-sm">❤️</span
                        >를 눌러 추가해 보세요.
                    </p>
                </div>
            </div>

            <div class="w-full max-w-[280px]">
                <button
                    class="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
                   text-white font-bold rounded-2xl shadow-lg shadow-blue-100 transition-all text-lg"
                    on:click={() =>
                        goto(`/auth/login?path=${$page.url.pathname}`)}
                >
                    로그인하기
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    /* 배경 애니메이션 (은은하게 퍼지는 효과) */
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.3;
        }
        100% {
            transform: scale(1);
            opacity: 0.5;
        }
    }
    .animate-pulse {
        animation: pulse 3s infinite ease-in-out;
    }

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
