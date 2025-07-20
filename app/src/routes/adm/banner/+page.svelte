<script>
    import SortableImg from "$lib/components/SortableImg.svelte";
    import { back_api } from "$lib/const";
    import axios from "axios";

    let { data } = $props();
    console.log(data);

    let bannerImgs = $state("");

    $effect(() => {
        if (data.basicEnv.banners) {
            console.log("들어와?!");

            bannerImgs = data.basicEnv.banners;
        }
    });

    async function updateImg(e) {
        console.log("이미지 업데이트~~");
        const imgArr = e.imgArr;

        let imgStrTemp = "";
        for (let i = 0; i < imgArr.length; i++) {
            const con = imgArr[i];
            imgStrTemp += con.href + ",";
        }
        bannerImgs = imgStrTemp.slice(0, -1);

        try {
            const res = await axios.post(`${back_api}/adm_etc/upload_banners`, {
                bannerImgs,
            });
        } catch (error) {}
    }
</script>

<SortableImg
    {updateImg}
    folder={"adm"}
    maxImgCount={10}
    imgModifyList={bannerImgs ? bannerImgs.split(",") : []}
    long={true}
></SortableImg>

<!-- imgModifyList={$all_data["imgs"] ? $all_data["imgs"].split(",") : ""} -->
