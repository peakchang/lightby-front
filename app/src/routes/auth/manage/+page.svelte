<script>
    import PageHeader from "$lib/components/PageHeader.svelte";

    function changeProfile() {
        console.log("as;ldfjalsidjf");
    }
</script>

<PageHeader></PageHeader>

<div class="bg-white relative min-h-screen">
    <div class="max-w-[530px] mx-auto pretendard pt-14 pb-24">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <div class="wrapper">
            <div class="w-20 h-20 relative mx-auto">
                <button
                    class="absolute bottom-[-10px] right-[-10px] w-7 h-7 border-2 rounded-full bg-white text-xs text-gray-500"
                    on:click={changeProfile}
                >
                    <i class="fa fa-camera" aria-hidden="true"></i>
                </button>
                <div
                    class="border-2 border-gray-300 rounded-xl overflow-hidden"
                >
                    <img src="/profile-base.png" alt="" />
                </div>
            </div>

            <div class="mt-4 text-xs text-center">프로필 이미지 변경</div>

            <div class="w-[60%] mx-auto mt-5">
                <div class="pb-4.5 mb-4.5 border-b border-gray-200">
                    <div class="text-sm text-gray-500 mb-1.5">- 아이디</div>
                    <!-- <div class="ml-3">changyong112</div> -->
                    <div class="ml-3 flex justify-start items-center">
                        <span>SNS 로그인</span>
                        <span
                            class="text-xs px-2.5 py-0.5 bg-yellow-400 ml-5 rounded-md"
                        >
                            <i class="fa fa-comment" aria-hidden="true"></i>
                            KAKAO
                        </span>
                    </div>
                </div>

                <div class="pb-4.5 mb-4.5 border-b border-gray-200">
                    <div class="text-sm text-gray-500 mb-1.5">- 이름</div>
                    <div class="ml-3">박창용</div>
                </div>

                <div class="pb-4.5 mb-4.5 border-b border-gray-200">
                    <div class="text-sm text-gray-500">- 닉네임</div>
                    <div class="ml-3 flex justify-between items-center">
                        <span class="mt-1">나야나얌</span>
                        <button class="btn btn-success btn-sm text-white">
                            변경하기
                        </button>
                    </div>
                </div>

                <div class="pb-4.5 mb-4.5 border-b border-gray-200">
                    <div class="text-sm text-gray-500">- 휴대폰</div>
                    <div class="ml-3 flex justify-between items-center">
                        <span class="mt-1">010-2190-2197</span>
                        <button class="btn btn-success btn-sm text-white">
                            변경하기
                        </button>
                    </div>
                </div>

                <div class="pb-4.5 mb-4.5 border-b border-gray-200">
                    <div class="text-sm text-gray-500">- 비밀번호</div>
                    <div class="ml-3 flex justify-between items-center">
                        <span class="mt-1">***********</span>
                        <button class="btn btn-success btn-sm text-white">
                            변경하기
                        </button>
                    </div>
                </div>
            </div>

            <div class=" text-center">
                <button class="btn btn-info w-[50%] text-white">
                    변경하기
                </button>
            </div>
        </div>
    </div>
</div>
