<script>
    import DetailView from "$lib/components/page/DetailView.svelte";
    let { data } = $props();
    console.log(data);
    
</script>

<DetailView item={data} favorateValue={data.favorateBool} isApp={false} />
