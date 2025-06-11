import { back_api } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import { main_location } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {
    // hook 사용해서 유저 셋팅!
    user_info.set(data.user)

    // console.log($main_location);
    console.log(main_location);



    // 메인에 노출될 사이트 리스트 불러오기
    let siteList = []; // 메인에 노출될 사이트 리스트
    let mainLocation = "" // 

    if (browser) {
        mainLocation = localStorage.getItem("location");
        if(mainLocation){
            main_location.set(mainLocation)
        }else{
            main_location.set("전국")
        }
    }




    try {
        const res = await axios.post(`${back_api}/sitelist/load_site_list`, {})
        console.log(res.data);
        siteList = res.data.site_list
        for (let i = 0; i < siteList.length; i++) {
            siteList[i]['img'] = siteList[i]['imgs'].split(',')[0]
        }
        console.log(siteList);



    } catch (error) {

    }

    return { siteList }
}