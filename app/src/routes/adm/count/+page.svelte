<script>
    import { onMount } from "svelte";
    import moment from "moment-timezone";
    import { setParams } from "$lib/lib";
    import { page } from "$app/stores";
    import { invalidateAll } from "$app/navigation";

    let { data } = $props();

    let startDate = $state("");
    let endDate = $state("");
    let count_list = $state([]);

    onMount(() => {
        const today = moment().format("YYYY-MM-DD");
        const startDateValue = moment().startOf("month").format("YYYY-MM-DD");
        startDate = $page.url.searchParams.get("start") || startDateValue;
        endDate = $page.url.searchParams.get("end") || today;
    });

    function dateSubmit(e) {
        setParams({ start: startDate, end: endDate }, true);
    }

    function setSearchDate() {
        invalidateAll();
    }

    $effect(() => {
        count_list = data.countList || [];
    });
</script>

<div class="max-w-4xl mx-auto p-6 antialiased">
    <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
    >
        <div>
            <h2 class="text-2xl font-bold text-gray-800">방문자 통계</h2>
            <p class="text-sm text-gray-500">
                기간별 방문자 추이를 확인하세요.
            </p>
        </div>

        <form
            on:submit|preventDefault={dateSubmit}
            class="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2"
        >
            <div class="flex items-center gap-1">
                <input
                    type="date"
                    class="border-none focus:ring-0 text-sm font-medium text-gray-600 cursor-pointer"
                    bind:value={startDate}
                />
                <span class="text-gray-300">→</span>
                <input
                    type="date"
                    class="border-none focus:ring-0 text-sm font-medium text-gray-600 cursor-pointer"
                    bind:value={endDate}
                />
            </div>
            <button
                class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-100 flex items-center gap-2"
                on:click={setSearchDate}
            >
                <i class="fa fa-search"></i> 조회
            </button>
        </form>
    </div>

    <div
        class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-50/50">
                    <th
                        class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                        >조회 날짜</th
                    >
                    <th
                        class="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right"
                        >방문자 수</th
                    >
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                {#each count_list as item}
                    <tr class="hover:bg-emerald-50/30 transition-colors group">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                ></div>
                                <span class="text-sm font-medium text-gray-700">
                                    {moment(item.date).format(
                                        "YYYY년 MM월 DD일",
                                    )}
                                </span>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <span
                                class="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-sm font-bold group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors"
                            >
                                {item.real_count.toLocaleString()} 명
                            </span>
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td
                            colspan="2"
                            class="px-6 py-12 text-center text-gray-400 text-sm"
                        >
                            데이터가 없습니다. 기간을 다시 선택해 주세요.
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    /* 데이트 피커 기본 스타일 미세 조정 */
    input[type="date"]::-webkit-calendar-picker-indicator {
        cursor: pointer;
        filter: invert(0.5);
    }
</style>
