<script>
    import { goto } from "$app/navigation";

    let sampleArr = $state([1, 2, 3, 4, 5]);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class="pt-20 pb-32 suit-font px-3">
    {#each sampleArr as sample}
        <div
            class="border-b py-5 px-3 border-gray-300 cursor-pointer"
            on:click={() => {
                goto("/showfee/test");
            }}
        >
            <div class="mt-1 font-semibold">이것은 글의 제목 입니다!!!</div>
            <div class="mt-1 ellipsis">
                Lorem ipsum, 숫자가 보이면 ** 처리 되게!!! dolor sit amet
                consectetur adipisicing elit. Sint voluptas veniam explicabo
                ullam error cumque numquam quae pariatur, aspernatur modi
                inventore beatae voluptatem quaerat expedita amet excepturi
                soluta aliquid suscipit.
            </div>
            <div class=" mt-3 flex justify-end flex-wrap items-center">
                <span class="text-xs md:text-sm">테스트 모모</span>
                <span class="mx-1.5">|</span>
                <span class="flex items-center gap-1 text-sm">
                    <i class="fa fa-heart-o" aria-hidden="true"></i>
                    <span
                        class="border border-gray-400 px-1.5 py-0.5 rounded-full text-[10px] md:text-xs"
                    >
                        195
                    </span>
                </span>
                <span class="mx-1">|</span>

                <span class="flex items-center gap-1 text-sm">
                    <i class="fa fa-commenting text-gray-500" aria-hidden="true"
                    ></i>
                    <span
                        class="border border-gray-400 px-2 py-0.5 rounded-full text-[10px] md:text-xs"
                    >
                        195
                    </span>
                </span>

                <span class="mx-1">|</span>

                <span class="text-xs md:text-sm"> 25-06-17 12:42 </span>
            </div>
        </div>
    {/each}
</div>

<style>
    .ellipsis {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
