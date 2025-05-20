<script>
    import PdButton from "$lib/components/PdButton.svelte";
    let selectedSite = $state("전국");
    let siteList = $derived([
        "전국",
        "서울/경기/인천",
        "충청/전라",
        "강원/경상/제주",
    ]);

    let loading = $state(true);

    $effect(() => {
        setTimeout(() => {
            loading = false;
        }, 0);
    });
</script>

<div class="pt-16 suit-font">
    <div>
        <ul
            class="grid grid-cols-3 md:grid-cols-4 gap-x-5 md:gap-x-2 gap-y-1 px-4"
        >
            {#each siteList as site}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <!-- svelte-ignore event_directive_deprecated -->
                <li
                    class="text-center text-xs py-1.5 px-2 rounded-full border border-gray-500 text-gray-500 cursor-pointer"
                    class:bg-[#62C15B]={selectedSite == site}
                    class:text-white={selectedSite == site}
                    class:border-white={selectedSite == site}
                    data-site={site}
                    on:click={(e) => {
                        console.log(e.target.getAttribute("data-site"));
                        selectedSite = e.target.getAttribute("data-site");
                    }}
                >
                    {site}
                </li>
            {/each}
        </ul>
    </div>

    {#if loading}
        <div class="mt-20 text-center">
            <div>로딩중</div>
            <span class="loading loading-dots loading-xl"></span>
        </div>
    {:else}
        <div class="mt-5">
            <h1>Welcome to SvelteKit</h1>
            <p>
                Visit <a href="https://svelte.dev/docs/kit"
                    >svelte.dev/docs/kit</a
                > to read the documentation
            </p>

            <div class="bg-red-500">sdafjhasdf</div>
            sdkjfjsldfjlsjfd

            <a href="/registjob">테스트 페이지</a>

            <PdButton
                classVal="px-10 py-1 rounded-full text-white"
                on:click={() => {
                    console.log("alsdjfialsjdflijadsf");
                }}
            >
                구인등록
            </PdButton>

            <button class="px-10 py-1 rounded-full text-white bg-gray-700">
                가나다라
            </button>
        </div>
    {/if}
</div>

<style>
</style>
