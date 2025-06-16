import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import { main_location } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {


    // 메인에 노출될 사이트 리스트 불러오기

    let premiumList = [];
    let topList = [];
    let siteList = []; // 메인에 노출될 사이트 리스트

    let mainLocation = "" // 

    if (browser) {
        mainLocation = localStorage.getItem("location");
        if (mainLocation) {
            main_location.set(mainLocation)
        } else {
            main_location.set("전국")
        }
    }




    try {
        const res = await axios.post(`${back_api}/sitelist/load_site_list`, { mainLocation })
        console.log(res.data);

        premiumList = res.data.premium_list
        topList = res.data.top_list
        siteList = res.data.site_list




    } catch (error) {

    }

    return { premiumList, topList, siteList }
}