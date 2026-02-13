export const back_api_origin = `${import.meta.env.VITE_SERVER_URL_BASE}`


export const img_bucket = `https://storage.cloud.google.com/${import.meta.env.VITE_BUCKET_NAME}/`


export const public_img_bucket = `https://storage.googleapis.com/${import.meta.env.VITE_BUCKET_NAME}/`

export const back_api = `${import.meta.env.VITE_SERVER_URL}`



export const regions = [
    "전국",
    "서울",
    "경기남부",
    "경기북부",
    "인천",
    "부산",
    "울산",
    "대구",
    "경상도",
    "대전",
    "세종",
    "충청도",
    "광주",
    "전라도",
    "강원도",
    "제주도",
]

export const businessCategorys = [
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
]


export const jobCategorys = [
    "시행/대행 사무직",
    "분양대행사",
    "본부장",
    "팀장",
    "직원",
    "데스크",
    "TM상담사",
    "알바",
]


export const iconList = [
    { name: "설거지", id: "guzi", color: "red" },    // 위험/경고
    { name: "수수료UP", id: "feeup", color: "orange" }, // 강조/이익
    { name: "소수인원", id: "minority", color: "blue" },   // 신뢰/차분
    { name: "신규현장", id: "new", color: "emerald" },// 신선함/시작
    { name: "조건변경", id: "change", color: "purple" }, // 변화/전환
    { name: "할인분양", id: "discount", color: "pink" },   // 파격/이벤트
    { name: "급구현장", id: "hurry", color: "amber" },  // 주의/긴급
    { name: "한방현장", id: "once", color: "indigo" }, // 강력함/한방
];


export const colorMap = {
    red: "border-red-500 text-red-500 hover:border-red-600 hover:text-red-600 bg-red-50/30",
    orange: "border-orange-500 text-orange-500 hover:border-orange-600 hover:text-orange-600 bg-orange-50/30",
    blue: "border-blue-500 text-blue-500 hover:border-blue-600 hover:text-blue-600 bg-blue-50/30",
    emerald: "border-emerald-500 text-emerald-500 hover:border-emerald-600 hover:text-emerald-600 bg-emerald-50/30",
    purple: "border-purple-500 text-purple-500 hover:border-purple-600 hover:text-purple-600 bg-purple-50/30",
    pink: "border-pink-500 text-pink-500 hover:border-pink-600 hover:text-pink-600 bg-pink-50/30",
    amber: "border-amber-500 text-amber-500 hover:border-amber-600 hover:text-amber-600 bg-amber-50/30",
    indigo: "border-indigo-500 text-indigo-500 hover:border-indigo-600 hover:text-indigo-600 bg-indigo-50/30",
};