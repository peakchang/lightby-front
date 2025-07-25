<script>
    import { goto, invalidateAll } from "$app/navigation";
    import { back_api } from "$lib/const.js";
    import axios from "axios";
    import moment from "moment-timezone";
    import { prev } from "$lib/stores/stores.js";

    let { data } = $props();
    let jobOfferList = $state([]);

    $effect(() => {
        jobOfferList = data.jobOfferList;
    });
    console.log(data);
</script>

<div class="text-2xl font-bold">공고관리</div>

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
                <th>조회수</th>
                <th>버튼</th>
            </tr>
        </thead>
        <tbody>
            {#each jobOfferList as val, idx}
                <tr class="text-center">
                    <th>
                        <span
                            class="cursor-pointer"
                            on:click={() => {
                                $prev = "/adm/manage_job";
                                goto(`/detail/${val.idx}`);
                            }}
                        >
                            {val.subject}
                        </span>
                    </th>
                    <th
                        >{val.user_id ? val.user_id : "카카오"} / {val.user_nickname}</th
                    >
                    <th>{moment(val.created_at).format("YY/MM/DD HH:mm")}</th>
                    <th>{val.view_count}</th>
                    <th>
                        <a
                            href="/joboffer?modifyidx={val.idx}&manage=on"
                            on:click|preventDefault={() => {
                                $prev = "/adm/manage_job";
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
                    </th>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
