<script>
    import CustomModal from "$lib/components/CustomModal.svelte";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import imageCompression from "browser-image-compression";

    import { onDestroy, onMount } from "svelte";
    import { browser } from "$app/environment";
    import { page } from "$app/stores";

    import uploadImageAct from "$lib/lib.js";
    import { back_api, public_img_bucket } from "$lib/const.js";
    import {
        toastStore,
        scrollY,
        pageScrollStatus,
        loadingStore,
    } from "$lib/stores/stores";
    import { afterNavigate, goto } from "$app/navigation";
    import axios from "axios";

    let { data } = $props();

    console.log(data);

    let authBool = $state(false);

    let profile = $state("");
    let name = $state("");
    let gender = $state("남자");
    let age = $state("");

    let careerList = $state([]);
    let careerSplit = $state("");
    let career = $state("");

    let introduction = $state("");

    let profileStatus = $state(false);

    let compressedFile = $state({});
    let previewImg = $state("");

    let alertModal = $state(false);
    let alertMessage = $state("");
    let successModal = $state(false); // 무언가 성공시 모달! (2초 후 로그인 페이지로 이동)
    let successMessage = $state("");
    let modalLoading = $state(false);

    let skipModal = $state(false);

    afterNavigate((e) => {
        console.log(e);
        if (e.from && e.from.route.id.includes("auth")) {
            authBool = true;
        }
    });

    onMount(() => {
        if (!data.userInfo) {
            console.log("여기 와야지??");
            goto("/my");
        }

        $pageScrollStatus = false;

        if (data.userInfo.profile_image) {
            profile = data.userInfo.profile_image;
        }

        name = data.userInfo.name;
        age = data.userInfo.age;
        career = data.userInfo.career;
        if (career) {
            careerList = career.split("|");
        }

        introduction = data.userInfo.introduction;
    });

    function changeProfile() {
        const input = document.createElement("input");

        input.setAttribute("type", "file");
        input.setAttribute("accept", ".png,.jpg,.jpeg,.webp,.gif");
        input.click();

        input.onchange = async (e) => {
            loadingStore.set(true);

            const imageFile = e.target.files[0];

            const options = {
                maxSizeMB: 1, // 최대 파일 크기 (MB)
                // maxWidthOrHeight: 1024, // 최대 너비 또는 높이
                useWebWorker: true, // 웹 워커 사용
            };

            try {
                const maxSize = 1 * 1024 * 1024; // 1MB

                if (imageFile.name.split(".")[1] == "gif") {
                    if (imageFile.size >= maxSize) {
                        throw new Error("파일 용량이 1MB 이상입니다.");
                    }
                    compressedFile = imageFile;
                } else {
                    compressedFile = await imageCompression(imageFile, options);
                }

                const previewSrc = URL.createObjectURL(compressedFile);
                previewImg = previewSrc;

                loadingStore.set(false);
                if (typeof callback === "function") {
                    callback(null, res.data);
                }
            } catch (err) {
                console.error(err.message);

                loadingStore.set(true);
                const m = err.response?.data?.message;
                if (typeof callback === "function") {
                    callback(err, null);
                }
            }
        };
    }

    function deleteCareerList() {
        console.log(this.value);
        careerList.splice(Number(this.value), 1);
    }

    async function uploadMyTalent() {
        if (!name) {
            alertModal = true;
            alertMessage = "이름을 입력 해 주세요.";
            return;
        }

        if (!age) {
            alertModal = true;
            alertMessage = "나이를 입력 해 주세요.";
            return;
        }

        if (!introduction) {
            alertModal = true;
            alertMessage = "자기소개를 입력 해 주세요.";
            return;
        }

        career = careerList.join("|");

        if (Object.keys(compressedFile).length != 0) {
            let imgForm = new FormData();
            const timestamp = new Date().getTime();
            const fileName = `${timestamp}${Math.random()
                .toString(36)
                .substring(2, 11)}.${compressedFile.name.split(".")[1]}`;
            imgForm.append("folder", "profile");
            imgForm.append("onimg", compressedFile, fileName);

            imgForm.append("name", name);
            imgForm.append("gender", gender);
            imgForm.append("age", age);
            imgForm.append("career", career);
            imgForm.append("introduction", introduction);
            imgForm.append("prev_img", profile);
            imgForm.append("idx", data.userInfo.idx);

            try {
                const res = await axios.post(
                    `${back_api}/regist/upload_talent_include_image`,
                    imgForm,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );

                if (res.status) {
                    if (authBool) {
                        successMessage =
                            "회원가입 성공! 번개분양을 시작합니다!";
                        successModal = true;
                        modalLoading = true;
                        setTimeout(() => {
                            successModal = false;
                            modalLoading = false;
                            goto("/");
                        }, 1800);
                    } else {
                        successModal = true;
                        successMessage = "내 인재 정보가 업데이트 되었습니다.";
                    }
                }
            } catch (error) {}
        } else {
            try {
                const res = await axios.post(
                    `${back_api}/regist/upload_talent_no_image`,
                    {
                        name,
                        gender,
                        age,
                        career,
                        introduction,
                        idx: data.userInfo.idx,
                    },
                );

                if (res.status) {
                    if (authBool) {
                        successMessage =
                            "회원가입 성공! 번개분양을 시작합니다!";
                        successModal = true;
                        modalLoading = true;
                        setTimeout(() => {
                            successModal = false;
                            modalLoading = false;
                            goto("/");
                        }, 1800);
                    } else {
                        successModal = true;
                        successMessage = "내 인재 정보가 업데이트 되었습니다.";
                    }
                }
            } catch (err) {
                console.error(err.message);
            }
            console.log("이미지 업로드 없음");
        }
    }
