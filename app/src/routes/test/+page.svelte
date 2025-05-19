<script>
    import { pageStack } from "$lib/stores/pageStack";
    import PageStack from "$lib/components/PageStack.svelte";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    function openPage(name) {
        console.log('alsdjfliajsdf');
        
        pageStack.update((stack) => [...stack, name]);
    }
</script>

<button on:click={() => openPage("example")}>슬라이드 페이지 열기</button>

<!-- 페이지 스택에 따라 OverlayPage 렌더링 -->
{#each $pageStack as pageName, index (index)}
    <PageStack {pageName} />
{/each}
