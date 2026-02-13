<script>
    import { goto } from "$app/navigation";
    import { user_info } from "$lib/stores/stores";
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import axios from "axios";

    let id = $state("");
    let password = $state("");

    // 모달 관련
    let successModal = $state(false);
    let successMessage = $state("");
    let alertModal = $state(false);
    let alertMessage = $state("");
    let modalLoading = $state(false);

    onMount(async () => {
        if ($user_info.idx) {
            alertMessage = "이미 로그인 되어 있습니다.";
            alertModal = true;
            setTimeout(() => {
                alertModal = false;
                location.href = "/";
            }, 800);
        }
    });

    async function loginSubmit(e) {
        e.preventDefault();
        const movePath = $page.url.searchParams.get("path");

        try {
            const res = await axios.post(`/auth/login`, { id, password });

            successMessage = "반갑습니다! 곧 메인으로 이동합니다.";
            successModal = true;
            modalLoading = true;

            const random = Math.floor(Math.random() * (1200 - 800 + 1)) + 800;
            setTimeout(() => {
                successModal = false;
                modalLoading = false;
                location.href = movePath ? movePath : "/";
            }, random);
        } catch (err) {
            const m = err.response?.data?.message;
            alertModal = true;
            alertMessage = `${m ? m : "로그인 정보가 올바르지 않습니다."}`;
        }
    }

    const kakao_login = () => {
        const kakaoInfo = {
            kakao_restapi: import.meta.env.VITE_KAKAO_RESTAPI,
            kakao_redirect: import.meta.env.VITE_KAKAO_REDIRECT_URI,
        };
        location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoInfo.kakao_restapi}&redirect_uri=${kakaoInfo.kakao_redirect}&response_type=code`;
    };
</script>

<div
    class="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 suit-font"
>
    <div
        class="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
    >
        <div
            class="pt-12 pb-8 text-center bg-gradient-to-b from-blue-50 to-white"
        >
            <a
                href="/"
                class="inline-block transition-transform hover:scale-105"
            >
                <img src="/logo.png" alt="번개분양 로고" class="h-12 mx-auto" />
            </a>
            <h2 class="mt-5 text-xl font-bold text-slate-800 tracking-tight">
                서비스 이용을 위해 로그인해주세요
            </h2>
        </div>

        <div class="p-8 pt-2">
            <form onsubmit={loginSubmit} class="space-y-4">
                <div class="form-control">
                    <div class="relative flex items-center">
                        <span class="absolute left-4 z-10 text-slate-400">
                            <i class="fa fa-user-o" aria-hidden="true"></i>
                        </span>
                        <input
                            type="text"
                            class="input input-bordered w-full h-14 pl-12 bg-slate-50 border-gray-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-700"
                            placeholder="아이디"
                            bind:value={id}
                            required
                        />
                    </div>
                </div>

                <div class="form-control">
                    <div class="relative flex items-center">
                        <span class="absolute left-4 z-10 text-slate-400">
                            <i class="fa fa-lock" aria-hidden="true"></i>
                        </span>
                        <input
                            type="password"
                            class="input input-bordered w-full h-14 pl-12 bg-slate-50 border-gray-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-700"
                            placeholder="비밀번호"
                            bind:value={password}
                            required
                        />
                    </div>
                </div>

                <button
                    class="btn btn-primary w-full h-14 rounded-2xl text-lg font-semibold border-none shadow-lg shadow-blue-100 mt-2"
                >
                    로그인
                </button>
            </form>

            <div class="relative my-8">
                <div class="absolute inset-0 flex items-center">
                    <span class="w-full border-t border-slate-100"></span>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-white px-2 text-slate-400">또는</span>
                </div>
            </div>

            <div class="space-y-3">
                <button
                    class="w-full h-14 bg-[#FEE500] hover:bg-[#FADA0A] text-slate-800 font-semibold rounded-2xl flex justify-center items-center gap-3 transition-all active:scale-95"
                    onclick={kakao_login}
                >
                    <img src="/kakao_logo.png" alt="카카오" class="w-6 h-6" />
                    카카오 로그인
                </button>

                <button
                    class="w-full h-14 text-sm bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all flex justify-center items-center gap-2"
                    onclick={() => goto("/auth/join")}
                >
                    아직 회원이 아니신가요?
                    <span
                        class="text-blue-600 font-bold underline underline-offset-4"
                    >
                        회원가입
                    </span>
                </button>
            </div>
        </div>

        <div class="pb-8 text-center">
            <button
                class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >아이디/비밀번호 찾기</button
            >
        </div>
    </div>
</div>

<CustomModal bind:visible={successModal} closeBtn={false}>
    <div class="py-8 px-4 text-center suit-font">
        <div class="mb-6 relative inline-block">
            <div
                class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110 success-pulse"
            >
                <i
                    class="fa fa-check-circle text-green-500 text-5xl"
                    aria-hidden="true"
                ></i>
            </div>
            <span
                class="absolute -top-1 -right-2 text-yellow-400 text-xl animate-bounce"
                >✨</span
            >
        </div>

        <h3 class="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">
            완료되었습니다!
        </h3>

        <div
            class="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100 flex items-center justify-center"
        >
            <p class="text-slate-600 font-semibold leading-relaxed">
                {successMessage}
            </p>
        </div>

        {#if modalLoading}
            <div class="flex flex-col items-center gap-3 py-2">
                <span class="loading loading-dots loading-md text-blue-500"
                ></span>
                <p class="text-xs text-slate-400">잠시만 기다려주세요...</p>
            </div>
        {/if}
    </div>
</CustomModal>

<CustomModal bind:visible={alertModal}>
    <div class="py-6 px-4 text-center suit-font">
        <div class="mb-6 relative inline-block">
            <div
                class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110"
            >
                <i
                    class="fa fa-exclamation-triangle text-red-500 text-4xl"
                    aria-hidden="true"
                ></i>
            </div>
            <div
                class="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm"
            >
                <i class="fa fa-question-circle text-red-300 text-xs"></i>
            </div>
        </div>

        <h3 class="text-xl font-bold text-slate-800 mb-3 tracking-tight">
            확인이 필요합니다
        </h3>
        <div
            class="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100 min-h-[60px] flex items-center justify-center"
        >
            <p class="text-slate-600 font-medium leading-relaxed">
                {alertMessage}
            </p>
        </div>

        <button
            class="btn btn-lg w-full max-w-[200px] bg-slate-800 hover:bg-slate-900 border-none text-white rounded-2xl font-bold shadow-md transition-all active:scale-95"
            onclick={() => (alertModal = false)}
        >
            확인
        </button>
    </div>
</CustomModal>

<style>
    :global(.suit-font) {
        font-family: "SUIT", sans-serif;
    }
    .btn-primary {
        background-color: #3b82f6;
    }
    .btn-primary:hover {
        background-color: #2563eb;
    }

    /* 애니메이션 효과 */
    .bg-red-50 {
        animation: pulse-red 2s infinite;
    }

    @keyframes pulse-red {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }

    /* 성공 아이콘 부드러운 맥박 애니메이션 */
    .success-pulse {
        animation: success-pulse 2s infinite;
    }

    @keyframes success-pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.2);
            transform: scale(1);
        }
        50% {
            box-shadow: 0 0 0 15px rgba(34, 197, 94, 0);
            transform: scale(1.05);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
            transform: scale(1);
        }
    }
</style>
