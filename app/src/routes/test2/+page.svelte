<script>
    import { Swiper, SwiperSlide } from "swiper/svelte";
    import { Navigation, Pagination, Autoplay } from "swiper/modules";

    const slides = [
        { id: 1, text: "첫 번째 슬라이드" },
        { id: 2, text: "두 번째 슬라이드" },
        { id: 3, text: "세 번째 슬라이드" },
    ];
</script>

<Swiper
    modules={[Navigation, Pagination, Autoplay]}
    navigation={true}
    pagination={{ clickable: true }}
    autoplay={{ delay: 2500, disableOnInteraction: false }}
    loop={true}
    class="mySwiper"
>
    {#each slides as slide}
        <SwiperSlide>{slide.text}</SwiperSlide>
    {/each}
</Swiper>

<style>
    .swiper {
        width: 100%;
        height: 300px;
    }
    .swiper-slide {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        background: #eee;
    }
</style>
