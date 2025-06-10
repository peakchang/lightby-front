<script>
    import DetailMenu from "$lib/components/DetailMenu.svelte";
    let { children } = $props();
    let headerShowBool = $state(true); // 스크롤 내릴시 상단 메뉴 보이게 하기 위한 변수!
    let showBool = $state(true); // 처음 페이지 로딩시 위로 올라가는 잔상 없애기 위해!
    let y = $state(0);

    $effect(() => {
        if (y != 0) {
            // 스크롤 조금이라도 움직이면 hidden 해제!
            showBool = false;
        }

        // 스크롤이 250 이상으로 내려가면 애니메이션 적용!
        if (y > 250) {
            headerShowBool = false;
        } else {
            headerShowBool = true;
        }
    });
</script>

<svelte:window bind:scrollY={y} />
<!-- 숨겨진 헤더!!!!!!!!!!!!!!!!!!!!!! -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_consider_explicit_label -->
<div
    class="fixed top-0 left-0 w-full z-50 suit-font slide-menu"
    class:hidden={showBool}
    class:show={!headerShowBool}
>
    <div class="max-w-[530px] mx-auto bg-white">
        <DetailMenu />
    </div>
</div>

<!-- <div
    class="fixed top-0 left-0 w-full z-50 suit-font slide-menu"
    class:show={!headerShowBool}
>
    <div class="max-w-[530px] mx-auto bg-white">
        <div class=" py-1 flex justify-between items-center">
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
</div> -->

<div class="bg-white relative min-h-screen">
    <div class="max-w-[530px] mx-auto pretendard pb-16">
        {@render children()}
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
