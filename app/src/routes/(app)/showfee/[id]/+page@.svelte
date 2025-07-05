<script>
    import PageHeader from "$lib/components/PageHeader.svelte";
    import moment from "moment-timezone";
    import { public_img_bucket, img_bucket, back_api } from "$lib/const";
    import { user_info } from "$lib/stores/stores.js";
    import CustomModal from "$lib/components/CustomModal.svelte";
    import PdButton from "$lib/components/PdButton.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { toastStore } from "$lib/stores/stores.js";
    import { loadingStore } from "$lib/stores/stores.js";
    import axios from "axios";
    import { page } from "$app/stores";
    import { getRandBet } from "$lib/lib.js";
    import { onMount } from "svelte";

    console.log(`$user_info : ${$user_info.idx}`);
    console.log($page);

    let { data } = $props();
    let boardItem = $state({});
    let replyList = $state([]);
    boardItem = data.boardItem;
    replyList = data.replyList;
    let loginAlertModalShow = $state(false);

    let replyAreaShow = $state(false);

    let imgList = $state([]);
    // svelte-ignore state_referenced_locally
    if (boardItem.imgs) {
        imgList = boardItem.imgs.split(",");
        console.log(imgList);
    }

    let tempArr = [1, 2, 3, 4, 5, 6, 7];
    let replyInpBorder = $state(false);
    let replyInpArea = $derived({});
    let replyContent = $state("");


    onMount(() => {
        console.log('onMounted!!!!');
        console.log($user_info);
        
    })



    async function uploadReply() {
        console.log(replyContent);

        $loadingStore = true;
        try {
            const res = await axios.post(`${back_api}/board/upload_reply`, {
                bo_id: $page.params.id,
                user_id: $user_info.idx,
                replyContent,
            });

            // invalidateAll();
        } catch (error) {
            console.log("에러?");

            alert("업로드 실패~");
        } finally {
            const ranVal = getRandBet(500, 1200);
            setTimeout(() => {
                $loadingStore = false;
                toastStore.set({
                    show: true,
                    message: "댓글이 등록 되었습니다.",
                    // color: "#FF3636",
                    color: "#2478FF",
                });
            }, ranVal);
        }
    }
</script>

<CustomModal bind:visible={loginAlertModalShow} closeBtn={false}>
    <div class="text-center">
        <div class=" text-green-700 text-3xl mb-2">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div class="mb-2 text-lg">로그인이 필요합니다!</div>

        <div class="flex justify-center gap-3">
            <PdButton
                classVal="w-1/3 py-2 rounded-lg text-white text-sm"
                backgroundColor="#1266FF"
                hoverColor="#0042ED"
                on:click={() => {
                    goto(`/auth/login?path=${$page.url.pathname}`);
                }}
            >
                로그인 바로가기
            </PdButton>
            <PdButton
                classVal="w-1/3 py-2 rounded-lg text-white text-sm"
                backgroundColor="#5D5D5D"
                hoverColor="#393939"
            >
                닫기
            </PdButton>
        </div>
    </div>
</CustomModal>

<PageHeader></PageHeader>

<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="bg-white relative min-h-screen px-3">
    <div class="max-w-[530px] mx-auto pretendard pt-14 pb-24">
        <div class="content-area border-b border-gray-300">
            <div class="text-lg font-semibold">
                {boardItem.subject}
            </div>

            <div class=" mt-3 flex justify-end flex-wrap items-center">
                <span class="text-xs md:text-sm">{boardItem.nickname}</span>
                <span class="mx-1.5">|</span>
                <span class="flex items-center gap-1 text-sm">
                    <i class="fa fa-heart-o" aria-hidden="true"></i>
                    <span
                        class="border border-gray-400 px-1.5 py-0.5 rounded-full text-[10px] md:text-xs"
                    >
                        {boardItem.good_count ? boardItem.good_count : 0}
                    </span>
                </span>
                <span class="mx-1">|</span>

                <span class="flex items-center gap-1 text-sm">
                    <i class="fa fa-commenting text-gray-500" aria-hidden="true"
                    ></i>
                    <span
                        class="border border-gray-400 px-2 py-0.5 rounded-full text-[10px] md:text-xs"
                    >
                        195
                    </span>
                </span>

                <span class="mx-1">|</span>

                <span class="text-xs md:text-sm">
                    {moment(boardItem.created_at).format("YY/MM/DD HH:mm")}
                </span>
            </div>

            <div class="mt-10 pb-10">
                {#each imgList as img}
                    <img src={`${public_img_bucket}${img}`} alt="" />
                {/each}

                <div class:mt-8={boardItem.imgs}>
                    {boardItem.content}
                </div>
            </div>
        </div>

        <div class="my-5 flex justify-between">
            <span class=" border px-3 py-1 text-sm rounded-full">댓글</span>
            <button
                class="btn btn-accent btn-sm text-white"
                on:click={() => {
                    if (!$user_info.idx) {
                        console.log("진입은 하잖아?");

                        loginAlertModalShow = true;
                        return;
                    }
                    replyAreaShow = !replyAreaShow;
                }}
            >
                댓글 작성
            </button>
        </div>

        {#if replyAreaShow}
            <div
                class="border rounded-lg mt-3 mb-10 pt-3"
                class:border-gray-400={!replyInpBorder}
                class:border-blue-400={replyInpBorder}
            >
                <div>
                    <textarea
                        class="px-2 w-full focus:outline-none resize-none"
                        rows="3"
                        bind:this={replyInpArea}
                        bind:value={replyContent}
                        on:focusin={() => {
                            replyInpBorder = true;
                        }}
                        on:focusout={() => {
                            replyInpBorder = false;
                        }}
                    ></textarea>
                </div>

                <div
                    class="text-right px-3 pb-3"
                    on:click={() => {
                        replyInpArea.focus();
                    }}
                >
                    <button
                        class="btn btn-info btn-sm text-white"
                        on:click={uploadReply}
                    >
                        댓글 등록
                    </button>
                </div>
            </div>
        {/if}

        {#each replyList as reply}
            <div class="reply-area border-b border-gray-300 pb-5 mb-5">
                <div class="whitespace-pre-line">
                    {reply.content}
                </div>
                <div class="mt-3 flex justify-end text-sm">
                    <span>{reply.nickname}</span>
                    <span class="mx-2">|</span>
                    <span>
                        {moment(reply.created_at).format("YY/MM/DD HH:mm")}
                    </span>
                </div>
            </div>
        {/each}
    </div>
</div>
