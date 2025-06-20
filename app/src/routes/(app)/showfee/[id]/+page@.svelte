<script>
    let tempArr = [1, 2, 3, 4, 5, 6, 7];
</script>

<div class="fixed top-0 left-0 w-full z-20 suit-font">
    <div class="max-w-[530px] mx-auto bg-white border-b">
        <div class=" py-2 flex justify-between items-center">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="cursor-pointer"
                style="color: #3da83b;"
                on:click={() => {
                    window.history.back();
                }}
            >
                <i class="fa fa-angle-left text-2xl mr-1" aria-hidden="true"
                ></i>
                <span class="">뒤로가기</span>
            </div>
        </div>
    </div>
</div>

<!-- svelte-ignore event_directive_deprecated -->
<div class="bg-white relative min-h-screen">
    <div class="max-w-[530px] mx-auto pretendard pt-14 pb-24">
        <div class="content-area border-b border-gray-300">
            <div class="text-lg font-semibold">이것은 글의 제목 입니다!!!</div>
            <div class=" mt-3 flex items-center justify-end">
                <span class="text-sm">테스트 모모</span>
                <span class="mx-3">|</span>
                <span class="flex items-center gap-1.5">
                    <i class="fa fa-heart-o" aria-hidden="true"></i>
                    <span
                        class="border border-gray-400 px-2 py-0.5 rounded-full text-xs"
                    >
                        195
                    </span>
                </span>
                <span class="mx-3">|</span>

                <span class="flex items-center gap-1.5">
                    <i class="fa fa-commenting text-gray-500" aria-hidden="true"
                    ></i>
                    <span
                        class="border border-gray-400 px-2 py-0.5 rounded-full text-xs"
                    >
                        195
                    </span>
                </span>
                <span class="mx-3">|</span>

                <span class="text-sm"> 25-06-17 12:42 </span>
            </div>

            <div class="mt-10 pb-10">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum
                voluptas officia sit provident error delectus ipsa blanditiis
                molestias porro ex, ducimus amet repudiandae eligendi magnam.
                Dolor temporibus veritatis obcaecati cum?
            </div>
        </div>

        <div class="my-5">
            <span class=" border px-3 py-1 text-sm rounded-full">댓글</span>
        </div>

        {#each tempArr as temp}
            <div class="reply-area border-b border-gray-300 pb-5 mb-5">
                <div class="">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Similique minus aliquid, asperiores deserunt omnis
                    accusantium libero officia voluptatem?
                </div>
                <div class="mt-3 flex justify-end text-sm">
                    <span>댓글 작성자</span>
                    <span class="mx-2">|</span>
                    <span>25/06/20 11:42</span>
                </div>
            </div>
        {/each}
    </div>
</div>
