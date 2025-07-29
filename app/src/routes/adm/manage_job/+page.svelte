<script>
    import { goto, invalidateAll } from "$app/navigation";
    import { back_api } from "$lib/const.js";
    import axios from "axios";
    import moment from "moment-timezone";
    import { prev } from "$lib/stores/stores.js";
    import { setParams, getRemainingDaysPlusOne } from "$lib/lib.js";
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let { data } = $props();
    let jobOfferList = $state([]);

    let nowPage = $state(1);
    let pageList = $state([]);

    let searchVal = $state("");
    let searchType = $state("");
    let maxPage = $state(0);

    const productTypeMap = {
        premium: "프리미엄",
        top: "지역탑",
        free: "무료",
    };

    function getProductTypeLabel(key) {
        return productTypeMap[key] || "알 수 없음";
    }

    onMount(() => {
        maxPage = data.maxPage;
    });

    $effect(() => {
        jobOfferList = data.jobOfferList;
        pageList = data.pageList;
    });

    async function chagePage() {
        if (this.value == "prev") {
            if (nowPage - 1 == 0) {
                alert("첫번째 페이지 입니다.");
                return;
            } else {
                nowPage = Number(nowPage) - 1;
            }
        } else if (this.value == "next") {
            if (Number(nowPage) + 1 > maxPage) {
                alert("마지막 페이지 입니다.");
                return;
            } else {
                nowPage = Number(nowPage) + 1;
            }
        } else if (this.value == "first") {
            nowPage = 1;
        } else if (this.value == "last") {
            nowPage = maxPage;
        } else {
            nowPage = Number(this.value);
        }

        setParams({ page: nowPage });
    }

    function searchFunc() {
        setParams({ search: searchVal, type: searchType }, true);
        nowPage = 1;
    }

    async function updateAdDate() {
        console.log(jobOfferList[this.value]);
        const ad_start_date = jobOfferList[this.value]["ad_start_date"];
        const ad_end_date = jobOfferList[this.value]["ad_end_date"];
        const idx = jobOfferList[this.value]["idx"];

        try {
            const res = await axios.post(
                `${back_api}/adm_manage/update_ad_date`,
                {
                    idx,
                    ad_start_date,
                    ad_end_date,
                },
            );

            alert("광고 날짜 업데이트가 완료 되었습니다.");
            invalidateAll();
        } catch (error) {}
    }
</script>

<div class="mb-5">
    <div class="flex items-center gap-2">
        <div class="text-2xl font-bold mr-10">공고관리</div>
        <input
            type="text"
            class="border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:border-blue-500 rounded-md"
            bind:value={searchVal}
        />
        <select
            class="border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:border-blue-500 rounded-md"
            bind:value={searchType}
        >
            <option value="subject">제목(일부)</option>
            <option value="nickname">닉네임</option>
            <option value="phone">휴대폰</option>
        </select>
        <!-- svelte-ignore event_directive_deprecated -->
        <button class="btn btn-soft btn-sm" on:click={searchFunc}>검색</button>
    </div>
</div>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class="overflow-x-auto mt-3 mb-8">
    <table class="table">
        <thead>
            <tr class="text-center">
                <th>제목</th>
                <th>아이디 / 닉네임</th>
                <th>등록일</th>
                <th>광고</th>
                <th>광고 상태</th>
                <th>시작 / 종료</th>
                <th>조회수</th>
                <th>버튼</th>
            </tr>
        </thead>
        <tbody>
            {#each jobOfferList as val, idx}
                <tr class="text-center">
                    <td>
                        <span
                            class="cursor-pointer"
                            on:click={() => {
                                $prev = `${$page.url.pathname}${$page.url.search}`;
                                goto(`/detail/${val.idx}`);
                            }}
                        >
                            {val.subject}
                        </span>
                    </td>
                    <td>
                        {#if !val.user_id && !val.user_nickname}
                            탈퇴
                        {:else if !val.user_id}
                            카카오 / {val.user_nickname}
                        {:else}
                            {val.user_id} / {val.user_nickname}
                        {/if}
                    </td>
                    <td>
                        {moment.utc(val.created_at).format("YY/MM/DD HH:mm")}
                    </td>

                    <td>
                        {getProductTypeLabel(val.product)}
                    </td>

                    <td>
                        {#if val.ad_end_date}
                            {getRemainingDaysPlusOne(val.ad_end_date) == 0
                                ? "종료"
                                : `${getRemainingDaysPlusOne(val.ad_end_date)}일 남음`}
                        {:else}
                            -
                        {/if}
                    </td>
                    <td>
                        {#if jobOfferList[idx]["ad_start_date"] && jobOfferList[idx]["ad_end_date"]}
                            <div class="flex justify-center items-center gap-1">
                                <input
                                    type="date"
                                    class="border border-gray-400 py-1 px-2 rounded-md"
                                    bind:value={
                                        jobOfferList[idx]["ad_start_date"]
                                    }
                                />
                                <span>~</span>
                                <input
                                    type="date"
                                    class="border border-gray-400 py-1 px-2 rounded-md"
                                    bind:value={
                                        jobOfferList[idx]["ad_end_date"]
                                    }
                                />
                                <button
                                    class="btn btn-info btn-sm text-white"
                                    value={idx}
                                    on:click={updateAdDate}
                                >
                                    적용
                                </button>
                            </div>
                        {:else}
                            -
                        {/if}
                    </td>

                    <td>{val.view_count}</td>
                    <td>
                        <a
                            href="/joboffer?modifyidx={val.idx}&manage=on"
                            on:click|preventDefault={() => {
                                $prev = `${$page.url.pathname}${$page.url.search}`;
                                goto(
                                    `/joboffer?modifyidx=${val.idx}&manage=on`,
                                );
                            }}
                        >
                            <button class="btn btn-accent btn-sm text-white">
                                수정
                            </button>
                        </a>

                        <button
                            class="btn btn-error btn-sm text-white"
                            value={val.idx}
                            on:click={async (e) => {
                                if (
                                    !confirm(
                                        "삭제된 공고는 복구가 불가능합니다. 진행 하시겠습니까?",
                                    )
                                ) {
                                    return;
                                }
                                try {
                                    const res = await axios.post(
                                        `${back_api}/adm_manage/delete_job`,
                                        {
                                            idx: e.target.value,
                                            delImgs: jobOfferList[idx]["imgs"],
                                            delThumbnail:
                                                jobOfferList[idx]["thumbnail"],
                                        },
                                    );

                                    invalidateAll();
                                } catch (error) {}
                            }}
                        >
                            삭제
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <!-- svelte-ignore a11y_consider_explicit_label -->
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="my-5 text-center">
        <div class="join">
            <button class="join-item btn" value="first" on:click={chagePage}>
                <i class="fa fa-angle-double-left" aria-hidden="true"></i>
            </button>
            <button class="join-item btn" value="prev" on:click={chagePage}>
                <i class="fa fa-angle-left" aria-hidden="true"></i>
            </button>

            {#each pageList as page, idx}
                {#if page == nowPage}
                    <button
                        class="join-item btn btn-active"
                        value={page}
                        on:click={chagePage}
                    >
                        {page}
                    </button>
                {:else}
                    <button
                        class="join-item btn"
                        value={page}
                        on:click={chagePage}
                    >
                        {page}
                    </button>
                {/if}
            {/each}
            <button class="join-item btn" value="next" on:click={chagePage}>
                <i class="fa fa-angle-right" aria-hidden="true"></i>
            </button>
            <button class="join-item btn" value="last" on:click={chagePage}>
                <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            </button>
        </div>
    </div>
</div>
