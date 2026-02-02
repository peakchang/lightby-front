<script>
    import CommunityDetailView from "$lib/components/page/CommunityDetailView.svelte";
    let { data } = $props();
</script>

<CommunityDetailView detailData={data} isApp={false} />
