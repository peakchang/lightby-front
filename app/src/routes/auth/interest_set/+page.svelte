<script>
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { user_info, toastStore, joinStatus } from "$lib/stores/stores";
    import {
        regions,
        businessCategorys,
        jobCategorys,
        back_api,
    } from "$lib/const.js";
    import axios from "axios";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    // 데이터 상태
    let location = $state([]);
    let business = $state([]);
    let occupation = $state([]);

    let alertModal = $state(false);
    let alertMessage = $state("");
    let modalLoading = $state(false);
    let siteWrab = $state({});

    if (browser) {
        siteWrab = document.querySelector(".site-wrab");
    }

    onMount(() => {
        if (browser && siteWrab) {
            siteWrab.scrollTo(0, 0);
        }
        if ($joinStatus["type"] == undefined) {
            goto("/");
        }
    });

    async function setInterest() {
        if (location.length == 0) {
            alertMessage = "관심 지역을 한가지 이상 선택해 주세요.";
            alertModal = true;
            return;
        }
        if (business.length == 0) {
            alertMessage = "관심 업종을 한가지 이상 선택해 주세요.";
            alertModal = true;
            return;
        }
        if (occupation.length == 0) {
            alertMessage = "관심 직종을 한가지 이상 선택해 주세요.";
            alertModal = true;
            return;
        }

        const interestObj = { location, business, occupation };
        const insertestStr = JSON.stringify(interestObj);

        try {
            if ($joinStatus["type"] == "general") {
                const res = await axios.post(`/auth/login`, {
                    id: $joinStatus["info"]["id"],
                    password: $joinStatus["info"]["password"],
                });
                $joinStatus["idx"] = res.data.userInfo.idx;
                $user_info["idx"] = res.data.userInfo.idx;
                $user_info["rate"] = res.data.userInfo.rate;
            }
            await axios.post(`${back_api}/users/set_interesting`, {
                user_id: $joinStatus.idx,
                insertestStr,
            });
            goto("/mytalent");
        } catch (error) {
            console.error(error);
        }
    }
</script>

<div class="min-h-screen bg-white py-10 px-6 suit-font">
    <div class="text-center mt-6 mb-12">
        <div class="inline-block p-4 bg-sky-50 rounded-3xl mb-5 shadow-sm">
            <span class="text-3xl">✨</span>
        </div>
        <h2 class="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
            맞춤 정보를 설정할까요?
        </h2>
        <p class="text-gray-500 text-[15px] leading-relaxed">
            회원님께 딱 맞는 현장 소식을<br />
            번개처럼 가장 먼저 알려드릴게요!
        </p>
    </div>

    <div class="space-y-12 max-w-md mx-auto">
        <section>
            <div class="flex items-center gap-2 mb-5 px-1">
                <span
                    class="flex items-center justify-center w-7 h-7 bg-slate-100 rounded-lg text-sm"
                    >🌍</span
                >
                <h3 class="font-bold text-gray-800 text-lg">희망 근무 지역</h3>
            </div>
            <div class="grid grid-cols-3 gap-2">
                {#each regions as region}
                    <label
                        class="interest-chip"
                        class:active={location.includes(region)}
                    >
                        <input
                            type="checkbox"
                            hidden
                            value={region}
                            bind:group={location}
                            disabled={location.length === 1 &&
                                location.includes(region)}
                        />
                        <span class="text-sm font-medium">{region}</span>
                    </label>
                {/each}
            </div>
            <p class="text-[11px] text-gray-400 mt-3 px-1">
                * 근무지역은 최소 1개 이상 선택해야 합니다.
            </p>
        </section>

        <section>
            <div class="flex items-center gap-2 mb-5 px-1">
                <span
                    class="flex items-center justify-center w-7 h-7 bg-slate-100 rounded-lg text-sm"
                    >🏢</span
                >
                <h3 class="font-bold text-gray-800 text-lg">관심 업종</h3>
            </div>
            <div class="grid grid-cols-2 gap-2">
                {#each businessCategorys as val}
                    <label
                        class="interest-card"
                        class:active={business.includes(val)}
                    >
                        <input
                            type="checkbox"
                            hidden
                            value={val}
                            bind:group={business}
                            disabled={business.length === 1 &&
                                business.includes(val)}
                        />
                        <div
                            class="flex items-center justify-center gap-2 py-4"
                        >
                            <span class="dot transition-all"></span>
                            <span class="text-[14px] font-semibold">{val}</span>
                        </div>
                    </label>
                {/each}
            </div>
        </section>

        <section>
            <div class="flex items-center gap-2 mb-5 px-1">
                <span
                    class="flex items-center justify-center w-7 h-7 bg-slate-100 rounded-lg text-sm"
                    >💼</span
                >
                <h3 class="font-bold text-gray-800 text-lg">나의 역할(직종)</h3>
            </div>
            <div class="flex flex-wrap gap-2">
                {#each jobCategorys as job}
                    <label
                        class="interest-tag"
                        class:active={occupation.includes(job)}
                    >
                        <input
                            type="checkbox"
                            hidden
                            value={job}
                            bind:group={occupation}
                            disabled={occupation.length === 1 &&
                                occupation.includes(job)}
                        />
                        <span class="text-[13px] font-semibold"># {job}</span>
                    </label>
                {/each}
            </div>
        </section>
    </div>

    <div class="mt-16 max-w-md mx-auto">
        <button
            class="w-full bg-sky-500 text-white py-5 rounded-2xl font-extrabold text-lg shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all active:scale-[0.98]"
            onclick={setInterest}
        >
            설정 완료하고 시작하기 ⚡️
        </button>
    </div>
</div>

<CustomModal bind:visible={alertModal} closeBtn={false}>
    <div class="text-center p-4">
        <div class="text-red-500 text-4xl mb-4">
            <i class="fa fa-exclamation-circle"></i>
        </div>
        <div class="text-gray-700 font-bold mb-2">{alertMessage}</div>
        <button
            class="btn btn-ghost btn-sm text-gray-400 mt-4"
            onclick={() => (alertModal = false)}>닫기</button
        >
    </div>
</CustomModal>

<style>
    :global(.suit-font) {
        font-family: "SUIT", sans-serif;
    }

    /* 1. 지역 칩 스타일 (3열 그리드) */
    .interest-chip {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 12px 0;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .interest-chip.active {
        background: #0ea5e9;
        color: white;
        border-color: #0ea5e9;
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
    }

    /* 2. 업종 카드 스타일 (2열 그리드) */
    .interest-card {
        background: #ffffff;
        border: 1.5px solid #f1f5f9;
        border-radius: 18px;
        color: #475569;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }
    .interest-card .dot {
        width: 6px;
        height: 6px;
        background: #cbd5e1;
        border-radius: 50%;
    }
    .interest-card.active {
        border-color: #0ea5e9;
        background: #f0f9ff;
        color: #0369a1;
    }
    .interest-card.active .dot {
        background: #0ea5e9;
        transform: scale(1.5);
    }

    /* 3. 직종 태그 스타일 (해시태그) */
    .interest-tag {
        padding: 10px 20px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 30px;
        color: #94a3b8;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .interest-tag.active {
        background: #1e293b; /* 다크 네이비 스타일 */
        color: #ffffff;
        border-color: #1e293b;
    }

    label:active {
        transform: scale(0.95);
    }
</style>
