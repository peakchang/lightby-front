<!-- 메인 페이지 (+page.svelte) -->
<script>
    import { browser } from "$app/environment";
    import { user_info } from "$lib/stores/stores";
    console.log($user_info);
</script>

<a href="/test/t1">
    <button> pageMove </button>
</a>
