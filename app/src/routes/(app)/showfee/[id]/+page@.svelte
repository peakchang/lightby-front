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
    import { onDestroy, onMount } from "svelte";
    import DetailMenu from "$lib/components/DetailMenu.svelte";
    import Like from "$lib/components/Like.svelte";
    import { browser } from "$app/environment";

    let { data } = $props();

    let headerShowBool = $state(true); // 스크롤 내릴시 상단 메뉴 보이게 하기 위한 변수!
    let showBool = $state(true); // 처음 페이지 로딩시 위로 올라가는 잔상 없애기 위해!
    let y = $state(0);

    let shareModal = $state(false);

    let postItem = $state({}); // 전체 본문 정보
    let imgList = $state([]); // 본문 내 이미지

    let replyList = $state([]); // 댓글 리스트

    let loginAlertModalShow = $state(false); // 댓글 작성시 로그인이 안되어 있을때 경고 modal
    let replyAreaShow = $state(false); // 댓글 작성 영역 열고 닫기
    let replyInpBorder = $state(false); // 댓글 작성 열었을때 border 값
    let replyInpArea = $derived({}); // 댓글 작성 열었을때 area 값
    let replyContent = $state(""); // 댓글 컨텐츠

    let likeCount = $state(0); // 좋아요 갯수
    let replyCount = $state(0); // 댓글 갯수

    let alertModalBool = $state(false); // 글 삭제시 먼저 물어보는 모달

    let re_replayAreaShow = $state(false);
    let re_replayChoiceNum = $state(0);
    let replyDeleteAlertModalShow = $state(false);
    let replyDeleteIdx = $state("");

    let siteWrab = $state({});
    if (browser) {
        siteWrab = document.querySelector(".site-wrab");
    }

    onMount(() => {

        // 스크롤 이벤트 추가
        if (browser) {
            siteWrab.scrollTo(0, 0);
            siteWrab.addEventListener("scroll", handleScroll);
        }
        likeCount = data.likeCount;
        postItem = data.postItem;
        if (postItem.imgs) {
            imgList = postItem.imgs.split(",");
        }
    });

    $effect(() => {
        if (data) {
            likeCount = data.likeCount;
        }

        if (data.replyList) {
            replyList = data.replyList;

            replyCount = data.replyList.length;
        }

        if (y != 0) {
            // 스크롤 조금이라도 움직이면 hidden 해제!
            showBool = false;
        }

        // 스크롤이 250 이상으로 내려가면 애니메이션 적용!
        if (y > 250) {
            headerShowBool = false;
        } else {
            headerShowBool = true;
        }
    });

    onDestroy(() => {
        // 스크롤 이벤트 삭제
        if (browser) {
            siteWrab.removeEventListener("scroll", handleScroll);
        }
    });

    function handleScroll() {
        y = siteWrab.scrollTop;
    }

    async function uploadReply() {
        console.log(this.value);

        $loadingStore = true;
        let toastMessage = "";
        try {
            let bo_id = "";
            let user_id = "";
            let path = "";
            
            if (this.value == "upload") {
                bo_id = $page.params.id;
                user_id: $user_info.idx;
                path = "upload_reply";
                toastMessage = "댓글이 등록 되었습니다.";
            } else if (this.value == "update") {
                bo_id = replyList[re_replayChoiceNum]["idx"];
                path = "update_reply";
                toastMessage = "댓글 수정이 완료 되었습니다.";
            } else {
                bo_id = replyDeleteIdx;
                path = "delete_reply";
                toastMessage = "댓글 삭제 되었습니다.";
            }

            const res = await axios.post(`${back_api}/board/${path}`, {
                bo_id,
                user_id,
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
                    message: toastMessage,
                    // color: "#FF3636",
                    color: "#2478FF",
                });
                replyContent = "";
                replyAreaShow = false;
                re_replayAreaShow = false;
            }, ranVal);
        }
    }

    async function likeAction(e) {
        invalidateAll();
    }

    async function deletePost() {
        if (replyCount > 0) {
            alertModalBool = true;
        }
    }

    function openShareModal(e) {
        shareModal = true;
    }
