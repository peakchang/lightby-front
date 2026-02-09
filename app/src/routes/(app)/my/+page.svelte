<script>
    import CustomModal from "$lib/components/CustomModal.svelte";
    import InterestSetting from "$lib/components/InterestSetting.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { navigating, page } from "$app/stores";
    import { onMount } from "svelte";
    import axios from "axios";

    import {
        regions,
        businessCategorys,
        jobCategorys,
        back_api,
        public_img_bucket,
    } from "$lib/const.js";

    import {
        user_info,
        toastStore,
        pageScrollStatus,
    } from "$lib/stores/stores";

    let { data } = $props();

    console.log(data);

    let userInfo = $derived({});

    // 관심 정보
    let location = $state([]);
    let business = $state([]);
    let occupation = $state([]);

    // 마지막 하나 없애는걸 방지하기 위해서!
    let selectVal = $state("");
    let lastData = $state("");
    onMount(() => {
        $pageScrollStatus = false; // 최상위 고정

        userInfo = data.userInfo;
        console.log(userInfo);

        if (userInfo.interest) {
            const interestJson = JSON.parse(userInfo.interest);
            location = interestJson.location;
            business = interestJson.business;
            occupation = interestJson.occupation;
        }
    });

    $effect(() => {});

    async function setInterest() {
        let jsonStr = "";
        if (
            location.length > 0 ||
            business.length > 0 ||
            occupation.length > 0
        ) {
            const setJson = { location, business, occupation };
            jsonStr = JSON.stringify(setJson);
        } else {
            jsonStr = "";
        }

        try {
            const res = await axios.post(`${back_api}/update_interest`, {
                idx: $user_info.idx,
                jsonStr,
            });

            toastStore.set({
                show: true,
                message: "관심 지역 설정이 완료 되었습니다.",
                color: "#4374D9",
            });

            invalidateAll();
        } catch (error) {
            alert("에러 발생! 관리자에게 문의하세요!");
        }
    }

    let interestModalBool = $state(false);
    let alertModalBool = $state(false);
</script>

<!-- 관심지역 설정 모달 -->
<CustomModal bind:visible={alertModalBool} closeBtn={false}>
    <div class="py-5 text-center">⏳ 현재 빠르게 준비 중입니다.</div>
</CustomModal>

<!-- 관심지역 설정 모달 -->
<CustomModal bind:visible={interestModalBool} closeBtn={false}>
    <InterestSetting
        bind:location
        bind:business
        bind:occupation
        onSave={setInterest}
    />
