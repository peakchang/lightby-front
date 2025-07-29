<script>
    import moment from "moment-timezone";
    import { setParams } from "$lib/lib.js";
    import { onMount } from "svelte";
    import { formatPhoneNum } from "$lib/lib.js";
    let { data } = $props();

    let userList = $state([]);
    let managerList = $state([]);

    let searchVal = $state("");
    let searchType = $state("");
    let nowPage = $state(1);
    let pageTopCount = $state(0);
    let pageList = $state([]);
    let maxPage = $state(0);

    onMount(() => {
        maxPage = data.maxPage;
    });

    $effect(() => {
        pageTopCount = data.allCount - (nowPage - 1) * 15;
        managerList = data.userList.filter((v) => v.rate == 5);
        userList = data.userList.filter((v) => v.rate < 5);
        pageList = data.pageList;
    });

    function searchFunc() {
        setParams({ search: searchVal, type: searchType }, true);
        nowPage = 1;
    }

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
</script>

<div class="mb-5">
    <div class="flex items-center gap-2">
        <input
            type="text"
            class="border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:border-blue-500 rounded-md"
            bind:value={searchVal}
        />
        <select
            class="border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:border-blue-500 rounded-md"
            bind:value={searchType}
        >
            <option value="name">이름</option>
            <option value="phone">휴대폰</option>
        </select>
        <!-- svelte-ignore event_directive_deprecated -->
        <button class="btn btn-soft btn-sm" on:click={searchFunc}>검색</button>
    </div>
</div>

<div class="overflow-x-auto">
    <table class="table">
        <thead>
            <tr class="text-center">
                <th class="tb"></th>
                <th class="tb">아이디</th>
                <th class="tb">비번변경</th>
                <th class="tb">SNS</th>
                <th class="tb">휴대폰번호</th>
                <th class="tb">이름</th>
                <th class="tb">닉네임</th>
                <th class="tb">등급</th>
                <th class="tb">프로필</th>
                <th class="tb">가입일자</th>
                <th class="tb">마지막접속</th>
            </tr>
        </thead>

        <tfoot>
            {#each managerList as manager}
                <tr class="text-center text-black">
                    <td class="tb">관리자</td>
                    <td class="tb">{manager.id}</td>
                    <td class="tb">
                        <div class="flex gap-1">
                            <input type="text" class="tb rounded-md w-full" />
                            <button class="btn btn-sm">변경</button>
                        </div>
                    </td>
                    <td class="tb">{manager.sns_id ? "KAKAO" : ""}</td>
                    <td class="tb"> {formatPhoneNum(manager.phone)}</td>
                    <td class="tb">{manager.name}</td>
                    <td class="tb">{manager.nickname}</td>
                    <td class="tb">일반</td>
                    <td class="tb">
                        <button class="btn btn-sm">보기</button>
                    </td>

                    <td class="tb">
                        {moment(manager.created_at).format("YY/MM/DD")}
                    </td>
                    <td class="tb"
                        >{moment(manager.connected_at).format(
                            "YY/MM/DD HH:mm:ss",
                        )}</td
                    >
                </tr>
            {/each}
        </tfoot>
        <tbody>
            {#each userList as user, idx}
                <tr class="text-center">
                    <th class="tb">{pageTopCount - idx}</th>
                    <td class="tb">{user.id}</td>
                    <td class="tb">
                        <div class="flex gap-1">
                            <input type="text" class="tb rounded-md w-full" />
                            <button class="btn btn-sm">변경</button>
                        </div>
                    </td>
                    <td class="tb">{user.sns_id ? "KAKAO" : ""}</td>
                    <td class="tb">{formatPhoneNum(user.phone)}</td>
                    <td class="tb">{user.name}</td>
                    <td class="tb">{user.nickname}</td>
                    <td class="tb">일반</td>
                    <td class="tb">
                        <button class="btn btn-sm">보기</button>
                    </td>

                    <td class="tb">
                        {moment(user.created_at).format("YY/MM/DD")}
                    </td>
                    <td class="tb"
                        >{moment(user.connected_at).format(
                            "YY/MM/DD HH:mm:ss",
                        )}</td
                    >
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

<style>
    tfoot {
        display: table-header-group; /* 테이블의 머리처럼 취급 */
    }
</style>
