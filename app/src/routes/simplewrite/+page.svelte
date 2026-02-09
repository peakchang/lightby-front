<script>
    import Cookies from "js-cookie";
    import axios from "axios";

    import PageHeader from "$lib/components/PageHeader.svelte";
    import SortableImg from "$lib/components/SortableImg.svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";

    import { goto, beforeNavigate } from "$app/navigation";
    import { onMount, tick } from "svelte";

    import { getCookieValue } from "$lib/lib";
    import { back_api } from "$lib/const";

    import {
        user_info,
        main_location,
        toastStore,
        prev,
        pageScrollStatus,
    } from "$lib/stores/stores";

    let { data } = $props();
    console.log(data);

    let delImgList = $state([]);
    let imgs = $state("");
    let subjectArea = $derived({});
    let subject = $state("");

    let contentArea = $derived({});
    let content = $state("");

    let uploadChkModalShow = $state(false);
    let uploadChkModalTxt = $state("");

    let errType = $state("");

    let escapePageModal = $state(false);
    let blockBack = $state(true);
    let toPage = $state("");

    let imgModifyList = $state("");
    let modifyIdx = $state(undefined);

    let isAnonymous = $state(false); // 익명 체크 여부

    onMount(async () => {
        $pageScrollStatus = false; // 페이지 시작시 최상위
        await tick();

        console.log($user_info);

        if (!$user_info.idx) {
            goto("/");
        }
        modifyIdx = data.modifyIdx;
        if (modifyIdx) {
            const modifyContent = data.modifyContent;
            console.log(modifyContent);

            if (modifyContent.imgs) {
                imgModifyList = modifyContent.imgs.split(",");
            }

            imgs = modifyContent.imgs;
            subject = modifyContent.subject;
            content = modifyContent.content;
        }

        // 새로고침, 최초 로딩시 삭제할 이미지 있으면 쿠키에서 값 가져와서 삭제하기! (글쓰는 페이지 적용!!)
        const refreshFlag = Cookies.get("del_img_list");
        if (refreshFlag) {
            try {
                const res = await axios.post(`${back_api}/img/delete_many`, {
                    delImgList: refreshFlag.split(","),
                });
            } catch (err) {
                console.error(err.meesage);
            }
            Cookies.remove("del_img_list");
        }
    });

    $effect(async () => {
        // delImgList 에 리스트 담기!! (글쓰는 페이지!)
        if (delImgList.length > 0) {
            const delImgListStr = delImgList.join(",");
            Cookies.set("del_img_list", delImgListStr, {
                path: "/",
                expires: 7,
            });
        } else {
            Cookies.remove("del_img_list", { path: "/" });
        }
    });

    async function goToBackAndArrangeImg() {
        if (delImgList.length > 0) {
            try {
                const res = await axios.post(`${back_api}/img/delete_many`, {
                    delImgList,
                });
            } catch (err) {
                console.error(err.meesage);
            }
        }
        blockBack = false;
        goto(toPage);
    }

    // 뒤로가기시 제목 or 컨텐츠 or 이미지 있을경우 처리 할 부분!!
    beforeNavigate((nav) => {
        let hasData = false;

        if (subject || content || (delImgList && delImgList.length > 0)) {
            hasData = true;
        }

        console.log(`hasData : ${hasData}`);

        if (blockBack && hasData) {
            toPage = nav.to.url.pathname;
            escapePageModal = true;
            nav.cancel();
        }
    });

    async function uploadShowFee() {
        if (!subject) {
            uploadChkModalTxt = "제목을 입력 해 주세요.";
            uploadChkModalShow = true;
            errType = "subject";
            return;
        }
        if (!content) {
            uploadChkModalTxt = "내용을 입력 해 주세요.";
            uploadChkModalShow = true;
            errType = "content";
            return;
        }

        try {
            const res = await axios.post(`${back_api}/board/upload`, {
                user_id: $user_info.idx,
                subject,
                content,
                imgs,
                is_anonymous: isAnonymous ? 1 : 0,
            });

            blockBack = false;
            toastStore.set({
                show: true,
                message: "게시글 업로드가 완료 되었습니다.",
                // color: "#FF3636",
                color: "#2478FF",
            });
            goto("/showfee");
        } catch (err) {
            const m = err.response.data.message;
            console.log(m);
        }
    }

    async function updateShowFee() {
        if (!subject) {
            uploadChkModalTxt = "제목을 입력 해 주세요.";
            uploadChkModalShow = true;
            errType = "subject";
            return;
        }
        if (!content) {
            uploadChkModalTxt = "내용을 입력 해 주세요.";
            uploadChkModalShow = true;
            errType = "content";
            return;
        }

        try {
            const res = await axios.post(`${back_api}/board/update`, {
                item_id: modifyIdx,
                subject,
                content,
                imgs,
            });

            blockBack = false;
            toastStore.set({
                show: true,
                message: "게시글 업데이트가 완료 되었습니다.",
                // color: "#FF3636",
                color: "#2478FF",
            });

            if ($prev) {
                goto($prev);
            } else {
                goto("/manage_board");
            }
        } catch (err) {
            const m = err.response.data.message;
            console.log(m);
        }
    }

    function updateImg(e) {
        // 새로고침 또는 뒤로가기 시에 삭제할 이미지 리스트 정하기
        if (e["type"]) {
            if (e.type == "add") {
                delImgList.push(e.url);
            } else {
                const tempArr = delImgList.filter((item) => item !== e.url);
                delImgList = tempArr;
            }
        }
        // // 정상적으로 업로드 될 이미지 리스트 셋
        const imgArr = e.imgArr;
        let imgStr = "";
        for (let i = 0; i < imgArr.length; i++) {
            const con = imgArr[i];
            imgStr += con.href + ",";
        }
        imgs = imgStr.slice(0, -1);

        console.log(imgs);
    }
