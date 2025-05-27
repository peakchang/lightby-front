<script>
    import { pageStack } from "$lib/stores/pageStack";
    import PageStack from "$lib/components/PageStack.svelte";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { fetchRequest } from "$lib/lib";
    import imageCompression from "browser-image-compression";
    import { back_api } from "$lib/const";
    import axios from "axios";

    let imgArr = $state([]);
    let maxImgCount = $state(10);

    function openPage(name) {
        console.log("alsdjfliajsdf");

        pageStack.update((stack) => [...stack, name]);
    }

    const onFileSelected = (e) => {
        if (imgArr.length >= maxImgCount) {
            alert(`최대 ${maxImgCount}개 이미지만 업로드 가능합니다.`);
            return false;
        }

        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".png,.jpg,.jpeg");
        input.click();

        // input change
        input.onchange = async (e) => {
            const imageFile = e.target.files[0];
            const options = {
                maxSizeMB: 1, // 최대 파일 크기 (MB)
                maxWidthOrHeight: 1024, // 최대 너비 또는 높이
                useWebWorker: true, // 웹 워커 사용
            };

            try {
                const compressedFile = await imageCompression(
                    imageFile,
                    options,
                );
                console.log("Compressed file:", compressedFile);
                console.log(compressedFile.name);

                let imgForm = new FormData();

                const timestamp = new Date().getTime();
                const fileName = `${timestamp}${Math.random()
                    .toString(36)
                    .substring(2, 11)}.${compressedFile.name.split(".")[1]}`;

                console.log(fileName);

                imgForm.append("onimg", compressedFile, fileName);

                // FormData의 key 값과 value값 찾기
                // let keys = imgForm.keys();
                // for (const pair of keys) {
                //     console.log(`name : ${pair}`);
                // }

                // let values = imgForm.values();
                // for (const pair of values) {
                //     console.log(`value : ${pair}`);
                // }

                try {
                    const res = await axios.post(
                        `${back_api}/img/upload/single`,
                        imgForm,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        },
                    );
                    // 성공시 아래 코드 작업!!
                    console.log("성공!!!");
                } catch (err) {
                    // 실패시 아래 코드 작업! err.response.data.message 는 서버에서 넘어온 메세지!
                    const m = err.response.data.message;
                    alert(m ? m : "이미지 업로드 오류! 다시 시도해주세요!");
                    return;
                }

                // console.log(res);

                // if (res.status == 200) {
                //     addVal(res.data.baseUrl);
                //     setDetailImgCount = imgArr.length - 1;
                //     updateImg(imgArr);
                // }
            } catch (error) {
                console.error("Error during image compression:", error);
                alert("이미지 업로드 오류! 다시 시도해주세요!");
            }
        };
    };
</script>

<button on:click={onFileSelected}> 이미지 업로드! </button>
