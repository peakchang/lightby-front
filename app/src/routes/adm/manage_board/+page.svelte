<script>
    import { invalidateAll } from "$app/navigation";
    import { back_api } from "$lib/const.js";
    import axios from "axios";
    import moment from "moment-timezone";

    let { data } = $props();

    let postList = $state([]);

    $effect(() => {
        postList = data.postList;
    });
</script>

<div class="">
    <span class="text-2xl font-bold"> 게시글 관리</span>
    <span class="text-sm">(수수료 인증)</span>
</div>
<div class="overflow-x-auto mt-3 mb-8">
    <table class="table">
        <thead>
            <tr class="text-center">
                <th>제목</th>
                <th>아이디 / 닉네임</th>
                <th>등록일</th>
                <th>버튼</th>
            </tr>
        </thead>
        <tbody>
            {#each postList as val, idx}
                <tr class="text-center">
                    <th>{val.subject}</th>
                    <th
                        >{val.user_id ? val.user_id : "카카오"} / {val.user_nickname}</th
                    >
                    <th>{moment(val.created_at).format("YY/MM/DD HH:mm")}</th>
                    <th>
                        <a href="/simplewrite?modifyidx={val.idx}">
                            <button class="btn btn-accent btn-sm text-white">
                                수정
                            </button>
                        </a>

                        <button
                            class="btn btn-error btn-sm text-white"
                            value={val.idx}
                            onclick={async (e) => {
                                if (
                                    !confirm(
                                        "삭제된 게시글은 복구가 불가능합니다. 진행 하시겠습니까?",
                                    )
                                ) {
                                    return;
                                }

                                console.log(postList[idx]);
                                console.log(postList[idx]["imgs"]);

                                try {
                                    const res = await axios.post(
                                        `${back_api}/adm_manage/delete_post`,
                                        {
                                            idx: e.target.value,
                                            delImgs: postList[idx]["imgs"],
                                        },
                                    );

                                    invalidateAll();
                                } catch (error) {
                                    console.error(error.message);
                                }
                            }}
                        >
                            삭제
                        </button>
                    </th>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
