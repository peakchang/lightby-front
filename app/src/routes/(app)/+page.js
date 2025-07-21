import { back_api, public_img_bucket } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import { main_location, search_val } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {


    let baseEnv = {} // 배너 리스트 불러오기 위해서!
    // 메인에 노출될 사이트 리스트 불러오기

    let premiumList = [];
    let topList = [];
    let siteList = []; // 메인에 노출될 사이트 리스트

    let mainLocation = "" // 
    let searchVal = ""
    if (browser) {
        mainLocation = localStorage.getItem("location");
        searchVal = localStorage.getItem("search_val");


        // F5 할때를 대비해서!!!
        if (searchVal) {
            search_val.set(searchVal)
        } else {
            search_val.set("")
        }

        if (mainLocation) {
            main_location.set(mainLocation)
        } else {
            main_location.set("전국")
        }
    }




    try {
        const res = await axios.post(`${back_api}/sitelist/load_site_list`, { mainLocation, searchVal })

        premiumList = res.data.premium_list
        topList = res.data.top_list
        siteList = res.data.site_list


        // [premiumList, topList, siteList].forEach(applyMainImgSrc);

        // console.log(premiumList);
        // console.log(topList);
        


        baseEnv = res.data.baseEnv
    } catch (error) {

    }

    return { premiumList, topList, siteList, baseEnv }
}

const applyMainImgSrc = list => {
    list.forEach(item => {
        item.mainImgSrc = item.thumbnail
            ? `${public_img_bucket}${item.thumbnail}`
            : item.imgs
                ? `${public_img_bucket}${item.imgs.split(',')[0]}`
                : '';
    });
};
