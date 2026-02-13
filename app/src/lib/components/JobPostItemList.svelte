<script>
    import { goto } from "$app/navigation";
    import { public_img_bucket, iconList, colorMap } from "$lib/const.js";
    import {
        prev,
        nonMemberViewLimitNum,
        user_info,
        viewLimitAlertModal,
        main_list,
    } from "$lib/stores/stores";
    import { raiseViewCount, formatToManWon } from "$lib/lib";

    let { type } = $props();

    const businessReplaceDict = $derived({
        도시형생활주택: "도생",
        지식산업센터: "지산",
        "상가/쇼핑몰": "상가",
    });

    let postList = $state([]);

    $effect(() => {
        postList = $main_list[type] || [];
    });

    function goToDetail(idx) {
        if (!$user_info.idx) {
            if ($nonMemberViewLimitNum > 3) {
                $viewLimitAlertModal = true;
                return;
            }
            $nonMemberViewLimitNum = $nonMemberViewLimitNum + 1;
        }
        raiseViewCount("site", idx);
        $prev = "/";
        goto(`/detail/${idx}`);
    }

    function multiReplace(str, map) {
        if (!str) return "";
        const regex = new RegExp(Object.keys(map).join("|"), "g");
        return str.replace(regex, (match) => map[match]);
    }

    function handleImageError(e) {
        e.target.src = "/alt_image.jpg";
    }

    function isNumeric(str) {
        return /^\d+$/.test(str);
    }

    function getIconDetail(targetId) {
        // 1. iconList에서 해당 ID를 가진 객체를 찾습니다.
        const icon = iconList.find((item) => item.id === targetId);

        // 2. 만약 찾지 못했다면 빈 값을 반환하거나 기본값을 설정합니다.
        if (!icon) return { name: "", color: "", class: "" };

        // 3. 기존 정보에 colorMap의 클래스 정보를 추가해서 반환합니다.
        return {
            ...icon,
            class: colorMap[icon.color] || "", // colorMap에 해당 색상이 없으면 빈 문자열
        };
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class="flex flex-col gap-3 py-2">
    {#each postList as value}
        <div
            class="group bg-white rounded-xl p-3 shadow-sm
                   border border-gray-200 cursor-pointer
                   transition-all active:scale-[0.98] hover:border-sky-300"
            on:click={() => goToDetail(value.idx)}
        >
            <div class="flex gap-4 items-stretch relative">
                <div
                    class="relative w-28 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100"
                >
                    <img
                        src={value.thumbnail
                            ? `${public_img_bucket}${value.thumbnail}`
                            : value.imgs
                              ? `${public_img_bucket}${value.imgs.split(",")[0]}`
                              : "/alt_image.jpg"}
                        alt="thumbnail"
                        on:error={handleImageError}
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                        class="absolute top-0 left-0 bg-gray-800/70 backdrop-blur-sm text-[9px] text-white px-1.5 py-0.5 rounded-br-md font-bold uppercase tracking-tighter"
                    >
                        {type}
                    </div>
                </div>

                <div
                    class="flex-1 min-w-0 flex flex-col justify-between py-0.5"
                >
                    <div>
                        <div
                            class="text-[11px] md:text-xs text-amber-700 truncate mb-1"
                        >
                            <i class="fa fa-map-marker mr-1"></i>{value.point}
                        </div>

                        <div
                            class="text-[15px] md:text-base font-semibold text-gray-900 leading-snug mb-1"
                        >
                            <div class="flex items-center gap-1 w-full min-w-0">
                                <span class="truncate min-w-0">
                                    {value.subject}
                                </span>
                            </div>
                        </div>

                        <div class="flex items-baseline gap-1.5">
                            <span class="text-[10px] md:text-xs text-gray-400"
                                >{value.fee_type}</span
                            >
                            <span
                                class="text-[15px] md:text-lg font-bold text-sky-600"
                            >
                                {isNumeric(value.fee)
                                    ? formatToManWon(value.fee)
                                    : value.fee}
                            </span>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-1.5 mt-2">
                        <span
                            class="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] md:text-xs px-2 py-0.5 rounded-md font-bold"
                        >
                            {multiReplace(value.business, businessReplaceDict)}
                        </span>
                        <span
                            class="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] md:text-xs px-2 py-0.5 rounded-md font-bold"
                        >
                            {value.occupation}
                        </span>
                    </div>
                </div>

                {#if value.icons}
                    <div class="absolute bottom-[-2px] right-[-2px]">
                        <span
                            class="{getIconDetail(value.icons)[
                                'class'
                            ]}text-[10px] md:text-xs flex-shrink-0 badge badge-outline font-bold px-1.5 py-2 animate-pulse"
                        >
                            {getIconDetail(value.icons)["name"]}
                        </span>
                        <!-- <div
                            class="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg p-1 shadow-sm border border-gray-200"
                        >
                            <img
                                src="/icons/icon-{value.icons.split(
                                    ',',
                                )[0]}.png"
                                alt="icon"
                                class="w-full h-full object-contain"
                            />
                        </div> -->
                    </div>
                {/if}
            </div>
        </div>
    {/each}
</div>

<style>
    /* 한 줄 말줄임표 */
    .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
