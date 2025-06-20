<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed top-0 left-0 w-full z-20 suit-font">
    <div class="max-w-[530px] mx-auto bg-white border-b">
        <div class="flex justify-between items-center">
            <div
                class="cursor-pointer p-2"
                style="color: #3da83b;"
                on:click={() => {
                    window.history.back();
                }}
            >
                <i class="fa fa-angle-left text-2xl mr-1" aria-hidden="true"
                ></i>
                <span class="text-sm">뒤로가기</span>
            </div>
        </div>
    </div>
</div>
