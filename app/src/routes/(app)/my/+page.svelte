<script>
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { user_info } from "$lib/stores/stores";
    import { goto, invalidateAll } from "$app/navigation";
    import { navigating, page } from "$app/stores";
    import { onMount } from "svelte";
    import {
        regions,
        businessCategorys,
        jobCategorys,
        back_api,
    } from "$lib/const.js";

    import { toastStore } from "$lib/stores/stores";
    import axios from "axios";

    let { data } = $props();

    let userInfo = $derived({});

    // 관심 정보
    let location = $state([]);
    let business = $state([]);
    let occupation = $state([]);
    onMount(() => {
        userInfo = data.userInfo;
        if (userInfo.interest) {
            const interestJson = JSON.parse(userInfo.interest);
            location = interestJson.location;
            business = interestJson.business;
            occupation = interestJson.occupation;
        }
    });

    async function setInterest() {
        let jsonStr = "";
        if (
            location.length > 0 ||
            business.length > 0 ||
            occupation.length > 0
        ) {
            const setJson = { location, business, occupation };
            jsonStr = JSON.stringify(setJson);
        } else {
            jsonStr = "";
        }

        try {
            const res = await axios.post(`${back_api}/update_interest`, {
                idx: $user_info.idx,
                jsonStr,
            });

            toastStore.set({
                show: true,
                message: "관심 지역 설정이 완료 되었습니다.",
                color: "#4374D9",
            });

            invalidateAll();
        } catch (error) {
            alert("에러 발생! 관리자에게 문의하세요!");
        }
    }

    let interestModalBool = $state(false);
</script>

<!-- 관심지역 설정 모달 -->
<CustomModal bind:visible={interestModalBool} closeBtn={false}>
    <div class="">
        <div class="my-3">- 관심지역 설정</div>
        <div class="grid grid-cols-2 gap-1">
            {#each regions as region, idx}
                <label class="button-checkbox">
                    <input
                        type="checkbox"
                        hidden
                        value={region}
                        bind:group={location}
                    />
                    <div>{region}</div>
                </label>
            {/each}
        </div>

        <div class="my-3">- 관심업종 설정</div>
        <div class="grid grid-cols-2 gap-1">
            {#each businessCategorys as val, idx}
                <label class="button-checkbox">
                    <input
                        type="checkbox"
                        hidden
                        value={val}
                        bind:group={business}
                    />
                    <div>{val}</div>
                </label>
            {/each}
        </div>

        <div class="my-3">- 관심직종 설정</div>
        <div class="grid grid-cols-2 gap-1">
            {#each jobCategorys as job, idx}
                <label class="button-checkbox">
                    <input
                        type="checkbox"
                        hidden
                        value={job}
                        bind:group={occupation}
                    />
                    <div>{job}</div>
                </label>
            {/each}
        </div>
        <div class="mt-5 text-center">
            <!-- svelte-ignore event_directive_deprecated -->
            <button
                class="btn btn-success w-1/2 text-white"
                on:click={setInterest}
            >
                등록하기
            </button>
        </div>
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
                        class="absolute bottom-[-10px] right-[-10px] w-7 h-7 border-2 rounded-full bg-white text-xs text-gray-500 cursor-pointer"
                        on:click={() => {
                            goto("/auth/manage");
                        }}
                    >
                        <i class="fa fa-camera" aria-hidden="true"></i>
                    </button>
                    <div
                        class="border-2 border-gray-300 rounded-xl overflow-hidden"
                    >
                        {#if userInfo.profile_thumbnail}
                            <img src={userInfo.profile_thumbnail} alt="" />
                        {:else}
                            <img src="/profile-base.png" alt="" />
                        {/if}
                    </div>
                </div>

                <div class="flex flex-col justify-center gap-1">
                    <span>
                        <span class="text-lg font-semibold"
                            >{userInfo.nickname}</span
                        >
                        <span>님</span>
                    </span>
                    <span
                        class="text-sm cursor-pointer"
                        on:click={() => {
                            goto("/auth/manage");
                        }}
                    >
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

<style>
    .button-checkbox div {
        display: block;
        background-color: #f0f0f0;
        color: #333;
        font-size: 14px;
        border: 1.5px solid #ccc;
        border-radius: 5px;
        padding: 8px 0;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
    }

    .button-checkbox input[type="checkbox"]:checked + div {
        background-color: #08b9ff;
        color: white;
        border-color: #0099ff;
    }

    .button-checkbox input[type="radio"]:checked + div {
        background-color: #08b9ff;
        color: white;
        border-color: #0099ff;
    }
</style>
