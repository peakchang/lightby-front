<script>
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
        for (const el of tabArea.children) {
            el.classList.remove("tab-active");
        }
        tabArea.children[e.target.dataset.num].classList.add("tab-active");
    }
</script>

<div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="tab-area cursor-pointer" bind:this={tabArea}>
        <div data-num="0" class:tab-active={tabNum == 0} on:click={changeTab}>
            구인글 관리
        </div>
        <div data-num="1" class:tab-active={tabNum == 1} on:click={changeTab}>
            게시판 관리
        </div>
    </div>
</div>

{#if tabNum == 0 || tabNum == 1}
    <div class="z-50 suit-font px-3 mt-5" style="padding-bottom:70px">
        {#each tempArr as value}
            <a href="/detail/{value.idx}" on:click|preventDefault={() => {}}>
                <div
                    class="border border-gray-300 rounded-lg p-2 mb-3 shadow-sm cursor-pointer relative"
                >
                    <div
                        class="flex gap-3 justify-between md:gap-5 items-center border-b-gray-300"
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

                        <div class="flex flex-col justify-between w-full">
                            <div class="mb-1">모모 현장입니다~~~</div>
                            <div class="text-sm">25/06/20 15:32</div>
                        </div>
                        <div class=" text-right">
                            <button
                                class="btn btn-success btn-sm text-sm min-w-[60px] text-white"
                            >
                                수정
                            </button>
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>
{:else}
    <div class="z-50 suit-font px-3 mt-5" style="padding-bottom:70px">
        준비중입니다....
    </div>
{/if}

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
