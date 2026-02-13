<script>
    import CustomModal from "$lib/components/CustomModal.svelte";
    import { goto } from "$app/navigation";
    import { back_api } from "$lib/const";
    import { user_info, joinStatus } from "$lib/stores/stores";
    import {
        formatTime,
        generateRandomNumber,
        isAlphanumeric,
        removeSpecialCharactersAndSpaces,
    } from "$lib/lib";
    import axios from "axios";
    import { onMount } from "svelte";

    // ... 기존 로직 (동일하게 유지) ...
    onMount(() => {
        if ($user_info["idx"]) {
            alertMessage = "이미 로그인 되어 있습니다.";
            alertModal = true;
            modalLoading = true;
            setTimeout(() => {
                alertModal = false;
                modalLoading = false;
                location.href = "/";
            }, 800);
        }
    });

    let id = $state("");
    let idErrBool = $state(false);
    let idSuccessBool = $state(false);
    let idStatusErrBool = $state(false);
    let name = $state("");
    let nickname = $state("");
    let nicknameSuccessBool = $state(false);
    let nicknameErrBool = $state(false);
    let phone = $state("");
    let authNumber = $state("");
    let authNumChk = $state("");
    let authShowBool = $state(false);
    let authBool = $state(false);
    let timeLeft = $state(180);
    let interval = $state(null);
    let businessNum = $state("");
    let password = $state("");
    let passwordChk = $state("");
    let pwdErrShowBool = $state(false);
    let pwdSuccessShowBool = $state(false);
    let alertModal = $state(false);
    let alertMessage = $state("");
    let successModal = $state(false);
    let successMessage = $state("");
    let modalLoading = $state(false);

    // ... 함수 로직 (기존과 동일하되 디자인 요소에 맞춰 최적화 유지) ...
    async function duplicate_chk(e) {
        const type = e.target.getAttribute("data-type");
        if (type == "id") {
            const idChk = isAlphanumeric(id);
            idStatusErrBool = !idChk;
            if (id && idChk) {
                try {
                    await axios.post(`${back_api}/auth/duplicate_chk`, {
                        type,
                        value: id,
                    });
                    idErrBool = false;
                    idSuccessBool = true;
                } catch (error) {
                    idErrBool = true;
                    idSuccessBool = false;
                }
            }
        } else if (type == "nickname") {
            if (nickname) {
                try {
                    await axios.post(`${back_api}/auth/duplicate_chk`, {
                        type,
                        value: nickname,
                    });
                    nicknameErrBool = false;
                    nicknameSuccessBool = true;
                } catch (error) {
                    nicknameErrBool = true;
                    nicknameSuccessBool = false;
                }
            }
        } else {
            if (phone) {
                try {
                    await axios.post(`${back_api}/auth/duplicate_chk`, {
                        type,
                        value: removeSpecialCharactersAndSpaces(phone),
                    });
                    return true;
                } catch (error) {
                    alertMessage = "전화번호가 중복됩니다. 다시 입력해주세요";
                    alertModal = true;
                    phone = "";
                    return false;
                }
            }
        }
    }

    async function startAuth() {
        if (phone.length < 12) {
            alertMessage = "휴대폰 번호를 확인해주세요";
            alertModal = true;
            return;
        }
        authShowBool = true;
        authNumber = generateRandomNumber();
        console.log(authNumber);

        try {
            const res = await axios.post(`${back_api}/send_sms`, {
                phone,
                message: `[번개분양] 인증번호 [${authNumber}]를 입력해주세요.`,
            });
            if (res.status == 200) {
                if (interval) clearInterval(interval);
                timeLeft = 180;
                interval = setInterval(() => {
                    if (timeLeft > 0) timeLeft -= 1;
                    else {
                        authNumber = "";
                        authShowBool = false;
                        clearInterval(interval);
                        interval = null;
                        alert("시간이 만료 되었습니다. 다시 시도해주세요.");
                    }
                }, 1000);
            }
        } catch (error) {}
    }

    function checkAuthStop() {
        if (authNumber == authNumChk) {
            clearInterval(interval);
            successMessage = "인증되었습니다.";
            successModal = true;
            authShowBool = false;
            authBool = true;
        } else {
            alertMessage = "인증번호가 일치하지 않습니다.";
            alertModal = true;
        }
    }

    function chkPwdFunc() {
        pwdErrShowBool = false;
        pwdSuccessShowBool = false;
        if (password && passwordChk) {
            if (password === passwordChk) pwdSuccessShowBool = true;
            else pwdErrShowBool = true;
        }
    }

    async function joinSubmit(e) {
        e.preventDefault();
        if (!id || idStatusErrBool || idErrBool) {
            alertMessage = "아이디를 확인해주세요.";
            alertModal = true;
            return;
        }
        if (!name) {
            alertMessage = "이름을 입력하세요";
            alertModal = true;
            return;
        }
        if (!nickname || nicknameErrBool) {
            alertMessage = "닉네임을 확인해주세요.";
            alertModal = true;
            return;
        }
        if (!authBool) {
            alertMessage = "휴대폰 인증을 완료해주세요";
            alertModal = true;
            return;
        }
        if (!password || password !== passwordChk) {
            alertMessage = "비밀번호를 확인해주세요.";
            alertModal = true;
            return;
        }

        const cleanPhone = removeSpecialCharactersAndSpaces(phone);
        try {
            await axios.post(`${back_api}/auth/join`, {
                id,
                name,
                nickname,
                phone: cleanPhone,
                password,
            });
            joinStatus.set({ type: "general", info: { id, password } });
            goto("/auth/interest_set");
        } catch (err) {
            alertMessage = "회원가입 실패. 다시 시도해주세요.";
            alertModal = true;
        }
    }

    function formatPhoneNumber(event) {
        let value = event.target.value.replace(/\D/g, "");
        if (value.length > 3 && value.length <= 7)
            value = value.replace(/(\d{3})(\d+)/, "$1-$2");
        else if (value.length > 7)
            value = value.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
        phone = value;
    }
