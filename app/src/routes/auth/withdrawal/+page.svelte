<script>
    import { goto } from "$app/navigation";
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { back_api } from "$lib/const";
    import { user_info } from "$lib/stores/stores";
    import axios from "axios";

    let successModal = $state(false);
    let successMessage = $state("");
    let modalLoading = $state(false);

    async function deleteAccount() {
        console.log($user_info);

        try {
            const res = await axios.post(`${back_api}/auth/delete_account`, {
                idx: $user_info.idx,
            });

            successMessage =
                "회원 탈퇴가 완료 되었습니다. 잠시후 메인으로 이동합니다.";
            successModal = true;
            modalLoading = true;

            $user_info["idx"] = undefined;
            $user_info["rate"] = 0;

            const random = Math.floor(Math.random() * (1200 - 800 + 1)) + 800;
            setTimeout(() => {
                successModal = false;
                modalLoading = false;
                goto("/");
            }, random);
        } catch (error) {
            console.error(error.message);
        }
    }
</script>

<CustomModal bind:visible={successModal} closeBtn={false}>
    <div class="text-center">
        <div class=" text-green-700 text-3xl mb-2">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div>{successMessage}</div>
        {#if modalLoading}
            <div class="mt-2">
                <span class="loading loading-ring loading-xl"></span>
            </div>
        {/if}
    </div>
</CustomModal>

<div class="max-w-[530px] mx-auto pt-12 pb-10 px-14 suit-font">
    <div class="text-center bg-white">
        <a href="/">
            <img src="/logo.png" alt="" class=" max-w-[150px] mx-auto" />
        </a>

        <div class="mt-6 text-2xl">회원 탈퇴</div>
    </div>

    <div class="mt-5 text-sm leading-loose">
        <p>● 회원 탈퇴 시, 회원님의 모든 개인정보는 지체 없이 파기됩니다.</p>
        <p>● 동일 아이디 또는 동일 소셜 아이디로 재 가입이 가능합니다.</p>
        <p>
            ● 탈퇴 후 작성하신 게시물은 삭제되지 않으며, 회원님의 아이디는
            '탈퇴한 회원'으로 표시됩니다.
        </p>
        <p>
            ● 탈퇴 후 재가입 시, 기존에 보유하셨던 포인트 및 쿠폰은 복구되지
            않습니다.
        </p>

        <div class="mt-10 text-center">
            <button
                class="btn btn-error w-full text-white"
                on:click={deleteAccount}
            >
                회원 탈퇴 진행
            </button>
        </div>
    </div>
</div>
