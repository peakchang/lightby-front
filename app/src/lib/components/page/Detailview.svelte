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

    let detail = $derived(item.detail)
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
    class="fixed top-0 left-0 w-full z-50 slide-menu"
    class:hidden={showBool}
    class:show={!headerShowBool}
>
    <div class="max-w-[530px] mx-auto bg-white">
        <DetailMenu openShareModal={() => (shareModal = true)} />
    </div>
</div>

<div id="detail-wrap" class:pb-24={!isApp}>
    <DetailMenu openShareModal={() => (shareModal = true)} />

    {#if detail.user_id == $user_info.idx}
        <!-- svelte-ignore event_directive_deprecated -->
        <div class="text-right my-3 px-3">
            <button
                class="btn btn-info text-white btn-sm"
                on:click={() => goto(`/joboffer?modifyidx=${detail.idx}`)}
                >내 글 수정</button
            >
            <button
                class="btn btn-error text-white btn-sm"
                on:click={() => (alertModalBool = true)}>내 글 삭제</button
            >
        </div>
    {/if}

    <div class="mb-8">
        {#if mainImage.length > 1}
            <div class="swiper" bind:this={swiperContainer}>
                <div class="swiper-wrapper">
                    {#each mainImage as img}
                        <div class="swiper-slide">
                            <img
                                src="{public_img_bucket}{img}"
                                alt=""
                                class="mx-auto"
                            />
                        </div>
                    {/each}
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        {:else if mainImage.length === 1}
            <img
                src="{public_img_bucket}{mainImage[0]}"
                alt=""
                class="mx-auto"
            />
        {/if}
    </div>

    <div class="bg-white rounded-lg p-3">
        <div class="font-bold text-xl text-center">{detail.subject}</div>
        <div class="mt-3">
            <p><span class="font-bold">현장 포인트:</span> {detail.point}</p>
            <p>
                <span class="font-bold">전화번호:</span>
                {formatPhoneNum(detail.phone)}
            </p>
        </div>
        <div class="flex items-center gap-0.5 mt-5 text-sm">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                width="16"
                height="16"
                ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                    d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7c0 0 0 0 0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5L109 384c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8c0 0 0 0 0 0s0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4c0 0 0 0 0 0s0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5l-48.6 0c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80l0-16 160 0 0 16c0 44.2-35.8 80-80 80z"
                /></svg
            >
            TIP : 번개분양을 보고 연락드렸다고 하시면 보다 상담이 쉬워집니다.
        </div>
    </div>

    <div class="mt-10 p-3 bg-white rounded-lg">
        <div class="text-lg">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            <span>채용정보</span>
        </div>

        <div class="my-3 font-semibold text-lg">기본정보</div>
        <div class="leading-loose">
            <p>대행사 : {detail.agency}</p>
            <p>담당자 성함 : {detail.name}</p>
            <p>
                모집 업종 : {detail.business
                    ? detail.business.replace(",", " / ")
                    : ""}
            </p>
            <p>
                모집 직종 : {detail.occupation
                    ? detail.occupation.replace(",", " / ")
                    : ""}
            </p>
            <p>경력 : {detail.career}</p>
            <p>인원 : {detail.number_people}</p>
        </div>

        <div class="my-3 font-semibold text-lg">급여 및 영업지원 정보</div>
        <div class="leading-loose">
            <p>수수료 : {detail.fee_type} {feeValue}</p>
            <p>
                일비 : {detail.daily_expense ? detail.daily_expense : "없음"}
            </p>
            <p>
                숙소비 : {detail.sleep_expense ? detail.sleep_expense : "없음"}
            </p>
            <p>
                프로모션 : {detail.promotion ? detail.promotion : "없음"}
            </p>
            <p>
                기본급여 : {detail.base_pay ? detail.base_pay : "없음"}
            </p>
        </div>
    </div>

    <div class="mt-3 p-3 bg-white rounded-lg">
        <div class="text-lg">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            <span>상세정보</span>
        </div>
        <div class="leading-relaxed mt-3 whitespace-pre-wrap">
            {detail.detail_content ? detail.detail_content : "-"}
        </div>
    </div>
</div>

<div class="mt-3 p-3 bg-white rounded-lg">
    <div class="text-lg font-bold mb-2">근무지역</div>
    <div class="mb-2">{detail.res_addr}</div>
    <div
        class="map-container {isApp
            ? 'h-[402px]'
            : 'h-72'} border border-sky-400 rounded-md overflow-hidden"
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
            <KakaoMap getAddress={detail.addr} phText="근무지" height="300px" />
        {/if}
    </div>
</div>
<!-- svelte-ignore event_directive_deprecated -->
<div class={isApp ? "detail-bottom-fix" : "fixed bottom-0 left-0 w-full z-20"}>
    <div
        class="max-w-[530px] mx-auto flex gap-2 justify-center bg-white pt-3 pb-3 border-t border-gray-200"
    >
        <a href="TEL:{detail.phone}" class="w-1/4">
            <button class="btn btn-info btn-sm w-full text-white"
                >전화하기</button
            >
        </a>
        <a
            href="SMS:{detail.phone}?body=번개분양 보고 연락 드렸습니다."
            class="w-1/4"
        >
            <button class="btn btn-success btn-sm w-full text-white"
                >문자하기</button
            >
        </a>

        <button
            class="btn btn-warning btn-sm w-1/4 text-white"
            on:click={() => (shareModal = true)}
        >
            공유하기
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
    /* 두 버전의 스타일 통합 */
    .detail-bottom-fix {
        position: fixed;
        bottom: var(--safe-bottom, 0);
        left: 0;
        width: 100%;
        z-index: 20;
    }
    .swiper {
        width: 100%;
        height: 100%;
    }
    .swiper-slide img {
        display: block;
        width: 100%;
        object-fit: cover;
    }
    .slide-menu {
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    }
    .slide-menu.show {
        transform: translateY(0);
    }
</style>
