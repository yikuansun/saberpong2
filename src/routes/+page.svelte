<script>
    import { onMount } from "svelte";

    /** @type {HTMLDivElement} */
    let gameScreen;

    function resizeGameScreen() {
        let scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
        gameScreen.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    let p1 = {
        x: 150,
        y: 540 - 180,
        width: 16,
        height: 360,
        color: "hsl(200deg, 100%, 50%)",
    };

    let p2 = {
        x: 1920 - 150 - 16,
        y: 540 - 180,
        width: 16,
        height: 360,
        color: "hsl(0deg, 100%, 60%)",
    };

    let ball = {
        x: 1920 / 2,
        y: 1080 / 2,
        radius: 4,
        angle: Math.PI / 3,
        color: "hsl(100deg, 100%, 50%)",
        speed: 642,
    };
    let ballPastPositions = [{x: ball.x, y: ball.y}];
    let laserLength = 150;

    /** @type {Object.<string, boolean>} */
    let keysPressed = {};

    let deltaTime = 0; // velocities are in pixels per second
    let lastTime = (new Date()).getTime();
    let frameCount = 0;
    const saberSpeed = 444;
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
            let xUV = Math.cos(ball.angle);
            let yUV = Math.sin(ball.angle);
            xUV = Math.abs(xUV);
            ball.angle = Math.atan2(yUV, xUV);
        }
        if (ball.x >= 1920) {
            let xUV = Math.cos(ball.angle);
            let yUV = Math.sin(ball.angle);
            xUV = -Math.abs(xUV);
            ball.angle = Math.atan2(yUV, xUV);
        }

        if (ball.y <= p1.y + p1.height && ball.y >= p1.y && ball.x >= p1.x && ball.x <= p1.x + p1.width) {
            let xUV = Math.cos(ball.angle);
            let yUV = Math.sin(ball.angle);
            xUV = Math.abs(xUV);
            ball.angle = Math.atan2(yUV, xUV);
        }
        if (ball.y <= p2.y + p2.height && ball.y >= p2.y && ball.x >= p2.x && ball.x <= p2.x + p2.width) {
            let xUV = Math.cos(ball.angle);
            let yUV = Math.sin(ball.angle);
            xUV = -Math.abs(xUV);
            ball.angle = Math.atan2(yUV, xUV);
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
    {#each [5, 10, 20, 40, 80, 160] as glowRadius}
        <div style:width="{p1.width}px" style:height="{p1.height}px" style:background-color={p1.color}
            style:position="absolute" style:top="{p1.y}px" style:left="{p1.x}px"
            style:border-radius="100px" style:filter="blur({glowRadius}px)" style:mix-blend-mode="screen"></div>
    {/each}
    <div style:width="{p1.width}px" style:height="{p1.height}px" style:background-color="white"
        style:position="absolute" style:top="{p1.y}px" style:left="{p1.x}px"
        style:border-radius="100px" style:filter="blur(1px)"></div>

    <!-- player 2 -->
    {#each [5, 10, 20, 40, 80, 160] as glowRadius}
        <div style:width="{p2.width}px" style:height="{p2.height}px" style:background-color={p2.color}
            style:position="absolute" style:top="{p2.y}px" style:left="{p2.x}px"
            style:border-radius="100px" style:filter="blur({glowRadius}px)" style:mix-blend-mode="screen"></div>
    {/each}
    <div style:width="{p2.width}px" style:height="{p2.height}px" style:background-color="white"
        style:position="absolute" style:top="{p2.y}px" style:left="{p2.x}px"
        style:border-radius="100px" style:filter="blur(1px)"></div>

    <!-- laser -->
    <div style:mix-blend-mode="screen" style:filter="blur(2px) drop-shadow(0 0 5px {ball.color}) drop-shadow(0 0 15px {ball.color})">
        <div style:width="{ball.radius * 2}px" style:height="{ball.radius * 2}px" style:background-color={ball.color}
            style:position="absolute" style:top="{ball.y - ball.radius}px" style:left="{ball.x - ball.radius}px"
            style:border-radius="100px"></div>
        {#each ballPastPositions as pastPosition}
            <div style:width="{ball.radius * 2}px" style:height="{ball.radius * 2}px" style:background-color={ball.color}
                style:position="absolute" style:top="{pastPosition.y - ball.radius}px" style:left="{pastPosition.x - ball.radius}px"
                style:border-radius="100px"></div>
        {/each}
    </div>

    <div style:position="fixed" style:top="10px" style:left="10px" style:color="white">
        Delta Time: {deltaTime.toFixed(3)}
    </div>

</div>