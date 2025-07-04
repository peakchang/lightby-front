<script>
    import Sortable from "sortablejs";
    import axios from "axios";
    import {
        back_api,
        back_api_origin,
        public_img_bucket,
        img_bucket,
    } from "$lib/const";
    import uploadImageAct from "$lib/lib";
    
    import fileinput from "daisyui/components/fileinput";

    let {
        updateImg,
        imgModifyList = [],
        maxImgCount = 999999,
        folder = "testfolder",
        detailShow = true,
    } = $props();
    let imgArr = $state([]);
    let sortable = $state(null);
    let setDetailImgCount = $state(0);

    if (imgModifyList && imgModifyList.length > 0) {
        const tempImgArr = [];
        for (let i = 0; i < imgModifyList.length; i++) {
            const con = imgModifyList[i];
            const imgObj = { id: i + 1, href: con };
            tempImgArr.push(imgObj);
        }
        imgArr = tempImgArr;
    }

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
        const delPath = delTarget.href;

        try {
            const res = await axios.post(`${back_api}/img/delete`, {
                delPath,
            });
        } catch (error) {
            console.error(error.message);
        }

        imgArr.splice(this.value, 1);
        const type = "subtract";
        updateImg({ imgArr, url: delPath, type });
    }

    function onFileSelected() {
        
        uploadImageAct(
            `${back_api}/img/upload_single`,
            { folder },
            (err, imgData) => {
                
                if (err) {
                    alert("이미지 업로드 실패! 다시 시도해주세요!");
                }

                try {
                    addVal(imgData.saveUrl);
                    setDetailImgCount = imgArr.length - 1;

                    const type = "add";
                    updateImg({ imgArr, url: imgData.saveUrl, type });
                } catch (err) {
                    console.error(err.message);
                } finally {
                }
            },
        );
    }

    // 아래는 sortable 관련 함수! 건드리지 말기!!

    useSortable(() => sortable, {
        animation: 200,
        handle: ".my-handle",
        ghostClass: "opacity-0",
        onEnd(evt) {
            imgArr = reorder(imgArr, evt);
            updateImg({ imgArr });
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
<ul class="flex flex-wrap m-1" bind:this={sortable}>
    {#each imgArr as img, idx (img)}
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <!-- svelte-ignore event_directive_deprecated -->
        <li
            class="m-1 flex w-28 h-24 items-center justify-center gap-1 border border-gray-300 my-handle rounded-lg overflow-hidden relative"
            data-idx={idx}
        >
            <button
                class="absolute top-0 right-1 text-red-500 cursor-pointer"
                type="button"
                value={idx}
                on:click={deleteImg}
            >
                <i class="fa fa-times-circle-o" aria-hidden="true"></i>
            </button>

            <img src={`${public_img_bucket}${img.href}`} alt="" />
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
