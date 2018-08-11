
import { Application, Sprite, loader, Container, settings, SCALE_MODES } from 'pixi.js';
import { Engine, Bodies, Body, World, Runner, Vector } from 'matter-js';
import { newCarrot } from './carrot.js';

import image from './test.jpg';

const LOGICAL_WIDTH = 800;
const LOGICAL_HEIGHT = 500;

const RENDER_FPS = 60.0;
const SIMULATE_PS = 60.0;

const resizeHandler = (renderer, displayContainer) => {
    const scaleFactor = Math.min(
        window.innerWidth / LOGICAL_WIDTH,
        window.innerHeight / LOGICAL_HEIGHT
    );
    const newWidth = Math.ceil(LOGICAL_WIDTH * scaleFactor);
    const newHeight = Math.ceil(LOGICAL_HEIGHT * scaleFactor);

    renderer.view.style.width = `${newWidth}px`;
    renderer.view.style.height = `${newHeight}px`;

    renderer.resize(newWidth, newHeight);
    displayContainer.scale.set(scaleFactor);
};

const launchIntoFullscreen = (element) => {
    if (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement) return;

    element.requestFullscreen && element.requestFullscreen();
    element.mozRequestFullScreen && element.mozRequestFullScreen();
    element.webkitRequestFullscreen && element.webkitRequestFullscreen();
    element.msRequestFullscreen && element.msRequestFullscreen();
};

const createImgRect = (x, y, w, h, texture) => {
    let body = Bodies.rectangle(x, y, w, h);
    Body.translate(body, Vector.sub(body.bounds.max, body.position));
    let sprite = new Sprite(texture);
    sprite.width = w;
    sprite.height = h;
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(w, h);

    return {
        body,
        sprite
    };
}

const addEntity = (container, world, e) => {
    if (e.sprite) container.addChild(e.sprite);
    if (e.mesh) container.addChild(e.mesh);
    World.add(world, e.body);
}

let objects = [];

const gameTick = delta => {
    objects.forEach(obj => {
        if (obj.tick) obj.tick(obj);
        // obj.sprite.position.x = obj.body.position.x;
        // obj.sprite.position.y = obj.body.position.y;
        // obj.sprite.rotation = obj.body.angle;
    });
};

let app = new Application({
    roundPixels: false,
    antialias: true,
    resolution: window.devicePixelRatio || 1
});

settings.SCALE_MODE = SCALE_MODES.NEAREST;

let engine = Engine.create();
let runner = Runner.create({
    delta: 1000 / RENDER_FPS
});

document.body.appendChild(app.view);
app.view.onclick = () => launchIntoFullscreen(app.view);
let displayContainer = new Container();
app.stage.addChild(displayContainer);

resizeHandler(app.renderer, displayContainer);
window.addEventListener(
    "resize", () => resizeHandler(app.renderer, displayContainer),
    false
);

loader
    .add([image])
    .load(() => {
        var graph = new PIXI.Graphics();
        graph.beginFill(0xFF3300);
        graph.drawCircle(0, 0, 10);
        graph.endFill();

        let e = createImgRect(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2, 100, 100, loader.resources[image].texture);
        Body.setAngularVelocity(e.body, 0.02);
        addEntity(displayContainer, engine.world, e);
        objects.push(e);

        e = createImgRect(0, LOGICAL_HEIGHT - 100, LOGICAL_WIDTH, 100, loader.resources[image].texture)
        e.body.isStatic = true;
        addEntity(displayContainer, engine.world, e);
        objects.push(e);

        e = newCarrot(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2, graph.generateTexture());
        addEntity(displayContainer, engine.world, e);
        objects.push(e);

        Runner.run(runner, engine);
        setInterval(gameTick, 1000 / SIMULATE_PS);
    });
