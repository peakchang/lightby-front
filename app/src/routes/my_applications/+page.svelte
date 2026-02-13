<script>
    import PageHeader from "$lib/components/PageHeader.svelte";
    import { public_img_bucket, back_api } from "$lib/const";
    import moment from "moment-timezone";
    import axios from "axios";
    import { user_info } from "$lib/stores/stores.js";

    let { data } = $props();

    let applyList = $state(data.applyList || []);
    let startNum = $state(data.startNum || 1);
    let loadLoading = $state(false);
    let observer;

    function handleImageError(e) {
        e.target.src = "/alt_image.jpg";
    }

    async function loadMore() {
        if (loadLoading) return;
        loadLoading = true;
        startNum += 10;

        try {
            const res = await axios.post(
                `${back_api}/detail/load_user_apply_list`,
                {
                    user_idx: $user_info.idx,
                    startNum,
                },
            );

            if (res.data.applyList && res.data.applyList.length > 0) {
                applyList = [...applyList, ...res.data.applyList];
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            loadLoading = false;
        }
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

<PageHeader pageName="내 지원 현황" />

<div class="bg-slate-50 min-h-screen suit-font">
    <div class="max-w-[640px] mx-auto pt-6 pb-24 px-4">
        <div class="space-y-3 p-4 bg-gray-50 min-h-screen">
            {#each applyList as item, index}
                <div
                    use:observeNode={index}
                    class="relative flex flex-col p-5 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all"
                >
                    <div class="flex gap-4">
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
                            <div class="flex justify-between items-start">
                                <div class="flex items-center gap-1.5 mb-1">
                                    {#if !item.is_read}
                                        <span
                                            class="text-[10px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded"
                                            >NEW</span
                                        >
                                    {/if}
                                    <span
                                        class="text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                                        >No.{item.idx}</span
                                    >
                                </div>
                            </div>

                            <h3
                                class="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-2"
                            >
                                {item.subject}
                            </h3>

                            <p class="text-[11px] text-gray-500 font-medium">
                                {moment(item.created_at).format("YY.MM.DD")}
                            </p>
                        </div>
                    </div>

                    <div
                        class="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between"
                    >
                        <div class="flex gap-5">
                            <div class="flex flex-col">
                                <span
                                    class="text-[10px] text-gray-400 font-bold mb-0.5"
                                    >열람</span
                                >
                                <span
                                    class="text-xs font-black {item.is_read
                                        ? 'text-blue-600'
                                        : 'text-gray-400'}"
                                >
                                    {item.is_read ? "확인완료" : "읽지않음"}
                                </span>
                            </div>
                            <div class="flex flex-col">
                                <span
                                    class="text-[10px] text-gray-400 font-bold mb-0.5"
                                    >지원현황</span
                                >
                                <span class="text-xs font-black text-gray-800"
                                    >지원중</span
                                >
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <button
                                onclick={() => {
                                    /* 취소 로직 */
                                }}
                                class="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-extrabold hover:bg-gray-200 active:scale-90 transition-all"
                            >
                                지원취소
                            </button>
                            <a
                                href="/detail/{item.site_idx}"
                                class="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-extrabold shadow-md active:scale-95 active:bg-black transition-all flex items-center"
                            >
                                공고보기
                            </a>
                        </div>
                    </div>
                </div>
            {/each}

            {#if applyList.length === 0}
                <div class="py-24 text-center">
                    <p class="text-gray-300 font-bold text-sm">
                        지원한 내역이 없습니다.
                    </p>
                </div>
            {/if}

            {#if loadLoading}
                <div
                    class="flex flex-col items-center justify-center py-10 gap-2"
                >
                    <div
                        class="w-6 h-6 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin"
                    ></div>
                </div>
            {/if}
        </div>
    </div>
</div>
