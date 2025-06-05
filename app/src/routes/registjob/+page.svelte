<script>
    import { goto, beforeNavigate } from "$app/navigation";
    import QuestionItem from "$lib/components/QuestionItem.svelte";
    import SortableImg from "$lib/components/SortableImg.svelte";
    import KakaoMap from "$lib/components/kakaoMap.svelte";

    import { user_info } from "$lib/stores/stores";
    import { browser } from "$app/environment";
    import { back_api } from "$lib/const";
    import { getCookieValue } from "$lib/lib";
    import axios from "axios";

    let allData = $state({});

    let feeBases = $derived(["본부", "팀", "직원", "상담시"]);
    let businessArr = $state([]);
    let occupationArr = $state([]);

    // if (!$user_info.idx) {
    //     goto('/')
    // }

    $effect(() => {
        // allData["user_id"] = $user_info.idx;
        allData["user_id"] = "12";

        const refreshFlag = getCookieValue("refresh_flag");

        if (refreshFlag) {
            console.log(refreshFlag);
            console.log("쿠키가 있어!!!!");
            document.cookie = "refresh_flag=; Max-Age=0; path=/";
        }

        // 새로고침시 이미지 삭제 등을 표현하기 위해서!!!!
        const handler = (e) => {
            // 삭제할 이미지 리스트 저장
            document.cookie = `refresh_flag=asdlkjgasdjfgj349fj3490jf034jf; path=/`;
        };
        window.addEventListener("beforeunload", handler);

        // beforeNavigate((nav) => {
        //     // console.log(imgs);

        //     console.log(nav);
        //     console.log(nav.from.url);
        //     console.log(nav.to.url);
        //     // 빠져나가는거 멈추기
        //     nav.cancel();
        // });

        // return () => {
        //     window.removeEventListener("beforeunload", handler);
        //     console.log("페이지 나감?!?!?!");
        // };
    });

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
        "도시형생활주택(도생)",
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

    function chkEssentialValue(objArr) {
        for (let i = 0; i < objArr.length; i++) {
            const e = objArr[i];
            if (!allData[e.var]) {
                alert(`${e.label}(은)는 필수 입력입니다.`);
                return false;
            }
            // if (!e.var) {
            //     alert(`${e.label}(은)는 필수 입력입니다.`);
            //     return false;
            // }
        }
        return true;
    }

    async function uploadRegist(e) {
        e.preventDefault();

        allData["business"] = businessArr.join(",");
        allData["occupation"] = occupationArr.join(",");

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

        console.log(chkBool);
        console.log(allData);

        if (!chkBool) {
            return;
        }

        try {
            const res = await axios.post(`${back_api}/regist/upload`, {
                allData,
            });
            alert("등록이 완료 되었습니다.");
            goto(`/`);
        } catch (err) {
            const m = err.response.data.message;
        }

        // try {
        //     const res = await axios.post(`${back_api}/regist/upload`, {

        //     });

        //     console.log(res);

        //     if (res.status == 200) {
        //         alert("등록이 완료 되었습니다.");
        //         goto(`/`);
        //     } else {
        //         alert("에러가 발생했습니다. 다시 시도해주세요.");
        //     }
        // } catch (err) {
        //     console.error(err.message);
        // }

        // console.log();
    }

    function updateImg(e) {
        const imgArr = e.imgArr;
        let imgStr = "";
        for (let i = 0; i < imgArr.length; i++) {
            const con = imgArr[i];
            imgStr += con.href + ",";
        }
        allData["imgs"] = imgStr.slice(0, -1);
    }

    function foldDaumPostcode() {
        // iframe을 넣은 element를 안보이게 한다.
        postWrap.style.display = "none";
        modalCloseBtn.click();
    }

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
                    allData["addr"] = data.roadAddress;
                } else {
                    // 사용자가 지번 주소를 선택했을 경우(J)
                    allData["addr"] = data.jibunAddress;
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

                getAddress = allData["addr"];
                console.log(regions);
                let selRegionIdx = null;
                for (let i = 0; i < regions.length; i++) {
                    const region = regions[i];
                    const regex = new RegExp(`^${region}`);
                    if (allData["addr"].match(regex)) {
                        selRegionIdx = i; // 매치되면 선택된 지역으로 저장
                        allData["location"] = regions[selRegionIdx];
                        break; // 매치된 경우 더 이상 순회하지 않음
                    }
                }

                allData["res_addr"] =
                    `(${data.zonecode}) ${allData["addr"]} ${extraAddr}`;

                console.log(allData["res_addr"]);

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

<dialog id="my_modal_1" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">주소를 입력하세요</h3>
        <div
            bind:this={postWrap}
            style="display:none;border:1px solid;width:100%;height:300px;margin:5px 0;position:relative"
        >
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <!-- svelte-ignore event_directive_deprecated -->
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
<div class="fixed top-0 left-0 w-full z-50 suit-font">
    <div class="max-w-[530px] mx-auto bg-white border-b">
        <div class=" py-1 flex justify-between items-center">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore event_directive_deprecated -->
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

<div class="bg-white relative min-h-screen">
    <div class="max-w-[530px] mx-auto pretendard pt-12 pb-24">
        <div class="text-center font-semibold text-xl bg-white p-3">
            구인글 등록
        </div>

        <!-- svelte-ignore event_directive_deprecated -->
        <form on:submit={uploadRegist}>
            <div class="mt-2 bg-white p-5">
                <div class="font-semibold text-lg">이미지 등록 *</div>
                <div class="text-xs">
                    이미지는 최대 10장, 슬라이드 형태로 표시됩니다.
                </div>
                <div class="my-3">
                    <SortableImg {updateImg} maxImgCount={10}></SortableImg>
                </div>

                <div class="font-semibold text-lg">공고제목 (현장명)*</div>
                <div class="mt-1.5">
                    <input
                        type="text"
                        placeholder="공고 제목(현장명을 입력하세요)(필수)"
                        bind:value={allData["subject"]}
                        class="input input-bordered input-info input-sm w-full"
                    />
                </div>

                <div class="mt-3 font-semibold text-lg">현장 한마디*</div>
                <div class="mt-1.5">
                    <input
                        type="text"
                        class="input input-bordered input-info input-sm w-full"
                        placeholder="현장 한마디를 입력해주세요(필수)"
                        bind:value={allData["point"]}
                    />
                </div>

                <div class="mt-3 font-semibold text-lg">근무지*</div>

                <div class="mt-1.5 flex w-full items-center gap-1">
                    {#if allData["res_addr"]}
                        <div
                            class="border w-full py-1.5 px-2 text-sm border-sky-400 rounded-md"
                        >
                            {allData["res_addr"]}
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
                        <KakaoMap {getAddress} phText="근무지" height="300px" />
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
                                    bind:group={allData["location"]}
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
                    bind:iptVal={allData["agency"]}
                />
                <QuestionItem
                    sbj="담당자 성함 *"
                    placeholder="필수입력"
                    bind:iptVal={allData["name"]}
                />

                <QuestionItem
                    sbj="담당자 연락처 *"
                    placeholder="필수입력"
                    bind:iptVal={allData["phone"]}
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
                    bind:iptVal={allData["career"]}
                />

                <QuestionItem
                    sbj="인원 *"
                    placeholder="ex) 2명 / 00명"
                    bind:iptVal={allData["number_people"]}
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
                                        bind:group={allData["fee_type"]}
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
                                bind:value={allData["fee"]}
                                placeholder="숫자만 입력해주세요"
                                class="input input-bordered input-info input-sm w-full"
                            />
                            <div class=" w-12">만 원</div>
                        </div>
                    </div>

                    <div class="text-xs text-right mt-1 text-green-700">
                        <p>
                            수수료는 구인글 메인에 노출됩니다. 정확하게
                            입력해주시면
                        </p>
                        <p>더 많은 사람들이 회원님의 공고를 확인하게 됩니다.</p>
                    </div>
                </div>
                <QuestionItem
                    sbj="일비"
                    placeholder="있을 경우만 입력 (ex, 월 100만원 / 일 3만원)"
                    bind:iptVal={allData["daily_expense"]}
                />

                <QuestionItem
                    sbj="숙소비"
                    placeholder="있을 경우만 입력 (ex, 원룸 제공)"
                    bind:iptVal={allData["sleep_expense"]}
                />

                <QuestionItem
                    sbj="프로모션"
                    placeholder="있을 경우만 입력 (ex, 5채 판매시 추가 100만)"
                    bind:iptVal={allData["promotion"]}
                />

                <QuestionItem
                    sbj="기본급여"
                    placeholder="있을 경우만 입력 (ex, 5채 판매시 추가 100만)"
                    bind:iptVal={allData["base_pay"]}
                />
            </div>

            <div class="mt-2 bg-white p-5">
                <div class="font-semibold text-lg">상세내용</div>
                <div class="mt-1.5">
                    <textarea
                        class="textarea textarea-info w-full p-2"
                        placeholder="Bio"
                        rows="5"
                        bind:value={allData["detail_content"]}
                    ></textarea>
                </div>

                <div class="mt-1.5">
                    <button
                        class="btn btn-success w-full text-white"
                        value="upload"
                    >
                        등록하기
                    </button>
                </div>
            </div>
        </form>
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
