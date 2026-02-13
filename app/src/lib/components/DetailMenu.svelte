<script>
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { page } from "$app/stores";
    import { user_info } from "$lib/stores/stores";
    import axios from "axios";
    import { back_api } from "$lib/const";
    import { favorateBool } from "$lib/stores/stores";
    import { toastStore } from "$lib/stores/stores";
    import { goto } from "$app/navigation";
    import { prev } from "$lib/stores/stores";

    let { favorateShow = true, shareShow = true } = $props();

    let notLoginAlertModal = $state(false);
    let shareModal = $state(false);

    async function favorateAct() {
        if (!$user_info.idx) {
            notLoginAlertModal = true;
            return;
        }

        try {
            const res = await axios.post(`${back_api}/detail/postlike_act`, {
                user_id: $user_info.idx,
                item_id: $page.params.id,
                type: this.value,
            });

            $favorateBool = !$favorateBool;
            //     toastShow = 1;
            if ($favorateBool) {
                toastStore.set({
                    show: true,
                    message: "관심현장에 등록 되었습니다.",
                    color: "#6799FF",
                });
            } else {
                toastStore.set({
                    show: true,
                    message: "관심현장에 해제 되었습니다.",
                    color: "#6799FF",
                });
            }
        } catch (err) {
            console.log(err.response.data.message);
        }
    }

    function openShareModal() {
        shareModal = true;
    }
</script>

<CustomModal bind:visible={shareModal}>
    <div class="py-4">
        <h3 class="text-center font-bold text-gray-800 mb-6 text-lg">
            현장 정보 공유하기
        </h3>
        <div class="flex justify-center items-center gap-8">
            <button
                class="flex flex-col items-center gap-2 group"
                onclick={() => {
                    navigator.clipboard.writeText($page.url.href).then(() =>
                        toastStore.set({
                            show: true,
                            message: "주소가 복사되었습니다",
                            color: "#34d399",
                        }),
                    );
                }}
            >
                <div
                    class="w-14 h-14 bg-gray-50 rounded-2xl flex justify-center items-center text-gray-600 group-active:scale-90 transition-all border border-gray-100 shadow-sm"
                >
                    <i class="fa fa-link text-xl"></i>
                </div>
                <span class="text-xs font-medium text-gray-500">링크 복사</span>
            </button>

            <button class="flex flex-col items-center gap-2 group">
                <div
                    class="w-14 h-14 bg-[#FEE500] rounded-2xl flex justify-center items-center group-active:scale-90 transition-all shadow-sm"
                >
                    <img src="/kakao_logo.png" alt="kakao" width="24" />
                </div>
                <span class="text-xs font-medium text-gray-500">카카오톡</span>
            </button>
        </div>
    </div>
</CustomModal>

<CustomModal bind:visible={notLoginAlertModal} closeBtn={false}>
    <div class="p-4 text-center">
        <div
            class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
        >
            <i class="fa fa-heart"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">로그인이 필요해요</h3>
        <p class="text-sm text-gray-400 mb-8 leading-relaxed">
            관심 현장을 저장하고 나중에 다시 보시려면<br />로그인이 필요합니다.
        </p>
        <div class="flex gap-2">
            <button
                class="btn flex-1 bg-gray-100 border-none text-gray-500 rounded-xl h-12"
                onclick={() => (notLoginAlertModal = false)}>닫기</button
            >
            <button
                class="btn flex-1 bg-sky-500 border-none text-white rounded-xl h-12 shadow-lg shadow-sky-100"
                onclick={() => goto("/auth/login")}>로그인</button
            >
        </div>
    </div>
</CustomModal>

<header
    class="sticky top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-50"
>
    <div
        class="max-w-[640px] mx-auto h-16 flex justify-between items-center px-4"
    >
        <div class="w-12">
            <button
                class="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
                onclick={() => goto($prev || "/")}
            >
                <i class="fa fa-chevron-left text-lg text-gray-800"></i>
            </button>
        </div>

        <a href="/" class="flex-none">
            <img
                src="/logo.png"
                alt="번개분양"
                class="h-6 w-auto object-contain"
            />
        </a>

        <div class="flex items-center gap-1 w-12 justify-end">
            {#if favorateShow}
                <button
                    class="w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-all"
                    value={$favorateBool ? "unfav" : "fav"}
                    onclick={favorateAct}
                >
                    {#if $favorateBool}
                        <svg
                            width="22"
                            height="22"
                            fill="#FF4848"
                            viewBox="0 0 512 512"
                            class="animate-heart-pop"
                        >
                            <path
                                d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                            />
                        </svg>
                    {:else}
                        <svg
                            width="22"
                            height="22"
                            fill="none"
                            stroke="#D1D5DB"
                            stroke-width="32"
                            viewBox="0 0 512 512"
                        >
                            <path
                                d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z"
                            />
                        </svg>
                    {/if}
                </button>
            {/if}

            {#if shareShow}
                <button
                    class="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
                    onclick={openShareModal}
                >
                    <i class="fa fa-share-alt text-lg text-gray-400"></i>
                </button>
            {/if}
        </div>
    </div>
</header>

<style>
    /* 하트 클릭 시 톡 튀어나오는 애니메이션 */
    @keyframes heartPop {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.3);
        }
        100% {
            transform: scale(1);
        }
    }
    .animate-heart-pop {
        animation: heartPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* 로고가 너무 작아보이지 않게 보정 */
    header img {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.02));
    }
</style>
