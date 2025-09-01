<script>
	import "../app.css";

	import { page } from "$app/stores";
	import { fly } from "svelte/transition";
	import { browser } from "$app/environment";
	import { derived } from "svelte/store";
	import Toast from "$lib/components/Toast.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import { onMount } from "svelte";

	import CustomModal from "$lib/components/CustomModal.svelte";
	import PdButton from "$lib/components/PdButton.svelte";
	import { goto } from "$app/navigation";

	import {
		user_info,
		toastStore,
		viewLimitAlertModal,
		loadingStore,
		scrollY,
		pageScrollStatus,
		scrollVal,
	} from "$lib/stores/stores";

	let { children } = $props();

	// 현재 경로 감지용 key 생성
	const key = derived(page, ($page) => $page.url.pathname);

	// 현재 경로에 따라 애니메이션 사용할지 결정
	let useAnimation = $state(false);
	let adminPage = $state(false);

	// 전체 wrapper!!! 스크롤 때문에!!
	let siteWrab = $derived({});

	onMount(() => {
		console.log(siteWrab);
		localStorage.removeItem("search_val");
	});

	$effect(() => {
		if (siteWrab) {
			if (!$pageScrollStatus) {
				siteWrab.scrollTop = 0;
			} else {
				siteWrab.scrollTop = $scrollVal;
			}

			if ($page.url.pathname.includes("adm")) {
				adminPage = true;
			} else {
				adminPage = false;
			}
		}
	});

	function handleScroll() {
		$scrollY = siteWrab.scrollTop;
	}

	const animatedRoutes = [
		"registjob",
		"detail",
		"auth/manage",
		"showfee/",
		"simplewrite",
		"test/t1",
		"joboffer",
		"faq",
	];

	const unsubscribe = page.subscribe(($page) => {
		// useAnimation = animatedRoutes.includes($page.url.pathname);

		useAnimation = animatedRoutes.some((item) =>
			$page.url.pathname.includes(item),
		);
	});
</script>

<CustomModal bind:visible={$viewLimitAlertModal} closeBtn={false}>
	<div class="text-center">
		<div class=" text-green-700 text-3xl mb-2">
			<i class="fa fa-exclamation-circle" aria-hidden="true"></i>
		</div>
		<div class="mb-5">
			<p>게시물을 더 확인 하시려면 로그인이 필요합니다.</p>
			<p>로그인 하시겠습니까?</p>
		</div>
		<div class="flex justify-center gap-3">
			<!-- svelte-ignore event_directive_deprecated -->
			<button
				class="btn btn-info text-white w-1/3"
				on:click={() => {
					goto("/auth/login");
				}}
			>
				로그인 바로가기
			</button>

			<button class="btn btn-soft w-1/3">닫기</button>
		</div>
	</div>
</CustomModal>

<!-- <div class="mt-10">
	<button
		on:click={() => {
			$loadingStore = true;
			setTimeout(() => {
				$loadingStore = false;
			}, 1500);
		}}>gogogo</button
	>

	<button
		on:click={() => {
			toastStore.set({
				show: true,
				message: "테스트토스트!",
				color: "green",
			});
		}}
	>
		glglglglgl
	</button>
</div> -->

<Loading />
<Toast />
<!-- svelte-ignore event_directive_deprecated -->

<svelte:head>
	<!-- Swiper JS -->
	<script
		src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
	></script>
	<!-- Link Swiper's CSS -->
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
	/>
	<!-- SUIT 폰트 CSS -->
	<link
		href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
		rel="stylesheet"
	/>

	<link
		rel="stylesheet"
		as="style"
		href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard-dynamic-subset.css"
	/>

	<link
		rel="stylesheet"
		href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
	/>

	<!-- <script src="https://developers.kakao.com/sdk/js/kakao.js"></script> -->
</svelte:head>

