<script>
    import PageHeader from "$lib/components/PageHeader.svelte";
    let { children } = $props();
    
</script>

<PageHeader></PageHeader>

<div class="bg-white relative min-h-screen">
    <div class="max-w-[530px] mx-auto pretendard pt-14 pb-24">
        

            {@render children()}

    </div>
</div>

