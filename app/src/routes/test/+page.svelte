<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

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

    function ssibalTest() {
        window.open(`/testpop`, "popup", "width=550,height=670");
    }

    function paymentSuccess(e) {
        console.log(e.data);
    }
</script>

<svelte:window on:message={paymentSuccess} />

<button on:click={ssibalTest}> testBtn </button>