</script>

<!-- 페이지 벗어나려고 할 시 보이는 모달 -->
<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={escapePageModal} closeBtn={false}>
    <div class="py-4 px-2">
        <div class="flex justify-center mb-6">
            <div
                class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 shadow-sm border border-amber-100"
            >
                <i class="fa fa-exclamation-circle text-3xl" aria-hidden="true"
                ></i>
            </div>
        </div>

        <div class="text-center space-y-2 mb-8">
            <h3 class="text-lg font-extrabold text-slate-800">
                정말 나가시겠어요?
            </h3>
            <div class="text-slate-500 text-sm leading-relaxed">
                <p>지금 페이지를 벗어나면</p>
                <p>
                    <span class="text-red-500 font-bold"
                        >작성 중인 모든 내용이 삭제</span
                    >됩니다.
                </p>
            </div>
        </div>

        <div
            class="flex flex-col sm:flex-row justify-center items-center gap-3"
        >
            <button
                class="w-full sm:flex-1 h-12 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all order-2 sm:order-1"
                on:click={goToBackAndArrangeImg}
            >
                벗어나기
            </button>
            <button
                class="w-full sm:flex-1 h-12 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-95 transition-all order-1 sm:order-2"
                on:click={() => (escapePageModal = false)}
            >
                계속 작성하기
            </button>
        </div>
    </div>
</CustomModal>

<CustomModal bind:visible={uploadChkModalShow} closeBtn={false}>
    <div class="p-4">
        <div class="flex justify-center mb-6">
            <div class="bg-red-50 p-4 rounded-full">
                <i
                    class="fa fa-exclamation-circle text-red-500 text-4xl"
                    aria-hidden="true"
                ></i>
            </div>
        </div>

        <div class="text-center mb-8">
            <h3 class="text-xl font-bold text-gray-800 mb-2">
                확인이 필요합니다
            </h3>
            <p class="text-gray-600 leading-relaxed">
                {uploadChkModalTxt}
            </p>
        </div>

        <div class="flex justify-center">
            <button
                class="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium transition-all shadow-lg active:scale-95"
                on:click={() => {
                    errType == "subject"
                        ? subjectArea.focus()
                        : contentArea.focus();
                }}
            >
                확인했습니다
            </button>
        </div>
    </div>
