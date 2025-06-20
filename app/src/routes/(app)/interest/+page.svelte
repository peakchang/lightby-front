<script>
    import { user_info } from "$lib/stores/stores";
    import { goto } from "$app/navigation";
    import { navigating, page } from "$app/stores";

    let tempArr = [
        { thumbnail: "sample_img1.jpg" },
        { thumbnail: "sample_img2.jpg" },
        {},
        {},
        { thumbnail: "sample_img1.jpg" },
        {},
    ];

    let tabArea = $derived({});
    let tabNum = $state(0); // 탭에 넘버 부여하고 변경 될때마다 관심 지역 / 찜한 목록 등 변경됨

    function changeTab(e) {
        tabNum = e.target.dataset.num;

        console.log(tabNum);

        for (const el of tabArea.children) {
            el.classList.remove("tab-active");
        }
        tabArea.children[e.target.dataset.num].classList.add("tab-active");
    }
</script>

<!-- svelte-ignore event_directive_deprecated -->
<div class="pb-32 suit-font">
    {#if $user_info.idx}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore event_directive_deprecated -->
        <div class="tab-area cursor-pointer pt-20" bind:this={tabArea}>
            <div
                class:border-b-2={tabNum == 0}
                class:text-black={tabNum == 0}
                class:pb-1={tabNum == 0}
                data-num="0"
                on:click={changeTab}
            >
                관심 지역
            </div>
            <div
                data-num="1"
                class:border-b-2={tabNum == 1}
                class:text-black={tabNum == 1}
                class:pb-1={tabNum == 1}
                on:click={changeTab}
            >
                찜한 목록
            </div>
            <div
                data-num="2"
                class:border-b-2={tabNum == 2}
                class:text-black={tabNum == 2}
                class:pb-1={tabNum == 2}
                on:click={changeTab}
            >
                내 주변 현장
            </div>
        </div>

        <!-- svelte-ignore event_directive_deprecated -->

        {#if tabNum == 0 || tabNum == 1}
            <div class="z-50 suit-font px-3 mt-5" style="padding-bottom:70px">
                {#each tempArr as value}
                    <a
                        href="/detail/{value.idx}"
                        on:click|preventDefault={() => {}}
                    >
                        <div
                            class="border border-gray-300 rounded-lg p-2 mb-3 shadow-sm cursor-pointer relative"
                        >
                            <div
                                class="flex gap-3 md:gap-5 items-center border-b-gray-300"
                            >
                                {#if value.thumbnail}
                                    <div
                                        class=" w-28 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden flex-shrink-0"
                                    >
                                        <img
                                            src={value.thumbnail}
                                            alt=""
                                            class="w-full h-full object-cover"
                                        />
                                    </div>
                                {:else}
                                    <div class="w-4"></div>
                                {/if}

                                <div class="flex flex-col justify-between">
                                    <div class="mb-1">모모 현장입니다~~~</div>
                                    <div class="text-sm">25/06/20 15:32</div>
                                </div>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {:else if tabNum == 2}
            <div class="pt-10 pb-32 suit-font px-3">
                <div
                    class="text-center text-xl bg-green-700 text-white w-[80%] md:w-[50%] mx-auto py-3 rounded-full mt-20"
                >
                    준비중입니다.
                </div>

                <div class="mt-10 text-center">
                    <p>
                        인재찾기 서비스는 모ㅗㅁ를 위해 모모 하는 서비스 입니다.
                    </p>
                    <p>asdflijasldijfliasjilfjasildjfliasjfliajf</p>
                    <p>aslidfjalisdjflijasdlijfilasjdlfijasdf</p>
                </div>
            </div>
        {/if}
    {:else}
        <div class="pt-40 text-center">
            <div class=" text-green-700 text-4xl">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
            </div>
            <div class="text-xl font-bold mt-5">
                로그인이 필요한 페이지 입니다.
            </div>
            <div class="text-sm mt-5">
                <p>관심현장은 로그인 후,</p>
                <p>마이페이지에서 지역 설정을 하시거나</p>
                <p>상세페이지에서 찜한 목록이 표시됩니다.</p>
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
    .tab-area {
        display: flex;
        justify-content: center;
        gap: 10%;
        color: #939393;
    }
    .tab-active {
        color: black;
        border-bottom: 3px solid black;
        padding-bottom: 5px;
    }
</style>
