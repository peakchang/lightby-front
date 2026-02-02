<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    function ssibalTest() {
        window.open(`/testpop`, "popup", "width=550,height=670");
    }

    function paymentSuccess(e) {
        console.log(e.data);
    }

    // let Kakao;

    // onMount(() => {
    //     if (typeof window !== "undefined" && !window.Kakao?.isInitialized()) {
    //         window.Kakao.init("72689d54e68abd94260d9284c64d7545");
    //         console.log(window.Kakao);
    //     }
    // });

    // try {
    //     Kakao.init("72689d54e68abd94260d9284c64d7545"); // 앱의 JavaScript 키
    //     console.log(Kakao);
    //     console.log(Kakao.isInitialized()); // true 확인
    // } catch (err) {
    //     console.error(err.message);
    // }

    // function kakaoTest() {
    //     window.Kakao.Share.sendDefault({
    //         objectType: "feed",
    //         content: {
    //             title: "제목입니다",
    //             description: "설명 텍스트입니다",
    //             imageUrl: "https://your-site.com/image.jpg",
    //             link: {
    //                 mobileWebUrl: "https://your-site.com",
    //                 webUrl: "https://your-site.com",
    //             },
    //         },
    //         buttons: [
    //             {
    //                 title: "웹으로 보기",
    //                 link: {
    //                     mobileWebUrl: "https://your-site.com",
    //                     webUrl: "https://your-site.com",
    //                 },
    //             },
    //         ],
    //     });
    // }
</script>

<svelte:window on:message={paymentSuccess} />

<button on:click={ssibalTest}> testBtn </button>

<div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
        <!-- Page content here -->
        <label for="my-drawer" class="btn btn-primary drawer-button"
            >Open drawer</label
        >
    </div>
    <div class="drawer-side">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"
        ></label>
        <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <!-- Sidebar content here -->
            <li><a>Sidebar Item 1</a></li>
            <li><a>Sidebar Item 2</a></li>
        </ul>
    </div>
</div>
