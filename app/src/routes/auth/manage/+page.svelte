<script>
    import PageHeader from "$lib/components/PageHeader.svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";
    import {
        formatTime,
        formatPhoneNum,
        generateRandomNumber,
        isAlphanumeric,
        removeSpecialCharactersAndSpaces,
    } from "$lib/lib.js";

    import uploadImageAct from "$lib/lib.js";
    import { onMount, tick } from "svelte";
    import axios from "axios";

    import { toastStore } from "$lib/stores/stores.js";
    import { back_api, public_img_bucket } from "$lib/const.js";
    import { invalidateAll } from "$app/navigation";

    let userInfo = $state({});
    let { data } = $props();

    // 닉네임 변경 area 부분 바꾸기
    let nickname = $state("");

    let nickChangeBool = $state(false); // 변경 창 열기!!
    let nickChangeInput; // focus를 위해

    // 휴대폰 변경 부분
    let phoneChangeBool = $state(false); // 변경 창 열기!!
    let phoneChangeInput; // focus를 위해

    let phone = $state("");

    let authNumber = $state(""); // 발송되는 인증번호

    let authNumChk = $state(""); // 실제 입력되는 인증번호
    let authShowBool = $state(false); // 인증번호 발송 시작되면 하단 인증 창 보여주기 위한 변수
    let timeLeft = $state(180); // 인증번호 카운트 다운 떨어지는 숫자!
    let ahthInterval = $state(null); // 인증번호 카운트 다운 시 setInerval 셋팅 변수

    // 비밀번호 변경 부분
    let prevPassword = $state("");
    let password = $state("");
    let pwdChangeBool = $state(false); //

    let alertModal = $state(false);
    let alertMessage = $state("");

    let profile = $state("");
    let profileStatus = $state(false);

    onMount(() => {
        clearInterval(ahthInterval);
        userInfo = data.userInfo;
        nickname = userInfo.nickname;
        phone = userInfo.phone;
        profile = userInfo.profile_image;
    });

    $effect(() => {
        if (data) {
            userInfo = data.userInfo;
        }
    });

    async function changeProfile() {
        uploadImageAct(
            `${back_api}/img/upload_single`,
            { folder: "profile" },
            (err, imgData) => {
                if (err) {
                    alert("이미지 업로드 실패! 다시 시도해주세요!");
                }
                profile = imgData.saveUrl;
                profileStatus = true;
            },
        );
    }

    async function updateProfile() {
        try {
            const res = await axios.post(`${back_api}/update_profile`, {
                type: this.value,
                profile,
                idx: userInfo.idx,
            });

            invalidateAll();
            profileStatus = false;

            if (this.value == "delete") {
                profile = res.data.profile;
            }
        } catch (error) {}
    }

    // 전화번호 인증 시작~~~~
    async function startAuth() {
        if (phone.length < 11) {
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
                message: `번개분양 인증번호 ${authNumber}`,
            });
            if (res.status == 200) {
                if (!interval) {
                    interval = setInterval(() => {
                        if (timeLeft > 0) {
                            timeLeft -= 1;
                        } else {
                            authNumber = "";
                            authShowBool = false;
                            clearInterval(interval);
                            ahthInterval = null;
                            timeLeft = 180;
                            alertMessage =
                                "시간이 만료 되었습니다. 다시 시도해주세요.";
                            alertModal = true;
                        }
                    }, 1000);
                }
            }

            // if (!interval) {
            //     interval = setInterval(() => {
            //         if (timeLeft > 0) {
            //             timeLeft -= 1;
            //         } else {
            //             authNumber = "";
            //             authShowBool = false;
            //             clearInterval(interval);
            //             interval = null;
            //             timeLeft = 180;
            //             alertMessage =
            //                 "시간이 만료 되었습니다. 다시 시도해주세요.";
            //             alertModal = true;
            //         }
            //     }, 1000);
            // }
        } catch (error) {}
    }

    // 인증 완료 또는 실패시
    async function chkAuthAndPhoneUpdate() {
        if (authNumber == authNumChk) {
            clearInterval(ahthInterval);

            const changePhone = removeSpecialCharactersAndSpaces(phone);
            try {
                const res = await axios.post(`${back_api}/update_user_info`, {
                    idx: userInfo.idx,
                    phone: changePhone,
                    type: "phone",
                });

                toastStore.set({
                    show: true,
                    message: "휴대폰 번호가 변경 되었습니다.",
                    color: "#4374D9",
                });

                ahthInterval = null;
                authShowBool = false;
                phoneChangeBool = false;
                invalidateAll();
            } catch (error) {
                alertMessage = "에러 발생! 관리자에게 문의 주세요!";
                alertModal = true;
            }
        } else {
            alertMessage = "인증번호가 일치하지 않습니다.";
            alertModal = true;

            return false;
        }
    }

    // ID / 닉네임 / 휴대폰번호 input 창에서 벗어날시 기존 DB와 중복 체크 부분!
    async function duplicate_chk(e) {
        const type = e.target.getAttribute("data-type");
        if (type == "nickname") {
            if (nickname) {
                try {
                    const res = await axios.post(`/auth/duplicate_chk`, {
                        type,
                        value: nickname,
                    });
                    return true;
                } catch (error) {
                    alertMessage = "중복된 닉네임 입니다. 다시 입력 해주세요.";
                    alertModal = true;
                    return false;
                }
            } else {
                alertMessage = "닉네임을 입력해 주세요.";
                alertModal = true;
                return false;
            }
        } else {
            if (phone) {
                try {
                    const res = await axios.post(`/auth/duplicate_chk`, {
                        type,
                        value: removeSpecialCharactersAndSpaces(phone),
                    });
                    clearInterval(ahthInterval);
                    return true;
                } catch (err) {
                    console.error(err.message);
                    alertMessage = "전화번호가 중복됩니다. 다시 입력해주세요";
                    alertModal = true;
                    return false;
                }
            } else {
                alertMessage = "전화번호를 입력해주세요";
                alertModal = true;
                return false;
            }
        }
    }

    async function updateNickname(e) {
        const type = e.target.dataset.type;
        if (type == "nickname") {
            try {
                const res = await axios.post(`${back_api}/update_user_info`, {
                    idx: userInfo.idx,
                    nickname,
                    type,
                });

                toastStore.set({
                    show: true,
                    message: "닉네임이 변경 되었습니다.",
                    color: "#4374D9",
                });

                invalidateAll();
                nickChangeBool = false;
            } catch (error) {
                toastStore.set({
                    show: true,
                    message: "에러 발생! 관리자에게 문의 해주세요.",
                    color: "#FF4848",
                });
            }
        }
    }

    async function changePasswordFunc() {
        if (!prevPassword) {
            alertModal = true;
            alertMessage = "기존 비밀번호를 입력해주세요.";
            return;
        }

        if (!password) {
            alertModal = true;
            alertMessage = "새로운 비밀번호를 입력해주세요.";
            return;
        }

        try {
            const res = await axios.post(`${back_api}/update_password`, {
                idx: userInfo.idx,
                prevPassword,
                password,
            });

            toastStore.set({
                show: true,
                message: "비밀번호가 변경 되었습니다.",
                color: "#4374D9",
            });

            invalidateAll();
            pwdChangeBool = false;
        } catch (err) {
            const m = err.response.data.message;
            alertModal = true;
            alertMessage = m;
        }
    }

    // 전화번호 업로드시 숫자만 남기기
    function formatPhoneNumber(event) {
        let value = event.target.value.replace(/\D/g, ""); // 숫자만 남기기 (한글, 영어, 특수문자 제거)

        if (value.length > 3 && value.length <= 7) {
            value = value.replace(/(\d{3})(\d+)/, "$1-$2");
        } else if (value.length > 7) {
            value = value.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
        }

        phone = value;
    }
