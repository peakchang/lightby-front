<script>
    import PdButton from "$lib/components/PdButton.svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { goto } from "$app/navigation";

    import { page } from "$app/stores";
    import { user_info } from "$lib/stores/stores";
    import { fetchRequest } from "$lib/lib";
    let { children } = $props();

    let successModal = $state(false);
    let successMessage = $state("");

    function movePage(e) {
        console.log(this.getAttribute("linkdata"));

        if (this.getAttribute("linkdata") == "/my" && !$user_info.idx) {
            // alert("로그인 후 이용 가능합니다.");
            // return;
        }
        if ($page.url.pathname != this.getAttribute("linkdata")) {
            goto(this.getAttribute("linkdata"));
        }
    }

    async function logout() {
        const res = await fetchRequest("POST", "/auth/logout", {
            idx: $user_info.idx,
        });
        if (res.status) {
            successMessage = "로그아웃 되었습니다.";
            successModal = true;
            setTimeout(() => {
                successModal = false;
            }, 800);
            $user_info = {};
        }

        console.log(res);
    }
</script>

<CustomModal bind:visible={successModal} closeBtn={false}>
    <div class="text-center">
        <div class=" text-green-700 text-3xl mb-2">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div>{successMessage}</div>
    </div>
</CustomModal>

<div
    class="fixed top-0 left-1/2 max-w-[640px] w-full -translate-x-1/2 bg-white p-3 shadow-bottom"
>
    <div class="flex justify-between">
        <div>
            <img src="/logo.png" alt="" class=" max-w-[110px] cursor-pointer" />
        </div>
        {#if $user_info.idx}
            <!-- svelte-ignore event_directive_deprecated -->
            <button
                class="btn btn-outline btn-success btn-xs"
                on:click={logout}
            >
                <i class="fa fa-user-circle" aria-hidden="true"></i>
                <span>로그아웃</span>
            </button>
        {:else}
            <a href="/auth/login">
                <button class="btn btn-outline btn-success btn-xs">
                    <i class="fa fa-user-circle" aria-hidden="true"></i>
                    <span>로그인</span>
                </button>
            </a>
        {/if}
    </div>
</div>

<div class="">
    {@render children()}
</div>

<div class="fixed left-0 bottom-0 w-full suit-font z-40">
    <ul
        class="max-w-[630px] mx-auto flex justify-between w-full gap-3 px-5 z-50 bg-white py-3 relative"
    >
        {#if $page.url.pathname == "/" || $page.url.pathname == "/interest"}
            <div class="absolute right-3 top-[-45px]">
                <a href="/registjob">
                    <PdButton
                        classVal="py-1.5 px-4 text-white font-light rounded-full"
                        backgroundColor="#5587ED"
                        hoverColor="#6799FF"
                    >
                        <i class="fa fa-plus-circle" aria-hidden="true"></i>
                        <span class="ml-1">구인등록</span>
                    </PdButton>
                </a>
                <!-- svelte-ignore event_directive_deprecated -->
                <!-- <button
                    class="py-1.5 px-4 bg-[#5587ED] text-white font-light rounded-full"
                    on:click={() => {
                        if ($user_info.idx) {
                            goto("/registjob");
                        } else {
                            alert("로그인 후 이용 가능 합니다.");
                        }
                    }}
                >
                    <i class="fa fa-plus" aria-hidden="true"></i>
                    <span>구인등록</span>
                </button> -->
            </div>
        {/if}

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore event_directive_deprecated -->
        <li
            class="w-1/4 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            style={$page.url.pathname == "/"
                ? "color:#61a2ff"
                : "color:#868686"}
            linkdata="/"
            on:click={movePage}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                class="w-6"
                style={$page.url.pathname == "/"
                    ? "fill: rgb(97,162,255);"
                    : "fill: rgb(134,134,134);"}
                ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                    d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                />
            </svg>
            <span class="text-xs">홈</span>
        </li>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore event_directive_deprecated -->
        <li
            class="w-1/4 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            style={$page.url.pathname == "/find"
                ? "color:#61a2ff"
                : "color:#868686"}
            linkdata="/find"
            on:click={movePage}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                class="w-6"
                style={$page.url.pathname == "/find"
                    ? "fill: rgb(97,162,255);"
                    : "fill: rgb(134,134,134);"}
                ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                    d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"
                />
            </svg>
            <span class="text-xs">인재찾기</span>
        </li>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore event_directive_deprecated -->
        <li
            class="w-1/4 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            style={$page.url.pathname == "/interest"
                ? "color:#61a2ff"
                : "color:#868686"}
            linkdata="/interest"
            on:click={movePage}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="w-5"
                style={$page.url.pathname == "/interest"
                    ? "fill: rgb(97,162,255);"
                    : "fill: rgb(134,134,134);"}
                ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                    d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                />
            </svg>
            <span class="text-xs">관심현장</span>
        </li>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore event_directive_deprecated -->
        <li
            class="w-1/4 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            style={$page.url.pathname == "/my"
                ? "color:#61a2ff"
                : "color:#868686"}
            linkdata="/my"
            on:click={movePage}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="w-6"
                style={$page.url.pathname == "/my"
                    ? "fill: rgb(97,162,255);"
                    : "fill: rgb(134,134,134);"}
                ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                    d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"
                />
            </svg>
            <span class="text-xs">마이</span>
        </li>
    </ul>

    <div></div>
</div>

<style>
</style>
