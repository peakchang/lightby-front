<script>
    import { toastStore } from "$lib/stores/stores";
    import { fly } from "svelte/transition";

    let timeoutId = null;

    $effect(() => {
        if ($toastStore.show == true) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                toastStore.set({ show: false, message: "" });
            }, 1800);
        }
    });
</script>

<!-- opacity-{toastShow} -->

{#if $toastStore.show}
    <div
        id="toast"
        class="toast toast-center toast-bottom z-[9999999] px-6 mb-24 suit-font"
        transition:fly={{ y: 20, duration: 300 }}
    >
        <div
            class="flex items-center gap-3 px-5 py-3 rounded-2xl text-white shadow-2xl backdrop-blur-md"
            style="background-color: {$toastStore.color}CC; border: 1px solid {$toastStore.color};"
        >
            <div class="flex-shrink-0">
                <i class="fa fa-info-circle text-lg"></i>
            </div>

            <span class="text-sm font-medium tracking-tight">
                {$toastStore.message}
            </span>
        </div>
    </div>
{/if}

<style>
    .toast {
        pointer-events: none; /* 토스트 때문에 아래 버튼 안 눌리는 현상 방지 */
    }

    .suit-font {
        font-family: "SUIT", sans-serif;
    }
</style>