</script>

<CustomModal bind:visible={alertModal} closeBtn={false}>
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-2">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div>{alertMessage}</div>
    </div>
</CustomModal>

<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={successModal} closeBtn={false}>
    <div class="px-4 py-8 text-center suit-font animate-fade-in">
        <div class="relative mx-auto w-20 h-20 mb-6">
            <div
                class="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"
            ></div>

            <div
                class="relative w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 animate-bounce-in"
            >
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    stroke-width="3.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
        </div>

        <div class="space-y-2 mb-8">
            <h3 class="text-xl font-black text-gray-800 tracking-tight">
                {successMessage.includes("성공")
                    ? "축하드려요! 🎉"
                    : "완료되었습니다!"}
            </h3>
            <p
                class="text-[15px] text-gray-500 leading-relaxed whitespace-pre-line"
            >
                {successMessage}
            </p>
        </div>

        {#if modalLoading}
            <div
                class="flex flex-col items-center gap-3 bg-gray-50 rounded-2xl py-4 px-6 border border-gray-100"
            >
                <div class="flex gap-1.5">
                    <span
                        class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                    ></span>
                    <span
                        class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"
                    ></span>
                    <span
                        class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"
                    ></span>
                </div>
                <span
                    class="text-[11px] font-bold text-emerald-600 tracking-widest uppercase"
                >
                    잠시 후 이동합니다.
                </span>
            </div>
        {:else}
            <div class="mt-2 flex flex-col gap-2">
                <button
                    class="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-[15px] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all duration-200"
                    on:click={() => {
                        successModal = false;
                    }}
                >
                    확인
                </button>
            </div>
        {/if}
    </div>
</CustomModal>

<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={skipModal} closeBtn={false}>
    <div class="py-10 px-6 text-center suit-font">
        <div class="relative inline-block mb-8">
            <div
                class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto"
            >
                <i
                    class="fa fa-check-circle text-green-500 text-5xl"
                    aria-hidden="true"
                ></i>
            </div>
            <span
                class="absolute -top-1 -right-1 text-yellow-400 text-xl animate-bounce"
                >✨</span
            >
        </div>

        <h2 class="text-2xl font-extrabold text-slate-800 mb-4 tracking-tight">
            설정이 완료되었습니다!
        </h2>

        <div
            class="bg-slate-50 rounded-2xl p-5 mb-10 max-w-sm mx-auto border border-slate-100"
        >
            <p class="text-slate-600 text-[15px] leading-relaxed">
                내 인재 정보는 <span class="font-bold text-slate-800"
                    >마이 > 내 인재 글 관리</span
                >에서<br />
                언제든 자유롭게 수정하실 수 있습니다.
            </p>
        </div>

        <div class="flex flex-col gap-3 items-center">
            <button
                class="btn btn-lg bg-green-500 hover:bg-green-600 border-none w-full max-w-[280px] text-white font-extrabold shadow-lg shadow-green-100 transition-all active:scale-95"
                on:click={() => {
                    goto("/");
                }}
            >
                번개분양 시작하기
                <i class="fa fa-bolt ml-2"></i>
            </button>

            <p class="text-xs text-slate-400 mt-2">
                지금 바로 맞춤 현장을 확인해보세요!
            </p>
        </div>
    </div>
</CustomModal>

{#if !authBool}
    <PageHeader pageName={"프로필 관리"} />
{/if}

<!-- svelte-ignore a11y_consider_explicit_label -->
<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_label_has_associated_control -->
<div class="bg-gray-50 relative min-h-screen suit-font">
    <div class="max-w-[640px] mx-auto pt-14 pb-24 px-4">
        <div class="text-center mb-10 animate-fade-in">
            <div class="inline-block p-3 bg-white rounded-2xl shadow-sm mb-4">
                <span class="text-2xl">📝</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">
                프로필 완성하기
            </h1>
            <p class="text-sm text-gray-400 leading-relaxed">
                시행사, 본부장님이 회원님을 기다리고 있어요!<br />
                멋진 프로필로
                <span class="text-sky-500 font-bold">좋은 현장</span>의 제안을
                받아보세요.
            </p>
        </div>

        <div class="space-y-6">
            <div
                class="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-center"
            >
                <div class="relative w-32 h-32 mx-auto mb-6">
                    <div
                        class="w-full h-full rounded-[40px] overflow-hidden ring-4 ring-sky-50 shadow-inner bg-gray-50 flex justify-center items-center"
                    >
                        {#if previewImg}
                            <img
                                src={previewImg}
                                alt="preview"
                                class="w-full h-full object-cover"
                            />
                        {:else if profile}
                            <img
                                src="{public_img_bucket}{profile}"
                                alt="profile"
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            <img
                                src="/profile-base.png"
                                alt="default"
                                class="w-full h-full object-cover opacity-50"
                            />
                        {/if}
                    </div>

                    <button
                        class="absolute -bottom-2 -right-2 w-10 h-10 bg-sky-500 text-white rounded-2xl shadow-lg flex justify-center items-center hover:bg-sky-600 transition-all"
                        on:click={changeProfile}
                    >
                        <i class="fa fa-camera"></i>
                    </button>
                </div>
                <p class="text-xs text-gray-400">
                    신뢰감을 줄 수 있는 깔끔한 사진을 권장해요!
                </p>
            </div>

            <div
                class="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-5"
            >
                <h3
                    class="font-bold text-gray-800 flex items-center gap-2 mb-2"
                >
                    <span class="w-1.5 h-4 bg-sky-500 rounded-full"></span> 기본
                    정보
                </h3>

                <div>
                    <label
                        class="block text-xs font-bold text-gray-400 mb-2 ml-1"
                        >이름</label
                    >
                    <input
                        type="text"
                        placeholder="실명을 입력해 주세요"
                        class="base-input"
                        bind:value={name}
                    />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label
                            class="block text-xs font-bold text-gray-400 mb-2 ml-1"
                            >성별</label
                        >
                        <div class="flex p-1 bg-gray-100 rounded-2xl">
                            <label class="flex-1">
                                <input
                                    type="radio"
                                    hidden
                                    value="남자"
                                    bind:group={gender}
                                />
                                <div
                                    class="text-center py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer {gender ===
                                    '남자'
                                        ? 'bg-white shadow-sm text-sky-500'
                                        : 'text-gray-400'}"
                                >
                                    남자
                                </div>
                            </label>
                            <label class="flex-1">
                                <input
                                    type="radio"
                                    hidden
                                    value="여자"
                                    bind:group={gender}
                                />
                                <div
                                    class="text-center py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer {gender ===
                                    '여자'
                                        ? 'bg-white shadow-sm text-sky-500'
                                        : 'text-gray-400'}"
                                >
                                    여자
                                </div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label
                            class="block text-xs font-bold text-gray-400 mb-2 ml-1"
                            >나이</label
                        >
                        <input
                            type="number"
                            placeholder="예: 32"
                            class="base-input"
                            bind:value={age}
                        />
                    </div>
                </div>
            </div>

            <div
                class="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100"
            >
                <h3
                    class="font-bold text-gray-800 flex items-center gap-2 mb-4"
                >
                    <span class="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                    주요 경력
                </h3>

                <div class="space-y-2 mb-4">
                    {#each careerList as val, idx}
                        <div
                            class="flex items-center justify-between bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 animate-slide-in"
                        >
                            <span class="text-sm font-medium text-emerald-700"
                                >{val}</span
                            >
                            <button
                                class="text-emerald-300 hover:text-red-400 transition-colors"
                                on:click={() => careerList.splice(idx, 1)}
                            >
                                <i class="fa fa-minus-circle text-lg"></i>
                            </button>
                        </div>
                    {/each}
                </div>

                <div class="relative">
                    <input
                        type="text"
                        placeholder="예: OO신도시 아파트 분양 팀장 (3년)"
                        class="base-input"
                        bind:value={careerSplit}
                    />
                    <button
                        class="absolute right-2 top-2 w-10 h-10 bg-emerald-500 text-white rounded-xl shadow-md flex justify-center items-center active:scale-90 transition-all"
                        on:click={() => {
                            if (careerSplit) {
                                careerList.push(careerSplit);
                                careerSplit = "";
                            }
                        }}
                    >
                        <i class="fa fa-plus"></i>
                    </button>
                </div>
                <p class="text-[11px] text-gray-400 mt-3 ml-1">
                    경력을 한 줄씩 입력 후 + 버튼을 눌러주세요.
                </p>
            </div>

            <div
                class="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100"
            >
                <h3
                    class="font-bold text-gray-800 flex items-center gap-2 mb-4"
                >
                    <span class="w-1.5 h-4 bg-orange-500 rounded-full"></span> 자기소개
                </h3>
                <textarea
                    class="base-input"
                    rows="6"
                    placeholder="자신의 강점이나 전문 분야를 자유롭게 적어주세요."
                    bind:value={introduction}
                ></textarea>
            </div>
        </div>

        <div class="mt-12 flex flex-col gap-3">
            <button
                class="w-full bg-sky-500 text-white py-5 rounded-2xl font-extrabold text-lg shadow-xl shadow-sky-100 active:scale-95 transition-all"
                on:click={uploadMyTalent}
            >
                내 인재 정보 등록하기 ⚡️
            </button>

            {#if authBool}
                <button
                    class="w-full bg-transparent text-gray-400 py-3 font-medium text-sm underline underline-offset-4 decoration-gray-200"
                    on:click={() => (skipModal = true)}
                >
                    나중에 등록하고 건너뛰기
                </button>
            {/if}
        </div>
    </div>
</div>

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fade-in {
        animation: fadeIn 0.6s ease-out;
    }
    .animate-slide-in {
        animation: fadeIn 0.3s ease-out;
    }

    /* 나타날 때 효과 */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
    }

    /* 아이콘 통 튀어오르는 효과 */
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    .animate-bounce-in {
        animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
    }
</style>
