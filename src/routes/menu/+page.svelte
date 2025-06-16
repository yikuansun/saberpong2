<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    import logo from "$lib/assets/images/logo.jpg";
    import ExpletusSansTtf from "$lib/assets/fonts/ExpletusSans-VariableFont_wght.ttf";
    import Exo2Ttf from "$lib/assets/fonts/Exo2-VariableFont_wght.ttf";
    import bgVideo from "$lib/assets/videos/homescreenLoop.mp4";
    import music from "$lib/assets/music/lady on the track 132.mp3";

    /** @type {HTMLDivElement} */
    let gameScreen;

    function resizeGameScreen() {
        let scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
        gameScreen.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    let curtainVisible = true;
    let screenFadeDuration = 500;

    /**
     * Go to a page & use fade-out effect
     * @param {string} endpt path to go to
     */
    function gotoCool(endpt) {
        curtainVisible = true;
        setTimeout(() => { goto(endpt); }, screenFadeDuration + 10);
    }

    onMount(() => {
        resizeGameScreen();
        window.addEventListener("resize", resizeGameScreen);

        setTimeout(() => { curtainVisible = false; }, 10);
    });
</script>

<div bind:this={gameScreen} style:width="1920px" style:height="1080px" style:background-color="#141414"
    style:position="fixed" style:top="50vh" style:left="50vw" style:transform="translate(-50%, -50%)"
    style:overflow="hidden">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video autoplay muted loop style:width="1920px" style:height="1080px" style:position = "absolute"
        style:top="0px" style:left="0px" style:mix-blend-mode="screen"
        on:contextmenu={(e) => e.preventDefault()} on:click={(e) => e.preventDefault()}>
        <source src={bgVideo} type="video/mp4" />
    </video>
    <div style:position="absolute" style:left="960px" style:top="540px" style:transform="translate(-50%, -50%)"
        style:font-size="36px" style:color="white" style:text-align="center" style:user-select="none" style:mix-blend-mode="screen">
        <img src={logo} alt="Saber Pong II" style:width="800px" style:height="auto" style:font-size="72px" draggable={false} />
        <br />
        <button on:click={() => {
            gotoCool("../arena");
        }}>New Game (Player vs. Player)</button>
        <br />
        <button on:click={() => {
            gotoCool("../arena");
        }}>New Game (Player vs. CPU)</button>
        <br />
        <button on:click={() => {

        }}>Credits</button>
    </div>

    {#if curtainVisible}
        <div style:position="absolute" style:left="0px" style:top="0px" style:width="1920px" style:height="1080px"
            style:background-color="black" transition:fade={{ duration: screenFadeDuration, }}></div>
    {/if}
</div>

<audio autoplay loop on:timeupdate={(e) => {
    if (e.target) {
        let buffer = 0.44;
        if (e.target.currentTime > e.target.duration - buffer) {
            e.target.currentTime = 0;
            e.target.play();
        }
    }
}}>
    <source src={music} type="audio/mpeg">
</audio>

<style>
    button {
        /*border: 5px solid white;
        border-radius: 5px;*/
        border: 0;
        background-color: transparent;
        color: white;
        text-shadow: 0 0 10px white, 0 0 20px white, 0 0 40px white;
        /*box-shadow: 0 0 4px white, 0 0 14px white, inset 0 0 4px white, inset 0 0 14px white;*/
        transition: text-shadow 0.3s, box-shadow 0.3s, color 0.3s;
        font-size: 36px;
        padding: 10px 20px;
        font-family: "Exo2", sans-serif;
    }

    button:hover {
        --glow-color: hsl(200deg, 100%, 70%);
        text-shadow: 0 0 15px var(--glow-color), 0 0 30px var(--glow-color), 0 0 60px var(--glow-color), 0 0 120px var(--glow-color);
        color: hsl(200deg, 100%, 88%);
        /*box-shadow: 0 0 10px var(--glow-color), 0 0 20px var(--glow-color), inset 0 0 10px var(--glow-color), inset 0 0 20px var(--glow-color);*/
        cursor: pointer;
    }

    @font-face {
        font-family: "ExpletusSans";
        src: url("$lib/assets/fonts/ExpletusSans-VariableFont_wght.ttf");
    }

    @font-face {
        font-family: "Exo2";
        src: url("$lib/assets/fonts/Exo2-VariableFont_wght.ttf");
    }
</style>

<svelte:head>
    <link rel="preload" as="font" href={ExpletusSansTtf} type="font/ttf" crossorigin="anonymous" />
    <link rel="preload" as="font" href={Exo2Ttf} type="font/ttf" crossorigin="anonymous" />
</svelte:head>