</script>

<CustomModal bind:visible={alertModal} closeBtn={false}>
    <div class="px-4 py-6 text-center suit-font">
        <div class="text-red-500 text-4xl mb-4 animate-bounce">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div
            class="text-gray-800 font-bold text-lg mb-6 leading-tight whitespace-pre-line"
        >
            {alertMessage}
        </div>
        <button
            class="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm active:scale-[0.98] transition-all"
            on:click={() => (alertModal = false)}
        >
            확인
        </button>
    </div>
</CustomModal>

<PageHeader pageName={"계정 설정"}></PageHeader>

<div class="bg-[#F8F9FA] min-h-screen suit-font pb-24">
    <div class="max-w-[530px] mx-auto pt-10">
        <div class="px-6 mb-8 text-center">
            <div class="relative inline-block">
                <div
                    class="w-24 h-24 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white"
                >
                    {#if profile}
                        <img
                            src="{public_img_bucket}{profile}"
                            alt="profile"
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <img
                            src="/profile-base.png"
                            alt="default"
                            class="w-full h-full object-cover"
                        />
                    {/if}
                </div>
                <button
                    class="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg active:scale-90 transition-transform"
                    on:click={changeProfile}
                >
                    <i class="fa fa-camera text-xs" aria-hidden="true"></i>
                </button>
            </div>

            {#if profileStatus}
                <div class="flex justify-center gap-2 mt-5">
                    <button
                        class="px-5 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-100"
                        on:click={updateProfile}
                        value="update">적용</button
                    >
                    <button
                        class="px-5 py-2 bg-white text-gray-400 rounded-lg text-xs font-bold border border-gray-200"
                        on:click={() => (profileStatus = false)}>취소</button
                    >
                </div>
            {:else}
                <div class="mt-4">
                    <h2 class="text-xl font-black text-gray-900">
                        {userInfo.nickname}님
                    </h2>
                    <p
                        class="text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-medium"
                    >
                        Account Settings
                    </p>
                </div>
            {/if}
        </div>

        <div class="px-5 space-y-4">
            <div
                class="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100"
            >
                <div
                    class="flex justify-between items-center py-3 border-b border-gray-50"
                >
                    <span class="text-sm font-bold text-gray-400">아이디</span>
                    <div
                        class="flex items-center gap-2 font-semibold text-gray-800"
                    >
                        {#if userInfo.sns_id}
                            <span
                                class="text-xs px-2 py-0.5 bg-[#FEE500] text-[#3C1E1E] rounded-md flex items-center gap-1"
                            >
                                <i
                                    class="fa fa-comment text-[10px]"
                                    aria-hidden="true"
                                ></i> KAKAO
                            </span>
                        {:else}
                            {userInfo.id}
                        {/if}
                    </div>
                </div>

                <div
                    class="flex justify-between items-center py-3 border-b border-gray-50"
                >
                    <span class="text-sm font-bold text-gray-400">이름</span>
                    <span class="font-semibold text-gray-800"
                        >{userInfo.name}</span
                    >
                </div>

                <div class="py-4 border-b border-gray-50">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-bold text-gray-400"
                            >닉네임</span
                        >
                        <button
                            class="text-[12px] font-bold {nickChangeBool
                                ? 'text-gray-400'
                                : 'text-blue-500'}"
                            on:click={() => {
                                nickChangeBool = !nickChangeBool;
                                if (nickChangeBool)
                                    setTimeout(
                                        () => nickChangeInput.focus(),
                                        50,
                                    );
                            }}
                        >
                            {nickChangeBool ? "취소" : "변경하기"}
                        </button>
                    </div>

                    {#if nickChangeBool}
                        <div class="flex gap-2 animate-fade-in">
                            <input
                                type="text"
                                class="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none font-semibold"
                                bind:this={nickChangeInput}
                                bind:value={nickname}
                            />
                            <button
                                class="bg-blue-500 text-white px-6 rounded-xl text-sm font-bold shadow-md shadow-blue-100 active:scale-95 transition-all"
                                on:click={async (e) => {
                                    if (await duplicate_chk(e))
                                        updateNickname(e);
                                }}
                                data-type="nickname">변경</button
                            >
                        </div>
                    {:else}
                        <div class="font-bold text-gray-800 ml-1">
                            {userInfo.nickname}
                        </div>
                    {/if}
                </div>

                <div class="py-4 border-b border-gray-50">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-bold text-gray-400"
                            >휴대폰 번호</span
                        >
                        <button
                            class="text-[12px] font-bold {phoneChangeBool
                                ? 'text-gray-400'
                                : 'text-blue-500'}"
                            disabled={authShowBool}
                            on:click={() => {
                                phoneChangeBool = !phoneChangeBool;
                                phone = formatPhoneNum(userInfo.phone);
                                if (phoneChangeBool)
                                    setTimeout(
                                        () => phoneChangeInput.focus(),
                                        50,
                                    );
                            }}
                        >
                            {phoneChangeBool ? "취소" : "변경하기"}
                        </button>
                    </div>

                    {#if phoneChangeBool}
                        <div class="space-y-2 animate-fade-in">
                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    class="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none font-semibold"
                                    bind:this={phoneChangeInput}
                                    bind:value={phone}
                                    on:input={formatPhoneNumber}
                                    disabled={authShowBool}
                                />
                                <button
                                    class="bg-gray-800 text-white px-6 rounded-xl text-sm font-bold active:scale-95 transition-all disabled:bg-gray-200"
                                    disabled={authShowBool}
                                    on:click={async (e) => {
                                        if (await duplicate_chk(e)) startAuth();
                                    }}
                                    data-type="phone">인증발송</button
                                >
                            </div>

                            {#if authShowBool}
                                <div class="flex gap-2 animate-bounce-in">
                                    <div class="relative flex-1">
                                        <input
                                            type="text"
                                            class="w-full bg-blue-50 border-2 border-blue-100 rounded-xl px-4 py-3 text-sm outline-none font-bold text-blue-600"
                                            placeholder="인증번호 입력"
                                            bind:value={authNumChk}
                                        />
                                        <span
                                            class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500"
                                        >
                                            {formatTime(timeLeft)}
                                        </span>
                                    </div>
                                    <button
                                        class="bg-blue-600 text-white px-6 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 active:scale-95"
                                        on:click={chkAuthAndPhoneUpdate}
                                        >확인</button
                                    >
                                </div>
                            {/if}
                        </div>
                    {:else}
                        <div class="font-bold text-gray-800 ml-1">
                            {userInfo.phone
                                ? formatPhoneNum(userInfo.phone)
                                : "번호 없음"}
                        </div>
                    {/if}
                </div>

                {#if !userInfo.sns_id}
                    <div class="py-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-bold text-gray-400"
                                >비밀번호</span
                            >
                            <button
                                class="text-[12px] font-bold {pwdChangeBool
                                    ? 'text-gray-400'
                                    : 'text-blue-500'}"
                                on:click={() =>
                                    (pwdChangeBool = !pwdChangeBool)}
                            >
                                {pwdChangeBool ? "취소" : "변경하기"}
                            </button>
                        </div>

                        {#if pwdChangeBool}
                            <div class="space-y-2 animate-fade-in">
                                <input
                                    type="password"
                                    placeholder="기존 비밀번호"
                                    class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none"
                                    bind:value={prevPassword}
                                />
                                <div class="flex gap-2">
                                    <input
                                        type="password"
                                        placeholder="새로운 비밀번호"
                                        class="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none"
                                        bind:value={password}
                                    />
                                    <button
                                        class="bg-blue-500 text-white px-6 rounded-xl text-sm font-bold active:scale-95"
                                        on:click={changePasswordFunc}
                                        >변경</button
                                    >
                                </div>
                            </div>
                        {:else}
                            <div
                                class="font-bold text-gray-800 ml-1 tracking-widest"
                            >
                                ••••••••
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>

            <p
                class="text-center text-[11px] text-gray-400 px-10 leading-relaxed"
            >
                회원정보는 개인정보 처리방침에 따라 안전하게 보호되며,<br />
                정보 변경 시 즉시 서비스에 반영됩니다.
            </p>
        </div>
    </div>
</div>

<style>
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-bounce-in {
        animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes bounceIn {
        from {
            transform: scale(0.95);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
</style>
