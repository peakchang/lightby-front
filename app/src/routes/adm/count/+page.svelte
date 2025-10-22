<script>
    // import ApexChart from "svelte-apexcharts";
    import { onMount } from "svelte";
    import moment from "moment-timezone";
    import { setParams } from "$lib/lib";
    import { page } from "$app/stores";

    let { data } = $props();

    let startDate = $state("");
    let endDate = $state("");
    let count_list = $state([]);

    onMount(() => {
        console.log($page.url.searchParams.get("start"));

        const today = moment().format("YYYY-MM-DD");

        startDate = $page.url.searchParams.get("start")
            ? $page.url.searchParams.get("start")
            : today;
        endDate = $page.url.searchParams.get("end")
            ? $page.url.searchParams.get("end")
            : today;
        count_list = data.countList;

        console.log(count_list);
        
    });

    function dateSubmit(e) {
        console.log(startDate);
        console.log(endDate);

        setParams({ start: startDate, end: endDate }, true);
    }
</script>

<div class="mb-5 p-3">
    <form on:submit|preventDefault={dateSubmit}>
        <div class="flex items-center gap-2">
            <input
                type="date"
                class="border border-gray-400 px-2 py-1.5 text-sm rounded-md"
                bind:value={startDate}
            />
            <span>~</span>
            <input
                type="date"
                class="border border-gray-400 px-2 py-1.5 text-sm rounded-md"
                bind:value={endDate}
            />
            <button class="btn btn-success btn-sm text-white">검색</button>
        </div>
    </form>
</div>
<div>
    <table class="w-full">
        <thead>
            <tr>
                <th class="border border-gray-400 p-1">날짜</th>
                <th class="border border-gray-400 p-1">방문자수</th>
            </tr>
        </thead>
        <tbody>
            {#each count_list as item}
                <tr class="text-center">
                    <td class="border border-gray-400 p-1">
                        {moment(item.date).format("YY / MM / DD")}
                    </td>
                    <td class="border border-gray-400 p-1">
                        {item.real_count}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- <ApexChart {options} {series} type="line" height="280" /> -->
