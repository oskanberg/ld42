
import { Application, Sprite, loader, Container, settings, SCALE_MODES } from 'pixi.js';
import { Engine, Bodies, Body, World, Runner, Vector } from 'matter-js';
import { newCarrot, carrotTexture } from './carrot.js';
import { newTin } from './tins.js';
import { LOGICAL_WIDTH, LOGICAL_HEIGHT, RENDER_FPS, SIMULATE_PS } from './config';

import image from './test.jpg';
import sausagePNG from './sausage.png';


// DEBUG
// import { Render } from 'matter-js';
// let r = Render.create({
//     element: document.body,
//     engine: engine
// });
// Render.run(r);

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
    sprite.position.set(x, y);

    return {
        body,
        sprite
    };
};

let objects = [];

const addEntity = (container, world, e) => {
    if (e.sprite) container.addChild(e.sprite);
    if (e.mesh) container.addChild(e.mesh);
    World.add(world, e.body);
    objects.push(e);
};

const gameTick = delta => {
    objects.forEach(obj => {
        if (obj.tick) obj.tick(obj, delta);
        if (obj.sprite && obj.body) {
            obj.sprite.position.x = obj.body.position.x;
            obj.sprite.position.y = obj.body.position.y;
            obj.sprite.rotation = obj.body.angle;
        }
    });
};

let app = new Application({
    roundPixels: false,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    backgroundColor: 0x356498
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
    'resize', () => resizeHandler(app.renderer, displayContainer),
    false
);

loader
    .add([image, sausagePNG])
    .load(() => {
        let e = createImgRect(0, LOGICAL_HEIGHT, LOGICAL_WIDTH, 100, loader.resources[image].texture);
        e.body.isStatic = true;
        addEntity(displayContainer, engine.world, e);

        let carrotTex = carrotTexture(app.renderer, loader);
        e = newCarrot(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 4, carrotTex);
        addEntity(displayContainer, engine.world, e);

        let tin = newTin(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT - 70);
        addEntity(displayContainer, engine.world, tin);

        Runner.run(runner, engine);
        setInterval(gameTick, 1000 / SIMULATE_PS);
    });
