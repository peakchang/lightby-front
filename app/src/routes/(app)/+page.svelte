<script>
    import { untrack } from "svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { back_api, public_img_bucket } from "$lib/const.js";
    import PdButton from "$lib/components/PdButton.svelte";
    import {
        main_location,
        loadingStore,
        // site_load_status,
        // free_start_num,
        main_list,
    } from "$lib/stores/stores.js";
    import { browser } from "$app/environment";
    import { navigating } from "$app/stores";
    import { onDestroy, onMount } from "svelte";
    import JobPostItem from "$lib/components/JobPostItem.svelte";
    import { prev } from "$lib/stores/stores.js";
    import SeoMeta from "$lib/components/SeoMeta.svelte";

    const seoVal = {
        title: "번개분양 - 분양현장 구인/구직",
        description:
            "가장 빠른 분양 구인·구직! 지금 바로 번개분양에서 확인하세요",
        icon: "/favicon.png",
        url: "https://lightby.co.kr",
        image: "/alt_image.jpg",
        date: "2025-04-27",
    };

    let { data } = $props();
    let searchModal = $state(false);
    let locationList = $derived([
        "전국",
        "서울·경기·인천",
        "충청·전라",
        "강원·경상·제주",
    ]);

    const businessReplaceDict = $derived({
        도시형생활주택: "도생",
        지식산업센터: "지산",
        "상가/쇼핑몰": "상가",
    });

    const bannerList = $state(
        data.baseEnv.banners ? data.baseEnv.banners.split(",") : [],
    );

    const bannerLinkList = $state(
        data.baseEnv.banner_links ? data.baseEnv.banner_links.split(",") : [],
    );

    let bannerInterval;
    let nowBannerIdx = $state(0);

    onMount(() => {
        if (bannerList.length > 0) {
            bannerInterval = setInterval(() => {
                nowBannerIdx++;
                if (nowBannerIdx >= bannerList.length) {
                    nowBannerIdx = 0;
                }
            }, 2500); // 예: 3초마다 변경
        }
    });

    onDestroy(() => {
        clearInterval(bannerInterval);
    });

    $effect(() => {
        if (scrollElement) {
            checkInitialPosition();
        }
        // 추후 스크롤 내리면서 로딩 시 적용 시키기!!!
        // if (data.currentStatus == "premium") {
        //     $main_list["premium"] = data.mainList;
        // } else if (data.currentStatus == "top") {
        //     $main_list["top"] = data.mainList;
        // } else if (data.currentStatus == "free") {
        //     const currentFreeList = untrack(() => $main_list["free"] || []);

        //     // id 기준으로 중복 체크 (실제 고유 필드명으로 변경하세요)
        //     const newUniqueItems = data.mainList.filter(
        //         (newItem) =>
        //             !currentFreeList.some(
        //                 (existing) => existing.idx === newItem.idx,
        //             ),
        //     );

        //     // 새로운 아이템이 있을 때만 업데이트
        //     if (newUniqueItems.length > 0) {
        //         $main_list["free"] = [...currentFreeList, ...newUniqueItems];
        //     }
        // }

        if ($loadingStore == true) {
            setTimeout(() => {
                $loadingStore = false;
            }, 500);
        }
    });

    function multiReplace(str, map) {
        const regex = new RegExp(Object.keys(map).join("|"), "g");
        return str.replace(regex, (match) => map[match]);
    }

    let searchFocus = $state(false);

    // -------------------------------------- 스크롤

    let locationListSample = $derived([
        "전국",
        "서울",
        "경기남부",
        "경기북부",
        "인천",
        "부산",
        "울산",
        "대구",
        "경상도",
        "대전",
        "세종",
        "충청도",
        "광주",
        "전라도",
        "강원도",
        "제주도",
    ]);

    let scrollBool = $state(false);
    let startX = $state(0);
    let scrollLeft = $state(0);
    let scrollElement;

    // 드래그 스크롤 처리 함수
    function handleDragScroll(clientX) {
        if (scrollBool && scrollElement) {
            const walk = (clientX - startX) * 2; // 스크롤 속도 조절 (2배)
            scrollElement.scrollLeft = scrollLeft - walk;
        }
    }

    // 초기 위치 체크 함수
    function checkInitialPosition() {
        if (!scrollElement) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollElement;

        const isAtLeft = scrollLeft <= 1;
        const isAtRight = scrollLeft + clientWidth >= scrollWidth - 1;

        if (isAtLeft && isAtRight) {
            console.log(
                "페이지 시작: 스크롤 불가능 (콘텐츠가 화면에 모두 들어감)",
            );
        } else if (isAtLeft) {
            console.log("페이지 시작: 왼쪽 끝");
        } else if (isAtRight) {
            console.log("페이지 시작: 오른쪽 끝");
        } else {
            console.log("페이지 시작: 중간 위치");
        }
    }

    // 스크롤 끝 감지 함수
    function checkScrollEnd() {
        if (!scrollElement) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollElement;

        const isAtLeft = scrollLeft <= 1;
        const isAtRight = scrollLeft + clientWidth >= scrollWidth - 1;

        // 왼쪽 끝 도달 (scrollLeft가 0에 가까움)
        if (isAtLeft) {
            console.log("왼쪽 끝!");
        }
        // 오른쪽 끝 도달 (scrollLeft + clientWidth >= scrollWidth)
        else if (isAtRight) {
            console.log("오른쪽 끝!");
        }
        // 중간 위치
        else {
            console.log("중간 위치!");
        }
    }

    // 화살표 클릭으로 스크롤 이동
    function scrollToDirection(direction, distance = 100) {
        if (!scrollElement) return;

        const currentScrollLeft = scrollElement.scrollLeft;
        let targetScrollLeft;

        if (direction === "left") {
            targetScrollLeft = Math.max(0, currentScrollLeft - distance);
        } else if (direction === "right") {
            const maxScrollLeft =
                scrollElement.scrollWidth - scrollElement.clientWidth;
            targetScrollLeft = Math.min(
                maxScrollLeft,
                currentScrollLeft + distance,
            );
        }

        // 부드러운 스크롤
        scrollElement.scrollTo({
            left: targetScrollLeft,
            behavior: "smooth",
        });
    }
