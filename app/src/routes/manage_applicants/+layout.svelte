<script>
    import PageHeader from "$lib/components/PageHeader.svelte";
    let { children } = $props();
</script>

<PageHeader pageName="지원자 관리" />

<div class="bg-gray-50 min-h-screen pb-24 suit-font">
    <div class="max-w-[530px] mx-auto pt-6 px-4">
        {@render children()}
    </div>
</div>
