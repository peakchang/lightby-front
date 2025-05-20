<script>
    import { page } from "$app/stores";
    import axios from "axios";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { user_info } from "$lib/store";
    import { back_api } from "$lib/const";
    import {
        formatTime,
        generateRandomNumber,
        removeSpecialCharactersAndSpaces,
    } from "$lib/lib";

    let { data } = $props();
    console.log(data);

    let userInfo = $state({});
    userInfo = data.userInfo;

    // 필수 정보 변수!
    let name = $state("");

    let nickname = $state("");
    let nicknameSuccessBool = $state(false); // 아이디 창 벗어났을때 성공 창 뜨게 하는 변수
    let nicknameErrBool = $state(false); // 아이디 창 벗어났을때 에러 창 뜨게 하는 변수

    let phone = $state("");

    let authNumber = $state(""); // 발송되는 인증번호
    let authNumChk = $state(""); // 실제 입력되는 인증번호
    let authShowBool = $state(false); // 인증번호 발송 시작되면 하단 인증 창 보여주기 위한 변수
    let authBool = $state(false); // 마무리 체크 단계 false 면 회원가입 안됨!
    let timeLeft = $state(180); // 인증번호 카운트 다운 떨어지는 숫자!
    let interval = $state(null); // 인증번호 카운트 다운 시 setInerval 셋팅 변수

    // 고객정보 대조 후 필수 정보 (전화번호 / 이름) 없으면 인증 받기 (SNS 아이디는 비밀번호 X)
    // 이렇게 해서 로그인 / 회원가입 같이 처리하기
    // 휴대폰 번호 등록은 아직이니까 추후 비즈니스 등록 후, 카카오에서 승낙하면 수정하기!

    /*
    1. 먼저 +page.server.js 에서 DB에 있는지 조회! (있으면 회원 정보 가지고 오기!)
    >> 만약 정보가 다 있으면 쿠키에 JWT 토큰 넣고 메인페이지로 이동 refresh! (hook 으로 처리)

    2. 필수 정보 없으면 정보 받기! (전화번호 / 이름)
    3. 필수 정보 다 채워지면 +server.js 를 통해 DB에 입력 / JWT 토큰 생성 및 쿠키 저장 / 메인페이지로 refresh! (hook 으로 처리)
    */

    $effect(() => {
        console.log(data);

        if (data.loginStatus == undefined) {
            alert("오류입니다. 다시 시도해주세요");
            goto("/auth/login");
        }
        // 빈 객체가 아닐경우 유저 정보가 있으므로 store user_info 에 정보 넣고 메인 페이지로 이동!
        if (data.loginStatus == true) {
            $user_info = data;
            location.href = "/";
        }

        if (userInfo.phone) {
            authBool = true;
        }
    });

    async function startAuth() {
        if (!phone) {
            alert("전화번호를 입력해주세요");
            return;
        }
        authShowBool = true;
        authNumber = generateRandomNumber();
        console.log(authNumber);

        try {
            // const res = await axios.post(`${back_api}/send-sms`, {
            //     phone,
            //     message: `분양가이드 인증번호 ${authNumber}`,
            // });
            // if (res.status == 200) {
            //     if (!interval) {
            //         interval = setInterval(() => {
            //             if (timeLeft > 0) {
            //                 timeLeft -= 1;
            //             } else {
            //                 authNumber = "";
            //                 authShowBool = false;
            //                 clearInterval(interval);
            //                 interval = null;
            //                 timeLeft = 180;
            //                 alert("시간이 만료 되었습니다. 다시 시도해주세요.");
            //             }
            //         }, 1000);
            //     }
            // }

            if (!interval) {
                interval = setInterval(() => {
                    if (timeLeft > 0) {
                        timeLeft -= 1;
                    } else {
                        authNumber = "";
                        authShowBool = false;
                        clearInterval(interval);
                        interval = null;
                        timeLeft = 180;
                        alert("시간이 만료 되었습니다. 다시 시도해주세요.");
                    }
                }, 1000);
            }
        } catch (error) {}
    }

    function checkAuthStop() {
        if (authNumber == authNumChk) {
            alert("인증 되었습니다.");
            clearInterval(interval);
            interval = null;
            authShowBool = false;
            authBool = true;
        } else {
            alert("인증번호가 맞지 않습니다. 다시 시도해주세요");
            return;
        }
    }

    async function snsloginSubmit(e) {
        e.preventDefault();

        if (!data.loginStatus && !userInfo.name && !name) {
            alert("이름을 입력하세요.");
            return;
        }

        if (!data.loginStatus && !userInfo.phone && !phone) {
            alert("휴대폰 번호를 입력하세요.");
            return;
        }

        if (!authBool) {
            alert("휴대폰 인증을 완료해주세요");
            return;
        }

        if (!data.loginStatus && !userInfo.nickname && !nickname) {
            alert("닉네임을 입력하세요.");
            return;
        }
        userInfo.name = name;
        userInfo.phone = removeSpecialCharactersAndSpaces(phone);
        userInfo.nickname = nickname;
        console.log(userInfo);

        // try {
        //     const res = await axios.post("/auth/kakao-callback", { userInfo });
        //     if (res.status == 200) {
        //         alert("로그인 성공!");
        //         location.href = "/";
        //     }
        // } catch (error) {}
    }

    async function duplicate_chk(e) {
        const type = e.target.getAttribute("data-type");
        if (type == "nickname") {
            if (nickname) {
                // try {
                //     const res = await axios.post(`/auth/duplicate_chk`, {
                //         type,
                //         value: nickname,
                //     });
                //     if (res.status == 200) {
                //         if (res.data.status == false) {
                //             nicknameErrBool = true;
                //             nicknameSuccessBool = false;
                //         } else {
                //             nicknameErrBool = false;
                //             nicknameSuccessBool = true;
                //         }
                //     } else {
                //         alert("에러발생! 다시 시도해주세요!");
                //         nickname = "";
                //     }
                // } catch (error) {}
            }
        } else {
            if (phone) {
                // try {
                //     const res = await axios.post(`/auth/duplicate_chk`, {
                //         type,
                //         value: phone,
                //     });
                //     if (res.status == 200) {
                //         if (res.data.status == false) {
                //             alert(
                //                 "중복된 번호가 있습니다. 전화번호를 확인해주세요",
                //             );
                //             return false;
                //         } else {
                //             return true;
                //         }
                //     } else {
                //         alert("에러발생! 다시 시도해주세요!");
                //         nickname = "";
                //     }
                // } catch (error) {}
            } else {
                alert("전화번호를 입력해주세요");
                return false;
            }
        }
    }

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

