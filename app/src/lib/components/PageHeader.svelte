<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    let { pageName, prevPage } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div
    class="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm suit-font"
>
    <div class="max-w-[640px] mx-auto h-14 flex items-center px-2">
        <div class="flex-1">
            <div
                class="inline-flex items-center justify-center w-10 h-10 rounded-full active:bg-gray-100 transition-colors cursor-pointer"
                on:click={() => {
                    if (prevPage) {
                        goto(prevPage);
                    } else {
                        if ($page.url.searchParams.get("prev")) {
                            goto($page.url.searchParams.get("prev"));
                        } else {
                            window.history.back();
                        }
                    }
                }}
            >
                <i class="fa fa-chevron-left text-xl text-gray-800"></i>
            </div>
        </div>

        <div class="flex-none">
            <span class="text-[16px] font-bold text-gray-900 tracking-tight">
                {pageName}
            </span>
        </div>

        <div class="flex-1"></div>
    </div>
</div>

<div class="h-14"></div>

<style>
    /* 폰트 보정 및 터치 영역 강조 */
    :global(.suit-font) {
        font-family:
            "Pretendard",
            -apple-system,
            BlinkMacSystemFont,
            system-ui,
            Roboto,
            sans-serif;
    }
</style>
