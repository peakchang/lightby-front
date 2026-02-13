<script>
    import { public_img_bucket } from "$lib/const";
    import moment from "moment-timezone";
    import { fade, scale } from "svelte/transition";

    let { data } = $props();

    let applicantList = $state(data.applicantList || []);
    let selectedApplicant = $state(null); // 모달용 상태

    function handleImageError(e) {
        e.target.src = "/alt_image.jpg";
    }

    function openModal(item) {
        selectedApplicant = item;
    }

    function closeModal() {
        selectedApplicant = null;
    }
</script>

<div class="space-y-3">
    {#each applicantList as item}
        <div
            class="flex flex-col p-5 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md"
        >
            <div class="flex gap-4">
                <div
                    class="w-14 h-14 shrink-0 bg-gray-100 rounded-full overflow-hidden border border-gray-50"
                >
                    <img
                        src={item.profile_thumbnail
                            ? `${public_img_bucket}${item.profile_thumbnail}`
                            : "/alt_image.jpg"}
                        alt="프로필"
                        onerror={handleImageError}
                        class="w-full h-full object-cover"
                    />
                </div>

                <div class="flex-1 min-w-0 flex flex-col justify-center">
                    <div class="flex justify-between items-center mb-1">
                        <div class="flex items-center gap-2">
                            <h3
                                class="text-base font-bold text-gray-800 leading-none"
                            >
                                {item.name}
                            </h3>
                            {#if item.status === "unread"}
                                <span
                                    class="w-1.5 h-1.5 rounded-full bg-red-500"
                                ></span>
                            {/if}
                        </div>
                        <span class="text-[10px] text-gray-400 font-medium">
                            {moment(item.created_at).format("YY.MM.DD")}
                        </span>
                    </div>

                    <div
                        class="text-xs text-gray-500 flex items-center gap-1.5"
                    >
                        <span
                            class="bg-gray-50 px-1.5 py-0.5 rounded text-gray-400 font-medium"
                            >정보</span
                        >
                        <span>{item.age ? `${item.age}세` : "나이 미입력"}</span
                        >
                        <span class="text-gray-200">|</span>
                        <span>
                            {item.gender === "M"
                                ? "남성"
                                : item.gender === "F"
                                  ? "여성"
                                  : "성별 미입력"}
                        </span>
                    </div>
                </div>
            </div>

            <div
                class="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between"
            >
                <div>
                    {#if item.status === "unread"}
                        <span
                            class="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-red-50 text-red-500"
                        >
                            미열람
                        </span>
                    {:else}
                        <span
                            class="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-gray-100 text-gray-500"
                        >
                            열람완료
                        </span>
                    {/if}
                </div>

                <button
                    class="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold active:scale-95 transition-all shadow-sm hover:bg-slate-800"
                    onclick={() => openModal(item)}
                >
                    지원자 상세
                </button>
            </div>
        </div>
    {/each}

    {#if applicantList.length === 0}
        <div class="py-24 text-center">
            <p class="text-gray-300 font-bold text-sm">
                아직 지원자가 없습니다.
            </p>
        </div>
    {/if}
</div>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if selectedApplicant}
    <div
        transition:fade={{ duration: 200 }}
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        onclick={closeModal}
    >
        <div
            transition:scale={{ start: 0.95, duration: 200 }}
            class="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative"
            style="max-height: 80vh;"
            onclick={(e) => e.stopPropagation()}
        >
            <button
                onclick={closeModal}
                class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors z-20"
            >
                ✕
            </button>

            <div class="flex-1 overflow-y-auto custom-scrollbar pt-12">
                <div class="flex justify-center mb-6">
                    <div
                        class="w-36 h-36 rounded-[2.5rem] border-4 border-gray-50 overflow-hidden bg-gray-100 shadow-xl"
                    >
                        <img
                            src={selectedApplicant.profile_image
                                ? `${public_img_bucket}${selectedApplicant.profile_image}`
                                : "/alt_image.jpg"}
                            alt="프로필"
                            onerror={handleImageError}
                            class="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div class="px-8 pb-6">
                    <div class="text-center mb-8">
                        <h2 class="text-2xl font-black text-gray-900">
                            {selectedApplicant.name}
                        </h2>
                        <div
                            class="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-lg"
                        >
                            <p class="text-xs font-bold text-slate-500">
                                지원자 상세 정보
                            </p>
                        </div>
                        <p
                            class="text-sm text-gray-600 mt-5 leading-relaxed whitespace-pre-wrap px-2"
                        >
                            {selectedApplicant.introduction ||
                                "등록된 자기소개가 없습니다."}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-3 mb-6">
                        <div
                            class="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center"
                        >
                            <p
                                class="text-[10px] text-gray-400 font-bold uppercase mb-1"
                            >
                                Age
                            </p>
                            <p class="text-base font-bold text-gray-800">
                                {selectedApplicant.age || "?"}세
                            </p>
                        </div>
                        <div
                            class="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center"
                        >
                            <p
                                class="text-[10px] text-gray-400 font-bold uppercase mb-1"
                            >
                                Gender
                            </p>
                            <p class="text-base font-bold text-gray-800">
                                {selectedApplicant.gender === "M"
                                    ? "남성"
                                    : "여성"}
                            </p>
                        </div>
                    </div>

                    <div class="mb-8">
                        <p
                            class="text-[11px] text-gray-400 font-black mb-3 px-1 uppercase tracking-widest"
                        >
                            Experience
                        </p>
                        <div class="space-y-2.5">
                            {#if selectedApplicant.career}
                                {#each selectedApplicant.career.split("|") as exp}
                                    <div
                                        class="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                                    >
                                        <div
                                            class="w-2 h-2 rounded-full bg-blue-500 shrink-0"
                                        ></div>
                                        <span
                                            class="text-sm text-gray-700 font-semibold"
                                            >{exp.trim()}</span
                                        >
                                    </div>
                                {/each}
                            {:else}
                                <p class="text-sm text-gray-400 italic px-1">
                                    등록된 경력 정보가 없습니다.
                                </p>
                            {/if}
                        </div>
                    </div>

                    <div
                        class="bg-slate-900 p-5 rounded-[2rem] text-white shadow-inner"
                    >
                        <div
                            class="flex justify-between items-center text-xs opacity-80 mb-3"
                        >
                            <span>지원 일시</span>
                            <span class="font-mono"
                                >{moment(selectedApplicant.created_at).format(
                                    "YYYY.MM.DD HH:mm",
                                )}</span
                            >
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs opacity-80"
                                >현재 열람 상태</span
                            >
                            <span
                                class="text-xs font-bold {selectedApplicant.status ===
                                'unread'
                                    ? 'text-red-400'
                                    : 'text-blue-400'}"
                            >
                                ● {selectedApplicant.status === "unread"
                                    ? "미열람"
                                    : "확인완료"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-8 pt-4">
                <button
                    onclick={closeModal}
                    class="w-full py-4.5 bg-gray-100 text-gray-900 rounded-2xl font-black hover:bg-gray-200 active:scale-[0.98] transition-all"
                >
                    닫기
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    /* 스크롤바 커스텀: 얇고 세련되게 */
    .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #f1f1f1;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    /* 버튼 패딩 보정 */
    .py-4\.5 {
        padding-top: 1.125rem;
        padding-bottom: 1.125rem;
    }
</style>
