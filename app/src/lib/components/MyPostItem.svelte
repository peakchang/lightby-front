<script>
    import { goto } from "$app/navigation";
    import moment from "moment-timezone";
    import { public_img_bucket } from "$lib/const.js";
    import { manageBoardTabNum, prev } from "$lib/stores/stores";

    let { value } = $props();

    let imgError = $state(false);
    let movePath = $state("");

    const productTypeMap = {
        premium: { label: "프리미엄", color: "bg-purple-100 text-purple-700" },
        top: { label: "지역탑", color: "bg-blue-100 text-blue-700" },
        free: { label: "무료", color: "bg-gray-100 text-gray-600" },
    };

    function getProductStyle(key) {
        return (
            productTypeMap[key] || {
                label: "알 수 없음",
                color: "bg-gray-100 text-gray-600",
            }
        );
    }

    $effect(() => {
        movePath = $manageBoardTabNum == 0 ? "detail" : "showfee";
    });

    const handleItemClick = () => {
        $prev = "/manage_board";
        goto(`/${movePath}/${value.idx}`);
    };
</script>

<div
    class="group bg-white border border-gray-100 rounded-2xl p-3 mb-4 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
    on:click={handleItemClick}
>
    <div class="flex gap-4 items-center">
        <div
            class="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-50"
        >
            {#if imgError || (!value.thumbnail && !value.imgs)}
                <div
                    class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400"
                >
                    <i class="fa fa-picture-o text-2xl"></i>
                </div>
            {:else}
                <img
                    src={public_img_bucket +
                        (value.thumbnail || value.imgs.split(",")[0])}
                    alt="thumbnail"
                    on:error={() => (imgError = true)}
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            {/if}

            {#if value.product}
                <div
                    class="absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-sm {getProductStyle(
                        value.product,
                    ).color} bg-opacity-90 backdrop-blur-sm"
                >
                    {getProductStyle(value.product).label}
                </div>
            {/if}
        </div>

        <div class="flex flex-col flex-1 min-w-0 gap-1.5">
            <div class="flex justify-between items-start gap-2">
                <h3
                    class="text-[15px] font-bold text-gray-800 truncate leading-tight"
                >
                    {value.subject}
                </h3>
            </div>

            <div class="flex items-center gap-2 text-gray-400 text-[12px]">
                <i class="fa fa-clock-o text-[10px]"></i>
                <span
                    >{moment(value.created_at).format("YYYY.MM.DD HH:mm")}</span
                >
            </div>

            {#if value.ad_status}
                <div class="mt-1 flex items-center gap-2">
                    {#if value.ad_status.status}
                        <div
                            class="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[11px] font-medium border border-green-100"
                        >
                            <span
                                class="w-1 h-1 bg-green-500 rounded-full animate-pulse"
                            ></span>
                            진행중 · {value.ad_status.daysLeft}일 남음
                        </div>
                    {:else}
                        <div
                            class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[11px] font-medium border border-gray-200"
                        >
                            광고 종료
                        </div>
                    {/if}
                </div>
            {/if}
        </div>

        <div
            class="text-gray-300 group-hover:text-blue-500 transition-colors px-2"
        >
            <i class="fa fa-chevron-right text-lg"></i>
        </div>
    </div>
</div>

<style>
    /* 폰트 및 추가 스타일 */
    h3 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