</CustomModal>

<PageHeader pageName="게시판 글 작성"></PageHeader>

<div class=" pt-6 pb-32 suit-font px-4 bg-slate-50 min-h-screen">
    <div class="max-w-[640px] mx-auto">
        <div class="mb-8 flex justify-between items-end px-1">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">
                    {#if modifyIdx}게시글 수정{:else}새로운 게시글{/if}
                </h1>
                <p class="text-slate-500 text-sm mt-1">
                    다양한 현장 이야기를 들려주세요.
                </p>
            </div>

            <label class="flex items-center gap-2 cursor-pointer group">
                <span
                    class="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors"
                >
                    익명으로 작성
                </span>
                <div class="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        bind:checked={isAnonymous}
                        class="sr-only peer"
                    />
                    <div
                        class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                    ></div>
                </div>
            </label>
        </div>

        <div
            class="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden transition-all"
        >
            <div class="p-6 md:p-8 space-y-8">
                <div class="space-y-2">
                    <label
                        for="subject"
                        class="text-sm font-semibold text-slate-700 ml-1"
                    >
                        제목
                    </label>
                    <input
                        id="subject"
                        type="text"
                        placeholder="제목을 입력해 주세요"
                        bind:this={subjectArea}
                        bind:value={subject}
                        class="w-full text-lg font-medium border-0 border-b-2 border-slate-100 p-2 focus:ring-0 focus:border-blue-500 transition-colors placeholder:text-slate-300"
                    />
                </div>

                <div class="space-y-3">
                    <div class="flex items-center gap-2 ml-1">
                        <label class="text-sm font-semibold text-slate-700"
                            >이미지 첨부</label
                        >
                        <span class="text-xs text-slate-400 font-normal"
                            >최대 10장</span
                        >
                    </div>
                    <div
                        class="bg-slate-50 rounded-xl p-4 border-2 border-dashed border-slate-200 hover:border-blue-300 transition-colors"
                    >
                        <SortableImg
                            {updateImg}
                            maxImgCount={10}
                            folder={"boardfee"}
                            {imgModifyList}
                        ></SortableImg>
                    </div>
                </div>

                <div class="">
                    <label
                        for="content"
                        class="text-sm font-semibold text-slate-700 ml-1"
                        >내용</label
                    >
                    <textarea
                        id="content"
                        rows="12"
                        placeholder="이곳에 내용을 작성해 주세요..."
                        class="w-full bg-slate-50 rounded-xl border-slate-200 p-4 focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all text-slate-700 leading-relaxed resize-none"
                        bind:value={content}
                        bind:this={contentArea}
                    ></textarea>
                </div>

                <div
                    class="flex items-start gap-3 p-4 bg-amber-50 rounded-xl text-amber-700"
                >
                    <div class="mt-0.5 text-amber-500">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </div>
                    <div class="text-[12px] leading-tight opacity-90">
                        <p class="font-bold mb-1 underline underline-offset-2">
                            업로드 안내
                        </p>
                        <p>
                            작성 완료 시 이미지는 글 상단에, 텍스트는 하단에
                            정렬되어 표시됩니다.
                        </p>
                    </div>
                </div>

                <div class="pt-4 flex gap-3">
                    <button
                        class="btn btn-ghost bg-slate-100 hover:bg-slate-200 text-slate-600 flex-1 h-12"
                        on:click={() => history.back()}
                    >
                        취소
                    </button>

                    {#if modifyIdx}
                        <button
                            class="btn flex-[2] h-12 border-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-100 transition-all font-bold"
                            on:click={updateShowFee}
                        >
                            <i class="fa fa-check mr-2"></i> 수정 완료
                        </button>
                    {:else}
                        <button
                            class="btn flex-[2] h-12 border-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-100 transition-all font-bold"
                            on:click={uploadShowFee}
                        >
                            게시글 등록하기
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* 스무스한 포커스 효과를 위한 커스텀 스타일 */
    input:focus,
    textarea:focus {
        outline: none;
    }
    .suit-font {
        font-family: "SUIT", sans-serif;
    }
</style>
