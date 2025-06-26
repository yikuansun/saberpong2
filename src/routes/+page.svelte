<script>
    import blankSound from "$lib/assets/sounds/nothing.mp3";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import Exo2Ttf from "$lib/assets/fonts/Exo2-VariableFont_wght.ttf";
    import ExpletusSansTtf from "$lib/assets/fonts/ExpletusSans-VariableFont_wght.ttf";
    import logoImg from "$lib/assets/images/logo.jpg";
    import bgVideo from "$lib/assets/videos/homescreenLoop.mp4";
    import argonMusic from "$lib/assets/music/argon inst mix ab oz.mp3";
    import dreamADreamMusic from "$lib/assets/music/dream a dream inst mix ab oz.mp3";
    import ladyOnTheTrackMusic from "$lib/assets/music/lady on the track 132.mp3";
    import deflectSound from "$lib/assets/sounds/laser_deflect.mp3";
    import annoyingHumSound from "$lib/assets/sounds/saber_hum.mp3";
    import serveSound from "$lib/assets/sounds/laser_blast.mp3";
    import pauseSound from "$lib/assets/sounds/pause.wav";
    import scoreSound from "$lib/assets/sounds/score.wav";
    import beepSound from "$lib/assets/sounds/beep.wav";

    /**
     * Scrape assets (attempt to preload)
     * @param {string[]} urlList list of URLs to load
     */
    function loadAssets(urlList) {
        for (let url of urlList) {
            fetch(url);
        }
    }
    

    let autoplayAllowed = true;

    onMount(() => {
        let aud = new Audio(blankSound);
        aud.addEventListener("canplaythrough", () => {
            aud.play().then(() => {
                // media autoplay allowed
                goto("./menu");
            }).catch((e) => {
                // media autoplay not allowed, need user interaction
                console.log(e.message);
                autoplayAllowed = false;
            });
        });

        loadAssets([
            Exo2Ttf,
            ExpletusSansTtf,
            logoImg,
            bgVideo,
            argonMusic,
            dreamADreamMusic,
            ladyOnTheTrackMusic,
            deflectSound,
            annoyingHumSound,
            serveSound,
            pauseSound,
            scoreSound,
            beepSound,
        ]);
    });
</script>

{#if !autoplayAllowed}
    <div style:width="1920px" style:height="1080px"
        style:position="fixed" style:top="0" style:left="0"
        style:background-color="lightgrey"></div>
    <button style:position="fixed"
        style:left="960px" style:top="540px"
        style:transform="translate(-50%, -50%)"
        on:click={() => { goto("./menu"); }}
        style:padding="14px 24px" style:font-size="24px">
        Run Game
    </button>
{:else}
    <div style:width="1920px" style:height="1080px"
        style:position="fixed" style:top="0" style:left="0"
        style:background-color="black"></div>
{/if}