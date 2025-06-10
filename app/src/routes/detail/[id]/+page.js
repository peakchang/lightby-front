import { back_api } from "$lib/const";
import { user_info } from "$lib/stores/stores";
import axios from "axios";

export const load = async ({ params, url, data }) => {
    let detail = {}
    let favorateBool = false;
    try {

        let userId = ""
        user_info.subscribe((v) => {
            userId = v.idx
        })
        const res = await axios.post(`${back_api}/detail`, { idx: params.id, userId })
        detail = res.data.detail
        favorateBool = res.data.favorateBool
    } catch (error) {

    }
    return { detail, favorateBool }

}