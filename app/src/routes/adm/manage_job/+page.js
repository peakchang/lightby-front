import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import axios from "axios";
import { getPageList } from "$lib/lib.js";
import moment from "moment-timezone";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {





    const nowPage = url.searchParams.get('page') || "";
    const searchVal = url.searchParams.get('search') || "";
    const searchType = url.searchParams.get('type') || "";

    let jobOfferList = []
    let allCount = 0
    let pageList = [];
    let maxPage = 0

    try {
        const res = await axios.post(`${back_api}/adm_manage/load_joboffer_list`, { nowPage, searchVal, searchType })

        console.log(res.data.jobOfferList);


        jobOfferList = res.data.jobOfferList.map(item => ({
            ...item,
            ad_start_date: item.ad_start_date ? moment(item.ad_start_date).format('YYYY-MM-DD') : "",
            ad_end_date: item.ad_end_date ? moment(item.ad_end_date).format('YYYY-MM-DD') : ""
        }));

        console.log(jobOfferList);
        
        allCount = res.data.allCount
        maxPage = res.data.maxPage
        pageList = getPageList(nowPage, maxPage)
    } catch (err) {
        console.error(err.message);
    }




    return { jobOfferList, allCount, pageList, maxPage }
}