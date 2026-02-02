<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto, invalidateAll } from "$app/navigation";
    import axios from "axios";
    import moment from "moment-timezone";
    import { public_img_bucket, back_api } from "$lib/const";
    import { getRandBet } from "$lib/lib.js";
    import {
        user_info,
        toastStore,
        loadingStore,
        scrollY,
        pageScrollStatus,
    } from "$lib/stores/stores.js";

    import DetailMenu from "$lib/components/DetailMenu.svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";
    import Like from "$lib/components/Like.svelte";
    import PdButton from "$lib/components/PdButton.svelte";

    let { detailData, isApp = false } = $props();

    let postItem = $state(detailData.postItem || {});
    let replyList = $state(detailData.replyList || []);
    let likeCount = $state(detailData.likeCount || 0);
    let imgList = $derived(postItem.imgs ? postItem.imgs.split(",") : []);

    let headerShowBool = $state(true);
    let showBool = $state(true);
    let shareModal = $state(false);
    let loginAlertModalShow = $state(false);
    let replyAreaShow = $state(false);
    let replyInpBorder = $state(false);
    let replyInpArea = $state();
    let replyContent = $state("");
    let alertModalBool = $state(false);
    let re_replayAreaShow = $state(false);
    let re_replayChoiceNum = $state(0);
    let replyDeleteAlertModalShow = $state(false);
    let replyDeleteIdx = $state("");

    onMount(() => {
        if (!isApp) $pageScrollStatus = false;
    });

    $effect(() => {
        if ($scrollY != 0) showBool = false;
        headerShowBool = $scrollY <= 150;
    });

    async function uploadReply(mode) {
        if (!replyContent.trim() && mode !== "delete") return;
        $loadingStore = true;
        let toastMessage = "";
        try {
            let bo_id =
                mode === "upload"
                    ? postItem.idx
                    : mode === "update"
                      ? replyList[re_replayChoiceNum].idx
                      : replyDeleteIdx;
            let path =
                mode === "upload"
                    ? "upload_reply"
                    : mode === "update"
                      ? "update_reply"
                      : "delete_reply";
            toastMessage =
                mode === "upload"
                    ? "댓글이 등록되었습니다."
                    : mode === "update"
                      ? "수정되었습니다."
                      : "삭제되었습니다.";

            await axios.post(`${back_api}/board/${path}`, {
                bo_id,
                user_id: $user_info.idx,
                replyContent,
            });

            invalidateAll();
            replyContent = "";
            replyAreaShow = false;
            re_replayAreaShow = false;
            replyDeleteAlertModalShow = false;
        } catch (error) {
            alert("처리 실패");
        } finally {
            setTimeout(
                () => {
                    $loadingStore = false;
                    toastStore.set({
                        show: true,
                        message: toastMessage,
                        color: "#2478FF",
                    });
                },
                getRandBet(500, 1000),
            );
        }
    }
</script>

<div
    class="fixed top-0 left-0 w-full z-50 slide-menu"
    class:hidden={showBool}
    class:show={!headerShowBool}
>
    <div
        class="max-w-[640px] mx-auto bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
    >
        <DetailMenu favorateShow={false} />
    </div>
</div>

