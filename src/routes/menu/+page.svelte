<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    import logo from "$lib/assets/images/logo.jpg";

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


<div bind:this={gameScreen} style:width="1920px" style:height="1080px" style:background-color="black"
    style:position="fixed" style:top="50vh" style:left="50vw" style:transform="translate(-50%, -50%)"
    style:overflow="hidden">
    <div style:position="absolute" style:left="960px" style:top="540px" style:transform="translate(-50%, -50%)"
        style:font-size="36px" style:color="white" style:text-align="center" style:user-select="none">
        <img src={logo} alt="Saber Pong II" style:width="800px" style:height="auto" style:font-size="72px" draggable={false} />
        <br /> <br />
        <button on:click={() => {
            goto("../arena");
        }}>New Game</button>
    </div>
</div>

<style>
    button {
        border: 5px solid white;
        border-radius: 5px;
        background-color: transparent;
        color: white;
        font-weight: bold;
        text-shadow: 0 0 4px white, 0 0 14px white;
        box-shadow: 0 0 4px white, 0 0 14px white, inset 0 0 4px white, inset 0 0 14px white;
        transition: text-shadow 0.3s, box-shadow 0.3s;
        font-size: 36px;
        padding: 10px 20px;
    }

    button:hover {
        --glow-color: hsl(200deg, 100%, 60%);
        text-shadow: 0 0 10px var(--glow-color), 0 0 20px var(--glow-color);
        box-shadow: 0 0 10px var(--glow-color), 0 0 20px var(--glow-color), inset 0 0 10px var(--glow-color), inset 0 0 20px var(--glow-color);
    }
</style>