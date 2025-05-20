<script>
    import { goto } from "$app/navigation";
</script>

<div class="z-50 suit-font" style="padding-top: 57px; padding-bottom:70px">
    <div class="bg-white p-5 rounded-lg">
        <div class="flex gap-7">
            <div class="w-20 h-20 relative">
                <!-- svelte-ignore a11y_consider_explicit_label -->
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

        <div class="mt-10 bg-yellow-400 p-3 rounded-lg grid grid-cols-2 gap-3">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="flex gap-2 items-center cursor-pointer"
                on:click={() => {
                    goto("/registjob");
                }}
            >
                <div
                    class="bg-white w-7 h-7 rounded-lg flex justify-center items-center"
                >
                    <i class="fa fa-building-o" aria-hidden="true"></i>
                </div>
                <div class="text-sm font-semibold">구인글 등록</div>
            </div>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="flex gap-2 items-center cursor-pointer"
                on:click={() => {
                    goto("/manage_job");
                }}
            >
                <div
                    class="bg-white w-7 h-7 rounded-lg flex justify-center items-center text-xs"
                >
                    0
                </div>
                <div class="text-sm font-semibold">구인글 관리</div>
            </div>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="flex gap-2 items-center cursor-pointer"
                on:click={() => {
                    goto("/managemy");
                }}
            >
                <div
                    class="bg-white w-7 h-7 rounded-lg flex justify-center items-center"
                >
                    <i class="fa fa-user-o" aria-hidden="true"></i>
                </div>
                <div class="text-sm font-semibold">회원정보 관리</div>
            </div>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
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
                <div class="text-sm font-semibold">인재정보 관리</div>
            </div>
        </div>
    </div>

    <div class="mt-3 bg-white p-5 rounded-lg">
        <div class="flex gap-3">
            <button class="btn btn-outline w-1/2 border-gray-500 text-gray-500"
                >로그아웃</button
            >
            <button class="btn btn-outline w-1/2 border-gray-500 text-gray-500"
                >고객센터</button
            >
        </div>
    </div>
</div>
