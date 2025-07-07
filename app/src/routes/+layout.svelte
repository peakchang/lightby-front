<script>
	import "../app.css";

	import { page } from "$app/stores";
	import { fly } from "svelte/transition";
	import { browser } from "$app/environment";

	import { derived } from "svelte/store";

	import { toastStore } from "$lib/stores/stores";
	import Toast from "$lib/components/Toast.svelte";

	import { loadingStore } from "$lib/stores/stores";
	import Loading from "$lib/components/Loading.svelte";

	import { user_info } from "$lib/stores/stores";
	import { onMount } from "svelte";

	let { data, children } = $props();
	onMount(() => {
		if (data.user) {
			$user_info = data.user;
		}
	});

	// 현재 경로 감지용 key 생성
	const key = derived(page, ($page) => $page.url.pathname);

	// 현재 경로에 따라 애니메이션 사용할지 결정
	let useAnimation = $state(false);

	const animatedRoutes = [
		"registjob",
		"detail",
		"manage_board",
		"auth/manage",
		"showfee/",
		"simplewrite",
		"test/t1",
		"joboffer",
	];

	const unsubscribe = page.subscribe(($page) => {
		// useAnimation = animatedRoutes.includes($page.url.pathname);

		useAnimation = animatedRoutes.some((item) =>
			$page.url.pathname.includes(item),
		);
	});
</script>

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
</svelte:head>

<div class="site-wrab">
	<div class="max-w-[640px] mx-auto bg-white min-h-screen text-black">
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

<style>
	:global(body) {
		user-select: none;
		-webkit-user-drag: none;
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
	}

	:global(#toast) {
		transition: opacity 0.5s ease-in-out;
	}
</style>
