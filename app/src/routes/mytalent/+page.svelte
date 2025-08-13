<script>
    import PageHeader from "$lib/components/PageHeader.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let gender = $state("");
</script>

<PageHeader />

<div class="bg-white relative min-h-screen">
    <div class="max-w-[530px] mx-auto pretendard pt-14 pb-24 px-4 md:px-0">
        <div class="text-center mb-6">
            <p>📝 프로필을 작성해 주세요.</p>
            <p>😄 시행사 · 대행사 · 본부장 · 팀장님께서 ⚡</p>
            <p>빠르게 연락드릴 수 있어요 🤝</p>
        </div>

        <div class="mb-6">
            <div class="mb-1">이름</div>
            <div>
                <input
                    type="text"
                    class="border w-2/3 py-2 px-3 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
                />
            </div>
        </div>

        <div class="mb-6">
            <div class="mb-1">성별</div>
            <div class="flex gap-2">
                <label class="button-checkbox w-full">
                    <input
                        type="radio"
                        hidden
                        value="남자"
                        bind:group={gender}
                    />
                    <div>남자</div>
                </label>

                <label class="button-checkbox w-full">
                    <input
                        type="radio"
                        hidden
                        value="여자"
                        bind:group={gender}
                    />
                    <div>여자</div>
                </label>
            </div>
        </div>

        <div class="mb-6">
            <div class="mb-1">연령</div>
            <div>
                <input
                    type="text"
                    class="border w-2/3 py-2 px-3 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
                />
            </div>
        </div>

        <div class="mb-6">
            <div class="mb-1">경력</div>

            <table class="w-full mb-5">
                <tbody>
                    <!-- <tr>
                        <td class="border border-gray-300 p-2.5 text-sm">
                            경력1 어쩌구 저쩌구 쏼라쏼라
                        </td>
                    </tr> -->
                </tbody>
            </table>

            <div class="flex items-center gap-2">
                <input
                    type="text"
                    class="border w-full py-2 px-3 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
                />

                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button class="cursor-pointer">
                    <svg
                        fill="#000000"
                        width="30px"
                        height="30px"
                        viewBox="0 0 32 32"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM23 15h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1z"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>

        <div class="mb-6">
            <div class="mb-1">자기소개</div>
            <div>
                <textarea
                    class="border w-full py-2 px-3 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
                    rows="6"
                ></textarea>
            </div>
        </div>

        <div class="text-center">
            <button class="btn btn-info w-1/3 text-white">적용하기</button>
            <button class="btn btn-error w-1/3 text-white">건너뛰기</button>
        </div>
    </div>
</div>

<style>
    .button-checkbox div {
        display: block;
        background-color: #f0f0f0;
        color: #333;
        font-size: 14px;
        border: 1.5px solid #ccc;
        border-radius: 5px;
        padding: 8px 0;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
    }

    .button-checkbox input[type="checkbox"]:checked + div {
        background-color: #08b9ff;
        color: white;
        border-color: #0099ff;
    }

    .button-checkbox input[type="radio"]:checked + div {
        background-color: #08b9ff;
        color: white;
        border-color: #0099ff;
    }
</style>
