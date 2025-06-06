<script>
    import { goto } from "$app/navigation";

    let viewDetail = $state({});
</script>

<div class="relative">
    <div
        class="absolute text-white px-3 py-1 flex justify-between items-center w-full"
    >
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="text-3xl w-12 cursor-pointer"
            on:click={() => {
                window.history.back();
            }}
        >
            <i class="fa fa-angle-left" aria-hidden="true"></i>
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="cursor-pointer"
            on:click={() => {
                goto("/");
            }}
        >
            <img src="/logo_white.png" alt="" class=" max-w-[110px]" />
        </div>
        <div class="flex justify-end gap-2 w-12">
            <!-- <span>
                <svg
                    width="24"
                    height="24"
                    fill="#FFFFFF"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    ><path
                        d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                    /></svg
                >
            </span> -->
            <button>
                <svg
                    width="24"
                    height="24"
                    fill="#FFFFFF"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                        d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                    /></svg
                >
            </button>

            <button>
                <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                    ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M15.1622 6.35404C15.1622 5.14326 16.1423 4.16173 17.3514 4.16173C18.5604 4.16173 19.5405 5.14326 19.5405 6.35404C19.5405 7.56482 18.5604 8.54635 17.3514 8.54635C16.1423 8.54635 15.1622 7.56482 15.1622 6.35404ZM17.3514 2.7002C15.3363 2.7002 13.7027 4.33608 13.7027 6.35404C13.7027 6.70313 13.7516 7.04078 13.8429 7.36051L9.41758 9.82065C8.74843 9.0405 7.75616 8.54635 6.64865 8.54635C4.63356 8.54635 3 10.1822 3 12.2002C3 14.2182 4.63356 15.854 6.64865 15.854C7.80468 15.854 8.83514 15.3156 9.50364 14.4756L13.8326 17.0767C13.7479 17.3855 13.7027 17.7106 13.7027 18.0463C13.7027 20.0643 15.3363 21.7002 17.3514 21.7002C19.3664 21.7002 21 20.0643 21 18.0463C21 16.0284 19.3664 14.3925 17.3514 14.3925C16.1953 14.3925 15.1648 14.9309 14.4963 15.771L10.1674 13.17C10.2521 12.8611 10.2973 12.536 10.2973 12.2002C10.2973 11.8158 10.238 11.4453 10.1281 11.0973L14.5183 8.65669C15.1872 9.48112 16.2079 10.0079 17.3514 10.0079C19.3664 10.0079 21 8.372 21 6.35404C21 4.33608 19.3664 2.7002 17.3514 2.7002ZM6.64865 10.0079C5.43959 10.0079 4.45946 10.9894 4.45946 12.2002C4.45946 13.411 5.43959 14.3925 6.64865 14.3925C7.8577 14.3925 8.83784 13.411 8.83784 12.2002C8.83784 10.9894 7.8577 10.0079 6.64865 10.0079ZM17.3514 15.854C16.1423 15.854 15.1622 16.8356 15.1622 18.0463C15.1622 19.2571 16.1423 20.2387 17.3514 20.2387C18.5604 20.2387 19.5405 19.2571 19.5405 18.0463C19.5405 16.8356 18.5604 15.854 17.3514 15.854Z"
                        fill="current"
                    />
                </svg>
            </button>
        </div>
    </div>
</div>

<div>
    <img src="/sample_img1.jpg" alt="" />
</div>

<div class="mt-3 p-3 bg-white rounded-lg">
    <div class="font-bold text-xl text-center">{viewDetail.subject}</div>
    <div class="mt-3">
        <div>
            <span class="font-bold">현장 포인트&nbsp;:&nbsp;</span>
            {viewDetail.point}
        </div>
        <div class="mt-3">
            <span class="font-bold"> 전화번호&nbsp;:&nbsp;</span>
            {viewDetail.phone}
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
            TIP : 분양 가이드를 보고 연락드렸다고 하시면 보다 상담이 쉬워집니다.
        </div>

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
    <div>
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        <span>채용정보</span>
    </div>

    <div class="my-3 font-semibold">기본정보</div>
    <div class="text-sm leading-relaxed">
        <p>대행사 : {viewDetail.agency}</p>
        <p>
            모집 업종 : {viewDetail.business
                ? viewDetail.business.replace(",", " / ")
                : ""}
        </p>
        <p>
            모집 직종 : {viewDetail.occupation
                ? viewDetail.occupation.replace(",", " / ")
                : ""}
        </p>
        <p>경력 : {viewDetail.career}</p>
    </div>

    <div class="my-3 font-semibold">급여 및 영업지원 정보</div>
    <div class="text-sm leading-relaxed">
        <p>일비 : blabla~~~~~~~~~~~~~~</p>
        <p>숙소비 : blabla~~~~~~~~~~~~~~</p>
        <p>기타 : blabla~~~~~~~~~~~~~~</p>
        <p>급여 : blabla~~~~~~~~~~~~~~</p>
    </div>
</div>

<div class="mt-3 p-3 bg-white rounded-lg">
    <div>
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        <span>상세정보</span>
    </div>
    <div class="text-sm leading-relaxed mt-3">
        <p>일비 : blabla~~~~~~~~~~~~~~</p>
        <p>숙소비 : blabla~~~~~~~~~~~~~~</p>
        <p>기타 : blabla~~~~~~~~~~~~~~</p>
        <p>급여 : blabla~~~~~~~~~~~~~~</p>
    </div>
</div>

<div class="mt-3 p-3 bg-white rounded-lg">
    <div>
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        <span>근무지역</span>
    </div>
    <div class="text-sm leading-relaxed mt-3">지도지도</div>
</div>

<div class=" pb-36">gogo</div>
