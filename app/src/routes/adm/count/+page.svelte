<script>
    import { onMount, tick } from "svelte"; // tick 추가
    import moment from "moment-timezone";
    import { setParams } from "$lib/lib";
    import { page } from "$app/stores";

    let { data } = $props();

    let startDate = $state(data.start);
    let endDate = $state(data.end);
    let chartElement = $state(); // $state()로 명시적 선언
    let chart = null;

    // 그래프 데이터 가공 (과거 날짜순으로 정렬 필요)
    const chartData = $derived([...data.summary].reverse());

    async function initChart() {
        // 1. 서버 환경이거나 엘리먼트가 없으면 즉시 중단 (매우 중요!)
        if (typeof window === "undefined" || !chartElement) return;

        // 2. DOM이 완전히 그려질 때까지 한 차례 기다림
        await tick();

        const ApexCharts = (await import("apexcharts")).default;

        // 3. 기존 차트가 있다면 파괴
        if (chart) {
            chart.destroy();
            chart = null;
        }

        const chartData = [...data.summary].reverse();

        const options = {
            series: [
                {
                    name: "방문자수",
                    data: chartData.map((d) => d.total_count),
                },
            ],
            chart: {
                height: 250,
                type: "area",
                toolbar: { show: false },
                animations: { enabled: true }, // 애니메이션 켜기
            },
            // ... 나머지 옵션 동일
        };

        // 4. 다시 한번 엘리먼트 확인 후 렌더링
        if (chartElement) {
            chart = new ApexCharts(chartElement, options);
            await chart.render();
        }
    }

    onMount(() => {
        initChart();
        // 페이지 나갈 때 차트 메모리 해제
        return () => {
            if (chart) chart.destroy();
        };
    });

    // 데이터 업데이트 시 그래프 갱신
    $effect(() => {
        if (data.summary && chartElement) {
            initChart();
        }
    });

    function dateSubmit() {
        setParams({ start: startDate, end: endDate }, true);
    }
</script>

<div class="max-w-5xl mx-auto p-4 antialiased pb-20">
    <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
    >
        <div>
            <h2 class="text-2xl font-bold text-gray-800">방문자 통계</h2>
            <p class="text-sm text-gray-500">
                데이터를 기반으로 방문 추이를 분석합니다.
            </p>
        </div>

        <form
            on:submit|preventDefault={dateSubmit}
            class="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2"
        >
            <div class="flex items-center gap-1">
                <input
                    type="date"
                    class="border-none focus:ring-0 text-sm font-medium text-gray-600"
                    bind:value={startDate}
                />
                <span class="text-gray-300">→</span>
                <input
                    type="date"
                    class="border-none focus:ring-0 text-sm font-medium text-gray-600"
                    bind:value={endDate}
                />
            </div>
            <button
                class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all"
                >조회</button
            >
        </form>
    </div>

    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h3
            class="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest"
        >
            Visitor Trend
        </h3>
        <div bind:this={chartElement}></div>
    </div>

    <div
        class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
        <table class="w-full text-center">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                    <th class="py-4 font-semibold">날짜</th>
                    <th class="py-4 font-semibold">총 방문자</th>
                    <th class="py-4 font-semibold text-blue-500">웹</th>
                    <th class="py-4 font-semibold text-purple-500">앱</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                {#each data.summary as item}
                    <tr class="hover:bg-gray-50/50 transition-colors">
                        <td class="py-4 text-sm font-medium text-gray-600"
                            >{moment(item.date).format("YYYY-MM-DD")}</td
                        >
                        <td class="py-4 font-bold text-gray-800"
                            >{item.total_count}</td
                        >
                        <td class="py-4 text-blue-600 font-medium"
                            >{item.web_count}</td
                        >
                        <td class="py-4 text-purple-600 font-medium"
                            >{item.app_count}</td
                        >
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <h3 class="text-lg font-bold text-gray-800 mb-4 px-2">
        실시간 상세 로그 (최근 100건)
    </h3>
    <div
        class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                        <th class="px-6 py-4 font-semibold">시간</th>
                        <th class="px-6 py-4 font-semibold">IP / Platform</th>
                        <th class="px-6 py-4 font-semibold">유입경로</th>
                        <th class="px-6 py-4 font-semibold">브라우저 정보</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 text-xs">
                    {#each data.details as log}
                        <tr class="hover:bg-gray-50/50">
                            <td class="px-6 py-4 text-gray-500"
                                >{moment(log.date).format("HH:mm:ss")}</td
                            >
                            <td class="px-6 py-4">
                                <div class="font-bold text-gray-700">
                                    {log.ip}
                                </div>
                                <span
                                    class="px-2 py-0.5 rounded bg-gray-100 text-[10px] uppercase font-bold"
                                    >{log.platform}</span
                                >
                            </td>
                            <td
                                class="px-6 py-4 text-gray-500 truncate max-w-[150px]"
                                >{log.referer}</td
                            >
                            <td
                                class="px-6 py-4 text-gray-400 truncate max-w-[200px]"
                                >{log.user_agent}</td
                            >
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
