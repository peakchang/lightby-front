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

    function contactCall() {}
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


<div class="bg-white relative min-h-screen">
    <div class="max-w-[530px] mx-auto pretendard pb-16">
        {@render children()}
    </div>
</div>

<!-- svelte-ignore event_directive_deprecated -->
<div class="fixed bottom-0 left-0 w-full z-50 suit-font">
    <div class="max-w-[530px] mx-auto pretendard">
        <div
            class="flex gap-2 justify-center bg-white pt-3 pb-3 border-t border-gray-200"
        >
            
            <button
                class="btn btn-info btn-sm w-1/4 text-white"
                on:click={contactCall}
            >
                <i class="fa fa-phone" aria-hidden="true"></i>
                전화하기
            </button>
            <button
                class="btn btn-success btn-sm w-1/4 text-white"
                on:click={contactSms}
            >
                <i class="fa fa-envelope-o" aria-hidden="true"></i>
                문자하기
            </button>
            <button
                class="btn btn-warning btn-sm w-1/4 text-white"
                on:click={contactSms}
            >
                <i class="fa fa-envelope-o" aria-hidden="true"></i>
                공유하기
            </button>
        </div>

        <!-- 버튼들~~~ (전화하기 / 문자하기 / 공유하기)
        - 문자하기 버튼 클릭하면 양식 > 현장명 + 번개분양 보고 문의드립니다.
        - 공유하기는 카카오 공유 / 문자공유(문자로 링크 보내기) / 링크복사 2가지 -->
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
