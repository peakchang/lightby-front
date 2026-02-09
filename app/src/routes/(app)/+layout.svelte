<script>
    import PdButton from "$lib/components/PdButton.svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { goto, invalidateAll } from "$app/navigation";

    import { page } from "$app/stores";
    import {
        user_info,
        main_location,
        search_val,
        loadingStore,
        viewLimitAlertModal,
    } from "$lib/stores/stores";

    import { fetchRequest } from "$lib/lib";

    let { children, data } = $props();

    let successModal = $state(false);
    let successMessage = $state("");

    let loginAlertModalShow = $state(false);

    let searchModal = $state(false);
    let searchArea = $derived({});

    function movePage(e) {
        const link = this.dataset.link;
        if ($page.url.pathname != link) {
            goto(link);
        }
    }

    async function logout() {
        // 지역 설정 되어 있으면 풀기
        $main_location = "전국";
        sessionStorage.removeItem("location");

        const res = await fetchRequest("POST", "/auth/logout", {
            idx: $user_info.idx,
        });
        if (res.status) {
            successMessage = "로그아웃 되었습니다.";
            successModal = true;
            setTimeout(() => {
                successModal = false;
            }, 800);
            $user_info = { idx: undefined, rate: 0 };
        }
    }

    function searchFunc() {
        sessionStorage.setItem("search_val", $search_val);
        invalidateAll();
        searchModal = false;
        $loadingStore = true;
    }

    function goToMain() {
        console.log("?@????@?@?@??@?@?");

        $main_location = "전국";
        sessionStorage.removeItem("location");
        sessionStorage.removeItem("search_val");
        goto("/", { invalidateAll: true });
    }

    $effect(() => {});
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<svelte:head>
    <script
        type="text/javascript"
        defer
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS}&libraries=services&autoload=false`}
    ></script>

    <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>

    <!-- 메타 스크립트 -->
    <script>
        !(function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod
                    ? n.callMethod.apply(n, arguments)
                    : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = "2.0";
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(
            window,
            document,
            "script",
            "https://connect.facebook.net/en_US/fbevents.js",
        );
        fbq("init", "1291886845819358");
        fbq("track", "PageView");
    </script>

    <noscript
        ><img
            height="1"
            width="1"
            style="display:none"
            src="https://www.facebook.com/tr?id=1291886845819358&ev=PageView&noscript=1"
        />
    </noscript>
</svelte:head>

<CustomModal bind:visible={loginAlertModalShow} closeBtn={false}>
    <div
        class="max-w-sm mx-auto p-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 text-center suit-font"
    >
        <div
            class="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-50 text-blue-500 rounded-full"
        >
            <i class="fa fa-lock text-3xl" aria-hidden="true"></i>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mb-2">
            로그인이 필요합니다
        </h2>
        <p class="text-gray-400 text-sm mb-8 leading-relaxed">
            요청하신 페이지는 회원 전용입니다.<br />
            로그인 후 더 많은 서비스를 이용해 보세요!
        </p>

        <div class="flex flex-col gap-3">
            <button
                class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-bold rounded-2xl shadow-lg shadow-blue-100"
                on:click={() => goto("/auth/login")}
            >
                로그인 바로가기
            </button>

            <button
                class="w-full py-3 text-gray-400 hover:text-gray-600 font-medium rounded-2xl transition-colors text-sm"
                on:click={() => {
                    /* 닫기 로직 */
                }}
            >
                나중에 하기
            </button>
        </div>
    </div>
</CustomModal>

<CustomModal bind:visible={successModal} closeBtn={false}>
    <div class="text-center">
        <div class=" text-green-700 text-3xl mb-2">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div>{successMessage}</div>
    </div>
</CustomModal>

<CustomModal
    bind:visible={searchModal}
    positionTop={true}
    closeOnBackground={false}
    focusInput={true}
>
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="pt-5">
        <form on:submit|preventDefault={searchFunc}>
            <div class="flex gap-2 items-center">
                <input
                    type="text"
                    class="border w-full py-2 px-3 border-gray-400 focus:outline-none focus:border-blue-500 text-sm rounded-md"
                    bind:value={$search_val}
                    bind:this={searchArea}
                />
                <button class="btn btn-active btn-accent text-white">
                    검색
                </button>
                <button
                    type="button"
                    class="btn btn-warning text-white"
                    on:click={() => {
                        sessionStorage.removeItem("search_val");
                        invalidateAll();
                        searchModal = false;
                        $loadingStore = true;
                    }}
                >
                    초기화
                </button>
            </div>
        </form>
    </div>
</CustomModal>

<header
    class="fixed top-0 left-1/2 -translate-x-1/2 max-w-[640px] w-full z-40 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-b-2xl suit-font transition-all"
    style="box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);"
>
    <div class="flex justify-between items-center">
        <div class="flex items-center">
            <a
                href="/"
                on:click|preventDefault={goToMain}
                class="active:scale-95 transition-transform"
            >
                <img
                    src="/logo.png"
                    alt="번개분양"
                    class="max-w-[100px] md:max-w-[120px] h-auto object-contain"
                />
            </a>
        </div>

        <div class="flex items-center gap-2">
            {#if $user_info.idx}
                <button
                    class="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-200 active:scale-95 transition-all border-none"
                    on:click={logout}
                >
                    <i class="fa fa-sign-out text-sm"></i>
                    <span>로그아웃</span>
                </button>
            {:else}
                <a href="/auth/login" class="no-underline">
                    <button
                        class="flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-sky-500 text-white text-xs font-extrabold shadow-md shadow-sky-100 hover:bg-sky-600 active:scale-95 transition-all border-none"
                    >
                        <i class="fa fa-user-circle text-sm"></i>
                        <span>로그인</span>
                    </button>
                </a>
            {/if}
        </div>
    </div>
</header>

<div class="suit-font">
    {@render children()}

    <div class="border-t border-gray-400 mt-8 pb-4"></div>

    <div class="pb-28 px-10">
        <div class="text-sm mb-3">
            <a href="/terms">
                <span>개인정보처리방침</span>
            </a>
            <span>|</span>
            <a href="/terms/service"><span>이용약관</span></a>
        </div>
        <!-- <div class="text-xs leading-loose">
            <p>상호: 위드브릿지</p>
            <p>대표자: 박창용</p>
            <p>사업자번호 : 509-63-00569</p>
            <p>주소 : 경기도화성시효행로1068,6층604-G36호</p>
            <p>개인정보처리관리자 : 김가연</p>
        </div> -->

        <div class="text-xs leading-loose">
            <p>상호: 애드피크</p>
            <p>대표자: 박창현</p>
            <p>사업자번호 : 240-06-01900</p>
            <p>주소 : 경기도 부천시 소사구 경인로 37</p>
            <p>대표번호 : 1644-9714</p>
            <p>개인정보처리관리자 : 김가연</p>
        </div>
    </div>
</div>

<div class="fixed left-0 bottom-0 w-full suit-font z-40">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore event_directive_deprecated -->
    <ul
        class="max-w-[630px] mx-auto flex justify-between w-full gap-3 px-5 z-50 bg-white py-3 relative"
    >
        <div class="absolute right-3 top-[-45px]">
            {#if ["/", "/interest", "/my"].includes($page.url.pathname)}
                <!-- svelte-ignore event_directive_deprecated -->
                <a
                    href="/joboffer"
                    on:click|preventDefault={() => {
                        if (!$user_info.idx) {
                            loginAlertModalShow = true;
                            return;
                        }
                        goto(`/joboffer?prev=${$page.url.pathname}`);
                    }}
                >
                    <button
                        class="flex items-center justify-center gap-2 px-5 py-2.5
           bg-gradient-to-r from-[#5587ED] to-[#4876D6]
           hover:from-[#6799FF] hover:to-[#5587ED]
           active:scale-[0.96] transition-all duration-200
           text-white font-bold rounded-full shadow-md group suit-font"
                    >
                        <i
                            class="fa fa-plus-circle text-lg transition-transform group-hover:scale-110"
                            aria-hidden="true"
                        ></i>

                        <span class="text-[15px] tracking-tight">구인등록</span>
                    </button>
                </a>
            {:else if ["/showfee"].includes($page.url.pathname)}
                <!-- svelte-ignore event_directive_deprecated -->
                <a
                    href="/simplewrite"
                    on:click|preventDefault={() => {
                        if (!$user_info.idx) {
                            loginAlertModalShow = true;
                            return;
                        }

                        goto("/simplewrite");
                    }}
                >
                    <button
                        class="flex items-center justify-center gap-2 px-5 py-2.5
           bg-gradient-to-r from-[#5587ED] to-[#4876D6]
           hover:from-[#6799FF] hover:to-[#5587ED]
           active:scale-[0.96] transition-all duration-200
           text-white font-bold rounded-full shadow-md group suit-font"
                    >
                        <i
                            class="fa fa-plus-circle text-lg transition-transform group-hover:scale-110"
                            aria-hidden="true"
                        ></i>

                        <span class="text-[15px] tracking-tight"
                            >게시글 등록</span
                        >
                    </button>
                </a>
            {/if}
        </div>

        <li
            class="w-1/4 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            style={$page.url.pathname == "/"
                ? "color:#61a2ff"
                : "color:#868686"}
            data-link="/"
            on:click={movePage}
        >
            <div class="w-5 h-5 md:w-6 md:h-6 flex justify-center items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    class="w-full"
                    style={$page.url.pathname == "/"
                        ? "fill: rgb(97,162,255);"
                        : "fill: rgb(134,134,134);"}
                    ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                        d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                    />
                </svg>
            </div>
            <span class="text-[10px] text-xs">홈</span>
        </li>

        <li
            class="w-1/4 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            style={$page.url.pathname == "/showfee"
                ? "color:#61a2ff"
                : "color:#868686"}
            data-link="/showfee"
            on:click={movePage}
        >
            <div
                class="w-5 h-5 md:w-6 md:h-6 flex justify-center items-center ml-1"
            >
                <!-- <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    class="w-full"
                    preserveAspectRatio="xMidYMid meet"
                    style={$page.url.pathname == "/showfee"
                        ? "fill: rgb(97,162,255);"
                        : "fill: rgb(134,134,134);"}
                    ><path
                        d="M62.4 53.9C56.8 37.1 38.6 28.1 21.9 33.6S-3.9 57.4 1.6 74.1L51.6 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l40.9 0 56.7 170.1c4.5 13.5 17.4 22.4 31.6 21.9s26.4-10.4 29.8-24.2L233 288l46 0L321 455.8c3.4 13.8 15.6 23.7 29.8 24.2s27.1-8.4 31.6-21.9L439.1 288l40.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-19.6 0 50-149.9c5.6-16.8-3.5-34.9-20.2-40.5s-34.9 3.5-40.5 20.2L392.9 224l-64 0L287 56.2C283.5 42 270.7 32 256 32s-27.5 10-31 24.2L183 224l-64 0L62.4 53.9zm78 234.1l26.6 0-11.4 45.6L140.4 288zM249 224l7-28.1 7 28.1-14 0zm96 64l26.6 0-15.2 45.6L345 288z"
                    />
                </svg> -->

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-full"
                    viewBox="0 0 640 640"
                    style={$page.url.pathname == "/showfee"
                        ? "fill: rgb(97,162,255);"
                        : "fill: rgb(134,134,134);"}
                    ><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
                        d="M416 208C416 305.2 330 384 224 384C197.3 384 171.9 379 148.8 370L67.2 413.2C57.9 418.1 46.5 416.4 39 409C31.5 401.6 29.8 390.1 34.8 380.8L70.4 313.6C46.3 284.2 32 247.6 32 208C32 110.8 118 32 224 32C330 32 416 110.8 416 208zM416 576C321.9 576 243.6 513.9 227.2 432C347.2 430.5 451.5 345.1 463 229.3C546.3 248.5 608 317.6 608 400C608 439.6 593.7 476.2 569.6 505.6L605.2 572.8C610.1 582.1 608.4 593.5 601 601C593.6 608.5 582.1 610.2 572.8 605.2L491.2 562C468.1 571 442.7 576 416 576z"
                    /></svg
                >
            </div>

            <span class="text-[10px] text-xs">현장소통</span>
        </li>

        <li
            class="w-1/4 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            style={$page.url.pathname == "/find"
                ? "color:#61a2ff"
                : "color:#868686"}
            data-link="/find"
            on:click={movePage}
        >
            <div class="w-5 h-5 md:w-6 md:h-6 flex justify-center items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    class="w-full"
                    style={$page.url.pathname == "/find"
                        ? "fill: rgb(97,162,255);"
                        : "fill: rgb(134,134,134);"}
                    ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                        d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"
                    />
                </svg>
            </div>
            <span class="text-[10px] text-xs">인재찾기</span>
        </li>

        <li
            class="w-1/4 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            style={$page.url.pathname == "/interest"
                ? "color:#61a2ff"
                : "color:#868686"}
            data-link="/interest"
            on:click={movePage}
        >
            <div class="w-4 h-4 md:w-5 md:h-5 flex justify-center items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="w-5"
                    style={$page.url.pathname == "/interest"
                        ? "fill: rgb(97,162,255);"
                        : "fill: rgb(134,134,134);"}
                    ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                        d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                    />
                </svg>
            </div>

            <span class="text-[10px] text-xs">관심현장</span>
        </li>

        <li
            class="w-1/4 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            style={$page.url.pathname == "/my"
                ? "color:#61a2ff"
                : "color:#868686"}
            data-link="/my"
            on:click={movePage}
        >
            <div class="w-5 h-5 md:w-6 md:h-6 flex justify-center items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="w-6"
                    style={$page.url.pathname == "/my"
                        ? "fill: rgb(97,162,255);"
                        : "fill: rgb(134,134,134);"}
                    ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                        d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"
                    />
                </svg>
            </div>

            <span class="text-[10px] text-xs">마이</span>
        </li>
    </ul>

    <div></div>
</div>
