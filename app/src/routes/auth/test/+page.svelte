<script>
    
    console.log(import.meta.env.VITE_KAKAO_RESTAPI);
    
    const kakao_login = () => {
        const kakaoInfo = {
            // kakao_restapi: "e6c8c90ba06c8dcbe1825e0785679d30",
            kakao_restapi: import.meta.env.VITE_KAKAO_RESTAPI,
            kakao_redirect: import.meta.env.VITE_KAKAO_REDIRECT_URI,
        };
        location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoInfo.kakao_restapi}&redirect_uri=${kakaoInfo.kakao_redirect}&response_type=code`;
    };
</script>

<button class="pretendard font-bold text-lg" on:click={kakao_login}>
    인테리어/생활
</button>
