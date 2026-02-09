<script>
    import axios from "axios";

    import CustomAccodian from "$lib/components/CustomAccodian.svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";

    import { onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";

    import { back_api } from "$lib/const";
    import {
        user_info,
        toastStore,
        pageScrollStatus,
    } from "$lib/stores/stores";

    let { data } = $props();

    let faqList = $state([]);
    let qnaList = $state([]);

    onMount(() => {
        $pageScrollStatus = true; // 페이지 진입시 저장된 스크롤로 이동
        faqList = data.faqList;
    });
    $effect(() => {
        qnaList = data.qnaList;
    });

    let qnaTxtAreaBool = $state(false);
    let questionVal = $state("");

    let alertModal = $state(false);

    async function uploadQuestion() {
        if (!questionVal) {
            alertModal = true;
            return;
        }

        try {
            const res = await axios.post(`${back_api}/qna/upload`, {
                userId: $user_info.idx,
                questionVal,
            });

            if (res.status) {
                qnaTxtAreaBool = false;
                console.log("정상반영?!?!");

                invalidateAll();
                toastStore.set({
                    show: true,
                    message: "질문 사항 업로드가 완료 되었습니다.",
                    color: "#6799FF",
                });
            }
        } catch (error) {}
    }

    let activeTab = $state("faq"); // 'faq' 또는 'qna'
</script>

<!-- <CustomModal bind:visible={alertModal}>
    <div class="text-center">
        <div class=" text-blue-600 text-4xl mb-3">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        </div>
        <div>질문 내용을 등록 해주세요!</div>
    </div>
</CustomModal> -->

<div class="min-h-screen bg-gray-50 suit-font pb-24 px-4 pt-10">
    <div class="max-w-[500px] mx-auto text-center mb-10">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
            Customer Center
        </h1>
        <p class="text-gray-500 text-sm">
            무엇을 도와드릴까요? 신속하게 답변해 드립니다.
        </p>
    </div>

    <div
        class="max-w-[500px] mx-auto mb-8 p-1.5 bg-gray-200/50 rounded-2xl flex"
    >
        <button
            class="flex-1 py-3 text-[15px] font-bold rounded-xl transition-all"
            class:bg-white={activeTab === "faq"}
            class:shadow-sm={activeTab === "faq"}
            class:text-sky-600={activeTab === "faq"}
            class:text-gray-400={activeTab !== "faq"}
            onclick={() => (activeTab = "faq")}
        >
            자주 묻는 질문
        </button>
        <button
            class="flex-1 py-3 text-[15px] font-bold rounded-xl transition-all"
            class:bg-white={activeTab === "qna"}
            class:shadow-sm={activeTab === "qna"}
            class:text-sky-600={activeTab === "qna"}
            class:text-gray-400={activeTab !== "qna"}
            onclick={() => (activeTab = "qna")}
        >
            1:1 문의
        </button>
    </div>

    <div class="max-w-[500px] mx-auto">
        {#if activeTab === "faq"}
            {#if faqList.length > 0}
                <div
                    class="bg-white rounded-[28px] p-2 shadow-sm border border-gray-100 animate-fade-in"
                >
                    <CustomAccodian items={faqList} allowMultiple={false} />
                </div>
            {:else}
                <div class="py-20 text-center text-gray-400">
                    등록된 FAQ가 없습니다.
                </div>
            {/if}
        {:else}
            <div class="animate-fade-in">
                {#if !$user_info.idx}
                    <div
                        class="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100"
                    >
                        <div
                            class="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <i class="fa fa-lock text-2xl"></i>
                        </div>
                        <p class="text-gray-600 font-medium mb-5 text-sm">
                            1:1 문의는 로그인 후 이용 가능합니다.
                        </p>
                        <button
                            class="btn btn-info w-full rounded-2xl text-white border-none shadow-lg shadow-sky-100 h-12"
                            onclick={() => goto("/auth/login")}
                        >
                            로그인하러 가기
                        </button>
                    </div>
                {:else if qnaTxtAreaBool}
                    <div
                        class="bg-white rounded-3xl p-6 shadow-xl border border-sky-100 mb-6 ring-4 ring-sky-50/50"
                    >
                        <h3
                            class="font-bold text-gray-800 mb-4 flex items-center gap-2"
                        >
                            <span class="w-2 h-2 bg-sky-500 rounded-full"
                            ></span> 질문 내용 작성
                        </h3>
                        <textarea
                            class="w-full bg-gray-50 border-none rounded-2xl p-4 text-[15px] focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-gray-300"
                            rows="6"
                            placeholder="궁금하신 내용을 자세히 적어주세요. 확인 후 정성껏 답변해 드릴게요!"
                            bind:value={questionVal}
                        ></textarea>
                        <div class="flex gap-2 mt-4">
                            <button
                                class="btn flex-1 bg-gray-100 hover:bg-gray-200 border-none text-gray-500 rounded-xl h-12"
                                onclick={() => (qnaTxtAreaBool = false)}
                            >
                                취소
                            </button>
                            <button
                                class="btn flex-1 bg-sky-500 hover:bg-sky-600 border-none text-white rounded-xl h-12 shadow-lg shadow-sky-100"
                                onclick={uploadQuestion}
                            >
                                질문 등록
                            </button>
                        </div>
                    </div>
                {:else}
                    {#if qnaList.length > 0}
                        <div
                            class="bg-white rounded-[28px] p-2 shadow-sm border border-gray-100 mb-6"
                        >
                            <CustomAccodian
                                items={qnaList}
                                allowMultiple={false}
                                answerStatus={true}
                            />
                        </div>
                    {:else}
                        <div
                            class="bg-white rounded-[28px] py-16 text-center shadow-sm border border-gray-100 mb-6"
                        >
                            <div class="text-gray-200 text-5xl mb-4">
                                <i class="fa fa-comments-o"></i>
                            </div>
                            <p class="text-gray-400 text-sm">
                                작성된 문의 내역이 없습니다.
                            </p>
                        </div>
                    {/if}

                    <button
                        class="w-full bg-white border-2 border-dashed border-sky-200 py-4 rounded-2xl text-sky-500 font-bold hover:bg-sky-50 transition-all flex items-center justify-center gap-2"
                        onclick={() => (qnaTxtAreaBool = true)}
                    >
                        <i class="fa fa-plus-circle"></i> 새로운 질문 작성하기
                    </button>
                {/if}
            </div>
        {/if}
    </div>
</div>

<CustomModal bind:visible={alertModal}>
    <div class="p-4 text-center">
        <div
            class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
        >
            <i class="fa fa-exclamation-circle"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">
            내용을 입력해주세요
        </h3>
        <p class="text-gray-400 text-sm">
            질문 내용을 작성하셔야 등록이 가능합니다.
        </p>
    </div>
</CustomModal>

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fade-in {
        animation: fadeIn 0.4s ease-out;
    }

    /* 아코디언 컴포넌트 내부 여백 보정 (필요시) */
    :global(.custom-accordion-item) {
        border-bottom: 1px solid #f8fafc !important;
    }
</style>
