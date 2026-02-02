<script>
    import { onMount, tick } from "svelte";

    // 1. 더미 데이터 생성
    const dummyData = [
        { date: "01/25", count: 45 },
        { date: "01/26", count: 52 },
        { date: "01/27", count: 38 },
        { date: "01/28", count: 65 },
        { date: "01/29", count: 48 },
        { date: "01/30", count: 70 },
        { date: "01/31", count: 85 },
        { date: "02/01", count: 60 },
        { date: "02/02", count: 95 },
    ];

    let chartElement = $state();
    let chart = null;

    async function renderChart() {
        if (typeof window === "undefined" || !chartElement) return;

        // Svelte가 DOM 요소를 렌더링할 시간을 줍니다.
        await tick();

        // ApexCharts 동적 임포트
        const ApexCharts = (await import("apexcharts")).default;

        // 기존 차트가 있다면 안전하게 제거
        if (chart) {
            chart.destroy();
        }

        const options = {
            series: [
                {
                    name: "방문자수",
                    data: dummyData.map((d) => d.count),
                },
            ],
            chart: {
                type: "area", // 'line'으로 바꿔도 됩니다
                height: 350,
                toolbar: { show: false },
                zoom: { enabled: false },
                // 찌그러짐 방지를 위한 핵심 설정
                redrawOnParentResize: true,
                redrawOnWindowResize: true,
            },
            colors: ["#10b981"],
            dataLabels: { enabled: false },
            stroke: { curve: "smooth", width: 3 },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.5,
                    opacityTo: 0.1,
                },
            },
            xaxis: {
                categories: dummyData.map((d) => d.date),
                axisBorder: { show: false },
                labels: { style: { colors: "#9ca3af" } },
            },
            yaxis: {
                labels: { style: { colors: "#9ca3af" } },
            },
            grid: {
                borderColor: "#f1f1f1",
                strokeDashArray: 4,
            },
            tooltip: { x: { show: true } },
        };

        chart = new ApexCharts(chartElement, options);
        chart.render();
    }

    onMount(() => {
        renderChart();

        return () => {
            if (chart) chart.destroy();
        };
    });
</script>

<div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Chart Test Page</h1>
            <p class="text-gray-500">
                더미 데이터를 활용한 ApexCharts 렌더링 테스트
            </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <div
                bind:this={chartElement}
                class="w-full"
                style="min-height: 350px;"
            >
                <div
                    class="flex items-center justify-center h-[350px] text-gray-400"
                >
                    차트를 불러오는 중...
                </div>
            </div>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-4">
            <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p class="text-emerald-600 text-sm font-bold uppercase">
                    오늘 방문자
                </p>
                <p class="text-3xl font-black text-emerald-900">95명</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p class="text-blue-600 text-sm font-bold uppercase">
                    평균 방문자
                </p>
                <p class="text-3xl font-black text-blue-900">60.8명</p>
            </div>
        </div>
    </div>
</div>

<style>
    /* 차트 내부 툴팁 스타일 등이 깨질 때 대비 */
    :global(.apexcharts-canvas) {
        margin: 0 auto;
    }
</style>