</script>

<!-- <svelte:window on:scroll={handleScroll} /> -->
<div
    class="fixed top-0 left-0 w-full z-50 suit-font slide-menu"
    class:hidden={showBool}
    class:show={!headerShowBool}
>
    <div class="max-w-[530px] mx-auto bg-white">
        <DetailMenu {openShareModal} favorateShow={false} />
    </div>
</div>

<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={shareModal}>
    <div class="flex justify-center items-center gap-3">
        <button
            class="border border-gray-400 p-2 rounded-md text-gray-600 cursor-pointer"
            on:click={() => {
                navigator.clipboard
                    .writeText($page.url.href)
                    .then(() =>
                        toastStore.set({
                            show: true,
                            message: "주소가 복사되었습니다",
                            color: "#53C14B",
                        }),
                    )
                    .catch((err) =>
                        toastStore.set({
                            show: true,
                            message: "주소 복사에 실패 했습니다.",
                            color: "#53C14B",
                        }),
                    );
            }}
        >
            <div>
                <i class="fa fa-link" aria-hidden="true"></i>
            </div>
            <div class="text-xs md:text-sm">주소복사</div>
        </button>

        <!-- <button
            class="border border-gray-400 p-2 rounded-md text-gray-600 cursor-pointer bg-yellow-400"
        >
            <div class="flex justify-center items-center">
                <img src="/kakao_logo.png" alt="" width="23" height="23" />
            </div>
            <div class="text-xs md:text-sm">카카오톡</div>
        </button> -->
    </div>
</CustomModal>

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

<CustomModal bind:visible={replyDeleteAlertModalShow}>
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-5">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>

        <div class="mb-5">
            <p>삭제 된 댓글은 복구가 불가능합니다.</p>
            <p>진행 하시겠습니까?</p>
        </div>

        <div class="flex justify-center items-center gap-3">
            <!-- svelte-ignore event_directive_deprecated -->
            <button
                class="btn btn-error w-1/3 text-white"
                value="delete"
                on:click={uploadReply}
            >
                삭제
            </button>
            <button class="btn btn-active w-1/3">취소</button>
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
                <!-- svelte-ignore event_directive_deprecated -->
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

<div class="max-w-[530px] mx-auto bg-white">
    <DetailMenu {openShareModal} favorateShow={false}></DetailMenu>
</div>

<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="bg-white relative min-h-screen px-3 content-wrab">
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

                <div class="whitespace-pre-wrap" class:mt-8={postItem.imgs}>
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
                    replyContent = "";
                    re_replayAreaShow = false;
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
                        value="upload"
                        on:click={uploadReply}
                    >
                        댓글 등록
                    </button>
                </div>
            </div>
        {/if}

        {#each replyList as reply, idx}
            <div class="reply-area border-b border-gray-300 pb-5 mb-5">
                <div class="whitespace-pre-line">
                    {reply.content}
                </div>
                <div class="mt-3 flex justify-end items-center text-sm gap-1.5">
                    <span>{reply.nickname}</span>
                    <span>|</span>
                    <span>
                        {moment(reply.created_at).format("YY/MM/DD HH:mm")}
                    </span>

                    {#if $user_info.rate > 3 || $user_info.idx == reply.user_id}
                        <button
                            class="btn btn-success btn-xs text-white"
                            on:click={() => {
                                replyAreaShow = false;
                                re_replayAreaShow = !re_replayAreaShow;
                                re_replayChoiceNum = idx;
                                replyContent = replyList[idx]["content"];
                            }}
                        >
                            수정
                        </button>
                        <button
                            class="btn btn-error btn-xs text-white"
                            value={reply.idx}
                            on:click={(e) => {
                                replyDeleteAlertModalShow = true;
                                replyDeleteIdx = e.target.value;
                            }}
                        >
                            삭제
                        </button>
                    {/if}
                </div>

                {#if re_replayAreaShow && re_replayChoiceNum == idx}
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
                                value="update"
                                on:click={uploadReply}
                            >
                                댓글 등록
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .slide-menu {
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    }

    .slide-menu.show {
        transform: translateY(0);
    }
</style>
