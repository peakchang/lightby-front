<script>
    import { goto } from "$app/navigation";
    import DetailMenu from "$lib/components/DetailMenu.svelte";
    let { children } = $props();
    

</script>


<!-- 숨겨진 헤더!!!!!!!!!!!!!!!!!!!!!! -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_consider_explicit_label -->


<div class="bg-white relative min-h-screen suit-font">
    <div class="max-w-[630px] mx-auto pb-16">
        {@render children()}
    </div>
</div>



<style>
    
</style>
