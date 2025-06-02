<script>
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";

    import deflectSound from "$lib/assets/sounds/laser_deflect.mp3";
    import annoyingHumSound from "$lib/assets/sounds/saber_hum.mp3";

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
    let p1Lives = 5;

    let p2 = {
        x: 1920 - 360 - 12,
        y: 540 - 150,
        width: 12,
        height: 300,
        color: "hsl(0deg, 100%, 60%)",
        flicker: 1,
    };
    let p2Lives = 5;

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

    /** @type {Object.<string, boolean>} */
    let keysPressed = {};

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
        if (ball.x <= 0) {
            // in p1 endzone
            p1Lives--;
            ball.x = 960;
            ball.y = 540;
            ball.angle = Math.PI / 3;
        }
        if (ball.x >= 1920) {
            // in p2 endzone
            p2Lives--;
            ball.x = 960;
            ball.y = 540;
            ball.angle = 2 * Math.PI / 3;
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

        frameCount++;
        requestAnimationFrame(mainGameLoop);
    }

    onMount(() => {
        resizeGameScreen();
        window.addEventListener("resize", resizeGameScreen);

        window.addEventListener("keydown", (e) => {
            keysPressed[e.key] = true;
        });
        window.addEventListener("keyup", (e) => {
            keysPressed[e.key] = false;
        });

        mainGameLoop();
    });
</script>

<div style:width="1920px" style:height="1080px" style:background-color="black" bind:this={gameScreen}
    style:position="fixed" style:top="50vh" style:left="50vw" style:transform="translate(-50%, -50%)"
    style:overflow="hidden">

    <!-- player 1 -->
    {#each (new Array(6)).fill(0).map((_, i) => Math.pow(2, i) * 3) as glowRadius}
        <div style:width="{p1.width}px" style:height="{p1.height}px" style:background-color={p1.color}
            style:position="absolute" style:top="{p1.y}px" style:left="{p1.x}px"
            style:border-radius="6px/18px" style:filter="blur({glowRadius * p1.flicker}px)" style:mix-blend-mode="svreen"></div>
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

            <div style:width="{distance}px" style:height="{ball.radius * 2}px" style:background-color={ball.color}
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

    <div style:position="fixed" style:top="20px" style:left="20px" style:color="white">
        Health: {p1Lives}
    </div>
    <div style:position="fixed" style:top="20px" style:right="20px" style:color="white">
        Health: {p2Lives}
    </div>

    <!--<div style:position="fixed" style:top="10px" style:left="10px" style:color="white">
        Delta Time: {deltaTime.toFixed(3)}
    </div>-->

</div>

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

<svelte:head>
    <link rel="preload" as="audio" href={deflectSound} />
    <link rel="preload" as="audio" href={annoyingHumSound} />
</svelte:head>