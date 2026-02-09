<script>
    import { goto } from "$app/navigation";
    import PageHeader from "$lib/components/PageHeader.svelte";
    let { children } = $props();
</script>

<PageHeader pageName={"고객센터"} />

<div class="bg-white relative min-h-screen suit-font">
    <div class="max-w-[530px] mx-auto pt-14 pb-24">
        {@render children()}
    </div>
</div>