{#if adminPage}
	{@render children()}
{:else}
	<!-- svelte-ignore event_directive_deprecated -->
	<div class="site-wrab" bind:this={siteWrab} on:scroll={handleScroll}>
		<div
			class="max-w-[640px] mx-auto bg-white min-h-screen text-black site-wrab-inner"
		>
			{#key key}
				{#if useAnimation}
					<div in:fly={{ y: 300, duration: 300 }}>
						{@render children()}
					</div>
				{:else}
					<div>
						{@render children()}
					</div>
				{/if}
			{/key}
		</div>
	</div>
{/if}

<style>
	:global(body) {
		user-select: none;
		-webkit-user-drag: none;
		-ms-overflow-style: none; /* IE, Edge */
		overflow-y: scroll; /* 스크롤 유지 */
	}

	@font-face {
		font-family: "OKDDUNG";
		src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-02@1.0/OKDDUNG.woff2")
			format("woff2");
		font-weight: normal;
		font-style: normal;
	}
	@font-face {
		font-family: "KBO-Dia-Gothic_bold";
		src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/KBO-Dia-Gothic_bold.woff")
			format("woff");
		font-weight: 700;
		font-style: normal;
	}

	@font-face {
		font-family: "paperlogy";
		src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-1Thin.woff2")
			format("woff2");
		font-weight: 100;
		font-style: normal;
	}
	@font-face {
		font-family: "paperlogy";
		src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-2ExtraLight.woff2")
			format("woff2");
		font-weight: 200;
		font-style: normal;
	}
	@font-face {
		font-family: "paperlogy";
		src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-3Light.woff2")
			format("woff2");
		font-weight: 300;
		font-style: normal;
	}

	@font-face {
		font-family: "paperlogy";
		src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2")
			format("woff2");
		font-weight: 400;
		font-style: normal;
	}

	@font-face {
		font-family: "paperlogy";
		src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-5Medium.woff2")
			format("woff2");
		font-weight: 500;
		font-style: normal;
	}

	@font-face {
		font-family: "paperlogy";
		src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-6SemiBold.woff2")
			format("woff2");
		font-weight: 600;
		font-style: normal;
	}

	@font-face {
		font-family: "paperlogy";
		src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-7Bold.woff2")
			format("woff2");
		font-weight: 700;
		font-style: normal;
	}

	@font-face {
		font-family: "paperlogy";
		src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-8ExtraBold.woff2")
			format("woff2");
		font-weight: 800;
		font-style: normal;
	}

	@font-face {
		font-family: "paperlogy";
		src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-9Black.woff2")
			format("woff2");
		font-weight: 900;
		font-style: normal;
	}

	:global(.paperlogy) {
		font-family: "paperlogy";
	}

	:global(.kbo-font) {
		font-family: "KBO-Dia-Gothic_bold";
	}

	:global(.title-font) {
		font-family: "OKDDUNG";
	}

	:global(.suit-font) {
		font-family: "SUIT" !important;
	}

	:global(.input-base) {
		border-radius: 6px;
		padding: 7px 5px;
		border: 1px solid #cfcfcf;
		width: 100%;
		background-color: #f6f6f6;
	}
	:global(.input-base:focus) {
		border: 1px solid #40a9ff;
		outline: none;
		background-color: #ffffff;
	}
	:global(.in-th) {
		padding: 10px 5px;
		border: 1px solid #cfcfcf;
	}
	:global(.in-td) {
		border: 1px solid #cfcfcf;
	}

	@import url("/pretendard/pretendard.css");
	:global(.pretendard) {
		font-family: "Pretendard", sans-serif;
	}

	:global(.site-wrab) {
		background-color: #f3f6f6;

		max-height: 100vh;
		overflow-y: scroll; /* 세로 스크롤 유지 */
		scrollbar-width: none; /* Firefox 전용 */
		-ms-overflow-style: none; /* IE & Edge 구버전 */
	}

	.site-wrab::-webkit-scrollbar {
		display: none;
	}

	:global(#toast) {
		transition: opacity 0.5s ease-in-out;
	}
</style>
