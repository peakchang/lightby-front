<script>
    import moment from "moment-timezone";

    import CustomModal from "$lib/components/CustomModal.svelte";
    import MyPostItem from "$lib/components/MyPostItem.svelte";

    import { onMount } from "svelte";
    import { goto, invalidateAll, afterNavigate } from "$app/navigation";

    import {
        manageBoardTabNum,
        loadingStore,
        pageScrollStatus,
        scrollVal,
        scrollY,
    } from "$lib/stores/stores";

    let { data } = $props();

    let tabArea = $derived({});
    let post_list = $state([]);
    let unableModifyBool = $state(false);

    console.log(data.post_list);

    // 하단 메인 메뉴 내 페이지들 끼리는 무조건 최상단에 위치! ($scrollVal 을 0으로 초기화)
    afterNavigate((e) => {
        if (e.from && e.from.route.id.includes("(app)")) {
            $scrollVal = 0; // 하부 메뉴에서 페이지 진입시 스크롤 위치 초기화
        }
    });

    onMount(() => {
        $pageScrollStatus = true; // 최상위 고정
    });

    $effect(() => {
        post_list = data.post_list;
    });

    function changeTab(e) {
        $loadingStore = true;
        $manageBoardTabNum = e.target.dataset.num;
        for (const el of tabArea.children) {
            el.classList.remove("tab-active");
        }
        tabArea.children[e.target.dataset.num].classList.add("tab-active");
        invalidateAll();
        setTimeout(() => {
            $loadingStore = false;
        }, 800);
    }
</script>

<CustomModal bind:visible={unableModifyBool}>
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-5">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div class="mb-5 text-sm leading-8">
            <p>광고 기간이 만료 된 공고글은 수정이 불가합니다.</p>
            <p>기존 내용으로 공고를 올리시길 원할 경우</p>
            <p>공고 작성하기 페이지에서 "이전 등록한 공고"</p>
            <p>항목을 이용 해 주세요</p>
        </div>
    </div>
</CustomModal>

<div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="tab-area cursor-pointer" bind:this={tabArea}>
        <div
            data-num="0"
            class:tab-active={$manageBoardTabNum == 0}
            on:click={changeTab}
        >
            구인글 관리
        </div>
        <div
            data-num="1"
            class:tab-active={$manageBoardTabNum == 1}
            on:click={changeTab}
        >
            게시판 관리
        </div>
    </div>
</div>

{#if $manageBoardTabNum == 0}
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="z-50 paperlogy px-3 mt-5" style="padding-bottom:70px">
        {#each post_list as value}
            <MyPostItem {value}></MyPostItem>
        {/each}
    </div>
{:else if $manageBoardTabNum == 1}
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="z-50 paperlogy px-3 mt-5" style="padding-bottom:70px">
        {#each post_list as value}
            <MyPostItem {value}></MyPostItem>
        {/each}
    </div>
{:else}
    <div class="z-50 paperlogy px-3 mt-5" style="padding-bottom:70px">
        준비중입니다....
    </div>
{/if}

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
