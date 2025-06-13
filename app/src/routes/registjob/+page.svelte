<script>
    import { goto, beforeNavigate } from "$app/navigation";
    import QuestionItem from "$lib/components/QuestionItem.svelte";
    import SortableImg from "$lib/components/SortableImg.svelte";
    import KakaoMap from "$lib/components/kakaoMap.svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";
    import Toast from "$lib/components/Toast.svelte";
    import { user_info, all_data } from "$lib/stores/stores";
    import { browser } from "$app/environment";
    import { back_api } from "$lib/const";
    import { getCookieValue } from "$lib/lib";
    import axios from "axios";

    let feeBases = $derived(["본부", "팀", "직원", "상담시"]); // 수수료 기준 값
    let businessArr = $state([]);
    let occupationArr = $state([]);

    // 등록 전 결제 및 물어보는거 모달
    let submitPrevModal = $state(false);

    // 모달 내 계산기 관련
    let productInfo = $state({ name: "일반", price: 0 });
    let iconNames = $state([]);
    let icons = $state([]);
    let iconSum = $state(0);

    // 글 작성중 뒤로가기 또는 새로고침시 필요한 변수 (이미지 삭제 관련)
    let escapePageModal = $state(false);
    let delImgList = $state([]);
    let toPage = $state("");
    let blockBack = $state(true); // 뒤로가기시 nav 에 막혀서 안움직일시 임시 변수

    // 토스트 관련 변수
    let toastShow = $state(0);
    let toastMessage = $state("토스트 메세지!!");

    // alert modal 변수!!
    let alertModalShow = $state(false);
    let alertModalMessage = $state("");

    // 상태값 변경 임시변수
    let prevItem = $state("");

    // effct 함수 내에서 무한루프가 되는거 방지! (반복되는 코드 부분 상태값 변경으로 한번만 실행되게 함)
    let loopPrevent = $state(true);

    $all_data["user_id"] = $user_info.idx;

    $effect(async () => {
        console.log("sdfsdfsf");

        console.log($all_data);

        if (!$all_data["user_id"] && loopPrevent) {
            blockBack = false;
            goto("/");
            loopPrevent = false;
        }

        if (!$all_data["product"]) {
            $all_data["product"] = "free";
        }

        /*
        후처리 부분!!!
        (svelte5 에서는 $가 없어진 대신 effect 안에서 전부 처리)
        해당 기준 윗 부분은 페이지 접근시 선처리 부분, 기타 조건 변경시 후처리 부분!
        */

        if ($all_data["product"] != prevItem) {
            prevItem = $all_data["product"];
        }

        const refreshFlag = getCookieValue("del_img_list");

        if (refreshFlag) {
            try {
                const res = await axios.post(`${back_api}/img/delete_many`, {
                    delImgList: refreshFlag.split(","),
                });
            } catch (err) {
                console.error(err.meesage);
            }
            document.cookie = "del_img_list=; Max-Age=0; path=/";
        }

        // 새로고침시 이미지 삭제 등을 표현하기 위해서!!!!
        const handler = (e) => {
            // 삭제할 이미지 리스트 저장
            if (delImgList.length > 0) {
                const delImgListStr = delImgList.join(",");
                document.cookie = `del_img_list=${delImgListStr}; path=/`;
            }
        };
        window.addEventListener("beforeunload", handler);

        beforeNavigate((nav) => {
            const hasData = Object.keys($all_data).some(
                (key) => key !== "user_id",
            );
            if (blockBack && hasData) {
                toPage = nav.to.url.pathname;
                escapePageModal = true;
                nav.cancel();
            }
        });

        return () => {
            window.removeEventListener("beforeunload", handler);
            console.log("페이지 나감?!?!?!");
        };
    });

    const iconList = $derived([
        { name: "조건변경", id: "change" },
        { name: "할인", id: "discount" },
        { name: "수수료UP", id: "feeup" },
        { name: "설거지", id: "guzi" },
        { name: "급구", id: "hurry" },
        { name: "소수인원", id: "minority" },
        { name: "신규", id: "new" },
        { name: "한방", id: "once" },
    ]);

    /*
        아이콘 선택 변경시 함수
        아이콘 선택시 무료 등록이면 전부 해제 & 선택 불가
        프리미엄, 탑 선택시 2개 초과 선택 못하게 +
    */
    function iconsChange() {
        console.log(this.checked);

        if ($all_data["product"] == "free") {
            icons = [];
            this.checked = false;
            toastShow = 1;
            toastMessage = "아이콘 선택은 유료 상품에서만 가능합니다.";
            return;
        }
        if (this.checked && icons.length > 2) {
            this.checked = false;
            toastShow = 1;
            toastMessage = "아이콘 선택은 2개까지만 가능합니다.";
            return;
        }

        const iconsTemp = icons;
        iconNames = icons
            .map((id) => iconList.find((icon) => icon.id === id)?.name)
            .filter((name) => name !== undefined);
        iconSum = icons.length * 2200;

        $all_data["sum"] = productInfo.price + iconSum;
    }

    function itemRateChange() {
        console.log();

        if (this.value == "premium") {
            productInfo.name = "프리미엄";
            productInfo.price = 66000;

            console.log($all_data["sum"]);
        } else if (this.value == "top") {
            productInfo.name = "지역 탑";
            productInfo.price = 49500;
        } else if (this.value == "free") {
            productInfo.name = "일반";
            productInfo.price = 0;
            if (icons && icons.length > 0) {
                icons = [];
                iconNames = [];
                toastShow = 1;
                toastMessage = "아이콘 선택은 유료 상품에서만 가능합니다.";
                iconSum = 0;
            }
        }

        $all_data["sum"] = productInfo.price + iconSum;
    }

    async function goToBackAndArrangeImg() {
        if (delImgList.length > 0) {
            try {
                const res = await axios.post(`${back_api}/img/delete_many`, {
                    delImgList,
                });
            } catch (err) {
                console.error(err.meesage);
            }
        }
        blockBack = false;
        goto(toPage);
    }

    function updateImg(e) {
        // 새로고침 또는 뒤로가기 시에 삭제할 이미지 리스트 정하기
        if (e["type"]) {
            if (e.type == "add") {
                delImgList.push(e.url);
            } else {
                const tempArr = delImgList.filter((item) => item !== e.url);
                delImgList = tempArr;
            }
            console.log(delImgList);
        }

        // 정상적으로 업로드 될 이미지 리스트 셋
        const imgArr = e.imgArr;
        console.log(imgArr);

        let imgStr = "";
        for (let i = 0; i < imgArr.length; i++) {
            const con = imgArr[i];
            imgStr += con.href + ",";
        }
        $all_data["imgs"] = imgStr.slice(0, -1);
    }

    let regions = $derived([
        "서울",
        "경기북부",
        "경기남부",
        "인천",
        "충청",
        "전라",
        "강원도",
        "경상도",
        "제주도",
    ]);

    let businessCategorys = $derived([
        "아파트",
        "오피스텔",
        "도시형생활주택",
        "호텔",
        "레지던스",
        "상가/쇼핑몰",
        "오피스",
        "지식산업센터",
        "토지",
        "빌라",
        "타운하우스",
        "펜션/풀빌라",
        "전원주택",
        "기타",
    ]);

    let jobCategorys = $derived([
        "시행/대행 사무직",
        "분양대행사",
        "본부장",
        "팀장",
        "직원",
        "데스크",
        "TM상담사",
        "알바",
    ]);

    // ---------------------------------------------------

    // 주소 입력 창 영역
    let postWrap = $state();

    // 모달 열고 닫기
    let modalCloseBtn = $state();

    // KakaoMap 컴포넌트에 전달할 변수
    let getAddress = $state();

    function tudeAct(e) {
        $all_data["latitude"] = e.coords.Ma;
        $all_data["longtitude"] = e.coords.La;
    }

    function chkEssentialValue(objArr) {
        for (let i = 0; i < objArr.length; i++) {
            const e = objArr[i];
            if (!$all_data[e.var]) {
                alertModalMessage = `${e.label}(은)는 필수 입력입니다.`;
                alertModalShow = true;
                return false;
            }
            // if (!e.var) {
            //     alert(`${e.label}(은)는 필수 입력입니다.`);
            //     return false;
            // }
        }
        return true;
    }

    function uploadChkRegist(e) {
        $all_data["business"] = businessArr.join(",");
        $all_data["occupation"] = occupationArr.join(",");

        const chkBool = chkEssentialValue([
            { var: "imgs", label: "현장 이미지" },
            { var: "subject", label: "공고 제목(현장명)" },
            { var: "point", label: "현장 한마디" },
            { var: "addr", label: "근무지 주소" },
            { var: "location", label: "지역 선택" },
            { var: "agency", label: "분양대행사명" },
            { var: "name", label: "담당자 성함" },
            { var: "phone", label: "담당자 연락처" },
            { var: "business", label: "업종분류선택" },
            { var: "occupation", label: "직종분류선택" },
            { var: "career", label: "경력 입력" },
            { var: "number_people", label: "인원 입력" },
            { var: "fee_type", label: "수수료 타입" },
            { var: "fee", label: "수수료 입력" },
        ]);

        if (!chkBool) {
            return;
        }
        submitPrevModal = true;
    }

    async function uploadRegist() {
        $all_data["icons"] = icons.join(",");
        try {
            const res = await axios.post(`${back_api}/regist/upload`, {
                allData: $all_data,
            });
            alert("등록이 완료 되었습니다.");
            blockBack = false;
            goto(`/`);
            $all_data = {};
        } catch (err) {
            const m = err.response.data.message;
        }
    }

    function foldDaumPostcode() {
        // iframe을 넣은 element를 안보이게 한다.
        postWrap.style.display = "none";
        modalCloseBtn.click();
    }

    // 다음 주소
    function addressInput() {
        new daum.Postcode({
            oncomplete: function (data) {
                console.log("이곳은 또 몇번째??");

                // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var extraAddr = ""; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === "R") {
                    // 사용자가 도로명 주소를 선택했을 경우
                    $all_data["addr"] = data.roadAddress;
                } else {
                    // 사용자가 지번 주소를 선택했을 경우(J)
                    $all_data["addr"] = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if (data.userSelectedType === "R") {
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if (data.buildingName !== "" && data.apartment === "Y") {
                        extraAddr +=
                            extraAddr !== ""
                                ? ", " + data.buildingName
                                : data.buildingName;
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if (extraAddr !== "") {
                        extraAddr = " (" + extraAddr + ")";
                    }
                    // 조합된 참고항목을 해당 필드에 넣는다.
                    // document.getElementById("sample3_extraAddress").value =
                    //     extraAddr;
                } else {
                    // document.getElementById("sample3_extraAddress").value = "";
                }

                getAddress = $all_data["addr"];
                console.log(regions);
                let selRegionIdx = null;
                for (let i = 0; i < regions.length; i++) {
                    const region = regions[i];
                    const regex = new RegExp(`^${region}`);
                    if ($all_data["addr"].match(regex)) {
                        selRegionIdx = i; // 매치되면 선택된 지역으로 저장
                        $all_data["location"] = regions[selRegionIdx];
                        break; // 매치된 경우 더 이상 순회하지 않음
                    }
                }

                $all_data["res_addr"] =
                    `(${data.zonecode}) ${$all_data["addr"]} ${extraAddr}`;

                console.log($all_data["res_addr"]);

                // detailAddrArea.focus();

                // iframe을 넣은 element를 안보이게 한다.
                // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
                postWrap.style.display = "none";
                modalCloseBtn.click();
            },
            // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
            onresize: function (size) {
                postWrap.style.height = size.height + "px";
            },
            width: "100%",
            height: "100%",
        }).embed(postWrap);

        console.log("1번째인 이곳은 몇번째?");

        // iframe을 넣은 element를 보이게 한다.
        postWrap.style.display = "block";
        my_modal_1.showModal();
    }

    let successPrevModal = $state(false);
</script>

<svelte:head>
    <script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    ></script>

    <script
        type="text/javascript"
        defer
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=72689d54e68abd94260d9284c64d7545&libraries=services&autoload=false`}
    ></script>
</svelte:head>

<!-- <div class=" mt-40">
    <button
        on:click={() => {
            // successPrevModal = true;
            submitPrevModal = true;
        }}
    >
        버튼버튼
    </button>
</div> -->

<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={successPrevModal} closeBtn={false}>
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-5">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div class="mb-5">보자귱!!!!!</div>
        <div class="flex justify-center items-center gap-3">
            <button
                class="btn btn-active w-1/3"
                on:click={() => {
                    alertModalShow = true;
                }}>닫기</button
            >
        </div>
    </div>
</CustomModal>

<Toast
    {toastShow}
    {toastMessage}
    toastAct={() => {
        toastShow = 0;
    }}
></Toast>

<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={alertModalShow} closeBtn={false}>
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-5">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div class="mb-5">
            {alertModalMessage}
        </div>
        <div class="flex justify-center items-center gap-3">
            <button class="btn btn-active w-1/3">닫기</button>
        </div>
    </div>
</CustomModal>

<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={escapePageModal} closeBtn={false}>
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-5">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div class="mb-5">
            페이지에서 벗어날시 등록중인 글은 삭제됩니다. 진행하시겠습니까?
        </div>
        <div class="flex justify-center items-center gap-3">
            <button
                class="btn btn-active btn-info text-white w-1/3"
                on:click={goToBackAndArrangeImg}
            >
                뒤로가기
            </button>
            <button class="btn btn-active w-1/3">취소</button>
        </div>
    </div>
</CustomModal>

<CustomModal bind:visible={submitPrevModal} closeBtn={false}>
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="text-center">
        <div class=" text-green-700 text-3xl mb-2">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>

        <div>
            <div class="mb-5">
                <p class="md:text-lg">첫글 작성자 혜택!</p>
                <p>구인글 최초 1회 프리미엄 무료등록</p>
            </div>

            <label>
                <input
                    type="radio"
                    value="premium"
                    class="hidden peer"
                    bind:group={$all_data["product"]}
                    on:change={itemRateChange}
                />

                <div
                    class="mb-5 border-2 peer-checked:border-blue-500 border-gray-200 p-2 mx-auto rounded-lg"
                >
                    <p class="text-sm md:text-base mb-2">
                        프리미엄 등록 특가
                        <span class="line-through text-gray-500">
                            132,000원
                        </span>
                        ->
                        <span class="font-bold">66,000원</span>
                    </p>
                    <p class="text-xs md:text-sm">
                        시작페이지 / 지역페이지 모든 지면
                    </p>
                    <p class="text-xs md:text-sm">상단 10일 랜덤 노출</p>
                    <p class="text-xs md:text-sm">
                        등록된 내용은 마이페이지에서 수정 가능
                    </p>
                </div>
            </label>

            <label>
                <input
                    type="radio"
                    value="top"
                    class="hidden peer"
                    bind:group={$all_data["product"]}
                    on:change={itemRateChange}
                />

                <div
                    class="mb-5 border-2 peer-checked:border-blue-500 border-gray-200 p-2 mx-auto rounded-lg"
                >
                    <p class="text-sm md:text-base mb-2">
                        지역 탑 등록 특가
                        <span class="line-through text-gray-500">
                            99,000원
                        </span>
                        ->
                        <span class="font-bold">49,500원</span>
                    </p>
                    <p class="text-xs md:text-sm">
                        지역페이지 상단 10일 랜덤 노출
                    </p>
                    <p class="text-xs md:text-sm">
                        등록된 내용은 마이페이지에서 수정 가능
                    </p>
                </div>
            </label>

            <label>
                <input
                    type="radio"
                    value="free"
                    class="hidden peer"
                    bind:group={$all_data["product"]}
                    on:change={itemRateChange}
                />

                <div
                    class="mb-5 border-2 peer-checked:border-blue-500 border-gray-200 p-2 mx-auto rounded-lg"
                >
                    <p class="text-sm md:text-base mb-2">
                        - 바로 등록 (무료 등록)
                    </p>
                    <p class="text-xs md:text-sm">
                        일 2회 무료 등록이 가능합니다.
                    </p>
                </div>
            </label>
        </div>

        <div class="">
            <div class="mb-4">아이콘 선택 (개당 2,200원)</div>
            <div class="grid grid-cols-4 md:gap-x-2 gap-y-2">
                {#each iconList as icon}
                    <label>
                        <input
                            type="checkbox"
                            class="hidden peer"
                            value={icon.id}
                            bind:group={icons}
                            on:change={iconsChange}
                        />
                        <div
                            class="border-2 peer-checked:border-blue-500 border-gray-200 w-5/6 md:w-4/5 p-2 mx-auto rounded-lg"
                        >
                            <img
                                src="/icons/icon-{icon.id}.png"
                                alt=""
                                class="w-full"
                            />
                        </div>
                    </label>
                {/each}
            </div>
        </div>

        <div class="w-2/3 md:w-1/2 ml-auto my-4 text-lg font-semibold">
            <div
                class="flex justify-between items-center mb-2 border-b border-gray-100 text-sm"
            >
                <span class="text-gray-600">{productInfo.name}</span>
                <span class="font-medium">
                    {productInfo.price.toLocaleString()}원
                </span>
            </div>

            {#each iconNames as iconName}
                <div
                    class="flex justify-between items-center mb-2 border-b border-gray-100 text-sm"
                >
                    <span class="text-gray-600">{iconName}</span>
                    <span class="font-medium"> 2,200 원 </span>
                </div>
            {/each}

            <hr class="border-gray-300" />
            <div
                class="flex justify-between items-center py-2 border-b border-gray-100"
            >
                <span class="text-gray-600">합계</span>
                <span class="font-medium">
                    {$all_data["sum"] ? $all_data["sum"].toLocaleString() : 0}원
                </span>
            </div>
        </div>

        <div class="text-right">
            <button
                class="bg-gray-400 text-white px-3 py-1.5"
                on:click={uploadRegist}
            >
                결제 및 등록
            </button>
        </div>
    </div>
</CustomModal>

<!-- svelte-ignore event_directive_deprecated -->
<dialog id="my_modal_1" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">주소를 입력하세요</h3>
        <div
            bind:this={postWrap}
            style="display:none;border:1px solid;width:100%;height:300px;margin:5px 0;position:relative"
        >
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img
                src="//t1.daumcdn.net/postcode/resource/images/close.png"
                id="btnFoldWrap"
                style="cursor:pointer;position:absolute;right:0px;top:-1px;z-index:1"
                on:click={foldDaumPostcode}
                alt="접기 버튼"
            />
        </div>
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn" bind:this={modalCloseBtn}>Close</button>
            </form>
        </div>
    </div>
</dialog>

<!-- 숨겨진 헤더!!!!!!!!!!!!!!!!!!!!!! -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div class="fixed top-0 left-0 w-full z-20 suit-font">
    <div class="max-w-[530px] mx-auto bg-white border-b">
        <div class=" py-1 flex justify-between items-center">
            <div
                class="cursor-pointer"
                style="color: #3da83b;"
                on:click={() => {
                    window.history.back();
                }}
            >
                <i class="fa fa-angle-left text-2xl mr-1" aria-hidden="true"
                ></i>
                <span class="text-sm">뒤로가기</span>
            </div>

            <div class="w-12"></div>
        </div>
    </div>
</div>

<!-- svelte-ignore event_directive_deprecated -->
<div class="bg-white relative min-h-screen">
    <div class="max-w-[530px] mx-auto pretendard pt-12 pb-24">
        <div class="text-center font-semibold text-xl bg-white p-3">
            구인글 등록
        </div>

        <div class="mt-2 bg-white p-5">
            <div class="font-semibold text-lg">이미지 등록 *</div>
            <div class="text-xs">
                이미지는 최대 10장, 슬라이드 형태로 표시됩니다.
            </div>
            <div class="my-3">
                <SortableImg
                    {updateImg}
                    imgModifyList={$all_data["imgs"]
                        ? $all_data["imgs"].split(",")
                        : ""}
                    maxImgCount={10}
                ></SortableImg>
            </div>

            <div class="font-semibold text-lg">공고제목 (현장명)*</div>
            <div class="mt-1.5">
                <input
                    type="text"
                    placeholder="공고 제목(현장명을 입력하세요)(필수)"
                    bind:value={$all_data["subject"]}
                    class="input input-bordered input-info input-sm w-full"
                />
            </div>

            <div class="mt-3 font-semibold text-lg">현장 한마디*</div>
            <div class="mt-1.5">
                <input
                    type="text"
                    class="input input-bordered input-info input-sm w-full"
                    placeholder="현장 한마디를 입력해주세요(필수)"
                    bind:value={$all_data["point"]}
                />
            </div>

            <div class="mt-3 font-semibold text-lg">근무지*</div>

            <div class="mt-1.5 flex w-full items-center gap-1">
                {#if $all_data["res_addr"]}
                    <div
                        class="border w-full py-1.5 px-2 text-sm border-sky-400 rounded-md"
                    >
                        {$all_data["res_addr"]}
                    </div>
                {:else}
                    <div
                        class="border w-full py-1.5 px-2 text-sm border-sky-400 rounded-md text-gray-400"
                    >
                        우측 주소 입력을 클릭해 주소를 입력해주세요
                    </div>
                {/if}

                <button
                    class="btn btn-outline btn-info btn-sm"
                    type="button"
                    on:click={addressInput}
                >
                    <span>주소 입력</span>
                </button>
            </div>

            <!-- <div class="my-2">
                    <input
                        type="text"
                        bind:value={detailAddr}
                        bind:this={detailAddrArea}
                        placeholder="상세 주소를 입력하세요"
                        class="border w-full py-1.5 px-2 text-sm border-sky-400 rounded-md focus:outline-none focus:border-2"
                    />
                </div> -->

            {#if getAddress}
                <div
                    class="mt-2 h-72 border w-full text-sm border-sky-400 rounded-md overflow-hidden"
                >
                    <KakaoMap
                        {getAddress}
                        phText="근무지"
                        height="300px"
                        {tudeAct}
                    />
                </div>
            {:else}
                <div
                    class="mt-2 h-24 border border-sky-400 rounded-md flex justify-center items-center bg-gray-200"
                >
                    <div class="">주소를 입력하면 지도가 표시됩니다.</div>
                </div>
            {/if}

            <div class="mt-5">
                <div class="mt-3 font-semibold text-lg">지역선택*</div>
                <div class="mt-3 grid grid-cols-2 gap-1">
                    {#each regions as region, idx}
                        <label class="button-checkbox">
                            <input
                                type="radio"
                                hidden
                                value={region}
                                bind:group={$all_data["location"]}
                            />
                            <div>{region}</div>
                        </label>
                    {/each}
                </div>
            </div>
        </div>

        <div class="mt-2 bg-white p-5">
            <div class="font-semibold text-lg">기본정보</div>

            <QuestionItem
                sbj="분양대행사 *"
                placeholder="필수입력"
                bind:iptVal={$all_data["agency"]}
            />
            <QuestionItem
                sbj="담당자 성함 *"
                placeholder="필수입력"
                bind:iptVal={$all_data["name"]}
            />

            <QuestionItem
                sbj="담당자 연락처 *"
                placeholder="필수입력"
                bind:iptVal={$all_data["phone"]}
            />

            <div class="mt-5">
                <div class="pl-3 text-left text-sm">
                    <span>업종분류 *</span>
                    <span class="text-xs">(여러개 선택 가능)</span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-1">
                    {#each businessCategorys as businessCategory, idx}
                        <label class="button-checkbox">
                            <input
                                type="checkbox"
                                value={businessCategory}
                                bind:group={businessArr}
                                hidden
                            />
                            <div>{businessCategory}</div>
                        </label>
                    {/each}
                </div>
            </div>

            <div class="mt-5">
                <div class="pl-3 text-left text-sm">
                    <span>직종분류 *</span>
                    <span class="text-xs">(여러개 선택 가능)</span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-1">
                    {#each jobCategorys as jobCategory, idx}
                        <label class="button-checkbox">
                            <input
                                type="checkbox"
                                value={jobCategory}
                                bind:group={occupationArr}
                                hidden
                            />
                            <div>{jobCategory}</div>
                        </label>
                    {/each}
                </div>
            </div>

            <QuestionItem
                sbj="경력 *"
                placeholder="ex) 10년 / 초보"
                bind:iptVal={$all_data["career"]}
            />

            <QuestionItem
                sbj="인원 *"
                placeholder="ex) 2명 / 00명"
                bind:iptVal={$all_data["number_people"]}
            />
        </div>

        <div class="mt-2 bg-white p-5">
            <div class="font-semibold text-lg">급여 및 영업지원</div>

            <div class="mt-2">
                <div class="flex w-full items-center">
                    <div class="w-1/5 text-center text-sm">수수료 *</div>
                    <div class="w-4/5 flex gap-1">
                        {#each feeBases as feeBase}
                            <label class="button-checkbox w-full">
                                <input
                                    type="radio"
                                    value={feeBase}
                                    hidden
                                    bind:group={$all_data["fee_type"]}
                                />
                                <div class="">{feeBase}</div>
                            </label>
                        {/each}
                    </div>
                </div>

                <div class="flex justify-end items-center gap-3 mt-2">
                    <div class="w-4/5 flex items-center gap-3">
                        <input
                            type="text"
                            bind:value={$all_data["fee"]}
                            placeholder="숫자만 입력해주세요"
                            class="input input-bordered input-info input-sm w-full"
                        />
                        <div class=" w-12">만 원</div>
                    </div>
                </div>

                <div class="text-xs text-right mt-1 text-green-700">
                    <p>
                        수수료는 구인글 메인에 노출됩니다. 정확하게 입력해주시면
                    </p>
                    <p>더 많은 사람들이 회원님의 공고를 확인하게 됩니다.</p>
                </div>
            </div>
            <QuestionItem
                sbj="일비"
                placeholder="있을 경우만 입력 (ex, 월 100만원 / 일 3만원)"
                bind:iptVal={$all_data["daily_expense"]}
            />

            <QuestionItem
                sbj="숙소비"
                placeholder="있을 경우만 입력 (ex, 원룸 제공)"
                bind:iptVal={$all_data["sleep_expense"]}
            />

            <QuestionItem
                sbj="프로모션"
                placeholder="있을 경우만 입력 (ex, 5채 판매시 추가 100만)"
                bind:iptVal={$all_data["promotion"]}
            />

            <QuestionItem
                sbj="기본급여"
                placeholder="있을 경우만 입력 (ex, 기본급 200만)"
                bind:iptVal={$all_data["base_pay"]}
            />
        </div>

        <div class="mt-2 bg-white p-5">
            <div class="font-semibold text-lg">상세내용</div>
            <div class="mt-1.5">
                <textarea
                    class="textarea textarea-info w-full p-2"
                    placeholder="현장에 대한 상세 내용을 입력해주세요"
                    rows="5"
                    bind:value={$all_data["detail_content"]}
                ></textarea>
            </div>

            <div class="mt-1.5">
                <button
                    class="btn btn-success w-full text-white"
                    on:click={uploadChkRegist}
                >
                    등록하기
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .button-checkbox div {
        display: block;
        background-color: #f0f0f0;
        color: #333;
        font-size: 14px;
        border: 1.5px solid #ccc;
        border-radius: 5px;
        padding: 8px 0;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
    }

    .button-checkbox input[type="checkbox"]:checked + div {
        background-color: #08b9ff;
        color: white;
        border-color: #0099ff;
    }

    .button-checkbox input[type="radio"]:checked + div {
        background-color: #08b9ff;
        color: white;
        border-color: #0099ff;
    }
</style>
