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
const LEVEL_DOWN = 200

layer(["obj", "ui"], "obj")

// add a character to screen
addLevel([
  "!^^^^^^^^^^    &",
  "!^^^^^^^^^^    &",
  "!^^^^^^^^^^    &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
  "!              &",
], {
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

scene("lose", () => {
  add([
      text("Game Over"),
      pos(center()),
      origin("center"),
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
})

onUpdate('space-invader', (s) => {
  s.move(CURRENT_SPEED, 0)
  if (s.pos.y >= height() / 2) {
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
