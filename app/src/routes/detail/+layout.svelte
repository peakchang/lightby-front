<script>
    let headerShowBool = $state(true);
    let y = $state(0);

    $effect(() => {
        console.log(y);
        if (y > 100) {
            headerShowBool = false;
        } else {
            headerShowBool = true;
        }
    });
</script>

<svelte:window bind:scrollY={y} />
<!-- 숨겨진 헤더!!!!!!!!!!!!!!!!!!!!!! -->
<div
    class="fixed top-0 left-0 w-full z-50 suit-font slide-menu"
    class:show={!headerShowBool}
>
    <div class="max-w-[530px] mx-auto bg-white">
        <div class=" py-1 flex justify-between items-center">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore event_directive_deprecated -->
            <div
                class="cursor-pointer"
                style="color: #3da83b;"
                on:click={() => {
                    window.history.back();
                }}
            >
                <i class="fa fa-angle-left text-2xl mr-1" aria-hidden="true"
                ></i>
                <span class="text-sm">뒤로가기</span>
            </div>

            <div class="w-12"></div>
        </div>
    </div>
</div>

<div class="bg-white relative min-h-screen">
    <div class="max-w-[530px] mx-auto pretendard pt-6 pb-24">
        <slot></slot>
    </div>
</div>

<style>
    .slide-menu {
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    }

    .slide-menu.show {
        transform: translateY(0);
    }
</style>
