<script>
    import { goto } from "$app/navigation";
    import { public_img_bucket, img_bucket } from "$lib/const";
    import KakaoMap from "$lib/components/kakaoMap.svelte";
    import DetailMenu from "$lib/components/DetailMenu.svelte";
    import { user_info } from "$lib/stores/stores.js";

    let { data } = $props();

    console.log(public_img_bucket);

    console.log(data);
    console.log(data.favorateBool);

    const detailContent = $derived(data.detail);
    let mainImage = $state([]);
    // svelte-ignore state_referenced_locally
    mainImage = detailContent.imgs.split(",");

    function contactSms() {}

    function contactCall() {}

    let imgSwiper = $state({});

    $effect(() => {
        imgSwiper = new Swiper(".mySwiper", {
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
        });
    });

    //
</script>

<DetailMenu favorateBool={data.favorateBool} />

<div class=" mb-8">
    {#if mainImage.length == 1}
        <div class=" min-h-[300px] max-h-[500px]">
            <img src={`${public_img_bucket}${mainImage[0]}`} alt="" />
        </div>
    {:else}
        <div class="swiper mySwiper">
            <div class="swiper-wrapper">
                {#each mainImage as img, idx}
                    <div class="swiper-slide">
                        <img src={`${public_img_bucket}${img}`} alt="" />
                    </div>
                {/each}
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
    {/if}
</div>

<div class="bg-white rounded-lg">
    <div class="font-bold text-xl text-center">{detailContent.subject}</div>
    <div class="mt-3">
        <div>
            <span class="font-bold">현장 포인트&nbsp;:&nbsp;</span>
            {detailContent.point}
        </div>
        <div class="mt-3">
            <span class="font-bold"> 전화번호&nbsp;:&nbsp;</span>
            {detailContent.phone}
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
        <!-- svelte-ignore event_directive_deprecated -->
        <div class="mt-4">
            <button
                class="btn btn-info btn-sm text-white"
                on:click={contactCall}
            >
                <i class="fa fa-phone" aria-hidden="true"></i>
                전화하기
            </button>
            <button
                class="btn btn-success btn-sm text-white"
                on:click={contactSms}
            >
                <i class="fa fa-envelope-o" aria-hidden="true"></i>
                문자하기
            </button>
        </div>
    </div>
</div>

<div class="mt-3 p-3 bg-white rounded-lg">
    <div class="text-lg">
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        <span>채용정보</span>
    </div>

    <div class="my-3 font-semibold text-lg">기본정보</div>
    <div class="leading-relaxed">
        <p>대행사 : {detailContent.agency}</p>
        <p>담당자 성함 : {detailContent.name}</p>
        <p>
            모집 업종 : {detailContent.business
                ? detailContent.business.replace(",", " / ")
                : ""}
        </p>
        <p>
            모집 직종 : {detailContent.occupation
                ? detailContent.occupation.replace(",", " / ")
                : ""}
        </p>
        <p>경력 : {detailContent.career}</p>
        <p>인원 : {detailContent.number_people}</p>
    </div>

    <div class="my-3 font-semibold text-lg">급여 및 영업지원 정보</div>
    <div class="leading-relaxed">
        <p>수수료 : {detailContent.fee_type} {detailContent.fee}</p>
        <p>
            일비 : {detailContent.daily_expense
                ? detailContent.daily_expense
                : "없음"}
        </p>
        <p>
            숙소비 : {detailContent.sleep_expense
                ? detailContent.sleep_expense
                : "없음"}
        </p>
        <p>
            프로모션 : {detailContent.promotion
                ? detailContent.promotion
                : "없음"}
        </p>
        <p>
            기본급여 : {detailContent.base_pay
                ? detailContent.base_pay
                : "없음"}
        </p>
    </div>
</div>

<div class="mt-3 p-3 bg-white rounded-lg">
    <div class="text-lg">
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        <span>상세정보</span>
    </div>
    <div class="leading-relaxed mt-3">
        {detailContent.detail_content ? detailContent.detail_content : "-"}
    </div>
</div>

<div class="mt-3 p-3 bg-white rounded-lg">
    <div class="text-lg">
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        <span>근무지역</span>
    </div>

    <div>
        {detailContent.res_addr}
    </div>

    <div
        class="mt-2 h-72 border w-full text-sm border-sky-400 rounded-md overflow-hidden"
    >
        <KakaoMap
            getAddress={detailContent.addr}
            phText="근무지"
            height="300px"
        />
    </div>
</div>

<style>
    .swiper {
        width: 100%;
        height: 100%;
    }

    .swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #444;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .swiper-slide img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
