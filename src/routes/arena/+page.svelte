<script>
    import { onMount } from "svelte";
    import { fade, scale, fly } from "svelte/transition";

    import deflectSound from "$lib/assets/sounds/laser_deflect.mp3";
    import annoyingHumSound from "$lib/assets/sounds/saber_hum.mp3";
    import serveSound from "$lib/assets/sounds/laser_blast.mp3";
    import pauseSound from "$lib/assets/sounds/pause.wav";
    import scoreSound from "$lib/assets/sounds/score.wav";
    import beepSound from "$lib/assets/sounds/beep.wav";
    import ExpletusSansTtf from "$lib/assets/fonts/ExpletusSans-VariableFont_wght.ttf";
    import Exo2Ttf from "$lib/assets/fonts/Exo2-VariableFont_wght.ttf";

    /** @type {HTMLDivElement} */
    let gameScreen;

    function resizeGameScreen() {
        let scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
        gameScreen.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    let p1 = {
        x: 360,
        y: 540 - 150,
        width: 12,
        height: 300,
        color: "hsl(204deg, 100%, 54%)",
        flicker: 1,
    };
    let p1Lives = 10;

    let p2 = {
        x: 1920 - 360 - 12,
        y: 540 - 150,
        width: 12,
        height: 300,
        color: "hsl(0deg, 100%, 60%)",
        flicker: 1,
    };
    let p2Lives = 10;

    let ball = {
        x: 1920 / 2,
        y: 1080 / 2,
        radius: 4,
        angle: Math.PI / 3,
        color: "hsl(100deg, 100%, 50%)",
        speed: 842,
    };
    let ballPastPositions = [{x: ball.x, y: ball.y}];
    let laserLength = 150;

    let lensFlarePosition = {x: 0, y: 0};
    let lensFlareVisible = false;

    let serving = false;

    /** @type {Object.<string, boolean>} */
    let keysPressed = {};

    let paused = false;

    let deltaTime = 0; // velocities are in pixels per second
    let lastTime = (new Date()).getTime();
    let frameCount = 0;
    const saberSpeed = 444;
    let maxBounceAngle = 5 * Math.PI / 12;
    function mainGameLoop() {
        let startTime = (new Date()).getTime();
        deltaTime = (startTime - lastTime) / 1000;
        lastTime = startTime;

        if (keysPressed["w"]) {
            p1.y -= saberSpeed * deltaTime;
            if (p1.y < 0) p1.y = 0;
        }
        if (keysPressed["s"]) {
            p1.y += saberSpeed * deltaTime;
            if (p1.y > 1080 - p1.height) p1.y = 1080 - p1.height;
        }
        if (keysPressed["ArrowUp"]) {
            p2.y -= saberSpeed * deltaTime;
            if (p2.y < 0) p2.y = 0;
        }
        if (keysPressed["ArrowDown"]) {
            p2.y += saberSpeed * deltaTime;
            if (p2.y > 1080 - p2.height) p2.y = 1080 - p2.height;
        }

        if (ball.y <= 0) {
            // x unit velocity
            let xUV = Math.cos(ball.angle);
            let yUV = Math.sin(ball.angle);
            yUV = Math.abs(yUV);
            ball.angle = Math.atan2(yUV, xUV);
            // Why not use Math.PI * 2 - ball.angle? Because it may cause the ball to get stuck in the wall. Math.abs ensures the right direction
        }
        if (ball.y >= 1080) {
            let xUV = Math.cos(ball.angle);
            let yUV = Math.sin(ball.angle);
            yUV = Math.abs(yUV);
            ball.angle = -Math.atan2(yUV, xUV);
        }
        if (ball.x <= 0 - laserLength) {
            // in p1 endzone
            p1Lives--;
            ball.x = 960;
            ball.y = 540;
            ball.angle = Math.PI / 3;
            // shoot 1 second after goal
            ball.speed = 0;
            setTimeout(() => {
                ball.speed = 842;
                serving = true;
                setTimeout(() => { serving = false; }, 10);
            }, 3000);
            alert("Player 2 Scored!", p2.color, 2000, scoreSound);
        }
        if (ball.x >= 1920 + laserLength) {
            // in p2 endzone
            p2Lives--;
            ball.x = 960;
            ball.y = 540;
            ball.angle = 2 * Math.PI / 3;
            // shoot 1 second after goal
            ball.speed = 0;
            setTimeout(() => {
                ball.speed = 842;
                serving = true;
                setTimeout(() => { serving = false; }, 10);
            }, 3000);
            alert("Player 1 Scored!", p1.color, 2000, scoreSound);
        }

        lensFlareVisible = false;

        if (ball.y - ball.radius <= p1.y + p1.height && ball.y + ball.radius >= p1.y && ball.x + ball.radius >= p1.x && ball.x - ball.radius <= p1.x + p1.width) {
            // more info on bounce: https://gamedev.stackexchange.com/questions/4253/in-pong-how-do-you-calculate-the-balls-direction-when-it-bounces-off-the-paddl
            let relativeIntersectY = p1.y + p1.height / 2 - ball.y;
            let normalizedRelativeIntersectY = relativeIntersectY / p1.height * 2;
            ball.angle = -1 * normalizedRelativeIntersectY * maxBounceAngle;

            lensFlarePosition = {x: ball.x, y: ball.y};
            lensFlareVisible = true;
        }
        if (ball.y - ball.radius <= p2.y + p2.height && ball.y + ball.radius >= p2.y && ball.x + ball.radius >= p2.x && ball.x - ball.radius <= p2.x + p2.width) {
            let relativeIntersectY = p2.y + p2.height / 2 - ball.y;
            let normalizedRelativeIntersectY = relativeIntersectY / p2.height * 2;
            ball.angle = normalizedRelativeIntersectY * maxBounceAngle + Math.PI;

            lensFlarePosition = {x: ball.x, y: ball.y};
            lensFlareVisible = true;
        }

        ball.x += ball.speed * deltaTime * Math.cos(ball.angle);
        ball.y += ball.speed * deltaTime * Math.sin(ball.angle);
        ballPastPositions = [...ballPastPositions, {x: ball.x, y: ball.y}];
        let laserLengthActual = 0;
        for (let i = 0; i < ballPastPositions.length - 1; i++) {
            let distance = Math.sqrt(Math.pow(ballPastPositions[i].x - ballPastPositions[i + 1].x, 2) + Math.pow(ballPastPositions[i].y - ballPastPositions[i + 1].y, 2));
            laserLengthActual += distance;
        }
        while (laserLengthActual > laserLength) {
            let marginalDistance = Math.sqrt(Math.pow(ballPastPositions[0].x - ballPastPositions[1].x, 2) + Math.pow(ballPastPositions[0].y - ballPastPositions[1].y, 2));
            ballPastPositions = ballPastPositions.slice(1);
            laserLengthActual -= marginalDistance;
        }

        p1.flicker = 1 + 0.3 * Math.sin(Date.now() / 100);
        p2.flicker = 1 + 0.3 * Math.cos(Date.now() / 100);

        if (!paused) {
            frameCount++;
            requestAnimationFrame(mainGameLoop);
        }
    }

    let gameStarted = false;
    let curtainVisible = true;
    let screenFadeDuration = 500;

    let alertMessage = "";
    let alertColor = "white";
    /** @type {null | string} */
    let alertSound = null;
    let alertVisible = false;
    /**
     * Display custom alert message
     * @param {string} msg message to display
     * @param {string} [color="white"] color of the message
     * @param {number} [duration=2000] duration of the alert, in milliseconds (500ms buffer before and after)
     * @param {null | string} [sound=null] path to sound to play (if null, no sound)
     */
    function alert(msg, color="white", duration=2000, sound=null) {
        alertMessage = msg;
        alertColor = color;
        alertSound = sound;
        alertVisible = true;
        setTimeout(() => {
            alertVisible = false;
        }, duration);
    }

    let debugMode = false;

    onMount(() => {
        resizeGameScreen();
        window.addEventListener("resize", resizeGameScreen);

        window.addEventListener("keydown", (e) => {
            keysPressed[e.key] = true;
            if (e.key == " " && !e.repeat && gameStarted) {
                paused = !paused;
                if (!paused) {
                    lastTime = (new Date()).getTime();
                    frameCount++;
                    requestAnimationFrame(mainGameLoop);
                }
            }
            if (e.key == "i" && e.ctrlKey && e.altKey && !e.repeat) {
                e.preventDefault();
                debugMode = !debugMode;
            }
        });
        window.addEventListener("keyup", (e) => {
            keysPressed[e.key] = false;
        });

        setTimeout(() => {
            alert("3", "white", 1000, beepSound);
            setTimeout(() => {
                alert("2", "white", 1000, beepSound);
                setTimeout(() => {
                    alert("1", "white", 1000, beepSound);
                    setTimeout(() => {
                        gameStarted = true;
                        ball.speed = 842;
                        serving = true;
                        setTimeout(() => { serving = false; }, 10);
                        lastTime = (new Date()).getTime();
                        requestAnimationFrame(mainGameLoop);
                    }, 1500);
                }, 1500);
            }, 1500);
        }, screenFadeDuration + 10);

        setTimeout(() => { curtainVisible = false; }, 10);
    });
</script>

<div style:width="1920px" style:height="1080px" style:background-color="#111111" bind:this={gameScreen}
    style:position="fixed" style:top="50vh" style:left="50vw" style:transform="translate(-50%, -50%)"
    style:overflow="hidden">

    <!-- player 1 -->
    {#each (new Array(6)).fill(0).map((_, i) => Math.pow(2, i) * 3) as glowRadius}
        <div style:width="{p1.width}px" style:height="{p1.height}px" style:background-color={p1.color}
            style:position="absolute" style:top="{p1.y}px" style:left="{p1.x}px"
            style:border-radius="6px/18px" style:filter="blur({glowRadius * p1.flicker}px)" style:mix-blend-mode="screen"></div>
    {/each}
    <div style:width="{p1.width}px" style:height="{p1.height}px" style:background-color="white"
        style:position="absolute" style:top="{p1.y}px" style:left="{p1.x}px"
        style:border-radius="6px/18px" style:filter="blur({1 * p1.flicker}px)"></div>

    <!-- player 2 -->
    {#each (new Array(6)).fill(0).map((_, i) => Math.pow(2, i) * 3) as glowRadius}
        <div style:width="{p2.width}px" style:height="{p2.height}px" style:background-color={p2.color}
            style:position="absolute" style:top="{p2.y}px" style:left="{p2.x}px"
            style:border-radius="6px/18px" style:filter="blur({glowRadius * p2.flicker}px)" style:mix-blend-mode="screen"></div>
    {/each}
    <div style:width="{p2.width}px" style:height="{p2.height}px" style:background-color="white"
        style:position="absolute" style:top="{p2.y}px" style:left="{p2.x}px"
        style:border-radius="6px/18px" style:filter="blur({1 * p2.flicker}px)"></div>

    <!-- laser -->
    <div style:mix-blend-mode="screen" style:filter="blur(2px) drop-shadow(0 0 5px {ball.color}) drop-shadow(0 0 15px {ball.color})">
        <!-- for a smooth line, draw line segments between each pair of points -->
        {#each ballPastPositions as pastPosition, index}
            {@const midpointX = (index < ballPastPositions.length - 1) ? ((ballPastPositions[index + 1].x + pastPosition.x) / 2) : ((ball.x + pastPosition.x) / 2)}
            {@const midpointY = (index < ballPastPositions.length - 1) ? ((ballPastPositions[index + 1].y + pastPosition.y) / 2) : ((ball.y + pastPosition.y) / 2)}
            {@const distanceX = (index < ballPastPositions.length - 1) ? (ballPastPositions[index + 1].x - pastPosition.x) : (ball.x - pastPosition.x)}
            {@const distanceY = (index < ballPastPositions.length - 1) ? (ballPastPositions[index + 1].y - pastPosition.y) : (ball.y - pastPosition.y)}
            {@const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2))}
            {@const angle = Math.atan2(distanceY, distanceX)}

            <div style:width="{distance + ball.radius * 2}px" style:height="{ball.radius * 2}px" style:background-color={ball.color}
                style:position="absolute" style:top="{midpointY}px" style:left="{midpointX}px" style:transform="translate(-50%, -50%) rotate({angle}rad)"
                style:border-radius="100px"></div>
        {/each}
    </div>

    {#if lensFlareVisible}
        <div style:position="absolute" style:top="{lensFlarePosition.y}px" style:left="{lensFlarePosition.x}px"
            style:width="414px" style:height="32px" style:background-color="hsl(48deg, 100%, 64%)" style:filter="blur(16px)"
            style:transform="translate(-50%, -50%)" style:border-radius="100%" style:mix-blend-mode="screen"
            out:scale={{ duration: 222, }}></div>
        <div style:position="absolute" style:top="{lensFlarePosition.y}px" style:left="{lensFlarePosition.x}px"
            style:width="300x" style:height="20px" style:background-color="white" style:filter="blur(10px)"
            style:transform="translate(-50%, -50%)" style:border-radius="100%" style:mix-blend-mode="screen"
            out:scale={{ duration: 222, }}></div>
        <!-- since this sound effect occurs every time the lens flare is visible, we can group it together -->
        <audio autoplay volume="0.5" out:fade={{ delay: 911, duration: 1, }}> <!-- make sure sound finishes playing before element is destroyed -->
            <source src={deflectSound} type="audio/mpeg">
        </audio>
    {/if}

    {#each (new Array(p1Lives)).fill(0) as _, i}
        <div style:position="absolute" style:top="{24 + Math.floor(i / 5) * 54}px" style:left="{24 + (i % 5) * 54}px"
            style:width="32px" style:height="32px" style:filter="brightness(1.27) drop-shadow(0 0 3px {p1.color}) drop-shadow(0 0 10px {p1.color})"
            style:mix-blend-mode="screen" out:scale={{ duration: 500, }}>
            <div style:position="absolute" style:transform="translate(-50%, -50%)"
                style:top="11.5px" style:left="21.75px" style:width="16px" style:height="16px"
                style:border-radius="12px" style:background-color={p1.color}></div>
            <div style:position="absolute" style:transform="translate(-50%, -50%)"
                style:top="11.5px" style:left="10.25px" style:width="16px" style:height="16px"
                style:border-radius="12px" style:background-color={p1.color}></div>
            <div style:position="absolute" style:transform="translate(-50%, -50%) rotate(45deg)"
                style:top="17.25px" style:left="16px" style:width="16px" style:height="16px"
                style:background-color={p1.color}></div>
        </div>
    {/each}
    {#each (new Array(p2Lives)).fill(0) as _, i}
        <div style:position="absolute" style:top="{24 + Math.floor(i / 5) * 54}px" style:right="{24 + (i % 5) * 54}px"
            style:width="32px" style:height="32px" style:filter="brightness(1.27) drop-shadow(0 0 3px {p2.color}) drop-shadow(0 0 10px {p2.color})"
            style:mix-blend-mode="screen" out:scale={{ duration: 500, }}>
            <div style:position="absolute" style:transform="translate(-50%, -50%)"
                style:top="11.5px" style:left="21.75px" style:width="16px" style:height="16px"
                style:border-radius="12px" style:background-color={p2.color}></div>
            <div style:position="absolute" style:transform="translate(-50%, -50%)"
                style:top="11.5px" style:left="10.25px" style:width="16px" style:height="16px"
                style:border-radius="12px" style:background-color={p2.color}></div>
            <div style:position="absolute" style:transform="translate(-50%, -50%) rotate(45deg)"
                style:top="17.25px" style:left="16px" style:width="16px" style:height="16px"
                style:background-color={p2.color}></div>
        </div>
    {/each}

    {#if serving}
        <audio autoplay volume="0.5" out:fade={{ delay: 1801, duration: 1, }}> <!-- make sure sound finishes playing before element is destroyed -->
            <source src={serveSound} type="audio/mpeg">
        </audio>
    {/if}

    {#if paused}
        <audio autoplay>
            <source src={pauseSound} type="audio/wav">
        </audio>
        <div style:position="absolute" style:top="540px" style:left="960px" style:transform="translate(-50%, -50%)"
            style:color="white" style:font-size="36px" transition:fade={{ duration: 222, }}
            style:font-family="Exo2" style:user-select="none" style:mix-blend-mode="screen"
            style:text-align="center" style:text-shadow="0 0 20px white, 0 0 50px white">
            <span style:font-size="63px">Game Paused</span>
            <br /> <br />
            Press Space to Resume
        </div>
    {/if}

    {#if alertVisible}
        <div style:position="absolute" style:top="100px" style:left="960px" style:transform="translate(-50%, -50%)"
            style:color={alertColor} style:font-size="50px" transition:fly={{ duration: 500, y: "-100px", }}
            style:font-family="Exo2" style:user-select="none" style:mix-blend-mode="screen" style:filter="brightness(1.2)"
            style:text-align="center" style:text-shadow="0 0 14px {alertColor}, 0 0 24px {alertColor}, 0 0 40px {alertColor}">
            {alertMessage}
        </div>
        {#if alertSound}
            <audio autoplay on:ended={() => { alertSound = null; }}>
                <source src={alertSound} type="audio/mpeg">
            </audio>
        {/if}
    {/if}

    {#if curtainVisible}
        <div style:position="absolute" style:left="0px" style:top="0px" style:width="1920px" style:height="1080px"
            style:background-color="black" transition:fade={{ duration: screenFadeDuration, }}></div>
    {/if}

    {#if debugMode}
        <div style:position="absolute" style:top="0" style:left="0" style:color="white" style:background-color="hsla(0deg, 0%, 0%, 0.5)"
            style:padding="15px" style:font-size="20px">
            Delta Time: {deltaTime.toFixed(3)} sec <br />
            Framerate: {(1 / deltaTime).toFixed(2)} fps <br />
            Performance:
            {#if (1 / deltaTime) >= 60}
                <span style:color="white">Perfect</span>
            {:else if (1 / deltaTime) >= 45}
                <span style:color="green">Good</span>
            {:else if (1 / deltaTime) >= 30}
                <span style:color="yellow">Fine</span>
            {:else if (1 / deltaTime) >= 15}
                <span style:color="orange">Poor</span>
            {:else}
                <span style:color="red">wtf.</span>
            {/if}
        </div>
    {/if}

</div>

{#if gameStarted && !paused}
    <audio autoplay loop volume="1" on:timeupdate={(e) => {
        if (e.target) {
            let buffer = 0.5;
            if (e.target.currentTime > e.target.duration - buffer) {
                e.target.currentTime = 0;
                e.target.play();
            }
        }
    }}>
        <source src={annoyingHumSound} type="audio/mpeg">
    </audio>
{/if}

<style>
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
    <link rel="preload" as="audio" href={deflectSound} />
    <link rel="preload" as="audio" href={annoyingHumSound} />
    <link rel="preload" as="audio" href={serveSound} />
    <link rel="preload" as="audio" href={pauseSound} />
    <link rel="preload" as="font" href={ExpletusSansTtf} type="font/ttf" crossorigin="anonymous" />
    <link rel="preload" as="font" href={Exo2Ttf} type="font/ttf" crossorigin="anonymous" />
</svelte:head>