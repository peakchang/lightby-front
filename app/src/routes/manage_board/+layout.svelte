<script>
    import { goto } from "$app/navigation";
    import PageHeader from "$lib/components/PageHeader.svelte";
    let { children } = $props();
</script>

<svelte:head>
    <script
        type="text/javascript"
        defer
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS}&libraries=services&autoload=false`}
    ></script>

    <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
</svelte:head>

<PageHeader pageName={"내 글 관리"} prevPage={"/my"} />

<div class="bg-white relative min-h-screen suit-font">
    <div class="max-w-[640px] mx-auto pt-14 pb-24">
        {@render children()}
    </div>
</div>
