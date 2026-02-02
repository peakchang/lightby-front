<script>
    import DetailView from "$lib/components/page/Detailview.svelte";
    let { data } = $props();
    console.log(data);
    
</script>

<DetailView item={data} favorateValue={data.favorateBool} isApp={false} />