<div class="bg-gray-50 min-h-screen pb-20 antialiased pretendard">
    <div class="mx-auto bg-white min-h-screen shadow-sm overflow-hidden">
        <div class="px-4 pt-4">
            <DetailMenu favorateShow={false} />
        </div>

        <div class="px-5 pt-8 pb-10">
            {#if postItem.user_id == $user_info.idx}
                <div class="flex justify-end gap-2 mb-4">
                    <button
                        class="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-500 rounded-full hover:bg-sky-50 hover:text-sky-600 transition-colors"
                        on:click={() =>
                            goto(`/simplewrite?modifyidx=${postItem.idx}`)}
                        >수정</button
                    >
                    <button
                        class="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-500 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        on:click={() => (alertModalBool = true)}>삭제</button
                    >
                </div>
            {/if}

            <h1
                class="text-2xl font-semibold text-gray-900 leading-tight mb-4 tracking-tight"
            >
                {postItem.subject}
            </h1>

            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                    <div
                        class="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-100 rounded-full flex items-center justify-center text-gray-400"
                    >
                        <i class="fa fa-user"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-bold text-gray-800"
                            >{postItem.nickname}</span
                        >
                        <span class="text-[11px] text-gray-400 font-medium"
                            >{moment(postItem.created_at).format(
                                "YYYY.MM.DD HH:mm",
                            )}</span
                        >
                    </div>
                </div>
                <div class="flex items-center gap-4 text-gray-400">
                    <div class="flex items-center gap-1.5">
                        <i class="fa fa-heart-o text-xs"></i>
                        <span class="text-xs font-bold">{likeCount}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <i class="fa fa-commenting-o text-xs"></i>
                        <span class="text-xs font-bold">{replyList.length}</span
                        >
                    </div>
                </div>
            </div>

            <div class="space-y-4 mb-12">
                {#each imgList as img}
                    <div
                        class="rounded-2xl overflow-hidden shadow-sm border border-gray-50"
                    >
                        <img
                            src="{public_img_bucket}{img}"
                            alt="content"
                            class="w-full h-auto"
                        />
                    </div>
                {/each}
                <div
                    class="whitespace-pre-wrap leading-[1.8] text-gray-700 text-[16px] px-1"
                >
                    {postItem.content}
                </div>
            </div>

            <div class="flex justify-center py-4 border-t border-gray-50">
                <Like likeAction={() => invalidateAll()} />
            </div>
        </div>

        <div
            class="bg-gray-50 px-5 pt-8 pb-32 rounded-t-[32px] border-t border-gray-100"
        >
            <div class="flex justify-between items-center mb-6">
                <h2 class="font-black text-lg text-gray-900 px-1">
                    댓글 <span class="text-sky-500 ml-1"
                        >{replyList.length}</span
                    >
                </h2>
                <button
                    class="bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-sky-200 active:scale-95 transition-transform"
                    on:click={() => {
                        if (!$user_info.idx)
                            return (loginAlertModalShow = true);
                        replyAreaShow = !replyAreaShow;
                        re_replayAreaShow = false;
                        replyContent = "";
                    }}>댓글 달기</button
                >
            </div>

            {#if replyAreaShow}
                <div
                    class="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-gray-100 ring-2 ring-transparent transition-all"
                    class:ring-sky-100={replyInpBorder}
                >
                    <textarea
                        bind:this={replyInpArea}
                        bind:value={replyContent}
                        on:focusin={() => (replyInpBorder = true)}
                        on:focusout={() => (replyInpBorder = false)}
                        class="w-full focus:outline-none resize-none text-sm text-gray-700 placeholder-gray-300"
                        rows="3"
                        placeholder="따뜻한 댓글을 남겨주세요."
                    ></textarea>
                    <div
                        class="flex justify-end mt-2 pt-2 border-t border-gray-50"
                    >
                        <button
                            class="text-sky-500 font-bold text-xs px-2 py-1"
                            on:click={() => uploadReply("upload")}
                            >등록하기</button
                        >
                    </div>
                </div>
            {/if}

            <div class="space-y-4">
                {#each replyList as reply, idx}
                    <div
                        class="bg-white p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-50 transition-all hover:shadow-md"
                    >
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-black text-gray-800"
                                >{reply.nickname}</span
                            >
                            <span
                                class="text-[10px] text-gray-300 font-bold uppercase"
                                >{moment(reply.created_at).fromNow()}</span
                            >
                        </div>
                        <p class="text-sm text-gray-600 leading-relaxed mb-3">
                            {reply.content}
                        </p>

                        {#if $user_info.idx == reply.user_id}
                            <div
                                class="flex justify-end gap-3 pt-2 border-t border-gray-50"
                            >
                                <button
                                    class="text-[11px] font-bold text-sky-400"
                                    on:click={() => {
                                        re_replayAreaShow = true;
                                        re_replayChoiceNum = idx;
                                        replyContent = reply.content;
                                        replyAreaShow = false;
                                    }}>수정</button
                                >
                                <button
                                    class="text-[11px] font-bold text-rose-300"
                                    on:click={() => {
                                        replyDeleteAlertModalShow = true;
                                        replyDeleteIdx = reply.idx;
                                    }}>삭제</button
                                >
                            </div>
                        {/if}

                        {#if re_replayAreaShow && re_replayChoiceNum == idx}
                            <div
                                class="mt-4 p-3 bg-sky-50 rounded-xl border border-sky-100"
                            >
                                <textarea
                                    bind:value={replyContent}
                                    class="w-full bg-transparent focus:outline-none resize-none text-sm text-sky-900 font-medium"
                                    rows="3"
                                ></textarea>
                                <div class="flex justify-end gap-2 mt-2">
                                    <button
                                        class="text-xs font-bold text-gray-400 px-2 py-1"
                                        on:click={() =>
                                            (re_replayAreaShow = false)}
                                        >취소</button
                                    >
                                    <button
                                        class="text-xs font-bold text-sky-600 px-2 py-1"
                                        on:click={() => uploadReply("update")}
                                        >수정완료</button
                                    >
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
                {#if replyList.length === 0}
                    <div
                        class="text-center py-20 text-gray-300 text-sm font-medium"
                    >
                        첫 댓글의 주인공이 되어보세요! ✍️
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .slide-menu {
        transform: translateY(-100%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .slide-menu.show {
        transform: translateY(0);
    }
    :global(body) {
        background-color: #f9fafb;
    }
</style>