<div class="bg-green-50 relative min-h-screen pretendard">
    <div class="max-w-[530px] mx-auto pt-12 pb-10 bg-white p-14">
        <div class="text-center bg-white">
            <img src="/logo.png" alt="" class=" max-w-[150px] mx-auto" />
        </div>

        <div class="mt-12">
            <!-- svelte-ignore event_directive_deprecated -->
            <form on:submit={snsloginSubmit}>
                {#if !userInfo.name && !data.loginStatus}
                    <label
                        class="input input-bordered flex items-center gap-2 text-sm mt-5"
                    >
                        <span class="min-w-4 flex justify-center">
                            <i class="fa fa-user opacity-70" aria-hidden="true"
                            ></i>
                        </span>
                        <input
                            type="text"
                            class="grow"
                            placeholder="이름을 입력하세요"
                            bind:value={name}
                        />
                    </label>
                {/if}

                {#if !userInfo.nickname & !data.loginStatus}
                    <label
                        class="input input-bordered flex items-center gap-2 text-sm mt-5"
                    >
                        <span class="min-w-4 flex justify-center">
                            <i
                                class="fa fa-user-circle opacity-70"
                                aria-hidden="true"
                            ></i>
                        </span>

                        <!-- svelte-ignore event_directive_deprecated -->
                        <input
                            type="text"
                            class="grow"
                            placeholder="활동하실 닉네임을 입력하세요"
                            data-type="nickname"
                            bind:value={nickname}
                            on:focusin={() => {
                                nicknameErrBool = false;
                                nicknameSuccessBool = false;
                            }}
                            on:focusout={duplicate_chk}
                        />
                    </label>
                {/if}

                {#if nicknameErrBool == true}
                    <div class="text-right text-xs text-red-500 mt-1">
                        닉네임이 중복됩니다. 다시 입력해주세요.
                    </div>
                {:else if nicknameSuccessBool == true}
                    <div class="text-right text-xs text-green-600 mt-1">
                        사용 가능한 닉네임 입니다.
                    </div>
                {/if}

                {#if !userInfo.phone & !data.loginStatus}
                    <div class="flex items-center mt-5 gap-2">
                        <label
                            class="input input-bordered flex items-center gap-2 text-sm w-full"
                        >
                            <span class="min-w-4 flex justify-center">
                                <i
                                    class="fa fa-mobile text-lg opacity-70"
                                    aria-hidden="true"
                                ></i>
                            </span>

                            <input
                                type="text"
                                class="grow"
                                placeholder="휴대폰 번호를 입력하세요"
                                disabled={authShowBool || authBool}
                                on:input={formatPhoneNumber}
                                bind:value={phone}
                            />
                            <!-- disabled -->
                        </label>

                        <button
                            type="button"
                            data-type="phone"
                            class="btn btn-success text-white"
                            disabled={authShowBool || authBool}
                            on:click={async (e) => {
                                const phoneBool = await duplicate_chk(e);
                                console.log(phoneBool);

                                if (phoneBool) {
                                    startAuth();
                                }
                            }}
                        >
                            인증받기
                        </button>
                    </div>
                {/if}

                {#if authShowBool}
                    <div class="flex items-center mt-1.5 gap-2">
                        <label
                            class="input input-bordered flex items-center gap-2 text-sm w-full"
                        >
                            <span
                                class="min-w-4 flex justify-center text-red-400"
                            >
                                {formatTime(timeLeft)}
                            </span>

                            <input
                                type="text"
                                class="grow"
                                placeholder="인증번호를 입력하세요"
                                bind:value={authNumChk}
                            />
                        </label>

                        <button
                            type="button"
                            class="btn btn-warning text-white"
                            on:click={checkAuthStop}
                        >
                            인증확인
                        </button>
                    </div>
                {/if}

                <div class="mt-5">
                    <button class="btn btn-info w-full text-white">
                        로그인하기
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
