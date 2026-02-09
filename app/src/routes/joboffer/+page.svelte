<script>
    import axios from "axios";
    import Cookies from "js-cookie";
    import moment from "moment-timezone";

    import PageHeader from "$lib/components/PageHeader.svelte";
    import QuestionItem from "$lib/components/QuestionItem.svelte";
    import SortableImg from "$lib/components/SortableImg.svelte";
    import KakaoMap from "$lib/components/kakaoMap_pre.svelte";
    import CustomModal from "$lib/components/CustomModal.svelte";

    import { onDestroy, onMount, tick } from "svelte";
    import { goto, beforeNavigate } from "$app/navigation";
    import { browser } from "$app/environment";

    import { formatPhoneNum, removeSpecialCharactersAndSpaces } from "$lib/lib";

    import { feeBases, iconList } from "./jopoffer";
    import {
        user_info,
        all_data,
        paymentActRegistered,
        loadingStore,
        prev,
        toastStore,
        pageScrollStatus,
    } from "$lib/stores/stores";

    import {
        back_api,
        regions,
        businessCategorys,
        jobCategorys,
    } from "$lib/const";

    let { data } = $props();

    let businessArr = $state([]); // 업종분류 변수 담을 임시 배열
    let occupationArr = $state([]); // 직종분류 변수 담을 임시 배열
    let imgModifyList = $state("");

    // 로그인 체크 모달
    let notLoginChkModal = $state(false);

    // 이전 게시물 열어보기 모달
    let prevPostListModal = $state(false);
    let prevPostList = $state([]);
    let prevPostChkModal = $state(false);
    let setPrevPostIdx = $state(0); // 이전 게시물 불러오는데 만약 입력된 값들이 있을 경우 대비해서 아이디 값만 저장!

    // 등록 전 결제 및 물어보는거 모달
    let submitPrevModal = $state(false); // 모달 변수
    let paymentStatus = $state(false); // 업로드시에 결제 완료 여부 체크 변수!! (true 면 상품 등록 진행, free 는 임의로 true로, 기타 유료는 결제 완료시 true로 변경)
    let popup = $state();
    let popupCheckInterval = $state(); // 팝업이 닫혔을때 감지!!

    // 모달 내 계산기 관련
    let productInfo = $state({ name: "일반", price: 0 }); // 상품 정보가 담김!
    let iconNames = $state([]); // 아이콘 이름이 한글로 담김!
    let icons = $state([]); // 아이콘 이름이 영어로 담김!
    let iconSum = $state(0); // 아이콘 갯수에 따른 가격 합계
    let iconsShow = $state(false);

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

    // 최종 업로드 체크체크
    let successPrevModal = $state(false);
    let successPrevModalMessage = $state("");

    // 첫 글 무료 셋팅 변수!
    let freebies = $state(true);

    const chkBoolList = [
        // { var: "imgs", label: "현장 이미지" },
        { var: "subject", label: "공고 제목(현장명)" },
        { var: "point", label: "현장 한마디" },
        { var: "res_addr", label: "근무지 주소" },
        { var: "location", label: "지역 선택" },
        { var: "agency", label: "분양대행사명" },
        { var: "name", label: "담당자 성함" },
        { var: "phone", label: "담당자 연락처" },
        { var: "business", label: "업종분류선택" },
        { var: "occupation", label: "직종분류선택" },
        // { var: "career", label: "경력 입력" },
        // { var: "number_people", label: "인원 입력" },
        { var: "fee_type", label: "수수료 타입" },
        { var: "fee", label: "수수료 입력" },
    ];

    // 시작 셋팅
    onMount(async () => {
        $pageScrollStatus = false; // 페이지 시작시 최상위

        await tick();

        if (data.modifyIdx) {
            $all_data = data.modifyContent;
        } else {
            if (data.userInfo) {
                $all_data["name"] = formatPhoneNum(data.userInfo.name);
                $all_data["phone"] = formatPhoneNum(data.userInfo.phone);
                freebies = data.userInfo.freebies;
                console.log(`freebies : ${freebies}`);
            }
        }

        // 삭제할 이미지 있으면 쿠키에서 값 가져와서 삭제하기! (글쓰는 페이지 적용!!)
        const refreshFlag = Cookies.get("del_img_list");
        if (refreshFlag) {
            try {
                const res = await axios.post(`${back_api}/img/delete_many`, {
                    delImgList: refreshFlag.split(","),
                });
                Cookies.remove("del_img_list");
            } catch (err) {
                Cookies.remove("del_img_list");
                console.error(err);
            }
        }

        $all_data["user_id"] = $user_info.idx;

        if (!$all_data["user_id"] && loopPrevent) {
            // 유저 정보 없을경우 뒤로 돌아가기
            blockBack = false;
            window.history.back();
            loopPrevent = false;
            return;
        }

        if ($all_data["product"] != "free") {
            if ($all_data["product"] == "premium") {
                productInfo.name = "프리미엄";
                productInfo.price = 66000;
            } else if ($all_data["product"] == "top") {
                productInfo.name = "지역 탑";
                productInfo.price = 49500;
            }
        }

        if ($all_data["icons"]) {
            icons = $all_data["icons"].split(",");
            iconNames = icons
                .map((id) => iconList.find((icon) => icon.id === id)?.name)
                .filter((name) => name !== undefined);
        }

        // 주소 있을경우 주소값 입력하기 (카카오 맵 적용)
        if ($all_data["res_addr"]) {
            getAddress = $all_data["res_addr"];
        }

        // 업종분류 값 있을경우 businessArr 에 값 넣기
        if ($all_data["business"]) {
            businessArr = $all_data["business"].split(",");
        }

        // 직종분류 값 있을경우 occupationArr 에 값 넣기
        if ($all_data["occupation"]) {
            occupationArr = $all_data["occupation"].split(",");
        }
    });

    // 페이지 나갈때 버리거나 셋팅
    onDestroy(() => {});

    // 페이지 값 변경시 체크 사항
    beforeNavigate((nav) => {
        let hasData = false;
        if (delImgList && delImgList.length > 0) {
            hasData = true;
        }

        hasData = chkBoolList.some((item) => $all_data[item.var]);

        if (blockBack && hasData) {
            toPage = nav.to.url.pathname;
            escapePageModal = true;
            nav.cancel();
        }
    });

    // 변화 감지
    $effect(() => {
        // 모종의 이유로 모달이 닫힐때
        if (!$user_info.idx) {
            notLoginChkModal = true;
        } else if (!$user_info.idx && notLoginChkModal == false) {
            goto("/");
        }
        // delImgList 에 리스트 담기!! (글쓰는 페이지!)

        if (delImgList.length > 0) {
            const delImgListStr = delImgList.join(",");
            Cookies.set("del_img_list", delImgListStr, {
                path: "/joboffer",
                expires: 7,
                sameSite: "Lax",
            });
        } else {
            Cookies.remove("del_img_list", { path: "/" });
        }
    });

    function handleFeeInput(event) {
        let value = event.target.value;
        let numVal = value.replace(/[^0-9]/g, "");
        let commaVal = numVal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $all_data["fee"] = commaVal;
    }

    async function useChkPrevPost() {
        setPrevPostIdx = this.dataset.idx;
        const hasData = chkBoolList.some((item) => $all_data[item.var]);
        if (hasData) {
            prevPostChkModal = true;
        } else {
            usePrevPost();
        }
        prevPostListModal = false;
    }

    async function usePrevPost() {
        if (delImgList && delImgList.length > 0) {
            try {
                const res = await axios.post(`${back_api}/img/delete_many`, {
                    delImgList,
                });
            } catch (err) {
                console.error(err);
            }
        }

        try {
            const res = await axios.post(`${back_api}/regist/load_prev_post`, {
                postIdx: setPrevPostIdx,
            });
            $all_data = res.data.prevPost;
            imgModifyList = $all_data["imgs"];

            $all_data["product"] = "free";
            $all_data["icons"] = "";

            $all_data["phone"] = formatPhoneNum($all_data["phone"]);
            getAddress = $all_data["addr"];
            delete $all_data.created_at;
            delete $all_data.updated_at;
            delete $all_data.sum;
            delete $all_data.idx;

            delete $all_data.ad_end_date;
            delete $all_data.ad_start_date;
            delete $all_data.icons;

            businessArr = $all_data["business"].split(",");
            occupationArr = $all_data["occupation"].split(",");
        } catch (error) {}
    }

    // '이전 등록한 공고 불러오기' 버튼 클릭하면, 모달 열면서 기존 공고 불러오기
    async function loadPreviousPostList() {
        try {
            const res = await axios.post(`${back_api}/regist/load_prev_list`, {
                user_idx: $user_info.idx,
            });

            prevPostList = res.data.prevPostList;
            prevPostListModal = true;
        } catch (error) {}
    }

    // 결제 성공시 action! on:message 에 등록~
    async function paymentSuccess(e) {
        if (e.data.status) {
            $loadingStore = false;
            $all_data["payment_key"] = e.data.paymentInfo.payment_key;
            $all_data["order_id"] = e.data.paymentInfo.order_id;
            const today = moment().format("YYYY-MM-DD");
            const tenDaysLater = moment().add(10, "days").format("YYYY-MM-DD");
            $all_data["ad_start_date"] = today;
            $all_data["ad_end_date"] = tenDaysLater;
            paymentStatus = true;

            try {
                const res = await axios.post(`${back_api}/regist/upload`, {
                    allData: $all_data,
                });
                blockBack = false;
                successPrevModal = true;
                successPrevModalMessage = "업로드가 완료 되었습니다.";
                setTimeout(() => {
                    successPrevModal = false;
                    $all_data = {};
                    goto("/");
                }, 3500);
            } catch (err) {
                // 결제가 에러 나는 경우 결제 취소 해주자!!!

                popup = undefined;

                alertModalShow = true;
                alertModalMessage = "결제에러! 다시 시도해주세요!";

                const m = err.response.data.message;
                console.error(`에러남!!!!`);
            }
        }
    }

    // 상품 업로드 함수!!!
    async function uploadRegist() {
        if (icons.length > 1) {
            icons = icons.slice(0, 1);
        }

        $all_data["icons"] = icons.join(",");
        $all_data["phone"] = removeSpecialCharactersAndSpaces(
            $all_data["phone"],
        );

        $all_data["fee"] = removeSpecialCharactersAndSpaces($all_data["fee"]);

        // 첫글 무료시!! freebies 가 true 면 값 지정을 해준다! false 면 유료로 등록 해야함!!!
        if (freebies) {
            paymentStatus = true;
            if ($all_data["product"] == "premium") {
                const today = moment().format("YYYY-MM-DD");
                const tenDaysLater = moment()
                    .add(10, "days")
                    .format("YYYY-MM-DD");
                $all_data["ad_start_date"] = today;
                $all_data["ad_end_date"] = tenDaysLater;
            }
        }

        console.log(paymentStatus);
        console.log($all_data["product"]);
        console.log($user_info);

        // 유료 상품이면 팝업 열고 리턴 처리!!

        // 등급이 서브관리자 (3 이상) 이상이면 패스, 이하면 들어와서 체크
        if (!$user_info.rate || Number($user_info.rate) < 3) {
            if ($all_data["product"] != "free" && paymentStatus == false) {
                const payProductName = `${productInfo.name} + 아이콘${iconNames.length}`;
                popup = window.open(
                    `/payments?user_id=${$user_info.idx}&order_name=${payProductName}&amount=${$all_data["sum"]}`,
                    "popup",
                    "width=550,height=670",
                );

                popupCheckInterval = setInterval(() => {
                    if (popup && popup.closed) {
                        clearInterval(popupCheckInterval);
                        popupCheckInterval = null;

                        if (!paymentStatus) {
                            $loadingStore = false;
                            alertModalShow = true;
                            alertModalMessage =
                                "결제가 취소되었습니다. 다시 시도해주세요.";
                            popup = null;
                        }

                        // 여기에 닫힌 후 실행할 코드 추가
                    }
                }, 500); // 0.5초마다 감지

                $loadingStore = true;
                return;
            }
        }

        // const allData = $all_data
        // allData['amount'] = $all_data["sum"]

        if (Number($user_info.rate) >= 3) {
            // 레벨이 3(서브관리자) 이상이면 광고 기간 등록 해주기!
            const today = moment().format("YYYY-MM-DD");
            const tenDaysLater = moment().add(10, "days").format("YYYY-MM-DD");
            $all_data["ad_start_date"] = today;
            $all_data["ad_end_date"] = tenDaysLater;
        }

        // 상품 업로드!!
        try {
            const res = await axios.post(`${back_api}/regist/upload`, {
                allData: $all_data,
                freebies,
            });
            blockBack = false;
            successPrevModal = true;
            successPrevModalMessage = "업로드가 완료 되었습니다.";
            setTimeout(() => {
                successPrevModal = false;
                $all_data = {};
                goto("/");
            }, 2500);
        } catch (err) {
            const m = err.response.data.message;
            console.error(`에러남!!!!`);
        }
    }

    // 상품 업데이트 (수정) 함수!!!
    async function updateRegist() {
        $all_data["business"] = businessArr.join(",");
        $all_data["occupation"] = occupationArr.join(",");

        // 먼저 값들 다 제대로 들어갔는지 체크!
        const chkBool = chkEssentialValue(chkBoolList);
        if (!chkBool) {
            return;
        }

        try {
            const res = await axios.post(`${back_api}/regist/update`, {
                allData: $all_data,
            });
        } catch (error) {}

        blockBack = false;
        successPrevModal = true;
        successPrevModalMessage = "업데이트가 완료 되었습니다.";

        setTimeout(() => {
            successPrevModal = false;
            $all_data = {};

            if ($prev) {
                goto($prev);
            } else {
                goto("/manage_board");
            }
        }, 2500);
    }

    // 최종 업로드 (결제 및 아이콘 선택하는 모달) 모달 열기! / 결제 창 떠있는지도
    function uploadChkRegist(e) {
        if (popup) {
            alertModalShow = true;
            alertModalMessage = "현재 결제창이 열려 있습니다.";
            return;
        }

        $all_data["business"] = businessArr.join(",");
        $all_data["occupation"] = occupationArr.join(",");

        const chkBool = chkEssentialValue(chkBoolList);

        if (!chkBool) {
            return;
        }

        // 상품 값 없을경우 기본값 free // 먄약 첫 글일 경우 premium
        if (freebies) {
            $all_data["product"] = "premium";
            $all_data["sum"] = 66000;

            productInfo.name = "프리미엄";
            productInfo.price = 66000;
            iconsShow = true;
        } else if (!$all_data["product"]) {
            $all_data["product"] = "free";
        }

        submitPrevModal = true;
    }

    // uploadChkRegist 함수 실행 시 필수 항목 체크하는 함수!
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

    // 추가 함수!!!!!!!!!!!!!

    /*
        아이콘 선택 변경시 함수
        아이콘 선택시 무료 등록이면 전부 해제 & 선택 불가
        프리미엄, 탑 선택시 2개 초과 선택 못하게 +
    */
    function iconsChange() {
        if ($all_data["product"] == "free") {
            icons = [];
            this.checked = false;
            toastStore.set({
                show: true,
                message: "아이콘 선택은 유료 상품에서만 가능합니다.",
                color: "#3DB7CC",
            });
            return;
        }
        if (this.checked && icons.length > 1) {
            this.checked = false;

            toastStore.set({
                show: true,
                message: "아이콘 선택은 1개만 가능합니다.",
                color: "#3DB7CC",
            });
            return;
        }

        const iconsTemp = icons;
        iconNames = icons
            .map((id) => iconList.find((icon) => icon.id === id)?.name)
            .filter((name) => name !== undefined);
        iconSum = icons.length * 2200;

        $all_data["sum"] = productInfo.price + iconSum;
    }

    // 상품 변경시 처리 함수
    function itemRateChange() {
        if (this.value == "premium") {
            productInfo.name = "프리미엄";
            productInfo.price = 66000;
            iconsShow = true;
        } else if (this.value == "top") {
            productInfo.name = "지역 탑";
            productInfo.price = 49500;
            iconsShow = true;
        } else if (this.value == "free") {
            productInfo.name = "일반";
            productInfo.price = 0;
            iconsShow = false;
            if (icons && icons.length > 0) {
                icons = [];
                iconNames = [];

                toastStore.set({
                    show: true,
                    message: "아이콘 선택은 유료 상품에서만 가능합니다.",
                    color: "#3DB7CC",
                });
                iconSum = 0;
            }
        }

        $all_data["sum"] = productInfo.price + iconSum;
    }

    // 페이지 벗어나기(뒤로가기) 하면 나오는 모달에서 뒤로가기 승낙 했을때 뜨는 창!!
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
        $all_data = {};
        goto(toPage);
    }

    // SoartImg 컴포넌트 에서 이미지 업로드 후 처리 함수!
    function updateImg(e) {
        // 새로고침 또는 뒤로가기 시에 삭제할 이미지 리스트 정하기
        if (e["type"]) {
            if (e.type == "add") {
                delImgList.push(e.url);
            } else {
                const tempArr = delImgList.filter((item) => item !== e.url);
                delImgList = tempArr;
            }
        }

        // 정상적으로 업로드 될 이미지 리스트 셋
        const imgArr = e.imgArr;

        let imgStr = "";
        for (let i = 0; i < imgArr.length; i++) {
            const con = imgArr[i];
            imgStr += con.href + ",";
        }
        $all_data["imgs"] = imgStr.slice(0, -1);
    }

    // 주소 영역

    // ---------------------------------------------------

    // 주소 입력 창 영역
    let postWrap = $state();

    // 모달 열고 닫기
    let modalCloseBtn = $state();

    // KakaoMap 컴포넌트에 전달할 변수
    let getAddress = $state("");

    function tudeAct(e) {
        $all_data["latitude"] = e.coords.Ma;
        $all_data["longtitude"] = e.coords.La;
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
                } else {
                }

                getAddress = $all_data["addr"];
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

        // iframe을 넣은 element를 보이게 한다.
        postWrap.style.display = "block";
        my_modal_1.showModal();
    }

    // 전화번호 업로드시 숫자만 남기기
    function formatPhoneNumber(event) {
        let value = event.target.value.replace(/\D/g, ""); // 숫자만 남기기

        if (value.length === 8) {
            // 8자리: 국번 없는 대표번호 → 1661-4545
            value = value.replace(/(\d{4})(\d{4})/, "$1-$2");
        } else if (value.length === 9) {
            // 9자리: 지역번호(2자리)+번호(7자리) → 02-123-4567
            value = value.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
        } else if (value.length === 10) {
            // 10자리: 지역번호(3자리)+번호(7자리) → 032-655-8844
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        } else if (value.length === 11) {
            // 11자리: 휴대폰 → 010-5454-6464
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        } else if (value.length > 3 && value.length < 8) {
            // 임시 처리: 4~7자리 입력 → 010-1234 같은 형태
            value = value.replace(/(\d{3})(\d+)/, "$1-$2");
        }

        $all_data["phone"] = value;
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

<svelte:window on:message={paymentSuccess} />

<!-- 경고창 모달 -->
<!-- svelte-ignore event_directive_deprecated -->
<CustomModal
    bind:visible={notLoginChkModal}
    closeOnBackground={false}
    closeBtn={false}
    xBtn={false}
>
    <div class="text-center">
        <div class=" text-red-500 text-3xl mb-5">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div class="mb-5">구인 등록을 원하시면 로그인이 필요합니다.</div>
        <div class="flex justify-center items-center gap-3">
            <a href="/auth/login" class="btn btn-active w-1/3">
                <button
                    on:click={() => {
                        goto("/auth/login");
                    }}
                >
                    로그인 바로가기
                </button>
            </a>

            <a href="/" class="btn btn-active w-1/3">
                <button
                    on:click={() => {
                        goto("/");
                    }}
                >
                    취소
                </button>
            </a>
        </div>
    </div>
</CustomModal>

<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- 이전 공고 불러오기 리스트 모달 -->
<CustomModal bind:visible={prevPostListModal}>
    <div class="py-2 px-1 suit-font">
        <div class="flex items-center gap-2 mb-6">
            <div class="w-1.5 h-5 bg-blue-500 rounded-full"></div>
            <h2 class="text-xl font-extrabold text-slate-800">
                이전 등록 공고 불러오기
            </h2>
        </div>

        <div
            class="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar"
        >
            {#if prevPostList.length > 0}
                {#each prevPostList as post}
                    <div
                        class="group p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-white hover:shadow-md hover:shadow-blue-50 transition-all flex justify-between items-center"
                        data-idx={post.idx}
                        on:click={useChkPrevPost}
                    >
                        <div class="flex flex-col gap-1 overflow-hidden">
                            <span
                                class="text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors"
                            >
                                {post.subject}
                            </span>
                            <span class="text-[11px] text-slate-400">
                                {post.created_at
                                    ? post.created_at.split("T")[0]
                                    : "과거 등록건"}
                            </span>
                        </div>

                        <div class="flex items-center gap-2 shrink-0 ml-4">
                            <span
                                class="text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >선택하기</span
                            >
                            <div
                                class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all"
                            >
                                <i class="fa fa-chevron-right text-xs"></i>
                            </div>
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="py-20 text-center space-y-3">
                    <div class="text-slate-200 text-5xl">
                        <i class="fa fa-folder-open-o"></i>
                    </div>
                    <p class="text-slate-400 text-sm font-medium">
                        이전에 등록한 공고가 없습니다.
                    </p>
                </div>
            {/if}
        </div>

        <div class="mt-6 pt-2">
            <button
                class="w-full h-12 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                on:click={() => (prevPostListModal = false)}
            >
                닫기
            </button>
        </div>
    </div>
</CustomModal>

<!-- 이전 공고 선택시 기존 데이터 있으면 확인하는 모달 -->
<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={prevPostChkModal} closeBtn={false}>
    <div class="py-4 px-2 suit-font">
        <div class="flex justify-center mb-6">
            <div
                class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shadow-sm border border-blue-100"
            >
                <i
                    class="fa fa-refresh text-3xl animate-spin-slow"
                    aria-hidden="true"
                ></i>
            </div>
        </div>

        <div class="text-center space-y-2 mb-8">
            <h3 class="text-lg font-extrabold text-slate-800">
                내용을 덮어쓰시겠어요?
            </h3>
            <div class="text-slate-500 text-sm leading-relaxed">
                <p>현재 작성 중인 공고 내용이 모두 삭제되고,</p>
                <p>
                    선택하신 <span class="text-blue-600 font-bold"
                        >이전 공고 내용으로 교체</span
                    >됩니다.
                </p>
            </div>
        </div>

        <div class="flex justify-center items-center gap-3">
            <button
                class="flex-1 h-12 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                on:click={() => (prevPostChkModal = false)}
            >
                취소
            </button>
            <button
                class="flex-1 h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-100 active:scale-95 transition-all"
                on:click={usePrevPost}
            >
                불러오기
            </button>
        </div>
    </div>
</CustomModal>

<!-- 결제 완료 후 뜨는 모달 -->
<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={successPrevModal} closeBtn={false}>
    <div class="py-8 px-4 text-center suit-font">
        <div class="flex justify-center mb-6">
            <div class="relative">
                <div
                    class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm shadow-emerald-50"
                >
                    <i class="fa fa-check text-4xl" aria-hidden="true"></i>
                </div>
                <div
                    class="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white text-[10px] border-2 border-white shadow-sm"
                >
                    <i class="fa fa-star"></i>
                </div>
            </div>
        </div>

        <div class="space-y-2 mb-8">
            <h3 class="text-2xl font-black text-slate-800 tracking-tight">
                {successPrevModalMessage}
            </h3>
            <p class="text-slate-500 text-sm">
                성공적으로 처리되었습니다.<br />
                <span class="font-medium text-slate-400">
                    잠시 후 이전 페이지로 자동 이동합니다.
                </span>
            </p>
        </div>

        <div class="flex flex-col items-center gap-3">
            <div class="flex gap-1.5">
                <span
                    class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                    style="animation-delay: 0.1s"
                ></span>
                <span
                    class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                    style="animation-delay: 0.2s"
                ></span>
                <span
                    class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                    style="animation-delay: 0.3s"
                ></span>
            </div>
            <span
                class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest opacity-60"
                >Redirecting</span
            >
        </div>
    </div>
</CustomModal>

<!-- 경고창 모달 -->
<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={alertModalShow} closeBtn={false}>
    <div class="py-4 px-2">
        <div class="flex justify-center mb-6">
            <div
                class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-sm border border-red-100"
            >
                <i
                    class="fa fa-exclamation-triangle text-2xl"
                    aria-hidden="true"
                ></i>
            </div>
        </div>

        <div class="text-center space-y-2 mb-8">
            <h3 class="text-lg font-extrabold text-slate-800">
                확인이 필요합니다
            </h3>
            <p
                class="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap"
            >
                {alertModalMessage}
            </p>
        </div>

        <div class="flex justify-center">
            <button
                class="w-full sm:w-1/2 h-12 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 active:scale-95 transition-all shadow-md"
                on:click={() => (alertModalShow = false)}
            >
                확인했습니다
            </button>
        </div>
    </div>
</CustomModal>

<!-- 페이지 벗어나려고 할 시 보이는 모달 -->
<!-- svelte-ignore event_directive_deprecated -->
<CustomModal bind:visible={escapePageModal} closeBtn={false}>
    <div class="py-4 px-2">
        <div class="flex justify-center mb-6">
            <div
                class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 shadow-sm border border-amber-100"
            >
                <i class="fa fa-exclamation-circle text-3xl" aria-hidden="true"
                ></i>
            </div>
        </div>

        <div class="text-center space-y-2 mb-8">
            <h3 class="text-lg font-extrabold text-slate-800">
                정말 나가시겠어요?
            </h3>
            <div class="text-slate-500 text-sm leading-relaxed">
                <p>지금 페이지를 벗어나면</p>
                <p>
                    <span class="text-red-500 font-bold"
                        >작성 중인 모든 내용이 삭제</span
                    >됩니다.
                </p>
            </div>
        </div>

        <div
            class="flex flex-col sm:flex-row justify-center items-center gap-3"
        >
            <button
                class="w-full sm:flex-1 h-12 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all order-2 sm:order-1"
                on:click={goToBackAndArrangeImg}
            >
                벗어나기
            </button>
            <button
                class="w-full sm:flex-1 h-12 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-95 transition-all order-1 sm:order-2"
                on:click={() => (escapePageModal = false)}
            >
                계속 작성하기
            </button>
        </div>
    </div>
</CustomModal>

<!-- 상품 선택 및 결제 모달 -->
<CustomModal bind:visible={submitPrevModal} closeBtn={false}>
    <div class="py-2 px-1 suit-font">
        <div class="text-center mb-6">
            <div
                class="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-3"
            >
                <i class="fa fa-shopping-cart text-xl"></i>
            </div>
            {#if freebies}
                <h3 class="text-xl font-extrabold text-slate-800">
                    축하합니다! 첫 글 혜택 적용
                </h3>
                <p class="text-sm text-blue-600 font-medium mt-1">
                    프리미엄 등록을 무료로 이용하실 수 있습니다.
                </p>
            {:else}
                <h3 class="text-xl font-extrabold text-slate-800">
                    상품 선택 및 결제
                </h3>
                <p class="text-sm text-slate-500 mt-1">
                    원하시는 노출 옵션을 선택해 주세요.
                </p>
            {/if}
        </div>

        <div class="space-y-3 mb-6">
            <label class="product-card">
                <input
                    type="radio"
                    value="premium"
                    class="hidden"
                    bind:group={$all_data["product"]}
                    on:change={itemRateChange}
                />
                <div class="card-body">
                    <div class="flex justify-between items-start mb-2">
                        <span class="badge-premium">PREMIUM</span>
                        <div class="text-right">
                            {#if freebies}
                                <span
                                    class="block text-xs text-slate-400 line-through"
                                    >132,000원</span
                                >
                                <span class="text-lg font-bold text-blue-600"
                                    >0원 (무료)</span
                                >
                            {:else}
                                <span
                                    class="block text-xs text-slate-400 line-through"
                                    >132,000원</span
                                >
                                <span class="text-lg font-bold text-slate-800"
                                    >66,000원</span
                                >
                            {/if}
                        </div>
                    </div>
                    <ul class="text-[11px] text-slate-500 space-y-1">
                        <li>• 메인 + 지역페이지 최상단 랜덤 노출</li>
                        <li>• 광고 기간 10일 제공</li>
                    </ul>
                </div>
            </label>

            <label class="product-card">
                <input
                    type="radio"
                    value="top"
                    class="hidden"
                    bind:group={$all_data["product"]}
                    on:change={itemRateChange}
                />
                <div class="card-body">
                    <div class="flex justify-between items-start mb-2">
                        <span class="badge-top">REGION TOP</span>
                        <div class="text-right">
                            <span
                                class="block text-xs text-slate-400 line-through"
                                >99,000원</span
                            >
                            <span class="text-lg font-bold text-slate-800"
                                >49,500원</span
                            >
                        </div>
                    </div>
                    <ul class="text-[11px] text-slate-500 space-y-1">
                        <li>• 선택한 지역페이지 상단 랜덤 노출</li>
                        <li>• 광고 기간 10일 제공</li>
                    </ul>
                </div>
            </label>

            <label class="product-card">
                <input
                    type="radio"
                    value="free"
                    class="hidden"
                    bind:group={$all_data["product"]}
                    on:change={itemRateChange}
                />
                <div class="card-body">
                    <div class="flex justify-between items-center">
                        <span class="badge-free">NORMAL</span>
                        <span class="text-lg font-bold text-slate-800"
                            >무료 등록</span
                        >
                    </div>
                </div>
            </label>
        </div>

        {#if iconsShow}
            <div
                class="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100"
            >
                <div class="flex justify-between items-center mb-4">
                    <span class="text-sm font-bold text-slate-700">
                        포인트 아이콘 <span
                            class="text-xs font-normal text-slate-400 ml-1"
                            >(개당 2,200원)</span
                        >
                    </span>
                    <span
                        class="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500"
                        >1개 선택 가능</span
                    >
                </div>

                <div class="grid grid-cols-4 gap-3 px-1">
                    {#each iconList as icon}
                        <label class="icon-selector">
                            <input
                                type="checkbox"
                                value={icon.id}
                                class="hidden"
                                bind:group={icons}
                                on:change={iconsChange}
                            />
                            <div class="icon-box-new">
                                <img
                                    src="/icons/icon-{icon.id}.png"
                                    alt=""
                                    class="w-full h-auto object-contain"
                                />
                            </div>
                        </label>
                    {/each}
                </div>
            </div>
        {:else}
            <div
                class="bg-slate-50 rounded-xl p-4 mb-6 text-center text-xs text-slate-400 border border-dashed border-slate-200"
            >
                아이콘 선택은 프리미엄 또는 지역탑 등록 시 가능합니다.
            </div>
        {/if}

        <div class="bg-slate-800 rounded-2xl p-5 text-white shadow-inner mb-6">
            <div class="flex justify-between text-xs opacity-70 mb-1">
                <span>선택 상품: {productInfo.name}</span>
                <span>{productInfo.price.toLocaleString()}원</span>
            </div>
            {#each iconNames as iconName}
                <div class="flex justify-between text-xs opacity-70 mb-1">
                    <span>아이콘: {iconName}</span>
                    <span>2,200원</span>
                </div>
            {/each}
            <div
                class="border-t border-white/10 mt-3 pt-3 flex justify-between items-center"
            >
                <span class="font-bold">최종 결제 금액</span>
                <div class="text-right">
                    {#if freebies}
                        <span class="text-xs line-through opacity-50 mr-2"
                            >{$all_data["sum"]?.toLocaleString()}원</span
                        >
                        <span class="text-xl font-black text-emerald-400"
                            >0원</span
                        >
                    {:else}
                        <span class="text-xl font-black"
                            >{$all_data["sum"]?.toLocaleString()}원</span
                        >
                    {/if}
                </div>
            </div>
        </div>

        <button
            class="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
            on:click={uploadRegist}
        >
            {#if freebies || $all_data["product"] === "free"}무료로 등록하기{:else}결제
                및 등록하기{/if}
        </button>
    </div>
</CustomModal>

<!-- svelte-ignore event_directive_deprecated -->
<dialog id="my_modal_1" class="modal suit-font">
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
                <button class="btn" bind:this={modalCloseBtn}>닫기</button>
            </form>
        </div>
    </div>
</dialog>

<PageHeader pageName="구인글 등록" />

<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="bg-slate-50 min-h-screen suit-font pb-24">
    <div class="max-w-[530px] mx-auto pt-14 pb-24">
        <!-- <button on:click={testFunc}> testBtn </button> -->
        <div
            class="bg-white p-5 border-b border-slate-200 shadow-sm top-14 z-10"
        >
            <div class="max-w-[530px] mx-auto flex flex-col gap-3">
                <div class="flex justify-between items-center">
                    <h1
                        class="text-2xl font-black text-slate-800 tracking-tight"
                    >
                        {#if !data.modifyIdx}구인글 등록{:else}구인글 수정{/if}
                    </h1>

                    {#if !data.modifyIdx}
                        <button
                            type="button"
                            class="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all shadow-md shadow-slate-100"
                            on:click={loadPreviousPostList}
                        >
                            <i class="fa fa-file-text-o text-blue-400"></i>
                            <span>이전 공고 불러오기</span>
                        </button>
                    {/if}
                </div>

                {#if freebies}
                    <div class="flex">
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-extrabold animate-pulse border border-blue-100"
                        >
                            <i class="fa fa-gift text-sm"></i>
                            <span
                                >첫번째 구인공고 작성 시 프리미엄 무료 혜택이
                                적용됩니다!</span
                            >
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <div class="space-y-4">
            <section
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
            >
                <div class="flex items-center gap-2 mb-4">
                    <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                    <h2 class="font-bold text-slate-800 text-lg">
                        현장 이미지
                    </h2>
                    <span class="text-xs text-slate-400 font-normal ml-auto">
                        최대 10장, 슬라이드 형태로 표시됩니다.
                    </span>
                </div>
                <div
                    class="bg-slate-50 rounded-xl p-4 border-2 border-dashed border-slate-200"
                >
                    <SortableImg
                        {updateImg}
                        folder={"job-offer"}
                        imgModifyList={$all_data["imgs"]
                            ? $all_data["imgs"].split(",")
                            : ""}
                        maxImgCount={10}
                    ></SortableImg>
                </div>
            </section>

            <section
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6"
            >
                <div class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                    <h2 class="font-bold text-slate-800 text-lg">
                        공고 제목 (현장명) *
                    </h2>
                </div>

                <div>
                    <label
                        class="block text-sm font-bold text-slate-600 mb-2 ml-1"
                    >
                        <input
                            type="text"
                            placeholder="예: [브랜드명] 1본부 팀원 모집"
                            bind:value={$all_data["subject"]}
                            class="base-input"
                        />
                    </label>
                </div>

                <!-- -------------------- -->

                <div class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                    <h2 class="font-bold text-slate-800 text-lg">
                        현장 한마디*
                    </h2>
                </div>

                <div>
                    <label
                        class="block text-sm font-bold text-slate-600 mb-2 ml-1"
                    >
                        <input
                            type="text"
                            placeholder="현장 한마디를 입력해주세요(필수)"
                            bind:value={$all_data["point"]}
                            class="base-input"
                        />
                    </label>
                </div>
            </section>

            <section
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6"
            >
                <div class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                    <h2 class="font-bold text-slate-800 text-lg">
                        근무지 주소 *
                    </h2>
                </div>
                <div class="flex gap-1">
                    <input
                        type="text"
                        bind:value={$all_data["addr"]}
                        on:focusout={() => {
                            console.log(getAddress);
                        }}
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-3 transition-all focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <button
                        class="bg-slate-800 text-white px-3.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors shrink-0"
                        on:click={addressInput}>주소 검색</button
                    >

                    <button
                        class="bg-slate-800 text-white px-3.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors shrink-0"
                        class:opacity-50={!$all_data["addr"]}
                        disabled={!$all_data["addr"]}
                        type="button"
                        on:click={() => {
                            $all_data["res_addr"] = $all_data["addr"];
                            getAddress = $all_data["addr"];
                        }}
                    >
                        <span>맵적용</span>
                    </button>
                </div>

                {#if getAddress}
                    <div
                        class="rounded-2xl overflow-hidden border border-slate-200 shadow-inner h-64"
                    >
                        <KakaoMap
                            {getAddress}
                            phText="근무지"
                            height="100%"
                            {tudeAct}
                        />
                    </div>
                {:else}
                    <div
                        class="h-24 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-sm"
                    >
                        <i class="fa fa-map-marker mb-2 text-lg"></i>
                        주소를 입력하면 지도가 표시됩니다.
                    </div>
                {/if}
            </section>

            <section
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6"
            >
                <div class="space-y-3">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                        <h2 class="font-bold text-slate-800 text-lg">
                            활동 지역 선택 *
                        </h2>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                        {#each regions as region}
                            <label class="button-checkbox-new">
                                <input
                                    type="radio"
                                    hidden
                                    value={region}
                                    bind:group={$all_data["location"]}
                                />
                                <div class="transition-all">{region}</div>
                            </label>
                        {/each}
                    </div>
                </div>
            </section>

            <section
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6"
            >
                <div class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                    <h2 class="font-bold text-slate-800 text-lg">기본 정보</h2>
                </div>

                <div class="space-y-5">
                    <div class="space-y-2">
                        <label
                            for="agency"
                            class="block text-sm font-bold text-slate-600 ml-1"
                        >
                            분양대행사 <span class="text-blue-500">*</span>
                        </label>
                        <input
                            id="agency"
                            type="text"
                            placeholder="대행사명을 입력해 주세요"
                            bind:value={$all_data["agency"]}
                            class="base-input"
                        />
                    </div>

                    <div class="space-y-2">
                        <label
                            for="manager-name"
                            class="block text-sm font-bold text-slate-600 ml-1"
                        >
                            담당자 성함 <span class="text-blue-500">*</span>
                        </label>
                        <input
                            id="manager-name"
                            type="text"
                            placeholder="성함을 입력해 주세요"
                            bind:value={$all_data["name"]}
                            class="base-input"
                        />
                    </div>

                    <div class="space-y-2">
                        <label
                            for="manager-phone"
                            class="block text-sm font-bold text-slate-600 ml-1"
                        >
                            담당자 연락처 <span class="text-blue-500">*</span>
                        </label>
                        <div class="relative">
                            <input
                                id="manager-phone"
                                type="text"
                                placeholder="ex) 010-1234-5678"
                                bind:value={$all_data["phone"]}
                                on:input={formatPhoneNumber}
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-800 shadow-sm transition-all focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                            />
                            <span
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                <i class="fa fa-phone" aria-hidden="true"></i>
                            </span>
                        </div>
                        <p class="text-[11px] text-slate-400 ml-1">
                            연락처는 구인 희망자에게만 노출됩니다.
                        </p>
                    </div>
                </div>
            </section>

            <section
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6"
            >
                <div class="space-y-3">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                        <h2 class="font-bold text-slate-800 text-lg">
                            업종분류 *
                        </h2>
                        <span
                            class="text-xs text-slate-400 font-normal ml-auto"
                        >
                            여러개 선택 가능합니다.
                        </span>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                        {#each businessCategorys as businessCategory, idx}
                            <label class="button-checkbox-new">
                                <input
                                    type="checkbox"
                                    value={businessCategory}
                                    bind:group={businessArr}
                                    hidden
                                />
                                <div class="transition-all">
                                    {businessCategory}
                                </div>
                            </label>
                        {/each}
                    </div>
                </div>
            </section>

            <section
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6"
            >
                <div class="space-y-3">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                        <h2 class="font-bold text-slate-800 text-lg">
                            직종분류 *
                        </h2>
                        <span
                            class="text-xs text-slate-400 font-normal ml-auto"
                        >
                            여러개 선택 가능합니다.
                        </span>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                        {#each jobCategorys as jobCategory, idx}
                            <label class="button-checkbox-new">
                                <input
                                    type="checkbox"
                                    value={jobCategory}
                                    bind:group={occupationArr}
                                    hidden
                                />
                                <div class="transition-all">{jobCategory}</div>
                            </label>
                        {/each}
                    </div>
                </div>

                <div class="space-y-2">
                    <label
                        for="agency"
                        class="block text-sm font-bold text-slate-600 ml-1"
                    >
                        경력
                    </label>
                    <input
                        id="agency"
                        type="text"
                        placeholder="ex) 10년 / 초보"
                        bind:value={$all_data["career"]}
                        class="base-input"
                    />
                </div>

                <div class="space-y-2">
                    <label
                        for="agency"
                        class="block text-sm font-bold text-slate-600 ml-1"
                    >
                        인원
                    </label>
                    <input
                        id="agency"
                        type="text"
                        placeholder="ex) 2명 / 00명"
                        bind:value={$all_data["number_people"]}
                        class="base-input"
                    />
                </div>
            </section>

            <section
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6"
            >
                <div class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
                    <h2 class="font-bold text-slate-800 text-lg">
                        급여 및 영업지원
                    </h2>
                </div>

                <div
                    class="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 space-y-4"
                >
                    <div class="space-y-3">
                        <label
                            class="block text-sm font-bold text-emerald-800 ml-1"
                            >수수료 타입 *</label
                        >
                        <div class="grid grid-cols-3 gap-2">
                            {#each feeBases as feeBase}
                                <label class="fee-type-chip">
                                    <input
                                        type="radio"
                                        value={feeBase}
                                        bind:group={$all_data["fee_type"]}
                                        class="hidden"
                                    />
                                    <div class="chip-content">{feeBase}</div>
                                </label>
                            {/each}
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label
                            class="block text-sm font-bold text-emerald-800 ml-1"
                            >수수료 금액 *</label
                        >
                        <div class="flex items-center gap-3">
                            <div class="relative flex-1">
                                <input
                                    type="text"
                                    bind:value={$all_data["fee"]}
                                    on:input={handleFeeInput}
                                    placeholder="숫자만 입력"
                                    class="base-input !border-emerald-200 focus:!border-emerald-500 focus:!ring-emerald-100 pr-12"
                                />
                                <span
                                    class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-emerald-700"
                                    >만 원</span
                                >
                            </div>
                        </div>
                        <div class="flex items-center gap-1.5 px-1">
                            <i
                                class="fa fa-info-circle text-emerald-600 text-xs"
                            ></i>
                            <p
                                class="text-[11px] text-emerald-700 leading-tight mt-0.5"
                            >
                                정확한 수수료를 입력하시면 구인글 메인에 강조
                                노출되어 지원율이 높아집니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label
                            class="block text-sm font-bold text-slate-600 ml-1"
                            >일비</label
                        >
                        <input
                            type="text"
                            class="base-input"
                            placeholder="ex) 월 100만 / 일 3만"
                            bind:value={$all_data["daily_expense"]}
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            class="block text-sm font-bold text-slate-600 ml-1"
                            >숙소비</label
                        >
                        <input
                            type="text"
                            class="base-input"
                            placeholder="ex) 원룸 제공 / 지원금"
                            bind:value={$all_data["sleep_expense"]}
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            class="block text-sm font-bold text-slate-600 ml-1"
                            >프로모션</label
                        >
                        <input
                            type="text"
                            class="base-input"
                            placeholder="ex) 5채 판매시 추가 100만"
                            bind:value={$all_data["promotion"]}
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            class="block text-sm font-bold text-slate-600 ml-1"
                            >기본급여</label
                        >
                        <input
                            type="text"
                            class="base-input"
                            placeholder="ex) 기본급 200만"
                            bind:value={$all_data["base_pay"]}
                        />
                    </div>
                </div>
            </section>

            <section
                class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6 mb-10"
            >
                <div class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
                    <h2 class="font-bold text-slate-800 text-lg">상세 내용</h2>
                </div>

                <div class="space-y-4">
                    <textarea
                        id="detail_content"
                        class="base-input leading-relaxed resize-none"
                        placeholder="현장의 장점, 근무 조건, 팀 분위기 등을 자유롭게 작성해 주세요."
                        rows="10"
                        bind:value={$all_data["detail_content"]}
                    ></textarea>

                    <p class="text-[11px] text-slate-400 ml-1 italic">
                        * 허위 사실 기재 시 공고가 임의 삭제될 수 있습니다.
                    </p>
                </div>

                <div class="pt-2">
                    {#if data.modifyIdx}
                        <button
                            class="main-submit-btn bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-100"
                            on:click={updateRegist}
                        >
                            <i class="fa fa-save mr-2"></i> 수정 내용 저장하기
                        </button>
                    {:else}
                        <button
                            class="main-submit-btn bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-100"
                            on:click={uploadChkRegist}
                        >
                            <i class="fa fa-paper-plane mr-2"></i> 구인공고 등록하기
                        </button>
                    {/if}
                </div>
            </section>
        </div>
    </div>
</div>

<style>
    /* 아이콘이 아주 천천히 돌게 해서 '교체'의 느낌을 줌 (선택사항) */
    @keyframes spin-slow {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
    }

    /* 리스트 영역 스크롤바 커스텀 */
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
    }

    /* 메인 제출 버튼 커스텀 스타일 */
    .main-submit-btn {
        width: 100%;
        height: 3.5rem; /* h-14 */
        color: #ffffff;
        font-size: 1.125rem; /* text-lg */
        font-weight: 800;
        border-radius: 1rem; /* rounded-2xl */
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .main-submit-btn:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .main-submit-btn:active {
        transform: translateY(0);
        filter: brightness(0.95);
    }

    /* textarea 전용 base-input 보정 (글자 줄간격) */
    textarea.base-input {
        line-height: 1.6;
    }

    /* 커스텀 체크박스 스타일 (Blue) */
    .button-checkbox-new div {
        background-color: #fff;
        color: #64748b;
        font-size: 13px;
        font-weight: 600;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 10px 0;
        text-align: center;
        cursor: pointer;
    }
    .button-checkbox-new input:checked + div {
        background-color: #eff6ff;
        color: #2563eb;
        border-color: #3b82f6;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
    }

    .fee-type-chip {
        cursor: pointer;
        user-select: none;
    }

    .fee-type-chip .chip-content {
        padding: 0.6rem 0;
        background-color: #ffffff;
        color: #059669; /* emerald-600 */
        font-size: 0.875rem;
        font-weight: 700;
        border: 1px solid #d1fae5; /* emerald-100 */
        border-radius: 0.75rem;
        text-align: center;
        transition: all 0.2s;
    }

    .fee-type-chip input:checked + .chip-content {
        background-color: #059669; /* emerald-600 */
        color: #ffffff;
        border-color: #059669;
        box-shadow: 0 4px 10px rgba(5, 150, 105, 0.2);
    }

    /* 애니메이션 효과 */
    .suit-font {
        font-family: "SUIT", sans-serif;
    }

    /* 아이콘 선택기 컨테이너 */
    .icon-selector {
        cursor: pointer;
        display: block;
    }

    /* 아이콘을 감싸는 박스 (네모 모양) */
    .icon-box-new {
        aspect-ratio: 1 / 1; /* 정사각형 유지 */
        padding: 10px; /* 아이콘 크기를 줄이기 위한 내부 여백 */
        background-color: #ffffff;
        border: 2px solid #f1f5f9; /* 기본 테두리 (연한 회색) */
        border-radius: 1rem; /* 둥근 네모 모양 (rounded-xl) */
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* 마우스를 올렸을 때 */
    .icon-selector:hover .icon-box-new {
        border-color: #e2e8f0;
        transform: translateY(-2px);
    }

    /* ★ 아이콘이 선택(체크) 되었을 때 ★ */
    .icon-selector input:checked + .icon-box-new {
        background-color: #eff6ff; /* 연한 파란 배경 */
        border-color: #3b82f6; /* 선명한 파란색 테두리 */
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15); /* 푸른 광채 */
    }

    /* 이미지 크기 조절 */
    .icon-box-new img {
        max-width: 85%;
        max-height: 85%;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05));
    }
</style>
