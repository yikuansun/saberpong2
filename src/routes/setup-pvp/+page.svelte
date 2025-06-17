<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    import ExpletusSansTtf from "$lib/assets/fonts/ExpletusSans-VariableFont_wght.ttf";
    import Exo2Ttf from "$lib/assets/fonts/Exo2-VariableFont_wght.ttf";
    import music from "$lib/assets/music/lady on the track 132.mp3";
    import ColorSelect from "$lib/components/ColorSelect.svelte";

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

    let params = {
        P1_COLOR: "hsl(204deg, 100%, 54%)",
        P2_COLOR: "hsl(0deg, 100%, 60%)",
        BALL_COLOR: "hsl(100deg, 100%, 50%)",
        BALL_SPEED: 842,
        MAX_LIVES: 3,
        P1_NAME: "Player 1",
        P2_NAME: "Player 2",
        P1_UP_KEY: "w",
        P1_DOWN_KEY: "s",
        P2_UP_KEY: "ArrowUp",
        P2_DOWN_KEY: "ArrowDown",
        MOBILE_CONTROLS: false,
        AI_LEVEL: 1,
    };

    let availLaserColors = [
        {
            color: "hsl(100deg, 100%, 50%)",
            locked: false,
            unlockMessage: "",
        },
        {
            color: "hsl(5deg, 100%, 64%)",
            locked: true,
            unlockMessage: "Unlock by beating the Normal CPU in a 5-point game.",
        },
        {
            color: "hsl(210deg, 100%, 64%)",
            locked: true,
            unlockMessage: "Unlock by beating the Advanced CPU in a 5-point game.",
        },
        {
            color: "hsl(30deg, 100%, 54%)",
            locked: true,
            unlockMessage: "Unlock by beating the Expert CPU in a 5-point game.",
        },
    ];

    let availSaberColors = [
        {
            color: "hsl(204deg, 100%, 54%)",
            locked: false,
            unlockMessage: "",
        },
        {
            color: "hsl(0deg, 100%, 60%)",
            locked: false,
            unlockMessage: "",
        },
        {
            color: "hsl(100deg, 100%, 50%)",
            locked: true,
            unlockMessage: "Unlock by beating the Normal CPU in an 11-point game.",
        },
        {
            color: "hsl(289deg, 100%, 50%)",
            locked: true,
            unlockMessage: "Unlock by beating the Expert CPU in an 8-point game.",
        },
        {
            color: "hsl(30deg, 100%, 54%)",
            locked: true,
            unlockMessage: "Unlock by beating the Expert CPU in an 11-point game.",
        },
    ];

    onMount(() => {
        resizeGameScreen();
        window.addEventListener("resize", resizeGameScreen);

        if (window.localStorage.getItem("RED_LASER_UNLOCKED") == "yes") {
            availLaserColors[1].locked = false;
        }
        if (window.localStorage.getItem("BLUE_LASER_UNLOCKED") == "yes") {
            availLaserColors[2].locked = false;
        }
        if (window.localStorage.getItem("ORANGE_LASER_UNLOCKED") == "yes") {
            availLaserColors[3].locked = false;
        }

        setTimeout(() => { curtainVisible = false; }, 10);
    });
</script>

<div bind:this={gameScreen} style:width="1920px" style:height="1080px" style:background-color="#141414"
    style:position="fixed" style:top="50vh" style:left="50vw" style:transform="translate(-50%, -50%)"
    style:overflow="hidden">
    <table style:position="absolute" style:top="0" style:left="0" style:width="1920px" style:height="1080px"
        style:color="white" style:font-size="27px" style:font-family="Exo2">
        <tr>
            <td colspan="2" style:text-align="center" style:font-size="24px">
                <button on:click={() => {
                    gotoCool("../menu");
                }} style:font-size="24px">Return to Menu</button>
                <br /> <br />
                <b style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px" style:font-size="32px">New Game (Player vs. Player)</b>
            </td>
        </tr>
        <tr>
            <td colspan="2" style:text-align="center">
                <p style:display="inline-block" style:margin="0" style:text-align="left" style:width="500px">
                    <label>
                        Laser Color: <br />
                        <input type="hidden" bind:value={params.BALL_COLOR} />
                        <ColorSelect bind:value={params.BALL_COLOR} availColors={availLaserColors} />
                    </label> <br />
                    <label>
                        Laser Speed:
                        <select bind:value={params.BALL_SPEED}>
                            <option value={444}>Slow</option>
                            <option value={842}>Normal</option>
                            <option value={1111}>Fast</option>
                        </select>
                    </label> <br />
                    <label>
                        Starting Lives:
                        <input type="number" bind:value={params.MAX_LIVES} min={3} max={11} />
                    </label>
                </p>
            </td>
        </tr>
        <tr>
            <td style:text-align="center" style:width="50%">
                <b style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px" style:font-size="32px">Player 1</b>
                <br /> <br />
                <label>
                    Color: <br />
                    <input type="hidden" bind:value={params.P1_COLOR} />
                    <ColorSelect bind:value={params.P1_COLOR} availColors={availSaberColors} />
                </label> <br />
                <label>
                    Nickname:
                    <input type="text" bind:value={params.P1_NAME} />
                </label> <br />
                <label>
                    Control Scheme:
                    <select on:input={(e) => {
                        let [ upKey, downKey ] = e.target.value.split("/");
                        params.P1_UP_KEY = upKey;
                        params.P1_DOWN_KEY = downKey;
                    }}>
                        <option value="w/s" selected>W/A</option>
                    </select>
                </label>
            </td>
            <td style:text-align="center" style:width="50%">
                <b style:font-family="ExpletusSans" style:font-variant="small-caps" style:letter-spacing="7px" style:font-size="32px">Player 2</b>
                <br /> <br />
                <label>
                    Color: <br />
                    <input type="hidden" bind:value={params.P2_COLOR} />
                    <ColorSelect bind:value={params.P2_COLOR} availColors={availSaberColors} />
                </label> <br />
                <label>
                    Nickname:
                    <input type="text" bind:value={params.P2_NAME} />
                </label> <br />
                <label>
                    Control Scheme:
                    <select on:input={(e) => {
                        let [ upKey, downKey ] = e.target.value.split("/");
                        params.P2_UP_KEY = upKey;
                        params.P2_DOWN_KEY = downKey;
                    }}>
                        <option value="ArrowUp/ArrowDown" selected>Arrow Keys</option>
                        <option value="i/k">I/K</option>
                        <option value="PONG_AI/PONG_AI" hidden>ai lmao</option>
                    </select>
                </label>
            </td>
        </tr>
        <tr>
            <td colspan="2" style:text-align="center">
                <button on:click={() => {
                    let searchParams = new URLSearchParams();
                    for (let [key, value] of Object.entries(params)) {
                        searchParams.set(key, value);
                    }
                    gotoCool(`../arena?${searchParams.toString()}`);
                }} style:font-size="24px">Start Game</button>
            </td>
        </tr>
    </table>

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

    :global(body) {
        background-color: black;
    }
</style>

<svelte:head>
    <link rel="preload" as="font" href={ExpletusSansTtf} type="font/ttf" crossorigin="anonymous" />
    <link rel="preload" as="font" href={Exo2Ttf} type="font/ttf" crossorigin="anonymous" />
</svelte:head>