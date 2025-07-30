<script>
    import { goto } from "$app/navigation";
    import moment from "moment-timezone";
    import {
        prev,
        user_info,
        nonMemberViewLimitNum,
        viewLimitAlertModal,
    } from "$lib/stores/stores.js";
    import { raiseViewCount } from "$lib/lib.js";

    let { data } = $props();
    console.log(data);
    let boardList = $state([]);
    boardList = data.boardList;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class="pt-20 pb-32 suit-font px-3">
    {#each boardList as boardData}
        <div
            class="border-b py-5 px-3 border-gray-300 cursor-pointer"
            on:click={() => {
                // 비회원 조회수 제한!!
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
            }}
        >
            <div class="mt-1 font-semibold">
                {boardData.subject}
            </div>
            <div class="mt-1 ellipsis whitespace-pre-wrap">
                {boardData.content}
            </div>
            <div class=" mt-3 flex justify-end flex-wrap items-center">
                <span class="text-xs md:text-sm">{boardData.nickname}</span>
                <span class="mx-1.5">|</span>
                <span class="flex items-center gap-1 text-sm">
                    <i class="fa fa-heart-o" aria-hidden="true"></i>
                    <span
                        class="px-1.5 py-0.5 rounded-full text-[10px] md:text-xs"
                    >
                        {boardData.post_likes}
                    </span>
                </span>
                <span class="mx-1">|</span>

                <span class="flex items-center gap-1 text-sm">
                    <i class="fa fa-commenting text-gray-500" aria-hidden="true"
                    ></i>
                    <span
                        class="px-2 py-0.5 rounded-full text-[10px] md:text-xs"
                    >
                        {boardData.reply_count}
                    </span>
                </span>

                <span class="mx-1">|</span>

                <span class="text-xs md:text-sm">
                    {moment(boardData.created_at).format("YY/MM/DD HH:mm")}
                </span>
            </div>
        </div>
    {/each}
</div>

<style>
    .ellipsis {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
