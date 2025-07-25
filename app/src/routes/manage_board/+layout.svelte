<script>
    import { goto } from "$app/navigation";
    import PageHeader from "$lib/components/PageHeader.svelte";
    let { children } = $props();
</script>

<svelte:head>
    <script
        type="text/javascript"
        defer
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS}&libraries=services&autoload=false`}
    ></script>

    <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
</svelte:head>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class="fixed top-0 left-0 w-full z-20 suit-font">
    <div class="max-w-[530px] mx-auto bg-white border-b border-gray-300">
        <div class="flex justify-between items-center">
            <div
                class="cursor-pointer p-2"
                style="color: #3da83b;"
                on:click={() => {
                    goto("/my");
                }}
            >
                <i class="fa fa-angle-left text-2xl mr-1" aria-hidden="true"
                ></i>
                <span class="text-sm">뒤로가기</span>
            </div>
        </div>
    </div>
</div>

<div class="bg-white relative min-h-screen">
    <div class="max-w-[530px] mx-auto pretendard pt-14 pb-24">
        {@render children()}
    </div>
</div>
