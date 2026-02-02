<script>
    import { onMount } from "svelte";

    let swiperContainer;
    let swiper;

    // 테스트용 이미지 데이터
    const slides = [
        {
            id: 1,
            image: "https://picsum.photos/800/400?random=1",
            title: "슬라이드 1",
        },
        {
            id: 2,
            image: "https://picsum.photos/800/400?random=2",
            title: "슬라이드 2",
        },
        {
            id: 3,
            image: "https://picsum.photos/800/400?random=3",
            title: "슬라이드 3",
        },
        {
            id: 4,
            image: "https://picsum.photos/800/400?random=4",
            title: "슬라이드 4",
        },
    ];

    onMount(async () => {
        // Swiper 동적 임포트
        const SwiperModule = await import(
            "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs"
        );

        swiper = new SwiperModule.default(swiperContainer, {
            loop: true,
            speed: 600,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
        });

        // 컴포넌트 언마운트 시 Swiper 정리
        return () => {
            if (swiper) {
                swiper.destroy();
            }
        };
    });
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
    />
</svelte:head>

<div class="container">
    <h1>SvelteKit 5 + Swiper 테스트</h1>

    <div class="swiper-container" bind:this={swiperContainer}>
        <div class="swiper-wrapper">
            {#each slides as slide (slide.id)}
                <div class="swiper-slide">
                    <img src={slide.image} alt={slide.title} />
                    <div class="slide-caption">
                        <h2>{slide.title}</h2>
                    </div>
                </div>
            {/each}
        </div>

        <!-- 네비게이션 버튼 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>

        <!-- 페이지네이션 -->
        <div class="swiper-pagination"></div>
    </div>

    <div class="info">
        <p>✅ 자동 재생 (3초)</p>
        <p>✅ 좌우 네비게이션 버튼</p>
        <p>✅ 하단 페이지네이션</p>
        <p>✅ 무한 루프</p>
    </div>
</div>

<style>
    .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        text-align: center;
        color: #333;
        margin-bottom: 2rem;
    }

    .swiper-container {
        width: 100%;
        height: 400px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .swiper-slide {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
    }

    .swiper-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .slide-caption {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
    }

    .slide-caption h2 {
        margin: 0;
        font-size: 1.5rem;
    }

    .info {
        margin-top: 2rem;
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 8px;
        text-align: center;
    }

    .info p {
        margin: 0.5rem 0;
        font-size: 1.1rem;
        color: #555;
    }

    /* Swiper 버튼 커스터마이징 */
    :global(.swiper-button-prev),
    :global(.swiper-button-next) {
        color: white;
        background: rgba(0, 0, 0, 0.5);
        width: 44px;
        height: 44px;
        border-radius: 50%;
    }

    :global(.swiper-button-prev:after),
    :global(.swiper-button-next:after) {
        font-size: 20px;
    }

    :global(.swiper-pagination-bullet) {
        background: white;
        opacity: 0.7;
    }

    :global(.swiper-pagination-bullet-active) {
        background: white;
        opacity: 1;
    }
</style>