</script>

<div
    class="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 suit-font"
>
    <div
        class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
    >
        <div
            class="pt-10 pb-6 text-center bg-gradient-to-b from-blue-50 to-white"
        >
            <a
                href="/"
                class="inline-block transition-transform hover:scale-105"
            >
                <img src="/logo.png" alt="로고" class="h-12 mx-auto" />
            </a>
            <h2
                class="mt-4 text-2xl font-extrabold text-slate-800 tracking-tight"
            >
                회원가입
            </h2>
            <p class="text-slate-500 text-sm mt-1">
                번개분양의 새로운 가족이 되어주세요
            </p>
        </div>

        <div class="p-8 pt-4">
            <form onsubmit={joinSubmit} class="space-y-5">
                <div class="form-control">
                    <label class="label p-1">
                        <span class="label-text font-semibold text-slate-700"
                            >아이디</span
                        >
                    </label>
                    <div class="relative flex items-center">
                        <span class="absolute left-3 z-10 text-slate-400">
                            <i class="fa fa-id-card-o" aria-hidden="true"></i>
                        </span>
                        <input
                            type="text"
                            class="input input-bordered w-full pl-10 focus:input-primary transition-all bg-white"
                            placeholder="아이디를 입력하세요"
                            bind:value={id}
                            onfocusout={duplicate_chk}
                        />
                    </div>
                    {#if idStatusErrBool}
                        <p
                            class="text-[11px] text-error mt-1 ml-1 flex items-center gap-1"
                        >
                            <i class="fa fa-info-circle"></i> 형식 오류 (영문/숫자만)
                        </p>
                    {:else if idErrBool}
                        <p
                            class="text-[11px] text-error mt-1 ml-1 flex items-center gap-1"
                        >
                            <i class="fa fa-times-circle"></i> 이미 사용 중인 아이디입니다.
                        </p>
                    {:else if idSuccessBool}
                        <p
                            class="text-[11px] text-success mt-1 ml-1 flex items-center gap-1"
                        >
                            <i class="fa fa-check-circle"></i> 사용 가능한 아이디입니다.
                        </p>
                    {/if}
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="form-control">
                        <label class="label p-1"
                            ><span
                                class="label-text font-semibold text-slate-700"
                                >성명</span
                            ></label
                        >
                        <input
                            type="text"
                            class="input input-bordered w-full bg-white focus:input-primary"
                            placeholder="실명 입력"
                            bind:value={name}
                        />
                    </div>
                    <div class="form-control">
                        <label class="label p-1"
                            ><span
                                class="label-text font-semibold text-slate-700"
                                >닉네임</span
                            ></label
                        >
                        <input
                            type="text"
                            class="input input-bordered w-full bg-white focus:input-primary {nicknameErrBool
                                ? 'input-error'
                                : nicknameSuccessBool
                                  ? 'input-success'
                                  : ''}"
                            placeholder="활동 닉네임"
                            data-type="nickname"
                            bind:value={nickname}
                            onfocusin={() => {
                                nicknameErrBool = false;
                                nicknameSuccessBool = false;
                            }}
                            onfocusout={duplicate_chk}
                        />
                    </div>
                </div>
                {#if nicknameErrBool}
                    <p class="text-[11px] text-error -mt-3 ml-1">
                        이미 사용 중인 닉네임입니다.
                    </p>
                {/if}

                <div class="form-control">
                    <label class="label p-1"
                        ><span class="label-text font-semibold text-slate-700"
                            >휴대폰 번호</span
                        ></label
                    >
                    <div class="flex gap-2">
                        <input
                            type="text"
                            class="input input-bordered grow bg-white focus:input-primary"
                            placeholder="010-0000-0000"
                            disabled={authShowBool || authBool}
                            bind:value={phone}
                            oninput={formatPhoneNumber}
                        />
                        <button
                            type="button"
                            class="btn btn-neutral px-4"
                            disabled={authShowBool || authBool}
                            onclick={async (e) => {
                                if (await duplicate_chk(e)) startAuth();
                            }}
                        >
                            {authBool ? "완료" : "인증"}
                        </button>
                    </div>
                </div>

                {#if authShowBool}
                    <div
                        class="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2"
                    >
                        <div
                            class="flex items-center justify-between text-xs mb-1"
                        >
                            <span class="text-slate-500">인증번호 입력</span>
                            <span class="text-error font-bold"
                                >{formatTime(timeLeft)}</span
                            >
                        </div>
                        <div class="flex gap-2">
                            <input
                                type="text"
                                class="input input-bordered input-sm grow bg-white"
                                placeholder="6자리 입력"
                                bind:value={authNumChk}
                            />
                            <button
                                type="button"
                                class="btn btn-warning btn-sm text-white"
                                onclick={checkAuthStop}>확인</button
                            >
                        </div>
                    </div>
                {/if}

                <div class="space-y-3">
                    <div class="form-control">
                        <label class="label p-1"
                            ><span
                                class="label-text font-semibold text-slate-700"
                                >비밀번호</span
                            ></label
                        >
                        <input
                            type="password"
                            class="input input-bordered w-full bg-white focus:input-primary"
                            placeholder="비밀번호를 입력하세요"
                            bind:value={password}
                            onfocusout={chkPwdFunc}
                        />
                    </div>
                    <div class="form-control">
                        <input
                            type="password"
                            class="input input-bordered w-full bg-white focus:input-primary {pwdErrShowBool
                                ? 'input-error'
                                : pwdSuccessShowBool
                                  ? 'input-success'
                                  : ''}"
                            placeholder="비밀번호 확인"
                            bind:value={passwordChk}
                            onfocusout={chkPwdFunc}
                        />
                        {#if pwdErrShowBool}
                            <p
                                class="text-[11px] text-error mt-1 ml-1 flex items-center gap-1"
                            >
                                <i class="fa fa-times-circle"></i> 비밀번호가 일치하지
                                않습니다.
                            </p>
                        {:else if pwdSuccessShowBool}
                            <p
                                class="text-[11px] text-success mt-1 ml-1 flex items-center gap-1"
                            >
                                <i class="fa fa-check-circle"></i> 비밀번호가 확인되었습니다.
                            </p>
                        {/if}
                    </div>
                </div>

                <div class="pt-4">
                    <button
                        class="btn btn-primary btn-lg w-full text-white shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all border-none"
                    >
                        가입 완료하기
                    </button>
                    <p class="text-center text-xs text-slate-400 mt-4">
                        가입 시 <span
                            class="underline underline-offset-2 cursor-pointer"
                            >이용약관</span
                        >
                        및
                        <span
                            class="underline underline-offset-2 cursor-pointer"
                            >개인정보처리방침</span
                        >에 동의하게 됩니다.
                    </p>
                </div>
            </form>
        </div>
    </div>
</div>

<CustomModal bind:visible={successModal} closeBtn={false}>
    <div class="text-center p-4">
        <div class="text-success text-5xl mb-4 text-center">
            <i class="fa fa-check-circle-o"></i>
        </div>
        <div class="font-bold text-lg mb-2">{successMessage}</div>
        {#if modalLoading}
            <div class="mt-2">
                <span class="loading loading-dots loading-md text-primary"
                ></span>
            </div>
        {/if}
    </div>
</CustomModal>

<CustomModal bind:visible={alertModal} closeBtn={false}>
    <div class="text-center p-4">
        <div class="text-error text-5xl mb-4">
            <i class="fa fa-exclamation-circle"></i>
        </div>
        <div class="font-medium">{alertMessage}</div>
        <button
            class="btn btn-ghost btn-sm mt-4 text-slate-400"
            onclick={() => (alertModal = false)}>닫기</button
        >
    </div>
</CustomModal>

<style>
    :global(.suit-font) {
        font-family: "SUIT", sans-serif;
    }
    /* 입력창 포커스 효과 강화 */
    .input:focus {
        outline: 2px solid #3b82f6; /* Tailwind blue-500 */
        outline-offset: -1px;
    }
</style>
