<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    function ssibalTest() {
        window.open(`/testpop`, "popup", "width=550,height=670");
    }

    function paymentSuccess(e) {
        console.log(e.data);
    }
</script>

<svelte:window on:message={paymentSuccess} />

<button on:click={ssibalTest}> testBtn </button>
