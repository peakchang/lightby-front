import { back_api } from "$lib/const";
import { user_info } from "$lib/stores/stores";
import axios from "axios";

export const load = async ({ params, url, data }) => {

    let userIdx = ''

    user_info.subscribe((v) => {
        userIdx = v.idx
    })

    let faqList = [];
    let qnaList = [];

    try {
        const res = await axios.post(`${back_api}/qna/load_qna_list`, { userIdx })

        faqList = res.data.faqList
        qnaList = res.data.qnaList
    } catch (error) {

    }
    return { faqList, qnaList }

}