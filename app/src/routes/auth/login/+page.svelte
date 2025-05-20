<script>
    import { goto } from "$app/navigation";
    import { user_info } from "$lib/store";

    let id = $state("");
    let password = $state("");

    console.log($user_info);

    $effect(() => {
        loginedChecked();
    });

    function loginedChecked() {
        if ($user_info.idx) {
            alert("이미 로그인 되어 있습니다.");
            location.href = "/";
        }
    }

    async function loginSubmit(e) {
        e.preventDefault();

        let errorMessage = "";

        // try {
        //     const res = await axios.post(`/auth/login`, { id, password });
        //     console.log(res);

        //     if (res.status === 200) {
        //         alert("로그인 완료!");
        //         location.href = "/";
        //     }
        // } catch (error) {
        //     console.log(error.response);

        //     if (error.response) {
        //         // 서버에서 보낸 에러 메시지 추출
        //         console.error("Error Response:", error.response);
        //         alert(error.response.data.error || "로그인 실패!"); // 에러 메시지 표시
        //     } else if (error.request) {
        //         console.error("No response received:", error.request);
        //         alert("서버로부터 응답이 없습니다.");
        //     } else {
        //         console.error("Request error:", error.message);
        //         alert("요청 중 오류 발생");
        //     }
        // }
    }

    const kakao_login = () => {
        const kakaoInfo = {
            // kakao_restapi: "e6c8c90ba06c8dcbe1825e0785679d30",
            kakao_restapi: import.meta.env.VITE_KAKAO_RESTAPI,
            kakao_redirect: import.meta.env.VITE_KAKAO_REDIRECT_URI,
        };
        location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoInfo.kakao_restapi}&redirect_uri=${kakaoInfo.kakao_redirect}&response_type=code`;
    };
</script>

<div class="bg-green-50 relative min-h-screen">
    <div
        class="max-w-[530px] mx-auto suit-font pt-12 pb-10 bg-white p-14 min-h-screen"
    >
        <div class="text-center bg-white">
            <img src="/logo.png" alt="" class=" max-w-[150px] mx-auto" />
        </div>

        <div class="mt-12">
            <!-- svelte-ignore event_directive_deprecated -->
            <form on:submit={loginSubmit}>
                <label
                    class="input input-info mt-5 w-full"
                >
                    <span class="min-w-4 flex justify-center">
                        <i class="fa fa-id-card-o opacity-70" aria-hidden="true"
                        ></i>
                    </span>

                    <!-- svelte-ignore event_directive_deprecated -->
                    <input
                        type="text"
                        class="grow"
                        placeholder="아이디를 입력하세요"
                        bind:value={id}
                    />
                </label>

                <label class="input input-info mt-5 w-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        class="h-4 w-4 opacity-70"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    <input
                        type="password"
                        class="grow"
                        placeholder="비밀번호를 입력하세요"
                        bind:value={password}
                    />
                </label>

                <div class="mt-5">
                    <button class="btn btn-info w-full text-white">
                        로그인하기
                    </button>
                </div>
            </form>

            <div class="mt-3">
                <button
                    class=" bg-[#ffe500] font-semibold w-full p-3 rounded-lg flex justify-center items-center gap-2"
                    on:click={kakao_login}
                >
                    <img src="/kakao_logo.png" alt="" width="24" height="24" />
                    카카오로 3초만에 로그인
                </button>
            </div>

            <div class="mt-3 text-center">
                <button
                    class="text-xs text-blue-600"
                    on:click={() => {
                        goto("/auth/join");
                    }}
                >
                    회원이 아니신가요? 회원가입 바로가기
                </button>
            </div>
        </div>
    </div>
</div>
