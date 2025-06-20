<script>
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { user_info } from "$lib/stores/stores";
    import { goto } from "$app/navigation";
    import { navigating, page } from "$app/stores";

    function setInterest() {}

    let interestModalBool = $state(false);
</script>

<!-- 관심지역 설정 모달 -->
<CustomModal bind:visible={interestModalBool} closeBtn={false}>
    <div class="text-center">
        <div class=" text-lg mb-2">관심지역 설정</div>
        <div>asdljfailsjfdaslidfj</div>
    </div>
</CustomModal>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_consider_explicit_label -->
<div class="z-50 suit-font" style="padding-bottom:70px">
    {#if $user_info.idx}
        <div class="bg-white p-5 rounded-lg pt-20">
            <div class="flex gap-7">
                <div class="w-20 h-20 relative">
                    <button
                        class="absolute bottom-[-10px] right-[-10px] w-7 h-7 border-2 rounded-full bg-white text-xs text-gray-500"
                    >
                        <i class="fa fa-camera" aria-hidden="true"></i>
                    </button>
                    <div
                        class="border-2 border-gray-300 rounded-xl overflow-hidden"
                    >
                        <img src="/profile-base.png" alt="" />
                    </div>
                </div>

                <div class="flex flex-col justify-center gap-1">
                    <span>
                        <span class="text-lg font-semibold">스나바타니</span>
                        <span>님</span>
                    </span>
                    <span class="text-sm">
                        회원정보 관리
                        <i class="fa fa-angle-right" aria-hidden="true"></i>
                    </span>
                </div>
            </div>

            <div
                class="mt-10 bg-yellow-400 p-3 rounded-lg grid grid-cols-2 gap-3"
            >
                <div
                    class="flex gap-2 items-center cursor-pointer"
                    on:click={() => {
                        interestModalBool = true;
                    }}
                >
                    <div
                        class="bg-white w-7 h-7 rounded-lg flex justify-center items-center"
                    >
                        <i class="fa fa-building-o" aria-hidden="true"></i>
                    </div>
                    <div class="text-sm font-semibold">관심지역 설정</div>
                </div>

                <div
                    class="flex gap-2 items-center cursor-pointer"
                    on:click={() => {
                        goto("/manage_board");
                    }}
                >
                    <div
                        class="bg-white w-7 h-7 rounded-lg flex justify-center items-center text-xs"
                    >
                        0
                    </div>
                    <div class="text-sm font-semibold">내 글 관리</div>
                </div>

                <div
                    class="flex gap-2 items-center cursor-pointer"
                    on:click={() => {
                        goto("/auth/manage");
                    }}
                >
                    <div
                        class="bg-white w-7 h-7 rounded-lg flex justify-center items-center"
                    >
                        <i class="fa fa-user-o" aria-hidden="true"></i>
                    </div>
                    <div class="text-sm font-semibold">회원정보 관리</div>
                </div>

                <div
                    class="flex gap-2 items-center cursor-pointer"
                    on:click={() => {
                        goto("/registtalent");
                    }}
                >
                    <div
                        class="bg-white w-7 h-7 rounded-lg flex justify-center items-center"
                    >
                        <i class="fa fa-file-text-o" aria-hidden="true"></i>
                    </div>
                    <div class="text-sm font-semibold">
                        <p>내 인재 글 관리</p>
                        <p class="text-xs">(준비중)</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-3 bg-white p-5 rounded-lg">
            <div class="flex gap-3">
                <button
                    class="btn btn-outline w-1/2 border-gray-500 text-gray-500"
                    >로그아웃</button
                >
                <button
                    class="btn btn-outline w-1/2 border-gray-500 text-gray-500"
                    >고객센터</button
                >
            </div>
        </div>
    {:else}
        <div class="pt-40 text-center">
            <div class=" text-green-700 text-4xl">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
            </div>
            <div class="text-xl font-bold mt-5">
                로그인이 필요한 페이지 입니다.
            </div>
            <div class="text-sm mt-5">
                <p>
                    로그인 후, 구인 글 관리 / 관심 지역 설정 / 회원 정보 관리 등
                </p>
                <p>내 정보 관리가 가능합니다.</p>
            </div>
            <div class="mt-5">
                <a
                    href="/auth/login"
                    on:click|preventDefault={() => {
                        goto(`/auth/login?path=${$page.url.pathname}`);
                    }}
                >
                    <button class="btn btn-info btn-lg w-1/3 text-white">
                        로그인하기
                    </button>
                </a>
            </div>
        </div>
    {/if}
</div>
