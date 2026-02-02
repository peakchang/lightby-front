import { back_api } from "$lib/const.js";
import moment from "moment-timezone";

export const load = async ({ fetch, url }) => {
    const today = moment().format("YYYY-MM-DD");
    const firstDay = moment().startOf("month").format("YYYY-MM-DD");

    const start = url.searchParams.get("start") || firstDay;
    const end = url.searchParams.get("end") || today;

    const res = await fetch(`${back_api}/visit_stats_all?start=${start}&end=${end}`);
    const result = await res.json();

    console.log(result);
    
    

    return {
        summary: result.summary || [],
        details: result.details || [],
        start,
        end
    };
};