<script>
    import Sortable from "sortablejs";
    import imageCompression from "browser-image-compression";
    // import axios from "axios";
    import { back_api } from "$lib/const";

    let {
        updateImg,
        imgModifyList = [],
        maxImgCount = 999999,
        detailShow = true,
    } = $props();
    let imgArr = $state([]);
    let sortable = $state(null);
    let setDetailImgCount = $state(0);

    function addVal(getHerf) {
        const newId =
            imgArr.length > 0
                ? Math.max(...imgArr.map((fruit) => fruit.id)) + 1
                : 1;
        const newObj = {
            id: newId, // 가장 큰 id 값 + 1
            href: getHerf, // 새로운 text 값
        };
        imgArr = [...imgArr, newObj];
    }

    async function deleteImg() {
        if (imgArr.length - 1 == setDetailImgCount) {
            setDetailImgCount = setDetailImgCount - 1;
        }
        const delTarget = imgArr[this.value];
        console.log(delTarget);

        const delTargetArr = delTarget.href.split("/");

        const delFolder = delTargetArr[delTargetArr.length - 2];
        const delFile = delTargetArr[delTargetArr.length - 1];
        console.log(delFolder);
        console.log(delFile);

        // try {
        //     const res = await axios.post(`${back_api}/delete_sort_img`, {
        //         delFolder,
        //         delFile,
        //     });
        // } catch (error) {}

        imgArr.splice(this.value, 1);
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

                let res = {};
                // try {
                //     res = await axios.post(
                //         `${back_api}/upload_sort_img`,
                //         imgForm,
                //         {
                //             headers: {
                //                 "Content-Type": "multipart/form-data",
                //             },
                //         },
                //     );
                // } catch (error) {
                //     console.error("Error during image upload:", error.message);
                //     alert("이미지 업로드 오류! 다시 시도해주세요!");
                //     return;
                // }

                console.log(res);

                if (res.status == 200) {
                    addVal(res.data.baseUrl);
                    setDetailImgCount = imgArr.length - 1;
                    updateImg(imgArr);
                }
            } catch (error) {
                console.error("Error during image compression:", error);
                alert("이미지 업로드 오류! 다시 시도해주세요!");
            }
        };
    };

    // 아래는 sortable 관련 함수! 건드리지 말기!!

    useSortable(() => sortable, {
        animation: 200,
        handle: ".my-handle",
        ghostClass: "opacity-0",
        onEnd(evt) {
            console.log("*******************************");
            console.log(evt);

            imgArr = reorder(imgArr, evt);
            updateImg(imgArr);
        },
    });

    function useSortable(getter, options) {
        $effect(() => {
            const sortableEl = getter();
            const sortable = sortableEl
                ? Sortable.create(sortableEl, options)
                : null;
            return () => sortable?.destroy();
        });
    }

    function reorder(array, evt) {
        // should have no effect on stores or regular array
        const workArray = $state.snapshot(array);

        // get changes
        const { oldIndex, newIndex } = evt;

        if (oldIndex === undefined || newIndex === undefined) {
            return workArray;
        }
        if (newIndex === oldIndex) {
            return workArray;
        }

        // move elements
        const target = workArray[oldIndex];
        const increment = newIndex < oldIndex ? -1 : 1;

        for (let k = oldIndex; k !== newIndex; k += increment) {
            workArray[k] = workArray[k + increment];
        }
        workArray[newIndex] = target;
        return workArray;
    }

    // function handleLiClick(event) {
    //     const liElement = event.currentTarget;
    //     setDetailImgCount = Number(liElement.getAttribute("data-idx"));
    // }
</script>

<div class="hidden opacity-0"></div>
<!-- {#if detailShow && imgArr.length > 0}
    <div>
        <img src={imgArr[setDetailImgCount]["href"]} alt="" />
    </div>
{/if} -->
<ul class="flex flex-wrap" bind:this={sortable}>
    {#each imgArr as img, idx (img)}
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <!-- svelte-ignore event_directive_deprecated -->
        <li
            class="m-2 flex w-24 h-24 items-center justify-center gap-1 border-2 my-handle rounded-lg overflow-hidden relative"
            data-idx={idx}
        >
            <button
                class=" absolute top-0 right-0"
                type="button"
                value={idx}
                on:click={deleteImg}
            >
                <i class="fa fa-times-circle-o" aria-hidden="true"></i>
            </button>

            <img src={img.href} alt="" />
        </li>
    {/each}
</ul>

<!-- svelte-ignore event_directive_deprecated -->
<button
    class="btn btn-info btn-sm text-white pretendard"
    type="button"
    on:click={onFileSelected}
>
    이미지 추가하기
</button>
