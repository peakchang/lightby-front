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

<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={escapePageModal} closeBtn={false}>
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-5">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div class="mb-5">
            페이지에서 벗어날시 등록중인 글은 삭제됩니다. 진행하시겠습니까?
        </div>
        <div class="flex justify-center items-center gap-3">
            <button
                class="btn btn-active btn-info text-white w-1/3"
                on:click={goToBackAndArrangeImg}
            >
                뒤로가기
            </button>
            <button class="btn btn-active w-1/3">취소</button>
        </div>
    </div>
</CustomModal>

<CustomModal bind:visible={uploadChkModalShow} closeBtn={false}>
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-5">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div class="mb-5">
            {uploadChkModalTxt}
        </div>
        <div class="flex justify-center items-center gap-3">
            <button
                class="btn btn-active w-1/3"
                on:click={() => {
                    if (errType == "subject") {
                        subjectArea.focus();
                    } else {
                        contentArea.focus();
                    }
                }}
            >
                닫기
            </button>
        </div>
    </div>
</CustomModal>

<PageHeader></PageHeader>

<!-- svelte-ignore event_directive_deprecated -->
<div class="pt-16 pb-32 paperlogy px-3">
    <div class="bg-white relative min-h-screen">
        <div class="max-w-[530px] mx-auto pb-16">
            <div class="border border-gray-300 p-2 rounded-lg">
                <div class="mb-5">
                    <input
                        type="text"
                        bind:this={subjectArea}
                        bind:value={subject}
                        class="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-400 text-xs md:text-sm"
                    />
                </div>
                <!-- imgModifyList={} -->
                <SortableImg
                    {updateImg}
                    maxImgCount={10}
                    folder={"boardfee"}
                    {imgModifyList}
                ></SortableImg>

                <div class="mt-5">
                    <textarea
                        rows="5"
                        class="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-400 text-xs md:text-sm"
                        bind:value={content}
                        bind:this={contentArea}
                    ></textarea>
                </div>

                <div class="text-center mt-3">
                    {#if modifyIdx}
                        <button
                            class="btn btn-success text-white w-1/2 md:w-1/3"
                            on:click={updateShowFee}
                        >
                            수정하기
                        </button>
                    {:else}
                        <button
                            class="btn btn-success text-white w-1/2 md:w-1/3"
                            on:click={uploadShowFee}
                        >
                            등록하기
                        </button>
                    {/if}
                </div>

                <div class="mt-8 text-xs">
                    ○ 글 업로드 시 이미지는 상단 / 글은 하단에 표시됩니다.
                </div>
            </div>
        </div>
    </div>
</div>
