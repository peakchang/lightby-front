<script>
    import { goto } from "$app/navigation";
    import { public_img_bucket } from "$lib/const";
    import { prev } from "$lib/stores/stores";
    import moment from "moment-timezone";

    let { post } = $props();
    let imgError = $state(false);

    function goToDetail() {
        $prev = "/interest";
        goto(`/detail/${post.idx}`);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div
    class="group bg-white rounded-2xl py-1.5 px-2.5 border border-gray-200 shadow-sm
           cursor-pointer transition-all active:scale-[0.98] hover:border-blue-200 mb-3"
    on:click={goToDetail}
>
    <div class="flex gap-4 items-center relative">
        <div
            class="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100"
        >
            <img
                src={imgError || !post.thumbnail
                    ? "/alt_image.jpg"
                    : `${public_img_bucket}${post.thumbnail}`}
                alt="thumbnail"
                on:error={() => (imgError = true)}
                class="w-full h-full object-cover"
            />
        </div>

        <div class="flex-1 min-w-0 flex flex-col justify-center">
            <div
                class="text-[16px] md:text-lg font-bold text-gray-900 leading-snug truncate mb-2"
            >
                {post.subject}
            </div>

            <div class="flex items-center gap-2 text-gray-400">
                <span
                    class="bg-gray-100 text-[10px] font-bold px-2 py-0.5 rounded text-gray-500 uppercase tracking-tighter"
                >
                    Created
                </span>
                <span class="text-xs font-medium">
                    {moment(post.created_at).format("YY/MM/DD HH:mm")}
                </span>
            </div>
        </div>

        <div class="text-gray-300 ml-2">
            <i class="fa fa-chevron-right text-sm"></i>
        </div>
    </div>
</div>
