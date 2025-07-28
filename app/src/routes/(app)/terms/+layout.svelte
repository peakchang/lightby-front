<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    console.log($page);
    let termBool = $state(false);

    $effect(() => {
        console.log($page.url.pathname);

        if ($page.url.pathname.includes("service")) {
            termBool = true;
        } else {
            termBool = false;
        }

        console.log(termBool);
    });

    let { children } = $props();

    function moveTerms() {
        if (this.value == "terms") {
            goto("/terms");
        } else {
            goto("/terms/service");
        }
    }
</script>

<div class="simple-height"></div>

<!-- svelte-ignore event_directive_deprecated -->
<div class="flex gap-2 mb-3">
    {#if termBool}
        <button
            class="border border-gray-300 w-1/2 text-center p-5 text-xl rounded-lg cursor-pointer"
            value="terms"
            on:click={moveTerms}
        >
            개인정보 처리 방침
        </button>
        <button
            class="border-2 border-blue-500 w-1/2 text-center p-5 text-xl rounded-lg cursor-pointer"
        >
            이용 약관
        </button>
    {:else}
        <button
            class="border-2 border-blue-500 w-1/2 text-center p-5 text-xl rounded-lg cursor-pointer"
        >
            개인정보 처리 방침
        </button>
        <button
            class="border border-gray-300 w-1/2 text-center p-5 text-xl rounded-lg cursor-pointer"
            value="service"
            on:click={moveTerms}
        >
            이용 약관
        </button>
    {/if}
</div>

<div class="border border-gray-300 p-4 rounded-md mx-2">
    {@render children()}
</div>

<style>
    .simple-height {
        height: 100px;
    }
</style>
