<script>;
    import { onMount } from "svelte";

    /** @type {HTMLDivElement} */
    let gameScreen;

    function resizeGameScreen() {
        let scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
        gameScreen.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    onMount(() => {
        resizeGameScreen();
        window.addEventListener("resize", resizeGameScreen);
    });
</script>

<div bind:this={gameScreen} style:width="1920px" style:height="1080px" style:background-color="#141414"
    style:position="fixed" style:top="50vh" style:left="50vw" style:transform="translate(-50%, -50%)"
    style:overflow="hidden">
    <slot />
</div>

<style>
    :global(body) {
        background-color: black;
    }
</style>

<svelte:head>
    <title>Saber Pong II</title>
</svelte:head>