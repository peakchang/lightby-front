<script>
    import SortableImg from "$lib/components/SortableImg.svelte";
    import { back_api, public_img_bucket } from "$lib/const";
    import axios from "axios";
    import { onMount } from "svelte";
    import { loadingStore } from "$lib/stores/stores.js";
    import uploadImageAct from "$lib/lib.js";

    let { data } = $props();
    console.log(data);

    let bannerArr = $state([]);

    onMount(() => {
        console.log("dadfasdfasfd");

        console.log(data.basicEnv.banners);

        const tempBannerArr = data.basicEnv.banners.split(",");
        const tempBannerLinkArr = data.basicEnv.banner_links.split(",");
        const tempArr = [];
        for (let i = 0; i < tempBannerArr.length; i++) {
            const obj = {
                href: tempBannerArr[i],
                link: tempBannerLinkArr[i],
            };
            tempArr.push(obj);
        }
        bannerArr = tempArr;
    });

    async function bannerUpload() {
        uploadImageAct(
            `${back_api}/img/upload_single`,
            { folder: "banner" },
            (err, imgData) => {
                if (err) {
                    let errMessage = "이미지 업로드 실패!";
                    if (err.message) {
                        errMessage = err.message;
                    }
                    alert(`${errMessage} 다시 시도해주세요!`);
                    $loadingStore = false;
                    return;
                }

                try {
                    const obj = {
                        href: imgData.saveUrl,
                        link: "",
                    };
                    bannerArr.push(obj);
                } catch (err) {
                    console.error(err.message);
                } finally {
                }
            },
        );
    }

    async function bannerDataUpload() {
        const bannerImgs = bannerArr.map((item) => item.href).join(",");
        const bannerLinks = bannerArr.map((item) => item.link).join(",");
        try {
            const res = await axios.post(`${back_api}/adm_etc/upload_banners`, {
                bannerImgs,
                bannerLinks,
            });
        } catch (error) {}
    }

    async function deleteBanner() {
        const removedItem = bannerArr[this.value];
        const newArr = [
            ...bannerArr.slice(0, Number(this.value)),
            ...bannerArr.slice(Number(this.value) + 1),
        ];
        bannerArr = newArr;
        try {
            const res = await axios.post(`${back_api}/img/delete`, {
                delPath: removedItem.href,
            });
        } catch (error) {}
    }

    function swapByIndex(arr, originIdx, changeIdx) {
        const newArr = [...arr]; // 원본 보호
        const temp = newArr[originIdx];
        newArr[originIdx] = newArr[changeIdx];
        newArr[changeIdx] = temp;
        return newArr;
    }

    function sortUp() {
        const originIdx = Number(this.value);
        const changeIdx = originIdx - 1;
        bannerArr = swapByIndex(bannerArr, originIdx, changeIdx);
    }

    function sortDown() {
        const originIdx = Number(this.value);
        const changeIdx = originIdx + 1;
        bannerArr = swapByIndex(bannerArr, originIdx, changeIdx);
    }
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<!-- svelte-ignore event_directive_deprecated -->
<div>
    <div>
        {#each bannerArr as banner, idx}
            <div class="flex mb-3">
                <div
                    class="w-[50px] flex flex-col justify-center items-center gap-2 border border-gray-300 p-2"
                >
                    <div>
                        {idx}
                    </div>
                    <div>
                        {#if idx != 0}
                            <button
                                class="cursor-pointer text-xl"
                                value={idx}
                                on:click={sortUp}
                            >
                                <i
                                    class="fa fa-arrow-circle-up"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        {/if}
                        {#if idx != bannerArr.length - 1}
                            <button
                                class="cursor-pointer text-xl"
                                value={idx}
                                on:click={sortDown}
                            >
                                <i
                                    class="fa fa-arrow-circle-down"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        {/if}
                    </div>
                </div>
                <div>
                    <div>
                        <img
                            src={`${public_img_bucket}${banner.href}`}
                            alt=""
                        />
                    </div>
                    <div class="mt-2 flex gap-1">
                        <input
                            type="text"
                            class="w-2/3 border text-sm py-1 px-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={bannerArr[idx]["link"]}
                        />

                        <button
                            class="btn btn-sm btn-error text-white"
                            value={idx}
                            on:click={deleteBanner}
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
    <div class="mt-10">
        <button class="btn btn-sm btn-info text-white" on:click={bannerUpload}>
            배너 이미지 업로드
        </button>
        <button
            class="btn btn-sm btn-success text-white"
            on:click={bannerDataUpload}
        >
            배너 데이터 업로드
        </button>
    </div>
    <div class="mt-3 text-sm">
        <p>이미지 업로드 및 삭제 / 순서 변경 후엔 반드시 데이터 업로드를 클릭 해주세욤</p>
        <p>이미지 사이즈는 617 X 70</p>
        
    </div>
</div>
