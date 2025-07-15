<script>
    import { fade, fly } from "svelte/transition";
    import { slide } from "svelte/transition";
    let isOpen = $state(false);

    let { children } = $props();
</script>

{#if isOpen}
    <div class="fixed top-0 left-0 w-full h-full z-40 bg-black/30"></div>
    <div
        class="fixed top-0 left-0 w-[200px] border-r border-gray-300 h-full bg-white p-5 flex flex-col gap-5 z-50 suit-font"
        transition:fly={{ x: -200, duration: 350 }}
    >
        <div
            class="flex justify-between items-center border-b border-gray-300 pb-3"
        >
            <span>메뉴</span>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button
                onclick={() => {
                    isOpen = !isOpen;
                }}
                class="cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                    width="25px"
                    height="25px"
                    ><path
                        d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"
                    /></svg
                >
            </button>
        </div>
        <div>메인메뉴</div>
        <div>메인메뉴</div>
    </div>
{/if}

<div
    class="fixed top-0 left-0 w-full py-3 z-45 bg-white suit-font"
    class:pl-16={!isOpen}
    class:pl-56={isOpen}
>
    <div class="flex items-center gap-7">
        <button
            class="cursor-pointer"
            onclick={() => {
                isOpen = !isOpen;
            }}
        >
            <i class="fa fa-bars" aria-hidden="true"></i>
        </button>

        <button class="cursor-pointer">
            <i class="fa fa-home" aria-hidden="true"></i>
            <span>어드민 메인</span>
        </button>
    </div>
</div>

<!-- 하위 페이지나 레이아웃 -->
<div class="fullscreen-override z-30 mt-16 suit-font">
    <div class=" max-w-[1200px] mx-auto border px-5">
        {@render children()}
    </div>
</div>

<style>
    .fullscreen-override {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: white;
    }
</style>
