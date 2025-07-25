<script>
    import { back_api } from "$lib/const";
    import axios from "axios";
    import { user_info } from "$lib/stores/stores";
    import moment from "moment-timezone";
    import { invalidateAll } from "$app/navigation";

    let { data } = $props();

    // qna 관련!!!
    let qnaList = $state([]); // qna 리스트

    let qnaOpen = $state(false);
    let qnaQuestion = $state("");
    let qnaAnswer = $state("");

    let modifyIdx = $state(0); // 수정 또는 답변시 idx 값 (같은 테이블이니까 같이 쓰쟈)

    $effect(() => {
        qnaList = data.qnaList;
    });

    async function updateQna() {
        console.log(qnaAnswer);
        console.log(modifyIdx);

        if (!qnaAnswer) {
            alert("답변을 입력해주세요!");
            return false;
        }
        try {
            const res = await axios.post(`${back_api}/qna/upload_qna_answer`, {
                qnaAnswer,
                idx: modifyIdx,
            });

            qnaOpen = false;
            qnaQuestion = "";
            qnaAnswer = "";
            invalidateAll();

            alert("답변이 등록 되었습니다.");
        } catch (error) {}
    }
</script>

<div class=" text-2xl font-extrabold">QnA!!!</div>

{#if qnaList.length == 0}
    <div class="mt-3 mb-8">등록된 QnA가 없습니다.</div>
{:else}
    <div class="overflow-x-auto mt-3 mb-8">
        <table class="table">
            <thead>
                <tr class="text-center">
                    <th>질문</th>
                    <th>답변</th>
                    <th>질문자 아이디 / 닉네임</th>
                    <th>등록일</th>
                    <th>버튼</th>
                </tr>
            </thead>
            <tbody>
                {#each qnaList as val, idx}
                    <tr class="text-center">
                        <td class="tb w-[250px]">
                            <div class="w-[250px] truncate">
                                {val.question}
                            </div>
                        </td>
                        <td class="tb w-[250px]">
                            <div class="w-[250px] truncate">
                                {#if val.answer}
                                    {val.answer}
                                {:else}
                                    <div class="badge badge-soft badge-error">
                                        답변대기
                                    </div>
                                {/if}
                            </div>
                        </td>
                        <td class="tb">
                            {val.id} / {val.nickname}
                        </td>
                        <td class="tb">
                            {moment(val.question_created_at).format(
                                "YY/MM/DD HH:mm",
                            )}
                        </td>

                        <td class="tb min-w-[80px]">
                            <button
                                class="btn btn-info btn-sm text-white"
                                value={val.idx}
                                onclick={(e) => {
                                    qnaOpen = true;
                                    modifyIdx = e.target.value;
                                    qnaQuestion = qnaList[idx]["question"];
                                    qnaAnswer = qnaList[idx]["answer"];
                                }}
                            >
                                답변
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}

{#if qnaOpen}
    <div class="mt-3 mb-12">
        <div class="mb-3">
            <div>Question</div>

            <div
                class="border border-gray-400 w-full max-w-[600px] rounded-md p-3 bg-gray-100 whitespace-pre-wrap"
            >
                {qnaQuestion}
            </div>
        </div>

        <div>
            <div>Answer</div>
            <textarea
                class="border border-gray-400 w-full max-w-[600px] rounded-md focus:outline-none focus:border-blue-500 p-3"
                rows="3"
                bind:value={qnaAnswer}
            ></textarea>
        </div>

        <button
            class="btn btn-info text-white"
            value="upload"
            onclick={updateQna}
        >
            QnA 답변 등록 완료 하기
        </button>
        <button
            class="btn btn-error text-white"
            onclick={() => {
                qnaOpen = false;
            }}
        >
            취소
        </button>
    </div>
{/if}
