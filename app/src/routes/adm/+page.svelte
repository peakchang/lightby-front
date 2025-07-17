<script>
    import moment from "moment-timezone";
    let { data } = $props();

    let userList = $state([]);

    $effect(() => {
        userList = data.userList;
    });
</script>

<div class="overflow-x-auto">
    <table class="table">
        <thead>
            <tr class="text-center">
                <th></th>
                <th>아이디</th>
                <th>비번변경</th>
                <th>SNS</th>
                <th>휴대폰번호</th>
                <th>이름</th>
                <th>닉네임</th>
                <th>등급</th>
                <th>프로필</th>
                <th>가입일자</th>
                <th>마지막접속</th>
            </tr>
        </thead>

        <tfoot>
            <tr class="text-center">
                <th>관리자</th>
                <th>Name</th>
                <th>Job</th>
                <th>company</th>
                <th>location</th>
                <th>Last Login</th>
                <th>Favorite Color</th>
            </tr>
        </tfoot>
        <tbody>
            {#each userList as user}
                <tr class="text-center">
                    <th class="tb">1</th>
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
