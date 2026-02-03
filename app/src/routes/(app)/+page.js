import { back_api, public_img_bucket } from "$lib/const.js";
import { user_info } from "$lib/stores/stores.js";
import { main_location, search_val, main_list, sort_val } from "$lib/stores/stores.js";
import axios from "axios";
import { browser } from "$app/environment";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    // 메인에 노출될 사이트 리스트 불러오기

    let mainLocation = ""; // 
    let searchVal = "";
    let sortVal = "";

    if (browser) {
        mainLocation = sessionStorage.getItem("location");
        searchVal = sessionStorage.getItem("search_val");
        sortVal = sessionStorage.getItem("sort_val");


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

        if (sortVal) {
            sort_val.set(sortVal)
        } else {
            sort_val.set("base")
        }
    }

    // let currentStatus = ""
    // let siteLoadStatus = ""
    // let freeStartNum = 0
    // site_load_status.subscribe((v) => {
    //     siteLoadStatus = v
    // })
    // free_start_num.subscribe((v) => {
    //     freeStartNum = v
    // })

    /*
    일단 전체 다 뽑기!!
    각각 다 가져와서 main_list store 에 담아서 표기 하기!!
    */


    try {
        const res = await axios.post(`${back_api}/sitelist/load_site_list`, { mainLocation, searchVal, sortVal })


        main_list.set({
            premium: shuffleArray(res.data.premiumList),
            top: shuffleArray(res.data.topList),
            free: res.data.freeList
        })


        // mainList = res.data.loadSiteList
        // site_load_status.set(res.data.setNextStatus)
        // free_start_num.set(res.data.nextStartNum)
        // currentStatus = res.data.currentStatus
        // if (currentStatus != 'free') {
        //     mainList = shuffleArray(mainList)
        // }


    } catch (err) {
        console.error(err.message);
    }

    return {}
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 0 ≤ j ≤ i
        [array[i], array[j]] = [array[j], array[i]]; // swap
    }
    return array;
}

// const applyMainImgSrc = list => {
//     list.forEach(item => {
//         item.mainImgSrc = item.thumbnail
//             ? `${public_img_bucket}${item.thumbnail}`
//             : item.imgs
//                 ? `${public_img_bucket}${item.imgs.split(',')[0]}`
//                 : '';
//     });
// };
