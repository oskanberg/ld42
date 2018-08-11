
import image from './test.jpg';
import { Composites, Composite } from 'matter-js';
import { Point, mesh as Mesh } from 'pixi.js';

const tick = entity => {
    let bodies = Composite.allBodies(entity.body);
    bodies.forEach((b, i) => {
        entity.mesh.points[i].set(b.position.x, b.position.y);
    })
}

export const newCarrot = (x, y, texture) => {
    const particleOptions = {
        friction: 0.05,
        frictionStatic: 0.1,
        stiffness: 0
    };

    let body = Composites.softBody(
        x, y, 5, 1, 0, 0, true, 20, particleOptions, {
            stiffness: 1
        }
    );

    let points = Composite
        .allBodies(body)
        .map(b => new Point(b.position.x, b.position.y));

    let mesh = new Mesh.Rope(texture, points);
    
    var boxes = Composites.stack(500, 80, 3, 1, 10, 0, function(x, y) {
        return Bodies.rectangle(x, y, 50, 40);
    });
 
    var chain = Composites.chain(boxes, 0.5, 0, -0.5, 0, { stiffness: 1});
 
    return {
        body,
        tick,
        mesh
    };
};
