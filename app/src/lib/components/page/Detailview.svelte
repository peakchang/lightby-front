<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import {
        user_info,
        toastStore,
        scrollY,
        pageScrollStatus,
        favorateBool,
    } from "$lib/stores/stores.js";
    import { public_img_bucket, back_api } from "$lib/const";
    import { formatPhoneNum } from "$lib/lib";

    import KakaoMap from "$lib/components/kakaoMap.svelte";
    import DetailMenu from "$lib/components/DetailMenu.svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";

    // 컴포넌트 외부에서 주입받는 props
    let { item, isApp = false, favorateValue = false } = $props();

    let detail = $derived(item.detail);
    let mainImage = $state(detail.imgs ? detail.imgs.split(",") : []);
    let shareModal = $state(false);
    let alertModalBool = $state(false);
    let feeValue = $state("");
    let headerShowBool = $state(true);
    let showBool = $state(true);
    let swiperContainer = $state();

    const IFRAME_URL = $derived(
        `https://lightby.co.kr/embed_map?address=${detail.addr}`,
    );

    onMount(async () => {
        if (!isApp) $pageScrollStatus = false;
        $favorateBool = favorateValue;

        feeValue = /^[0-9]+$/.test(detail.fee)
            ? Number(detail.fee).toLocaleString()
            : `${detail.fee} 만`;

        try {
            const SwiperModule = await import(
                "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs"
            );
            new SwiperModule.default(swiperContainer, {
                loop: true,
                speed: 600,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                pagination: { el: ".swiper-pagination", clickable: true },
                autoplay: { delay: 3000, disableOnInteraction: false },
            });
        } catch (error) {
            console.error("Swiper 로드 실패:", error.message);
        }
    });

    $effect(() => {
        console.log($scrollY);

        if ($scrollY !== 0) showBool = false;
        headerShowBool = $scrollY <= 250;
    });

    async function deletePost() {
        try {
            await axios.post(`${back_api}/regist/delete`, {
                delImgs: detail.imgs,
                delThumbnail: detail.thumbnail,
                idx: detail.idx,
            });
            const prev = $page.url.searchParams.get("prev");
            goto(prev === "my" ? "/manage_board" : "/");
        } catch (error) {
            console.error(error.message);
        }
    }
</script>

<div
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300 shadow-lg"
    class:translate-y-[-100%]={headerShowBool}
    class:translate-y-0={!headerShowBool}
