<script>
    import { goto } from "$app/navigation";
    import moment from "moment-timezone";
    import { raiseViewCount } from "$lib/lib.js";
    import { onMount } from "svelte";
    import { public_img_bucket } from "$lib/const"; // 이미지 버킷 경로 필요

    import {
        prev,
        user_info,
        nonMemberViewLimitNum,
        viewLimitAlertModal,
        scrollY,
        scrollVal,
        pageScrollStatus,
    } from "$lib/stores/stores.js";

    let { data } = $props();
    let boardList = $state([]);

    onMount(() => {
        boardList = data.boardList;
        console.log(boardList);

        $pageScrollStatus = true;
    });

    $effect(() => {
        if ($scrollY) {
            $scrollVal = $scrollY;
        }
    });

    function handleDetail(boardData) {
        // 비회원 조회수 제한
        if (!$user_info.idx) {
            if ($nonMemberViewLimitNum > 3) {
                $viewLimitAlertModal = true;
                return;
            }
            $nonMemberViewLimitNum = $nonMemberViewLimitNum + 1;
        }

        raiseViewCount("board_fee", boardData.idx);
        $prev = "/showfee";
        goto(`/showfee/${boardData.idx}`);
    }
</script>

<div class="bg-gray-50 min-h-screen pt-20 pb-32 px-4">
    <div class="max-w-2xl mx-auto space-y-4">
        {#each boardList as boardData}
            {@const images = boardData.imgs ? boardData.imgs.split(",") : []}

            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore event_directive_deprecated -->
            <div
                class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer
                       transition-all active:scale-[0.98] hover:shadow-md"
                on:click={() => handleDetail(boardData)}
            >
                <div class="flex gap-4">
                    <div class="flex-1 min-w-0">
                        <div
                            class="text-[17px] font-bold text-gray-900 leading-snug mb-1 ellipsis-1"
                        >
                            {boardData.subject}
                        </div>
                        <div
                            class="text-sm text-gray-500 ellipsis-2 mb-3 leading-relaxed"
                        >
                            {boardData.content}
                        </div>
                    </div>

                    {#if images.length > 0}
                        <div class="flex-shrink-0">
                            <div
                                class="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-xl bg-gray-100 border border-gray-50"
                            >
                                <img
                                    src="{public_img_bucket}{images[0]}"
                                    alt="thumbnail"
                                    class="thumb-img"
                                    loading="lazy"
                                />
                                {#if images.length > 1}
                                    <div
                                        class="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                                    >
                                        +{images.length - 1}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>

                <div
                    class="flex items-center justify-between pt-3 mt-1 border-t border-gray-50"
                >
                    <div class="flex items-center gap-2">
                        <div
                            class="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center"
                        >
                            {#if boardData.is_anonymous}
                                <i class="fa fa-user text-[10px] text-sky-500"
                                ></i>
                            {:else if boardData.profile_thumbnail}
                                <img
                                    src={boardData.profile_thumbnail}
                                    alt="profile"
                                    class="w-full h-full object-cover"
                                />
                            {:else if boardData.profile_image}
                                <img
                                    src={`${public_img_bucket}${boardData.profile_image}`}
                                    alt="profile"
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <i class="fa fa-user text-[10px] text-sky-500"
                                ></i>
                            {/if}
                        </div>

                        <span class="text-xs font-medium text-gray-700">
                            {#if boardData.is_anonymous}
                                익명
                            {:else}
                                {boardData.nickname}
                            {/if}
                        </span>
                        <span class="text-[10px] text-gray-300">•</span>
                        <span class="text-[11px] text-gray-400"
                            >{moment(boardData.created_at).fromNow()}</span
                        >
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-1 text-rose-400">
                            <i class="fa fa-heart-o text-xs"></i>
                            <span class="text-xs font-semibold"
                                >{boardData.post_likes}</span
                            >
                        </div>
                        <div class="flex items-center gap-1 text-sky-400">
                            <i class="fa fa-commenting-o text-xs"></i>
                            <span class="text-xs font-semibold"
                                >{boardData.reply_count}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    /* 깨짐 방지 및 고화질 렌더링 스타일 */
    .thumb-img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* 비율 유지하며 꽉 채움 */
        object-position: center;

        /* 이미지가 깨져 보일 때 도움이 되는 속성들 */
        image-rendering: -webkit-optimize-contrast; /* 선명도 우선 렌더링 */
        transform: translateZ(0); /* 하드웨어 가속 사용 */
        backface-visibility: hidden;
    }
    /* 제목 1줄 제한 */
    .ellipsis-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    /* 본문 2줄 제한 */
    .ellipsis-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