</script>

<svelte:head>
    <SeoMeta seoValue={seoVal}></SeoMeta>
</svelte:head>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class=" pt-16 paperlogy px-3">
    <!-- <button
        on:click={() => {
            invalidateAll();
        }}
    >
        gogogo
    </button> -->

    <div class="mb-2 text-center">
        <label
            class="flex items-center border w-[95%] px-3 rounded-full bg-gray-100 mx-auto"
            class:bg-white={searchFocus}
        >
            <input
                type="text"
                class="w-[95%] py-2 text-sm outline-none"
                on:focusin={() => {
                    searchFocus = true;
                }}
                on:focusout={() => {
                    searchFocus = false;
                }}
            />
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="cursor-pointer text-xl">
                <svg
                    width="30px"
                    height="30px"
                    viewBox="0 -0.5 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.30524 15.7137C6.4404 14.8306 5.85381 13.7131 5.61824 12.4997C5.38072 11.2829 5.50269 10.0233 5.96924 8.87469C6.43181 7.73253 7.22153 6.75251 8.23924 6.05769C10.3041 4.64744 13.0224 4.64744 15.0872 6.05769C16.105 6.75251 16.8947 7.73253 17.3572 8.87469C17.8238 10.0233 17.9458 11.2829 17.7082 12.4997C17.4727 13.7131 16.8861 14.8306 16.0212 15.7137C14.8759 16.889 13.3044 17.5519 11.6632 17.5519C10.0221 17.5519 8.45059 16.889 7.30524 15.7137V15.7137Z"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M11.6702 7.20292C11.2583 7.24656 10.9598 7.61586 11.0034 8.02777C11.0471 8.43968 11.4164 8.73821 11.8283 8.69457L11.6702 7.20292ZM13.5216 9.69213C13.6831 10.0736 14.1232 10.2519 14.5047 10.0904C14.8861 9.92892 15.0644 9.4888 14.9029 9.10736L13.5216 9.69213ZM16.6421 15.0869C16.349 14.7943 15.8741 14.7947 15.5815 15.0879C15.2888 15.381 15.2893 15.8559 15.5824 16.1485L16.6421 15.0869ZM18.9704 19.5305C19.2636 19.8232 19.7384 19.8228 20.0311 19.5296C20.3237 19.2364 20.3233 18.7616 20.0301 18.4689L18.9704 19.5305ZM11.8283 8.69457C12.5508 8.61801 13.2384 9.02306 13.5216 9.69213L14.9029 9.10736C14.3622 7.83005 13.0496 7.05676 11.6702 7.20292L11.8283 8.69457ZM15.5824 16.1485L18.9704 19.5305L20.0301 18.4689L16.6421 15.0869L15.5824 16.1485Z"
                        fill="#000000"
                    />
                </svg>
            </button>
        </label>
    </div>

    {#if bannerList.length > 0}
        <div class=" border border-gray-300 rounded-lg p-2">
            <a href={bannerLinkList[nowBannerIdx]} target="_blank">
                <img
                    src={`${public_img_bucket}${bannerList[nowBannerIdx]}`}
                    alt=""
                />
            </a>
        </div>
    {/if}

    <div class="wrap max-w-[640px] border-y relative">
        <div
            bind:this={scrollElement}
            class="scroll__wrap"
            on:scroll={() => {
                checkScrollEnd();
            }}
            on:mousedown={(e) => {
                scrollBool = true;
                startX = e.clientX;
                scrollLeft = scrollElement.scrollLeft;
                e.preventDefault(); // 텍스트 선택 방지
            }}
            on:mouseup={() => {
                scrollBool = false;
            }}
            on:mouseleave={() => {
                scrollBool = false; // 마우스가 요소를 벗어나면 드래그 종료
            }}
            on:touchstart={(e) => {
                scrollBool = true;
                startX = e.touches[0].clientX;
                scrollLeft = scrollElement.scrollLeft;
            }}
            on:touchend={() => {
                scrollBool = false;
            }}
            on:click={(e) => {
                // 드래그 후에는 클릭 이벤트 방지
                if (Math.abs(e.clientX - startX) > 5) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
            on:mousemove={(e) => {
                e.preventDefault();
                handleDragScroll(e.clientX);
            }}
            on:touchmove={(e) => {
                e.preventDefault();
                handleDragScroll(e.touches[0].clientX);
            }}
        >
            {#each locationListSample as location}
                <div
                    class="inline-block w-[80px] text-center"
                    on:click={() => {
                        console.log(`Clicked on ${location}`);
                    }}
                >
                    {location}
                </div>
            {/each}
        </div>

        <div class="absolute left-0 top-0 h-full z-50 bg-white">
            <div class="flex items-center h-full justify-center">
                <div
                    class="px-3 py-5"
                    on:click={() => {
                        console.log("Clicked left arrow");
                        scrollToDirection("left", 100);
                    }}
                >
                    <i class="fa fa-caret-left" aria-hidden="true"></i>
                </div>
            </div>
        </div>

        <div class="absolute right-0 top-0 h-full z-50 bg-white">
            <div class="flex items-center h-full justify-center">
                <div
                    class="px-3 py-5"
                    on:click={() => {
                        console.log("Clicked right arrow");
                        scrollToDirection("right", 100);
                    }}
                >
                    <i class="fa fa-caret-right" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- <div class="">
        <div class="my-5 py-2 border-y border-gray-300">
            <ul class="flex gap-5 overflow-hidden w-[1100px]">
                {#each locationListSample as location}
                    <li
                        class=""
                        on:click={() => {
                            console.log(`Clicked on ${location}`);
                        }}
                    >
                        {location}
                    </li>
                {/each}
            </ul>
        </div>
    </div> -->

    <div class="my-5">
        <div class="flex justify-around text-sm md:text-base">
            {#each locationList as location}
                <span
                    class="text-center cursor-pointer"
                    data-location={location}
                    class:font-bold={$main_location == location}
                    class:font-light={$main_location != location}
                    class:text-blue-500={$main_location == location}
                    on:click={(e) => {
                        $main_location = e.target.dataset.location;
                        localStorage.setItem("location", $main_location);
                        invalidateAll();
                        $loadingStore = true;
                    }}
                >
                    {location}
                </span>
            {/each}
        </div>

        <ul class="grid grid-cols-4 gap-x-2 gap-y-1">
            <!-- {#each locationList as location}

                <li
                    class="text-center text-xs py-1.5 px-2 rounded-full border border-gray-500 text-gray-500 cursor-pointer"
                    class:bg-[#0669f8]={$main_location == location}
                    class:text-white={$main_location == location}
                    class:border-white={$main_location == location}
                    data-location={location}
                    on:click={(e) => {
                        // $main_list.premium = [];
                        // $main_list.top = [];
                        // $main_list.free = [];
                        // $site_load_status = "premium";
                        // $free_start_num = 0;

                        $main_location = e.target.dataset.location;
                        $main_location = $main_location;

                        localStorage.setItem("location", $main_location);
                        invalidateAll();
                        $loadingStore = true;
                    }}
                >
                    {location}
                </li>
            {/each} -->
        </ul>
    </div>

    {#if $main_list["premium"].length > 0}
        <div class="premium-area mb-10">
            <!-- 프리미엄 영역 -->
            <div
                class="mb-3 ml-6 text-lg font-bold text-cyan-700 flex items-center"
            >
                <span class="mr-2">
                    <i class="fa fa-bell" aria-hidden="true"></i>
                </span>
                <span class="mr-4">프리미엄</span>
                <div
                    class=" w-[50%] md:w-[40%] rounded-full"
                    style="height: 2px; background-color: #007595;"
                ></div>
            </div>
            {#each $main_list["premium"] as value}
                <JobPostItem {value}></JobPostItem>
            {/each}
        </div>
    {/if}

    {#if $main_list["top"].length > 0}
        <div class="top-area mb-10">
            <!-- 지역탑 영역 -->
            <div
                class="mb-3 ml-6 text-lg font-bold text-cyan-700 flex items-center"
            >
                <span class="mr-2">
                    <i class="fa fa-bell" aria-hidden="true"></i>
                </span>
                <span class="mr-4">지역 TOP</span>
                <div
                    class=" w-[50%] md:w-[40%] rounded-full"
                    style="height: 2px; background-color: #007595;"
                ></div>
            </div>
            {#each $main_list["top"] as value}
                <JobPostItem {value}></JobPostItem>
            {/each}
        </div>
    {/if}

    {#if $main_list["free"].length > 0}
        <div>
            <!-- 일반 공고 영역 -->
            <div
                class="mb-3 ml-6 text-lg font-bold text-cyan-700 flex items-center"
            >
                <span class="mr-2">
                    <i class="fa fa-bell" aria-hidden="true"></i>
                </span>
                <span class="mr-4">일반 공고</span>
                <div
                    class=" w-[50%] md:w-[40%] rounded-full"
                    style="height: 2px; background-color: #007595;"
                ></div>
            </div>

            {#each $main_list["free"] as value}
                <JobPostItem {value}></JobPostItem>
            {/each}
        </div>
    {/if}
</div>

<style>
    .scroll__wrap {
        display: flex;
        gap: 20px;
        overflow-x: auto;
        white-space: nowrap;
        padding: 10px 30px;
        position: relative;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
</style>
