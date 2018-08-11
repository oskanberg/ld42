
import { Bodies, Body, Vector} from 'matter-js';
import { Sprite, utils } from 'pixi.js';
import { LOGICAL_WIDTH } from './config.js';

import tinPNG from './test.jpg';

const TIN_HEIGHT = 70;
const TIN_WIDTH = 70;
const TIN_WALL_WIDTH = 15; 

const tick = (tin) => {
    if (tin.body.bounds.max.x < 0) {
        Body.translate(tin.body, { x: LOGICAL_WIDTH + TIN_WIDTH, y: 0});
    }

    Body.translate(tin.body, {x: -1, y: 0});
    tin.sprite.position.x = tin.body.position.x;
    tin.sprite.position.y = tin.body.position.y;
    tin.sprite.rotation = tin.body.angle;
};

export const newTin = (x, y) => {
    let l = Bodies.rectangle(x, y, TIN_WALL_WIDTH, TIN_HEIGHT);
    let r = Bodies.rectangle(x + TIN_WIDTH - TIN_WALL_WIDTH, y, TIN_WALL_WIDTH, TIN_HEIGHT);
    let b = Bodies.rectangle(x, y + TIN_HEIGHT - TIN_WALL_WIDTH, TIN_WIDTH, TIN_WALL_WIDTH);

    Body.translate(l, Vector.sub(l.bounds.max, l.position));
    Body.translate(r, Vector.sub(r.bounds.max, r.position));
    Body.translate(b, Vector.sub(b.bounds.max, b.position));
    
    let body = Body.create({
        parts: [l, r, b],
        isStatic: true
    });

    // Body.translate(body, Vector.sub(body.bounds.max, body.position));

    let texture = utils.TextureCache[tinPNG];
    let sprite = new Sprite(texture);
    sprite.width = TIN_WIDTH;
    sprite.height = TIN_HEIGHT;
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(x, y);

    return {
        body,
        sprite,
        tick
    };
};

export const createRandomTins = () => {

};