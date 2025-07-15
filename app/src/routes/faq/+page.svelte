<script>
    import CustomAccodian from "$lib/components/CustomAccodian.svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { back_api } from "$lib/const";
    import axios from "axios";
    import { user_info, toastStore } from "$lib/stores/stores";
    import { onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";

    let { data } = $props();

    let faqList = $state([]);
    let qnaList = $state([]);

    onMount(() => {
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
</script>

<CustomModal bind:visible={alertModal}>
    <div class="text-center">
        <div class=" text-blue-600 text-4xl mb-3">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        </div>
        <div>질문 내용을 등록 해주세요!</div>
    </div>
</CustomModal>

{#if faqList.length > 0}
    <div class="">
        <h1 class="text-2xl font-bold mb-4">FAQ</h1>
        <CustomAccodian
            items={faqList}
            allowMultiple={false}
        />
    </div>
{/if}

<!-- svelte-ignore event_directive_deprecated -->
<div class="mt-5">
    <h1 class="text-2xl font-bold mb-4">QnA</h1>

    {#if !$user_info.idx}
        QnA 이용은 로그인 후 가능합니다
    {:else}
        {#if qnaList.length > 0}
            <div class="">
                <CustomAccodian
                    items={qnaList}
                    allowMultiple={false}
                    answerStatus={true}
                />
            </div>
        {:else}
            <div>작성된 질문이 없습니다.</div>
        {/if}
        여기는 QnA 리스트!!!
        {#if qnaTxtAreaBool}
            <div>
                <div>
                    <textarea
                        class="w-full border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500 p-3 text-sm"
                        rows="5"
                        bind:value={questionVal}
                    ></textarea>
                </div>
                <div class="text-right">
                    <button
                        class="btn btn-success text-white"
                        on:click={uploadQuestion}
                        >질문 등록
                    </button>
                    <button
                        class="btn btn-error text-white"
                        on:click={() => {
                            qnaTxtAreaBool = false;
                        }}
                    >
                        취소
                    </button>
                </div>
            </div>
        {:else}
            <div class="text-right">
                <button
                    class="btn btn-accent text-white"
                    on:click={() => {
                        qnaTxtAreaBool = true;
                    }}
                >
                    질문 작성하기
                </button>
            </div>
        {/if}
    {/if}
</div>
