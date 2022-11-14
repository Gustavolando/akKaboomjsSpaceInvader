import kaboom from "kaboom"

// initialize context
kaboom()

// load assets
//loadSprite("bean", "sprites/bean.png")
loadPedit("space-invader", "sprites/space-invader.pedit");
loadPedit("left-wall", "sprites/left-wall.pedit");
loadPedit("right-wall", "sprites/right-wall.pedit");
loadPedit("space-ship", "sprites/space-ship.pedit");

const MOVE_SPEED = 200
const TIME_LEFT = 100
const INVADER_SPEED = 50
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 100
BULLET_SPEED = 400

// add a character to screen
const LEVEL1 = [
  "!^^^^^^^^^^^^    &",
  "!^^^^^^^^^^^^    &",
  "!^^^^^^^^^^^^    &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
  "!                &",
]

const TOTAL_INVADERS = LEVEL1.reduce((r, l) => {
  invaders = l.split('').filter(i => i == "^")
  return r += invaders.length
}, 0)

layer(["obj", "ui"], "obj")

addLevel(LEVEL1, {
  width: 30,
  height: 22,
  "^": () => [sprite("space-invader"), scale(0.8), area(), 'space-invader'],
  "!": () => [sprite("left-wall"), area(), "left-wall"],
  "&": () => [sprite("right-wall"), area() , "right-wall"],
})

const player = add([
  // list of components
  sprite("space-ship"),
  pos(210, height() / 8 * 7),
  origin("center"),
  scale(1.2),
  area(),
  'player',
])

// add a kaboom on mouse click
onClick(() => {
  addKaboom(mousePos())
})

// burp on "b"
onKeyPress("b", burp)

keyDown("right", () => {
  player.move(MOVE_SPEED, 0)
})

keyDown("left", () => {
  player.move(-MOVE_SPEED, 0)
})

function spawnBullet(p) {  
  add([
    rect(6,10),
    pos(p.x-3, p.y-25),
//    origin(center),
//    color(0, 128, 255),
    color(127, 0, 255),
    area(),
    "bullet"
  ])
}

keyPress('space', () => {
  spawnBullet(player.pos)
})

onUpdate('bullet', (b) => {
  b.move(0, -BULLET_SPEED)
  if (b.pos.y < 0) {
    destroy(b)
  }
})

collides('bullet', 'space-invader', (s, b) => {
  shake(4);
  s.destroy()
  b.destroy()
  score.value++
  score.text = score.value
})

const score = add([
  text("0"),
  scale(0.4),
  pos(30, 10),
  layer("ui"),
  {
    value: 0,
  }
])

const timer = add([
  text("0"),
  pos(30, 50),
  scale(0.3),
  layer("ui"),
  {
      time: TIME_LEFT,
  },
]);

scene("lose", (args) => {
  add([
    text(`Game Over\nScore: ${args.score}`),
    pos(center()),
    origin("center"),
  ]);
});

scene("win", (args) => {
  add([
    text(`You Win\nEnlapsed time: ${args.time.toFixed(1)}`),
    pos(center()),
    color(255,255,0),
    origin("center"),
    scale(0.5),
  ]);
});

timer.onUpdate(() => {
  timer.time -= dt();
  timer.text = timer.time.toFixed(1);
  if (timer.time <= 0) {
      addKaboom(player.pos);
      shake();
      go("lose", {score: score.value});
  }
  if (score.value == TOTAL_INVADERS) {
    go("win", {time: TIME_LEFT - timer.time})
  }
})

onUpdate('space-invader', (s) => {
  s.move(CURRENT_SPEED, 0)
  //if (s.pos.y >= height() / 2) {
  if (s.pos.y >= 12 * 22) {
    go("lose", {score: score.value});
  }
})

collides('space-invader', 'right-wall', () => {
  CURRENT_SPEED = -INVADER_SPEED
  every('space-invader', (si) => {
    si.move(0, LEVEL_DOWN)
  })
})

collides('space-invader', 'left-wall', () => {
  CURRENT_SPEED = INVADER_SPEED
  every('space-invader', (si) => {
    si.move(0, LEVEL_DOWN)
  })
})

collides('space-invader', 'player', () => {
  addKaboom(player.pos);
  shake();
  go("lose", {score: score.value});
})
