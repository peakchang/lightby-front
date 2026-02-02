<script>
    import MainContents from "$lib/components/page/MainContents.svelte";
    import MainLocation from "$lib/components/MainLocation.svelte";
    import { goto } from "$app/navigation";
    let { data } = $props();

    function goToDetail(idx) {
        goto(`/jobs/${idx}`); // 일반 URL 이동
    }
</script>

<MainContents {data} {goToDetail} containerClass="max-w-[620px] pt-16">
    <div slot="location"><MainLocation /></div>
</MainContents>