</CustomModal>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_consider_explicit_label -->
<div class="min-h-screen bg-gray-50 suit-font pb-24">
    {#if $user_info.idx}
        <div class="bg-white px-5 pt-16 pb-8 rounded-b-[40px] shadow-sm">
            <div class="flex items-center gap-5">
                <div class="relative group">
                    <div
                        class="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-sky-50 shadow-lg"
                    >
                        {#if userInfo.profile_thumbnail}
                            <img
                                src={userInfo.profile_thumbnail}
                                alt="profile"
                                class="w-full h-full object-cover"
                            />
                        {:else if userInfo.profile_image}
                            <img
                                src={`${public_img_bucket}${userInfo.profile_image}`}
                                alt="profile"
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            <img
                                src="/profile-base.png"
                                alt="profile"
                                class="w-full h-full object-cover"
                            />
                        {/if}
                    </div>
                    <button
                        class="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-gray-100 rounded-full shadow-md flex justify-center items-center text-sky-500 hover:bg-sky-50 transition-colors"
                        on:click={() => goto("/auth/manage")}
                    >
                        <i class="fa fa-camera text-xs"></i>
                    </button>
                </div>

                <div class="flex flex-col">
                    <div class="flex items-center gap-1 mb-1">
                        <span class="text-xl font-bold text-gray-800">
                            {userInfo.nickname}
                        </span>
                        <span class="text-gray-500">님</span>
                    </div>
                    <button
                        class="text-xs font-medium text-gray-400 flex items-center gap-1 hover:text-sky-500 transition-colors"
                        on:click={() => goto("/auth/manage")}
                    >
                        계정 설정 관리 <i class="fa fa-angle-right"></i>
                    </button>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-2 gap-3">
                <button
                    class="flex flex-col gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-left"
                    on:click={() => (interestModalBool = true)}
                >
                    <div
                        class="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center text-lg"
                    >
                        <i class="fa fa-bullseye"></i>
                    </div>
                    <div>
                        <div class="text-[13px] font-bold text-gray-800">
                            관심 설정
                        </div>
                        <div class="text-[11px] text-gray-400">
                            맞춤 정보 수신
                        </div>
                    </div>
                </button>

                <button
                    class="flex flex-col gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-left"
                    on:click={() => goto("/manage_board")}
                >
                    <div
                        class="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-lg relative"
                    >
                        <i class="fa fa-file-text-o"></i>
                        <span
                            class="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ring-2 ring-white"
                        >
                            {data.postCount}
                        </span>
                    </div>
                    <div>
                        <div class="text-[13px] font-bold text-gray-800">
                            내 글 관리
                        </div>
                        <div class="text-[11px] text-gray-400">
                            등록한 글 확인
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <div class="px-5 mt-6 space-y-3">
            <div
                class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
            >
                <button
                    class="w-full p-4 flex items-center justify-between hover:bg-gray-100 border-b border-gray-50 transition-colors group"
                    on:click={() => goto("/mytalent")}
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-100 rounded-lg"
                        >
                            <i class="fa fa-id-card-o text-lg"></i>
                        </div>
                        <span class="text-[15px] font-medium text-gray-700"
                            >내 프로필 관리</span
                        >
                    </div>
                    <i
                        class="fa fa-angle-right text-gray-300 group-hover:translate-x-1 transition-transform"
                    ></i>
                </button>

                <button
                    class="w-full p-4 flex items-center justify-between hover:bg-gray-100 border-b border-gray-50 group"
                    on:click={() => goto("/my_applications")}
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 flex items-center justify-center text-yellow-600 bg-yellow-100 rounded-lg"
                        >
                            <i class="fa fa-paper-plane-o"></i>
                        </div>
                        <span class="text-[15px] font-medium text-gray-700">
                            내 지원 현황
                        </span>
                    </div>
                    <i
                        class="fa fa-angle-right text-gray-300 group-hover:translate-x-1 transition-transform"
                    ></i>
                </button>

                <button
                    class="w-full p-4 flex items-center justify-between hover:bg-gray-100 border-b border-gray-50 group"
                    on:click={() => goto("/manage_applicants")}
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 flex items-center justify-center text-green-600 bg-green-100 rounded-lg"
                        >
                            <i class="fa fa-users"></i>
                        </div>
                        <span class="text-[15px] font-medium text-gray-700">
                            지원자 관리
                        </span>

                        <span
                            class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                        >
                            new
                        </span>
                    </div>
                    <i
                        class="fa fa-angle-right text-gray-300 group-hover:translate-x-1 transition-transform"
                    ></i>
                </button>

                <button
                    class="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors group"
                    on:click={() => goto("/faq")}
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 flex items-center justify-center text-orange-600 bg-orange-100 rounded-lg"
                        >
                            <i class="fa fa-question-circle-o text-lg"></i>
                        </div>
                        <span class="text-[15px] font-medium text-gray-700"
                            >고객센터</span
                        >
                    </div>
                    <i
                        class="fa fa-angle-right text-gray-300 group-hover:translate-x-1 transition-transform"
                    ></i>
                </button>
            </div>

            <div
                class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
            >
                <button
                    class="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                    on:click={() => alert("로그아웃 되었습니다.")}
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 flex items-center justify-center text-gray-400"
                        >
                            <i class="fa fa-sign-out"></i>
                        </div>
                        <span class="text-[15px] font-medium text-gray-700"
                            >로그아웃</span
                        >
                    </div>
                </button>
            </div>

            <div class="pt-4 flex justify-center">
                <button
                    class="text-xs text-gray-300 underline underline-offset-4 decoration-gray-200"
                    on:click={() => goto("/auth/withdrawal")}
                >
                    번개분양 회원 탈퇴
                </button>
            </div>
        </div>
    {:else}
        <div
            class="flex flex-col items-center justify-center pt-32 px-10 suit-font"
        >
            <div class="relative mb-10">
                <div
                    class="w-24 h-24 bg-gradient-to-tr from-sky-500 to-blue-400 rounded-[2.5rem] rotate-12 absolute opacity-20 animate-pulse"
                ></div>
                <div
                    class="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-4xl shadow-[0_15px_35px_rgba(56,189,248,0.2)] border border-sky-50 relative z-10"
                >
                    <div class="relative">
                        <i class="fa fa-user-o text-sky-500"></i>
                        <i
                            class="fa fa-bolt absolute -top-2 -right-3 text-yellow-400 text-2xl drop-shadow-sm"
                        ></i>
                    </div>
                </div>
            </div>

            <div class="text-center mb-12">
                <h2
                    class="text-2xl font-black text-gray-900 mb-3 tracking-tight"
                >
                    로그인이 필요합니다
                </h2>
                <p
                    class="text-[15px] text-gray-500 leading-relaxed font-medium"
                >
                    <span class="text-sky-600">번개분양</span>에 로그인하시면<br
                    />
                    맞춤 현장 추천부터 내 공고 관리까지<br />
                    <span class="text-gray-800 font-bold text-sm"
                        >모든 기능을 즉시 이용할 수 있습니다.</span
                    >
                </p>
            </div>

            <div class="w-full max-w-[300px] space-y-4">
                <button
                    class="w-full h-16 bg-sky-500 hover:bg-sky-600 active:scale-[0.97] transition-all
                   text-white font-bold text-lg rounded-[1.25rem]
                   shadow-[0_10px_25px_rgba(14,165,233,0.3)] border-none"
                    on:click={() =>
                        goto(`/auth/login?path=${$page.url.pathname}`)}
                >
                    번개분양 로그인하기
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    /* 배경 박스 회전 애니메이션 */
    @keyframes pulse-rotate {
        0%,
        100% {
            transform: rotate(12deg) scale(1);
        }
        50% {
            transform: rotate(20deg) scale(1.1);
        }
    }
    .animate-pulse {
        animation: pulse-rotate 4s infinite ease-in-out;
    }
</style>
