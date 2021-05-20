import { Engine, Render, Events, Bodies, Body, Runner, Composite, Common } from "matter-js";

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  element: document.getElementById("game-container"),
  engine: engine,
  options: {
    width: 800,
    height: 600,
    background: "#f4f4f8",
  }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);


const circle = Bodies.circle(400, 0, 100, { isStatic: true, friction: 0 });

const dot = Bodies.circle(400, 560, 40, { friction: 0.5 });

const dotL = Bodies.circle(dot.position.x, dot.position.y, 20);
const dotR = Bodies.circle(dot.position.x, dot.position.y, 20);

// Create slippery, static floors and walls. The walls are positioned off screen. A static body
// can't move or rotate.
const floor = Bodies.rectangle(400, 575, 800, 50, { isStatic: true, friction: 0, label: 'floor' });
const leftWall = Bodies.rectangle(-25, 400, 50, 800, { isStatic: true, friction: 0, label: 'left wall' });
const rightWall = Bodies.rectangle(825, 400, 50, 800, { isStatic: true, friction: 0, label: 'right wall' });

// Bodies won't do anything unless they are added to the world
Composite.add(world, floor);
Composite.add(world, leftWall);
Composite.add(world, rightWall);
Composite.add(world, dot);
Composite.add(world, circle);

const projectiles = [];
let counter = 0;
Events.on(engine, 'beforeUpdate', e => {
  counter++;
  if (counter % 60 === 0 && counter < 600) {
    console.log(e);
    const projectile = Bodies.circle(400, 60, 10);
    Body.setVelocity(projectile, { x: Common.random(-15, 15), y: 0 });
    projectiles.push(projectile);

    Composite.add(world, projectile);
  }
});

Events.on(engine, 'collisionStart', ({ pairs }) => {
  pairs.forEach(({ bodyA, bodyB }) => {
    if (bodyA === floor || bodyB === floor) {
      const idxA = projectiles.findIndex(x => x === bodyA);
      const idxB = projectiles.findIndex(x => x === bodyB);

      if (idxA >= 0) {
        Composite.remove(world, bodyA);
        projectiles.splice(idxA, 1);
      }
      if (idxB >= 0) {
        Composite.remove(world, bodyB);
        projectiles.splice(idxB, 1);
      }
    }
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') {
    Composite.remove(world, dotR);
    Composite.remove(world, dotL);

    Body.setPosition(dot, { x: (dotR.position.x + dotL.position.x) / 2, y: 560 });

    Composite.add(world, dot);

  } else if (e.key === 'ArrowDown') {
    Composite.remove(world, dot);

    Body.setPosition(dotR, dot.position);
    Body.setVelocity(dotR, { x: 10, y: 0 });

    Body.setPosition(dotL, dot.position);
    Body.setVelocity(dotL, { x: -10, y: 0 });

    Composite.add(world, dotR);
    Composite.add(world, dotL);

  } else if (e.key === 'ArrowRight') {
    Body.setVelocity(dot, { x: 10, y: 0 })
    Body.setVelocity(dotR, { x: 10, y: 0 })
    Body.setVelocity(dotL, { x: 10, y: 0 })
  } else if (e.key === 'ArrowLeft') {
    Body.setVelocity(dot, { x: -10, y: 0 })
    Body.setVelocity(dotR, { x: -10, y: 0 })
    Body.setVelocity(dotL, { x: -10, y: 0 })
  }
});

Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: 800, y: 600 }
});
