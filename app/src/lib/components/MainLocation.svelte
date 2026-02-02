<script>
    import { main_location, loadingStore } from "$lib/stores/stores.js";
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import { regions } from "$lib/const";

    let scrollBool = $state(false);
    let startX = $state(0);
    let scrollLeft = $state(0);
    let scrollElement;

    onMount(() => {
        scrollToTab($main_location);
    });

    // 특정 탭으로 스크롤 이동 (중앙 정렬 로직)
    function scrollToTab(targetTab) {
        if (!scrollElement) return;

        const targetIndex = regions.findIndex(
            (location) => location === targetTab,
        );
        if (targetIndex === -1) return;

        // 대략적인 탭 너비를 계산하여 중앙으로 이동
        const tabWidth = 90;
        const targetPosition = targetIndex * tabWidth;
        const containerWidth = scrollElement.clientWidth;
        const centeredPosition =
            targetPosition - containerWidth / 2 + tabWidth / 2;

        scrollElement.scrollTo({
            left: centeredPosition,
            behavior: "smooth",
        });
    }

    // 드래그 스크롤 처리
    function handleDragScroll(clientX) {
        if (scrollBool && scrollElement) {
            const walk = (clientX - startX) * 2;
            scrollElement.scrollLeft = scrollLeft - walk;
        }
    }

    // 화살표 버튼 클릭 시 이동
    function scrollToDirection(direction, distance = 150) {
        if (!scrollElement) return;

        const currentScrollLeft = scrollElement.scrollLeft;
        let targetScrollLeft;

        if (direction === "left") {
            targetScrollLeft = Math.max(0, currentScrollLeft - distance);
        } else {
            const maxScrollLeft =
                scrollElement.scrollWidth - scrollElement.clientWidth;
            targetScrollLeft = Math.min(
                maxScrollLeft,
                currentScrollLeft + distance,
            );
        }

        scrollElement.scrollTo({
            left: targetScrollLeft,
            behavior: "smooth",
        });
    }

    // 스크롤 끝 감지 (필요 시 UI 피드백용)
    function checkScrollEnd() {
        if (!scrollElement) return;
        // 필요 시 좌우 끝 도달 시 버튼 비활성화 등의 로직을 여기에 추가할 수 있습니다.
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_consider_explicit_label -->
<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_consider_explicit_label -->
<div
    class="relative bg-white border-y border-gray-100 overflow-hidden group shadow-sm"
>
    <div
        class="absolute left-0 top-0 bottom-0 z-20 flex items-center pr-10 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none"
    >
        <button
            type="button"
            class="ml-2 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 pointer-events-auto active:scale-90 transition-transform"
            on:click={() => scrollToDirection("left", 150)}
        >
            <i class="fa fa-chevron-left text-gray-500 text-sm"></i>
        </button>
    </div>

    <div
        bind:this={scrollElement}
        class="scroll__wrap no-scrollbar"
        on:scroll={checkScrollEnd}
        on:mousedown={(e) => {
            scrollBool = true;
            startX = e.clientX;
            scrollLeft = scrollElement.scrollLeft;
            e.preventDefault();
        }}
        on:mouseup={() => (scrollBool = false)}
        on:mouseleave={() => (scrollBool = false)}
        on:touchstart={(e) => {
            scrollBool = true;
            startX = e.touches[0].clientX;
            scrollLeft = scrollElement.scrollLeft;
        }}
        on:touchend={() => (scrollBool = false)}
        on:mousemove={(e) => {
            if (!scrollBool) return;
            e.preventDefault();
            handleDragScroll(e.clientX);
        }}
        on:touchmove={(e) => {
            if (!scrollBool) return;
            handleDragScroll(e.touches[0].clientX);
        }}
        on:click={(e) => {
            // 드래그 중 클릭 방지
            if (Math.abs(e.clientX - startX) > 5) {
                e.preventDefault();
                e.stopPropagation();
            }
        }}
    >
        <div class="flex gap-2.5 px-16 py-3.5">
            {#each regions as location}
                <div
                    class="chip-item {$main_location == location
                        ? 'active'
                        : ''}"
                    on:click={() => {
                        $main_location = location;
                        sessionStorage.setItem("location", $main_location);
                        scrollToTab(location);
                        invalidateAll();
                        $loadingStore = true;
                    }}
                >
                    {location}
                </div>
            {/each}
        </div>
    </div>

    <div
        class="absolute right-0 top-0 bottom-0 z-20 flex items-center pl-10 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none"
    >
        <button
            type="button"
            class="mr-2 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 pointer-events-auto active:scale-90 transition-transform"
            on:click={() => scrollToDirection("right", 150)}
        >
            <i class="fa fa-chevron-right text-gray-500 text-sm"></i>
        </button>
    </div>
</div>

<style>
    .scroll__wrap {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        cursor: grab;
        scroll-behavior: smooth;
    }

    .scroll__wrap:active {
        cursor: grabbing;
    }

    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .chip-item {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 82px;
        padding: 6px 12px;
        border-radius: 99px;
        font-size: 12px;
        font-weight: 500;
        color: #555;
        background-color: #fff;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid #e5e7eb;
        user-select: none;
        flex-shrink: 0;
    }

    .chip-item.active {
        color: white;
        background-color: #007595; /* 메인 테마 컬러 */
        border-color: #007595;
        box-shadow: 0 4px 10px rgba(0, 117, 149, 0.25);
        font-weight: 700;
        transform: translateY(-1px);
    }

    /* 호버 효과 (PC 전용) */
    @media (hover: hover) {
        .chip-item:not(.active):hover {
            background-color: #f9fafb;
            border-color: #d1d5db;
            color: #333;
        }
    }

    /* 터치 피드백 (앱 전용) */
    .chip-item:active {
        background-color: #f3f4f6;
    }

    .chip-item.active:active {
        background-color: #005f7a;
    }
</style>
