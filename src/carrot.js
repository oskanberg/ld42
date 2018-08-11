
import { Composites, Composite, Bodies, Body, Vector } from 'matter-js';
import { Point, mesh as Mesh, Sprite, RenderTexture } from 'pixi.js';

import sausagePNG from './sausage.png';

const carrotWidth = 50;
const carrotHeight = 20;

const tick = (entity) => {
    let bodies = Composite.allBodies(entity.body);
    bodies.forEach((b, i) => {
        entity.mesh.points[i].set(b.position.x, b.position.y);
    });
};

export const carrotTexture = (renderer, loader) => {
    let tex = loader.resources[sausagePNG].texture;
    let sprite = new Sprite(tex);
    sprite.width = carrotWidth;
    sprite.height = carrotHeight;
    sprite.position.set(0, 0);
    let rt = RenderTexture.create(carrotWidth, carrotHeight, undefined, 4);
    renderer.render(sprite, rt);
    return rt;
};

export const newCarrot = (x, y, texture) => {
    let ropeB = Composites.stack(x, y, 5, 1, 0, 0, (x, y) => Bodies.circle(x, y, carrotHeight / 4));
    ropeB.bodies.forEach(b => Body.translate(b, Vector.sub(b.bounds.max, b.position)));

    let body = Composites.chain(ropeB, 0.5, 0, -0.5, 0, {
        stiffness: 1,
        length: 0,
        damping: 0.01
    });

    let points = Composite
        .allBodies(body)
        .map(b => new Point(b.position.x, b.position.y));

    let mesh = new Mesh.Rope(texture, points);

    return {
        body,
        tick,
        mesh
    };
};
