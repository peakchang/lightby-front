<script>
    import { goto, invalidateAll } from "$app/navigation";
    import { manageBoardTabNum, loadingStore } from "$lib/stores/stores";
    import { back_api, public_img_bucket } from "$lib/const.js";
    import CustomModal from "$lib/components/CustomModal.svelte";

    import moment from "moment-timezone";

    let { data } = $props();

    const productTypeMap = {
        premium: "프리미엄",
        top: "지역탑",
        free: "무료",
    };

    let tabArea = $derived({});
    let post_list = $state([]);
    let unableModifyBool = $state(false);

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

    function getProductTypeLabel(key) {
        return productTypeMap[key] || "알 수 없음";
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
    <div class="z-50 suit-font px-3 mt-5" style="padding-bottom:70px">
        {#each post_list as value}
            <a href="/detail/{value.idx}" on:click|preventDefault={() => {}}>
                <div
                    class="border border-gray-300 rounded-lg p-2 mb-3 shadow-sm cursor-pointer relative"
                >
                    <div
                        class="flex gap-3 justify-between md:gap-5 items-center border-b-gray-300"
                    >
                        {#if value.thumbnail}
                            <div
                                class=" w-28 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden flex-shrink-0"
                            >
                                <img
                                    src={public_img_bucket + value.thumbnail}
                                    alt=""
                                    class="w-full h-full object-cover"
                                />
                            </div>
                        {:else}
                            <div class="w-4"></div>
                        {/if}

                        <div
                            class="flex flex-col justify-between gap-2 w-full h-full"
                        >
                            <div class="text-sm">{value.subject}</div>
                            <div class="text-xs">
                                {moment(value.created_at).format(
                                    "YY/MM/DD HH:mm",
                                )}
                            </div>

                            <div class="text-xs">
                                <span>
                                    광고 : {getProductTypeLabel(value.product)}
                                </span>
                                {#if value.product != "free"}
                                    <span>|</span>
                                {/if}
                                <span>
                                    {#if value.ad_status}
                                        잔여기간 :
                                        {#if value.ad_status.status}
                                            {value.ad_status.daysLeft}일
                                        {:else}
                                            종료
                                        {/if}
                                    {/if}
                                </span>
                            </div>
                        </div>
                        <div class=" text-right">
                            <button
                                class="btn btn-info btn-xs text-sm min-w-[60px] text-white mb-2"
                                on:click={() => {
                                    goto(`/detail/${value.idx}?prev=my`);
                                }}
                            >
                                보기
                            </button>

                            {#if value.product == "free"}
                                <button
                                    class="btn btn-success btn-xs text-sm min-w-[60px] text-white"
                                    on:click={() => {
                                        goto(
                                            `/joboffer?modifyidx=${value.idx}`,
                                        );
                                    }}
                                >
                                    수정
                                </button>
                            {/if}

                            {#if value.ad_status}
                                {#if value.ad_status.status}
                                    <button
                                        class="btn btn-success btn-xs text-sm min-w-[60px] text-white"
                                        on:click={() => {
                                            goto(
                                                `/joboffer?modifyidx=${value.idx}`,
                                            );
                                        }}
                                    >
                                        수정
                                    </button>
                                {:else}
                                    <button
                                        class="btn btn-soft btn-xs text-sm min-w-[60px]"
                                        on:click={() => {
                                            unableModifyBool =
                                                !unableModifyBool;
                                        }}
                                    >
                                        수정
                                    </button>
                                {/if}
                            {/if}
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>
{:else if $manageBoardTabNum == 1}
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="z-50 suit-font px-3 mt-5" style="padding-bottom:70px">
        {#each post_list as value}
            <div
                class="border border-gray-300 rounded-lg p-2 mb-3 shadow-sm cursor-pointer relative"
            >
                <div
                    class="flex gap-3 justify-between md:gap-5 items-center border-b-gray-300 pl-3"
                >
                    <div class="flex flex-col justify-between w-full">
                        <div class="mb-1">
                            {value.subject}
                        </div>
                        <div class="text-xs">
                            {moment(value.created_at).format("YY/MM/DD HH:mm")}
                        </div>
                    </div>
                    <div class=" text-right">
                        <button
                            class="btn btn-info btn-xs text-sm min-w-[60px] text-white mb-2"
                            on:click={() => {
                                goto(`/showfee/${value.idx}?prev=my`);
                            }}
                        >
                            보기
                        </button>
                        <button
                            class="btn btn-success btn-xs text-sm min-w-[60px] text-white"
                            on:click={() => {
                                goto(`/simplewrite?modifyidx=${value.idx}`);
                            }}
                        >
                            수정
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div class="z-50 suit-font px-3 mt-5" style="padding-bottom:70px">
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
