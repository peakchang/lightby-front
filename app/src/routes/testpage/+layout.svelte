<script>
    import { page } from "$app/stores";
    import { slide } from "svelte/transition";
    import { derived } from "svelte/store";

    let { children } = $props();

    const key = derived(page, ($page) => $page.url.pathname);

    $effect(() => {
        return () => {
            console.log("빠져나옴!!!");
        };
    });
</script>

<div class="max-w-[520px] mx-auto border h-screen">
    {#key $key}
        <div transition:slide={{ y: 200 }}></div>
    {/key}

    {@render children()}
</div>

