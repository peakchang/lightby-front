import { back_api } from "$lib/const.js";
import moment from "moment-timezone";

export const load = async ({ fetch, url }) => {
    const start = url.searchParams.get("start") || moment().startOf("month").format("YYYY-MM-DD");
    const end = url.searchParams.get("end") || moment().format("YYYY-MM-DD");
    const page = url.searchParams.get("page") || "1";

    const res = await fetch(`${back_api}/visit_stats_all?start=${start}&end=${end}&page=${page}`);
    const result = await res.json();

    return { ...result, start, end };
};