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
    import DetailMenu from "$lib/components/DetailMenu.svelte";
    import Like from "$lib/components/Like.svelte";

    let { data } = $props();
    let postItem = $state({});
    let replyList = $state([]);

    let loginAlertModalShow = $state(false);
    let replyAreaShow = $state(false);
    let imgList = $state([]);
    let tempArr = [1, 2, 3, 4, 5, 6, 7];
    let replyInpBorder = $state(false);
    let replyInpArea = $derived({});
    let replyContent = $state("");
    let likeCount = $state(0);
    let replyCount = $state(0);

    let loopStop = $state(false);

    let alertModalBool = $state(false); // 글 삭제시 먼저 물어보는 모달

    console.log(data);

    onMount(() => {
        likeCount = data.likeCount;
        postItem = data.postItem;
        console.log(postItem);

        if (postItem.imgs) {
            imgList = postItem.imgs.split(",");
        }
    });

    $effect(() => {
        if (data) {
            console.log(data);

            likeCount = data.likeCount;
        }
        if (data.replyList) {
            replyList = data.replyList;
            replyCount = data.replyList.length;
        }
    });

    async function uploadReply() {
        loopStop = false;
        $loadingStore = true;
        try {
            const res = await axios.post(`${back_api}/board/upload_reply`, {
                bo_id: $page.params.id,
                user_id: $user_info.idx,
                replyContent,
            });
        } catch (error) {
            alert("업로드 실패~");
        } finally {
            const ranVal = getRandBet(500, 1200);

            setTimeout(() => {
                $loadingStore = false;
                invalidateAll();

                toastStore.set({
                    show: true,
                    message: "댓글이 등록 되었습니다.",
                    // color: "#FF3636",
                    color: "#2478FF",
                });
                replyContent = "";
                replyAreaShow = false;
            }, ranVal);
        }
    }

    async function likeAction(e) {
        console.log(e.likeStatus);
        invalidateAll();
    }

    async function deletePost() {
        if (replyCount > 0) {
            alertModalBool = true;
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

<CustomModal bind:visible={alertModalBool}>
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-5">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>

        {#if replyCount > 0}
            <div class="mb-5">
                <p>댓글이 등록되어 있는 글은 삭제가 불가 합니다.</p>
            </div>
        {:else}
            <div class="mb-5">
                <p>삭제되는 내용은 복구가 불가합니다.</p>
                <p>진행 하시겠습니까?</p>
            </div>
        {/if}

        <div class="flex justify-center items-center gap-3">
            {#if replyCount == 0}
                <button
                    class="btn btn-error w-1/3 text-white"
                    on:click={deletePost}
                >
                    삭제
                </button>
            {/if}
            <button class="btn btn-active w-1/3">취소</button>
        </div>
    </div>
</CustomModal>

<DetailMenu favorateShow={false}></DetailMenu>

<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="bg-white relative min-h-screen px-3">
    <div class="max-w-[530px] mx-auto pretendard pt-10 pb-24">
        <div class="content-area border-b border-gray-300 pb-5">
            {#if postItem.user_id == $user_info.idx}
                <div class="text-right my-3">
                    <button
                        class="btn btn-info text-white btn-sm"
                        on:click={() => {
                            goto(`/simplewrite?modifyidx=${postItem.idx}`);
                        }}
                    >
                        내 글 수정
                    </button>
                    <button
                        class="btn btn-error text-white btn-sm"
                        on:click={() => {
                            alertModalBool = true;
                        }}
                    >
                        내 글 삭제
                    </button>
                </div>
            {/if}

            <div class="text-lg font-semibold">
                {postItem.subject}
            </div>

            <div class=" mt-3 flex justify-end flex-wrap items-center">
                <span class="text-xs md:text-sm">{postItem.nickname}</span>
                <span class="mx-1.5">|</span>
                <span class="flex items-center gap-1 text-sm">
                    <i class="fa fa-heart-o" aria-hidden="true"></i>
                    <span
                        class="border border-gray-400 px-1.5 py-0.5 rounded-full text-[10px] md:text-xs"
                    >
                        {likeCount}
                    </span>
                </span>
                <span class="mx-2">|</span>

                <span class="flex items-center gap-1 text-sm">
                    <i class="fa fa-commenting text-gray-500" aria-hidden="true"
                    ></i>
                    <span
                        class="border border-gray-400 px-2 py-0.5 rounded-full text-[10px] md:text-xs"
                    >
                        {replyList.length}
                    </span>
                </span>

                <span class="mx-2">|</span>

                <span class="text-xs md:text-sm">
                    {moment(postItem.created_at).format("YY/MM/DD HH:mm")}
                </span>
            </div>

            <div class="mt-10 pb-10">
                {#each imgList as img}
                    <img src={`${public_img_bucket}${img}`} alt="" />
                {/each}

                <div class:mt-8={postItem.imgs}>
                    {postItem.content}
                </div>
            </div>

            <!-- <div class="text-center">
                <button
                    class="text-sm border border-gray-400 text-gray-600 py-1.5 px-3 rounded-full cursor-pointer"
                    on:click={likeActFunc}
                >
                    <i class="fa fa-heart-o" aria-hidden="true"></i>
                    <span>좋아요</span>
                </button>
            </div> -->

            <Like {likeAction}></Like>
        </div>

        <div class="my-5 flex justify-between">
            <span class=" border px-3 py-1 text-sm rounded-full">댓글</span>
            <button
                class="btn btn-accent btn-sm text-white"
                on:click={() => {
                    if (!$user_info.idx) {
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
