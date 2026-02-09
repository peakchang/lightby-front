<script>
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { slide } from "svelte/transition";

    // Props
    let { items = [], allowMultiple = true, answerStatus = false } = $props();

    // 상태 관리
    let openItems = $state(allowMultiple ? {} : null);
    let alertModal = $state(false);

    // 토글 함수
    function toggleItem(id) {
        const item = items.find((item) => item.idx === id);
        if (!item || !item.answer) {
            alertModal = true;
            return;
        }

        if (allowMultiple) {
            if (openItems[id]) {
                delete openItems[id];
            } else {
                openItems[id] = true;
            }
        } else {
            openItems = openItems === id ? null : id;
        }
    }

    function isOpen(id) {
        return allowMultiple ? openItems[id] : openItems === id;
    }
</script>

<CustomModal bind:visible={alertModal}>
    <div class="p-4 text-center">
        <div
            class="w-16 h-16 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
        >
            <i class="fa fa-clock-o"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">답변 준비 중입니다</h3>
        <p class="text-gray-400 text-sm">
            조금만 기다려주시면<br />최대한 빠르게 답변해 드릴게요!
        </p>
    </div>
</CustomModal>

<div class="accordion-container space-y-3">
    {#each items as item (item.idx)}
        <div
            class="group border-none rounded-[20px] overflow-hidden transition-all duration-300"
            class:bg-white={!isOpen(item.idx)}
            class:bg-sky-50={isOpen(item.idx)}
            class:shadow-sm={!isOpen(item.idx)}
            class:ring-1={isOpen(item.idx)}
            class:ring-sky-100={isOpen(item.idx)}
        >
            <div
                class="py-4 px-5 flex justify-between items-start gap-3 cursor-pointer select-none"
                on:click={() => toggleItem(item.idx)}
            >
                <div class="flex gap-3 items-start flex-1">
                    <span
                        class="text-lg font-black {isOpen(item.idx)
                            ? 'text-sky-500'
                            : 'text-gray-300'}">Q.</span
                    >
                    <span
                        class="font-bold text-[15px] leading-tight mt-0.5 {isOpen(
                            item.idx,
                        )
                            ? 'text-sky-900'
                            : 'text-gray-700'}"
                    >
                        {item.question}
                    </span>
                </div>

                <div class="flex flex-col items-end gap-2 flex-shrink-0">
                    {#if answerStatus}
                        {#if item.answer}
                            <span
                                class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600"
                                >답변완료</span
                            >
                        {:else}
                            <span
                                class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400"
                                >검토중</span
                            >
                        {/if}
                    {/if}
                    <span
                        class="text-gray-300 transition-transform duration-300 {isOpen(
                            item.idx,
                        )
                            ? 'rotate-180 text-sky-500'
                            : ''}"
                    >
                        <i class="fa fa-chevron-down text-xs"></i>
                    </span>
                </div>
            </div>

            {#if isOpen(item.idx) && item.answer}
                <div
                    class="px-5 pb-5 animate-fade-in"
                    transition:slide={{ duration: 300 }}
                >
                    <div
                        class="flex gap-3 p-4 bg-white/60 rounded-2xl border border-sky-100/50"
                    >
                        <span class="text-lg font-black text-orange-400"
                            >A.</span
                        >
                        <div
                            class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap pt-0.5"
                        >
                            {item.answer}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .accordion-container {
        /* 마진 등 부모에서 조절 */
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    .animate-fade-in {
        animation: fadeIn 0.5s ease;
    }
</style>
