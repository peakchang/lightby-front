<script>
	import "../app.css";

	import { page } from "$app/stores";
	import { fly } from "svelte/transition";

	import { derived } from "svelte/store";
	import Toast from "$lib/components/Toast.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import { onMount } from "svelte";

	import CustomModal from "$lib/components/CustomModal.svelte";
	import PdButton from "$lib/components/PdButton.svelte";
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation";

	import {
		toastStore,
		viewLimitAlertModal,
		loadingStore,
		pageScrollStatus,
		scrollY,
		scrollVal,
	} from "$lib/stores/stores";

	let { children } = $props();

	// 현재 경로 감지용 key 생성
	const key = derived(page, ($page) => $page.url.pathname);

	// 현재 경로에 따라 애니메이션 사용할지 결정
	let useAnimation = $state(false);
	let exceptionPage = $state(false);

	// 전체 wrapper!!! 스크롤 때문에!!
	let siteWrab = $derived({});

	onMount(() => {
		localStorage.removeItem("search_val");
	});

	// 페이지 최초 진입시 $pageScrollStatus 에 따라 최상위 또는 마지막 스크롤 위치로!
	afterNavigate((e) => {
		if (!siteWrab) return;

		try {
			const from = e.from.route.id;
			const to = e.to.route.id;
			// 수수료 상세 제외 app 페이지 (하단 네비 메인 페이지) 끼리 이동시에는 최상위로 이동
			if (from.includes("(app)") && to.includes("(app)")) {
				if (
					!from.includes("showfee/[id]") &&
					!to.includes("showfee/[id]")
				) {
					$scrollVal = 0;
				}
			}
		} catch (error) {}

		if (!$pageScrollStatus) {
			siteWrab.scrollTop = 0;
		} else {
			siteWrab.scrollTop = $scrollVal;
		}
	});

	// $pageScrollStatus 가 true 일 경우 페이지 떠나기 전 스크롤 위치 저장
	beforeNavigate((e) => {
		if ($pageScrollStatus) {
			$scrollVal = $scrollY;
		}
	});

	$effect(() => {
		if (siteWrab) {
			// 어드민 페이지 or iframe 을 위한 페이지일 경우 제외
			if (
				$page.url.pathname.includes("adm") ||
				$page.url.pathname.includes("embed")
			) {
				exceptionPage = true;
			} else {
				exceptionPage = false;
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
		"joboffer",
		"faq",
		"mytalent",
		"manage_board",
		"manage_applicants",
	];

	const unsubscribe = page.subscribe(($page) => {
		// useAnimation = animatedRoutes.includes($page.url.pathname);

		useAnimation = animatedRoutes.some((item) =>
			$page.url.pathname.includes(item),
		);
	});
</script>

<CustomModal bind:visible={$viewLimitAlertModal} closeBtn={false}>
	<div
		class="max-w-sm mx-auto p-8 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 text-center suit-font"
	>
		<div class="relative inline-flex mb-6">
			<div
				class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center relative z-10"
			>
				<i class="fa fa-file-text-o text-2xl" aria-hidden="true"></i>
			</div>
			<div
				class="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm z-20"
			>
				<i class="fa fa-lock text-blue-600 text-sm"></i>
			</div>
		</div>

		<h3 class="text-xl font-bold text-gray-900 mb-3 tracking-tight">
			잠깐! 로그인이 필요해요
		</h3>
		<div class="text-gray-500 text-[15px] leading-relaxed mb-8">
			<p>게시물의 상세 내용을 더 확인하시려면</p>
			<p>로그인이 완료되어야 합니다.</p>
		</div>

		<div class="space-y-3">
			<button
				class="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
                   text-white font-bold rounded-2xl shadow-lg shadow-blue-100 transition-all"
				on:click={() => goto("/auth/login")}
			>
				로그인 바로가기
			</button>

			<button
				class="w-full py-3 text-gray-400 hover:text-gray-600 font-medium rounded-xl transition-colors text-sm"
				on:click={() => {
					/* 닫기 로직 */
				}}
			>
				나중에 볼게요
			</button>
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

{#if exceptionPage}
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

	:global(.base-input) {
		width: 100%;
		background-color: #f8fafc;
		color: #1e293b;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		font-size: 14px;
		padding: 1rem 1.25rem;

		/* 그림자 수정: 아래쪽으로 2px 정도 은은하게 깔리는 스타일 */
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.04),
			0 1px 1px rgba(0, 0, 0, 0.01);

		transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
	}

	:global(.base-input:focus) {
		border-color: #60a5fa;
		background-color: #ffffff;
		/* 포커스 시에는 그림자 대신 블루 광채(ring)로 강조 */
		box-shadow: 0 0 0 4px #eff6ff;
		/* 살짝 위로 들리는 느낌을 주고 싶다면 아래 주석 해제 */
		/* transform: translateY(-1px); */
	}

	/* Placeholder 스타일 (선택사항) */

	:global(.base-input::placeholder) {
		color: #94a3b8; /* slate-400 가독성 좋음 */
	}
</style>
