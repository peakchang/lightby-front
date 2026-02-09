<script>
    import { regions, businessCategorys, jobCategorys } from "$lib/const.js";
    import { toastStore } from "$lib/stores/stores";

    // 부모로부터 상태를 바인딩 받거나 함수를 전달받음
    let {
        location = $bindable([]),
        business = $bindable([]),
        occupation = $bindable([]),
        onSave,
        onClose,
    } = $props();
</script>

<div class="px-2 pb-6 suit-font">
    <div class="text-center mt-6 mb-8">
        <div class="inline-block p-3 bg-sky-50 rounded-2xl mb-4">
            <span class="text-2xl">✨</span>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">맞춤 알람 설정</h2>
        <p class="text-sm text-gray-500">
            딱 맞는 현장이 뜨면 가장 먼저 알려드려요!
        </p>
    </div>

    <div class="space-y-8">
        <section>
            <div class="flex items-center gap-2 mb-4 px-1">
                <span
                    class="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-lg text-xs"
                    >🌍</span
                >
                <h3 class="font-bold text-gray-800">희망 근무 지역</h3>
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
                        <span class="text-sm">{region}</span>
                    </label>
                {/each}
            </div>
        </section>

        <section>
            <div class="flex items-center gap-2 mb-4 px-1">
                <span
                    class="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-lg text-xs"
                    >🏢</span
                >
                <h3 class="font-bold text-gray-800">관심 업종</h3>
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
                            class="flex items-center justify-center gap-2 py-3"
                        >
                            <span class="dot transition-all"></span>
                            <span class="text-[13px]">{val}</span>
                        </div>
                    </label>
                {/each}
            </div>
        </section>

        <section>
            <div class="flex items-center gap-2 mb-4 px-1">
                <span
                    class="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-lg text-xs"
                    >💼</span
                >
                <h3 class="font-bold text-gray-800">나의 역할(직종)</h3>
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
                        <span class="text-[13px] font-medium"># {job}</span>
                    </label>
                {/each}
            </div>
        </section>
    </div>

    <div class="mt-12 flex gap-2">
        <button
            class="flex-[1] bg-gray-100 text-gray-400 py-4 rounded-2xl font-bold"
            onclick={onClose}
        >
            나중에
        </button>
        <button
            class="flex-[2] bg-sky-500 text-white py-4 rounded-2xl font-extrabold shadow-lg shadow-sky-100"
            onclick={onSave}
        >
            설정 완료 ⚡️
        </button>
    </div>
</div>

<style>
    /* 1. 지역 칩 스타일 (3열 그리드용) */
    .interest-chip {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .interest-chip.active {
        background: #0ea5e9;
        color: white;
        border-color: #0ea5e9;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(14, 165, 233, 0.2);
    }

    /* 2. 업종 카드 스타일 (2열 그리드용) */
    .interest-card {
        background: #ffffff;
        border: 1.5px solid #f1f5f9;
        border-radius: 16px;
        color: #475569;
        cursor: pointer;
        transition: all 0.2s ease;
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
        font-weight: bold;
    }
    .interest-card.active .dot {
        background: #0ea5e9;
        transform: scale(1.5);
    }

    /* 3. 직종 태그 스타일 (해시태그 형태) */
    .interest-tag {
        padding: 8px 16px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 30px;
        color: #94a3b8;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .interest-tag.active {
        background: #000000;
        color: #ffffff;
        border-color: #000000;
    }

    /* 공통 애니메이션 */
    label:active {
        transform: scale(0.96);
    }
</style>
