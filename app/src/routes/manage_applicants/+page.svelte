<script>
    import { onMount } from "svelte";
    import moment from "moment-timezone";
    import { public_img_bucket, back_api } from "$lib/const";
    import { user_info } from "$lib/stores/stores.js";
    import axios from "axios";
    import { goto } from "$app/navigation";

    let { data } = $props();
    let applyList = $state([]);
    let statusCount = $state({});

    let loadLoding = $state(false);
    let startNum = $state(1);
    let getListTemp = $state([]);

    onMount(() => {
        applyList = data.applyList || [];
        console.log(applyList);

        statusCount = data.statusCount || {};
    });

    $effect(() => {
        if (getListTemp.length > 0) {
            applyList = [...applyList, ...getListTemp];
            getListTemp = [];
            loadLoding = false;
        }
    });

    const getEndDate = (date) =>
        moment(date).add(10, "days").format("YY/MM/DD");
    function handleImageError(e) {
        e.target.src = "/alt_image.jpg";
    }

    let observer;
    async function loadMore() {
        if (loadLoding) return;
        loadLoding = true;
        startNum += 10;

        setTimeout(async () => {
            try {
                const res = await axios.post(
                    `${back_api}/detail/load_apply_status`,
                    {
                        startNum,
                        user_idx: $user_info.idx,
                    },
                );
                getListTemp = res.data.applyList;
            } catch (error) {
                console.error(error.message);
                loadLoding = false;
            }
        }, 1000);
    }

    function observeNode(node, index) {
        if ((index + 1) % 10 === 9) {
            if (!observer) {
                observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            loadMore();
                            observer.unobserve(entry.target);
                        }
                    });
                });
            }
            observer.observe(node);
        }
        return {
            destroy() {
                observer?.unobserve(node);
            },
        };
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->

<div class="grid grid-cols-3 gap-3 mb-6">
    <div
        class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center"
    >
        <p
            class="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider"
        >
            전체 공고
        </p>
        <p class="text-xl font-black text-gray-800">
            {statusCount.all_count || 0}
        </p>
    </div>
    <div
        class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center"
    >
        <p
            class="text-[10px] font-bold text-blue-400 mb-1 uppercase tracking-wider"
        >
            진행중
        </p>
        <p class="text-xl font-black text-blue-600">
            {statusCount.going_count || 0}
        </p>
    </div>
    <div
        class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center"
    >
        <p
            class="text-[10px] font-bold text-red-400 mb-1 uppercase tracking-wider"
        >
            마감
        </p>
        <p class="text-xl font-black text-red-500">
            {statusCount.end_count || 0}
        </p>
    </div>
</div>

<div class="space-y-4">
    {#each applyList as item, index}
        <div
            use:observeNode={index}
            class="relative flex flex-col p-5 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all"
        >
            <div
                class="flex gap-4 cursor-pointer active:opacity-70 transition-opacity"
                onclick={() => {
                    console.log("아이템 정보 클릭:", item.postId);
                    // 필요하다면 여기서도 상세 페이지로 이동하게 할 수 있어!
                    goto(`/detail/${item.idx}`);
                }}
            >
                <div
                    class="w-20 h-20 shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-50"
                >
                    <img
                        src={item.thumbnail
                            ? `${public_img_bucket}${item.thumbnail}`
                            : "/alt_image.jpg"}
                        alt=""
                        onerror={handleImageError}
                        class="w-full h-full object-cover"
                    />
                </div>

                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 mb-1.5">
                        {#if item.is_display}
                            <span
                                class="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase"
                                >진행중</span
                            >
                        {:else}
                            <span
                                class="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase"
                                >마감</span
                            >
                        {/if}
                        <span
                            class="text-[10px] font-bold text-gray-400 uppercase tracking-tight"
                        >
                            {moment(item.created_at).format("YY.MM.DD")}
                            — {getEndDate(item.created_at)}
                        </span>
                    </div>

                    <h3
                        class="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-2"
                    >
                        {item.post}
                    </h3>
                </div>
            </div>

            <div
                class="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between"
            >
                <div class="flex gap-6">
                    <div class="flex flex-col">
                        <span
                            class="text-[10px] text-gray-400 font-bold mb-0.5 uppercase"
                            >전체 지원자</span
                        >
                        <span class="text-xs font-black text-gray-800">
                            {item.allcount}<span
                                class="text-[10px] font-medium ml-0.5">명</span
                            >
                        </span>
                    </div>
                    <div class="flex flex-col">
                        <span
                            class="text-[10px] text-red-400 font-bold mb-0.5 uppercase"
                            >미열람</span
                        >
                        <span class="text-xs font-black text-red-500">
                            {item.unreads_num}<span
                                class="text-[10px] font-medium ml-0.5">명</span
                            >
                        </span>
                    </div>
                </div>

                <a
                    href={`/manage_applicants/${item.idx}`}
                    class="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-extrabold shadow-md active:scale-95 active:bg-black transition-all"
                >
                    지원자 보기
                </a>
            </div>
        </div>
    {/each}
</div>

{#if applyList.length === 0 && !loadLoding}
    <div class="py-24 text-center">
        <p class="text-gray-300 font-bold text-sm">등록된 공고가 없습니다.</p>
    </div>
{/if}

{#if loadLoding}
    <div class="flex flex-col items-center justify-center py-10 gap-2">
        <div
            class="w-6 h-6 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin"
        ></div>
        <p
            class="text-[10px] font-bold text-gray-300 uppercase tracking-widest"
        >
            Loading
        </p>
    </div>
{/if}

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
