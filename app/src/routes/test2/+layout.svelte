<script>
    import { page } from "$app/stores";
    import { fly } from "svelte/transition";
    import { onDestroy } from "svelte";
    import { tick } from "svelte";

    let currentComponent;
    let previousComponent;
    let animating = false;
    let pathname = "";

    export let segment; // SvelteKit 4에서는 layout에서도 segment 접근 가능

    import { getContext } from "svelte";
    const defaultSlot = getContext("default");

    // 트랜지션 활성 여부 (조건에 따라 변경 가능)
    let useAnimation = false;

    $: if (!animating && pathname !== $page.url.pathname) {
        animating = true;
        previousComponent = currentComponent;
        pathname = $page.url.pathname;
        useAnimation = pathname === "/test2/t2";

        tick().then(() => {
            currentComponent = defaultSlot;
            animating = false;
        });
    }
</script>

<div class="relative h-screen w-full overflow-hidden">
    {#if previousComponent && useAnimation}
        <div
            out:fly={{ x: 300, duration: 300 }}
            class="absolute top-0 left-0 w-full h-full z-10 bg-white"
        >
            <svelte:component this={previousComponent} />
        </div>
    {/if}

    {#if useAnimation}
        <div
            in:fly={{ x: 300, duration: 300 }}
            class="absolute top-0 left-0 w-full h-full z-20 bg-white"
        >
            <slot />
        </div>
    {:else}
        <div class="relative z-0">
            <slot />
        </div>
    {/if}
</div>
