<script>
    import moment from "moment-timezone";
    let { data } = $props();

    let userList = $state([]);
    let managerList = $state([]);

    const tempData = data.userList.filter((v) => Number(v.rate) < 5);
    console.log(tempData);

    $effect(() => {
        managerList = data.userList.filter((v) => v.rate == 5);
        userList = data.userList.filter((v) => v.rate < 5);
    });
</script>

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
                    <td class="tb"> {manager.phone}</td>
                    <td class="tb">{manager.name}</td>
                    <td class="tb">{manager.nickname}</td>
                    <td class="tb">일반</td>
                    <td class="tb">
                        <button class="btn btn-sm">보기</button>
                    </td>

                    <td class="tb">
                        {moment(manager.created_at).format("YY/MM/DD")}
                    </td>
                    <td class="tb"> 25/7/15 13:40 </td>
                </tr>
            {/each}
        </tfoot>
        <tbody>
            {#each userList as user, idx}
                <tr class="text-center">
                    <th class="tb">{data.allCount - idx}</th>
                    <td class="tb">{user.id}</td>
                    <td class="tb">
                        <div class="flex gap-1">
                            <input type="text" class="tb rounded-md w-full" />
                            <button class="btn btn-sm">변경</button>
                        </div>
                    </td>
                    <td class="tb">{user.sns_id ? "KAKAO" : ""}</td>
                    <td class="tb"> {user.phone}</td>
                    <td class="tb">{user.name}</td>
                    <td class="tb">{user.nickname}</td>
                    <td class="tb">일반</td>
                    <td class="tb">
                        <button class="btn btn-sm">보기</button>
                    </td>

                    <td class="tb">
                        {moment(user.created_at).format("YY/MM/DD")}
                    </td>
                    <td class="tb"> 25/7/15 13:40 </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    tfoot {
        display: table-header-group; /* 테이블의 머리처럼 취급 */
    }
</style>