>
    <div
        class="max-w-[630px] mx-auto bg-white/90 backdrop-blur-md border-b border-gray-100"
    >
        {#if isApp}
            <DetailMenu item_id={item.pageId} />
        {:else}
            <DetailMenu />
        {/if}
    </div>
</div>

<div id="detail-wrap" class="bg-gray-50 min-h-screen" class:pb-24={!isApp}>
    <div
        class="max-w-[630px] mx-auto bg-white/90 backdrop-blur-md border-b border-gray-100"
    >
        {#if isApp}
            <DetailMenu item_id={item.pageId} />
        {:else}
            <DetailMenu />
        {/if}
    </div>
    <div class="relative group bg-white">
        {#if mainImage.length > 1}
            <div class="swiper" bind:this={swiperContainer}>
                <div class="swiper-wrapper flex items-center">
                    {#each mainImage as img}
                        <div class="swiper-slide h-[350px] overflow-hidden">
                            <img
                                src="{public_img_bucket}{img}"
                                alt=""
                                class="w-full h-full object-cover"
                            />
                        </div>
                    {/each}
                </div>
                <div class="swiper-pagination"></div>
            </div>
        {:else if mainImage.length === 1}
            <div class="">
                <img
                    src="{public_img_bucket}{mainImage[0]}"
                    alt=""
                    class="w-full h-full object-cover"
                    on:error={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.style.display = "none";
                    }}
                />
            </div>
        {/if}

        {#if detail.user_id == $user_info.idx}
            <div class="absolute top-4 right-4 z-10 flex gap-2">
                <button
                    class="btn btn-circle btn-sm bg-white/80 border-none shadow-md hover:bg-info hover:text-white"
                    on:click={() => goto(`/joboffer?modifyidx=${detail.idx}`)}
                >
                    <i class="fa fa-pencil"></i>
                </button>
                <button
                    class="btn btn-circle btn-sm bg-white/80 border-none shadow-md hover:bg-error hover:text-white"
                    on:click={() => (alertModalBool = true)}
                >
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        {/if}
    </div>

    <div class="p-5 bg-white shadow-sm mb-3">
        <div class="flex items-center gap-2 mb-5">
            <span
                class="badge badge-outline border-sky-500 text-sky-600 font-bold px-3 py-3"
            >
                HOT 현장
            </span>
            <span class="text-gray-400 text-sm">{detail.agency}</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 leading-tight mb-5">
            {detail.subject}
        </h1>

        <div class="bg-sky-50 p-4 rounded-xl border border-sky-100">
            <div class="flex items-start gap-3">
                <span class="text-sky-500 mt-1"
                    ><i class="fa fa-star text-lg"></i></span
                >
                <div>
                    <span
                        class="block text-xs text-sky-600 font-bold uppercase tracking-wider"
                        >Field Point</span
                    >
                    <p class="text-gray-700 font-medium">{detail.point}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-3 px-4 mb-4">
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <span class="text-xs text-gray-400 block mb-1">수수료</span>
            <span class="text-lg font-extrabold text-orange-500"
                >{detail.fee_type} {feeValue}</span
            >
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <span class="text-xs text-gray-400 block mb-1">모집인원</span>
            <span class="text-lg font-extrabold text-gray-800">
                {detail.number_people}
                {detail.number_people.includes("명") ? "" : "명"}
            </span>
        </div>
    </div>

    <div class="px-4 space-y-4 pb-10">
        <section
            class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
        >
            <h2 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="w-1.5 h-4 bg-sky-500 rounded-full"></span>
                <span>기본정보</span>
            </h2>
            <div class="space-y-3">
                <div class="flex justify-between border-b border-gray-50 pb-2">
                    <span class="text-gray-500">담당자</span>
                    <span class="font-medium text-gray-800">{detail.name}</span>
                </div>
                <div class="flex justify-between border-b border-gray-50 pb-2">
                    <span class="text-gray-500">업종</span>
                    <span class="font-medium text-gray-800"
                        >{detail.business?.replace(",", " / ")}</span
                    >
                </div>
                <div class="flex justify-between border-b border-gray-50 pb-2">
                    <span class="text-gray-500">직종</span>
                    <span class="font-medium text-gray-800"
                        >{detail.occupation?.replace(",", " / ")}</span
                    >
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">경력</span>
                    <span class="font-medium text-gray-800"
                        >{detail.career}</span
                    >
                </div>
            </div>
        </section>

        <section
            class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
        >
            <h2 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="w-1.5 h-4 bg-orange-500 rounded-full"></span>
                <span>영업지원 및 복지</span>
            </h2>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex flex-col gap-1 bg-gray-50 p-3 rounded-lg">
                    <span class="text-gray-400 text-xs">일비</span>
                    <span class="font-bold"
                        >{detail.daily_expense || "없음"}</span
                    >
                </div>
                <div class="flex flex-col gap-1 bg-gray-50 p-3 rounded-lg">
                    <span class="text-gray-400 text-xs">숙소비</span>
                    <span class="font-bold"
                        >{detail.sleep_expense || "없음"}</span
                    >
                </div>
                <div class="flex flex-col gap-1 bg-gray-50 p-3 rounded-lg">
                    <span class="text-gray-400 text-xs">프로모션</span>
                    <span class="font-bold">{detail.promotion || "없음"}</span>
                </div>
                <div class="flex flex-col gap-1 bg-gray-50 p-3 rounded-lg">
                    <span class="text-gray-400 text-xs">기본급</span>
                    <span class="font-bold">{detail.base_pay || "없음"}</span>
                </div>
            </div>
        </section>

        <section
            class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
        >
            <h2 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="w-1.5 h-4 bg-sky-500 rounded-full"></span>
                <span>상세 모집내용</span>
            </h2>

            <div
                class="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200"
            >
                {detail.detail_content || "-"}
            </div>
        </section>

        <section
            class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
            <h2 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="w-1.5 h-4 bg-orange-500 rounded-full"></span>
                <span>근무지역</span>
            </h2>
            <p class="text-sm text-gray-500 mb-3">
                <i class="fa fa-map-marker"></i>
                {detail.res_addr}
            </p>
            <div
                class="map-container {isApp
                    ? 'h-[300px]'
                    : 'h-64'} rounded-xl overflow-hidden ring-1 ring-gray-100"
            >
                {#if isApp}
                    <iframe
                        src={IFRAME_URL}
                        style="width:100%;height:100%;border:0;"
                        allow="geolocation"
                        scrolling="no"
                        title="map"
                    ></iframe>
                {:else}
                    <KakaoMap
                        getAddress={detail.addr}
                        phText="근무지"
                        height="300px"
                    />
                {/if}
            </div>
        </section>
    </div>
</div>

<div
    class="fixed bottom-0 left-0 w-full z-40 px-4 pb-6 pt-2 bg-gradient-to-t from-white via-white/95 to-transparent"
>
    <div
        class="max-w-[500px] mx-auto flex gap-2 items-center bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100"
    >
        <a href="TEL:{detail.phone}" class="flex-1">
            <button
                class="btn btn-info w-full text-white border-none bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-100 rounded-xl h-12"
            >
                <i class="fa fa-phone mr-1"></i> 전화하기
            </button>
        </a>
        <a
            href="SMS:{detail.phone}?body=번개분양 보고 연락 드렸습니다."
            class="flex-1"
        >
            <button
                class="btn btn-success w-full text-white border-none bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-100 rounded-xl h-12"
            >
                <i class="fa fa-commenting mr-1"></i> 문자문의
            </button>
        </a>
        <button
            class="btn btn-ghost w-14 h-12 rounded-xl bg-gray-100 text-gray-600"
            on:click={() => (shareModal = true)}
        >
            <i class="fa fa-share-alt text-lg"></i>
        </button>
    </div>
</div>

<CustomModal bind:visible={alertModalBool}>
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-5">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>

        {#if detailContent.product == "free"}
            <div class="mb-5">
                <p>삭제되는 내용은 복구가 불가합니다.</p>
                <p>진행 하시겠습니까?</p>
            </div>
        {:else}
            <div class="mb-5">
                <p>삭제한 내용은 복구가 불가하며</p>
                <p>결제하신 내역까지 전부 사라지게 됩니다.</p>
                <p>진행 하시겠습니까?</p>
            </div>
        {/if}
        <div class="flex justify-center items-center gap-3">
            <button class="btn btn-error w-1/3 text-white" on:click={deletePost}
                >삭제</button
            >
            <button class="btn btn-active w-1/3">취소</button>
        </div>
    </div>
</CustomModal>

<style>
    /* 스와이퍼 페이지네이션 커스텀 */
    :global(.swiper-pagination-bullet-active) {
        background: #0ea5e9 !important; /* sky-500 */
        width: 20px !important;
        border-radius: 5px !important;
    }

    .map-container {
        mask-image: radial-gradient(white, black); /* 모서리 둥글게 유지 */
    }

    /* 폰트 보정 */
    #detail-wrap {
        font-family: "Pretendard", sans-serif;
    }
    /* 두 버전의 스타일 통합 */
    .swiper {
        width: 100%;
        height: 100%;
    }
    .swiper-slide img {
        display: block;
        width: 100%;
        object-fit: cover;
    }
</style>
