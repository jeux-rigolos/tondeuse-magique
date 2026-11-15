"use strict";

const game = document.querySelector("#game");
const board = document.querySelector("#board");
const ctx = board.getContext("2d");
const score = document.querySelector("#score");
const progress = document.querySelector("#progress");
const forms = document.querySelector("#forms");
const transform = document.querySelector("#transform");
const fullscreen = document.querySelector("#fullscreen");
const screenNote = document.querySelector("#screen-note");
const victory = document.querySelector("#victory");
const victoryTitle = document.querySelector("#victory-title");
const mapPicker = document.querySelector("#map");
const savedMaps = new Map();
let currentMap = "atelier";

const modes = [
  { name: "Taches", color: "#ffb678", icon: "✦", tool: "Éponge" },
  { name: "Poussière", color: "#d7b6ff", icon: "⠿", tool: "Aspirateur" },
  { name: "Liquides", color: "#7be4ff", icon: "💧", tool: "Serpillière" },
  { name: "Papier", color: "#fff09b", icon: "▤", tool: "Pince à papier" },
  { name: "Déchets", color: "#8aefac", icon: "◆", tool: "Ramasse-déchets" }
];
const modeCards = modes.map(({ name, color, icon }) => {
  const card = document.createElement("span");
  card.className = "form";
  card.style.setProperty("--color", color);
  const symbol = document.createElement("b");
  symbol.textContent = icon;
  symbol.setAttribute("aria-hidden", "true");
  const count = document.createElement("span");
  card.append(symbol, name, count);
  forms.append(card);
  return { card, count };
});

const robot = { x: 0, y: 0, angle: -Math.PI / 2 };
const keys = new Set();
const directions = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
let width, height, radius, dirt, mode, cleaned, target, pointer, lastTap, flash, previous;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const total = 20;
const isKitchen = () => currentMap === "cuisine";

function updateHud() {
  score.textContent = cleaned + " / " + total + " nettoyés";
  progress.value = cleaned;
  modeCards.forEach(({ card, count }, index) => {
    card.classList.toggle("active", index === mode);
    if (index === mode) card.setAttribute("aria-current", "true");
    else card.removeAttribute("aria-current");
    count.textContent = dirt.filter(item => item.type === index && !item.clean).length;
  });
}

function showForm() {
  const { color, icon, tool } = modes[mode];
  transform.style.setProperty("--form-color", color);
  transform.textContent = icon + " " + tool + " ↻";
  transform.setAttribute("aria-label", tool + " actif. Passer à la forme suivante");
  updateHud();
}

function nextForm() {
  if (victory.open) return;
  mode = (mode + 1) % modes.length;
  flash = performance.now();
  showForm();
}

function clearControls() {
  flash = -Infinity;
  target = pointer = lastTap = null;
  keys.clear();
}

function restart() {
  if (victory.open) victory.close();
  clearControls();
  mode = 0;
  cleaned = 0;
  robot.x = width / 2;
  robot.y = height / 2;
  robot.angle = -Math.PI / 2;
  dirt = isKitchen() ? kitchenDirt() : workshopDirt();
  showForm();
}

function workshopDirt() {
  const types = Array.from({ length: total }, (_, i) => i % modes.length);
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  return types.map((type, index) => ({
    type,
    x: 0.11 + (index % 4) * 0.26 + Math.random() * 0.035,
    y: 0.23 + Math.floor(index / 4) * 0.16 + Math.random() * 0.035,
    clean: false
  }));
}

function chooseMap(nextMap) {
  if (nextMap === currentMap) return;
  savedMaps.set(currentMap, {
    dirt, cleaned, mode,
    x: robot.x / width,
    y: robot.y / height,
    angle: robot.angle
  });
  if (victory.open) victory.close();
  currentMap = nextMap;
  mapPicker.value = nextMap;
  victoryTitle.textContent = isKitchen() ? "Cuisine impeccable !" : "Atelier impeccable !";

  const saved = savedMaps.get(nextMap);
  if (!saved) {
    restart();
    return;
  }
  clearControls();
  ({ dirt, cleaned, mode } = saved);
  robot.x = saved.x * width;
  robot.y = saved.y * height;
  robot.angle = saved.angle;
  showForm();
  if (cleaned === total) victory.showModal();
}

function resize() {
  const rect = board.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const dpr = Math.min(devicePixelRatio || 1, 3);
  if (width && height) {
    robot.x *= rect.width / width;
    robot.y *= rect.height / height;
  }
  width = rect.width;
  height = rect.height;
  radius = clamp(Math.min(width, height) / 17, 10, 22);
  board.width = Math.round(width * dpr);
  board.height = Math.round(height * dpr);
  ctx.setTransform(board.width / width, 0, 0, board.height / height, 0, 0);
  target = lastTap = null;
}

function point(event) {
  const rect = board.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

board.addEventListener("pointerdown", event => {
  if (event.button !== 0 || pointer || victory.open) return;
  const start = point(event);
  pointer = { id: event.pointerId, start, time: performance.now(), dragged: false };
  board.setPointerCapture(event.pointerId);
});
board.addEventListener("pointermove", event => {
  if (event.pointerId !== pointer?.id) return;
  const position = point(event);
  if (!pointer.dragged && distance(position, pointer.start) <= 8) return;
  pointer.dragged = true;
  lastTap = null;
  target = position;
});
board.addEventListener("pointerup", event => {
  if (event.pointerId !== pointer?.id) return;
  const end = point(event);
  const now = performance.now();
  if (pointer.dragged || now - pointer.time > 300 || distance(end, pointer.start) > 8) {
    lastTap = null;
  } else if (lastTap && now - lastTap.time <= 330 && distance(end, lastTap) <= 28) {
    target = null;
    lastTap = null;
    nextForm();
  } else {
    target = end;
    lastTap = { ...end, time: now };
  }
  pointer = null;
});
function cancelPointer(event) {
  if (event.pointerId !== pointer?.id) return;
  pointer = target = lastTap = null;
}
board.addEventListener("pointercancel", cancelPointer);
board.addEventListener("lostpointercapture", cancelPointer);

window.addEventListener("keydown", event => {
  if (victory.open) return;
  if (Object.hasOwn(directions, event.key)) {
    event.preventDefault();
    keys.add(event.key);
    target = null;
  } else if (event.code === "Space" && !event.target.closest("a, button")) {
    event.preventDefault();
    if (!event.repeat) nextForm();
  }
});
window.addEventListener("keyup", event => keys.delete(event.key));
window.addEventListener("blur", () => {
  keys.clear();
  target = pointer = lastTap = null;
});

fullscreen.addEventListener("click", async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }
  try {
    await game.requestFullscreen();
    screenNote.hidden = true;
  } catch {
    screenNote.hidden = false;
  }
});
document.addEventListener("fullscreenchange", () => {
  const label = document.fullscreenElement ? "Quitter le plein écran" : "Activer le plein écran";
  fullscreen.setAttribute("aria-label", label);
  fullscreen.title = label;
});
transform.addEventListener("click", nextForm);
document.querySelector("#replay").addEventListener("click", () => {
  restart();
  transform.focus();
});
mapPicker.addEventListener("change", () => chooseMap(mapPicker.value));
document.querySelector("#other-map").addEventListener("click", () => {
  chooseMap(isKitchen() ? "atelier" : "cuisine");
  if (!victory.open) mapPicker.focus();
});

function circle(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

function rounded(x, y, w, h, corner, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, corner);
  ctx.fill();
}

function drawDirt(item, time) {
  const x = item.x * width;
  const y = item.y * height;
  const { color, icon } = modes[item.type];
  const size = radius * 0.81;
  if (item.clean) {
    const fade = 1 - (time - item.clean) / 480;
    if (fade > 0) {
      ctx.globalAlpha = fade;
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const spread = size * (2 - fade);
        circle(x + Math.cos(angle) * spread, y + Math.sin(angle) * spread, 2.5, color);
      }
      ctx.globalAlpha = 1;
    }
    return;
  }
  if (isKitchen()) {
    drawKitchenDirt(ctx, item, x, y, radius);
    return;
  }
  circle(x, y + 2, size + 2, "#131d30");
  circle(x, y, size, color);
  ctx.fillStyle = "#17233a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold " + size * 1.25 + "px system-ui";
  ctx.fillText(icon, x, y);
}

function drawRobot(time) {
  const effect = Math.max(0, 1 - (time - flash) / 360);
  const color = modes[mode].color;
  circle(robot.x + 2, robot.y + 4, radius + 2, "#0b1230aa");
  if (effect) {
    ctx.globalAlpha = effect;
    circle(robot.x, robot.y, radius * (2.2 - effect), color);
    ctx.globalAlpha = 1;
  }
  ctx.save();
  ctx.translate(robot.x, robot.y);
  ctx.rotate(robot.angle + effect * Math.PI * 2);
  ctx.scale(radius, radius);
  rounded(-0.72, -1.02, 1.4, 0.32, 0.13, "#141e31");
  rounded(-0.72, 0.7, 1.4, 0.32, 0.13, "#141e31");
  rounded(-0.91, -0.8, 1.65, 1.6, 0.36, color);
  rounded(-0.55, -0.46, 0.96, 0.92, 0.24, "#121b2e");
  for (const offset of [-0.2, 0.2]) circle(0.15, offset, 0.105, "#f5fbff");
  switch (mode) {
    case 0:
      rounded(0.62, -0.55, 0.55, 1.1, 0.18, "#f5d477");
      break;
    case 1:
      rounded(0.65, -0.18, 0.48, 0.36, 0.12, color);
      rounded(0.97, -0.45, 0.25, 0.9, 0.12, "#f4ddff");
      break;
    case 2:
      rounded(0.62, -0.16, 0.46, 0.32, 0.1, color);
      for (const offset of [-0.35, 0, 0.35]) circle(1.04, offset, 0.22, "#bfedff");
      break;
    case 3:
      for (const offset of [-0.54, 0.24]) rounded(0.64, offset, 0.52, 0.3, 0.09, color);
      break;
    case 4:
      rounded(0.62, -0.58, 0.59, 1.16, 0.13, color);
      rounded(0.87, -0.38, 0.24, 0.76, 0.08, "#35735f");
      break;
  }
  ctx.restore();
}

function move(dt) {
  let dx = 0;
  let dy = 0;
  for (const key of keys) {
    dx += directions[key][0];
    dy += directions[key][1];
  }
  const top = radius + (isKitchen() ? kitchenCounterHeight(height) : 0);
  if (target && !keys.size) {
    dx = clamp(target.x, radius, width - radius) - robot.x;
    dy = clamp(target.y, top, height - radius) - robot.y;
  }
  const length = Math.hypot(dx, dy);
  if (length < 0.1) return;
  const step = clamp(Math.min(width, height) * 0.72, 120, 340) * dt;
  const speed = keys.size ? step : Math.min(length, step);
  robot.x = clamp(robot.x + dx / length * speed, radius, width - radius);
  robot.y = clamp(robot.y + dy / length * speed, top, height - radius);
  robot.angle = Math.atan2(dy, dx);
}

function drawWorkshop() {
  ctx.fillStyle = "#1d2b42";
  ctx.fillRect(0, 0, width, height);
  const tile = clamp(Math.min(width, height) / 8, 25, 60);
  ctx.fillStyle = "#22334c";
  for (let y = 0, row = 0; y < height; y += tile, row++) {
    for (let x = row % 2 * tile; x < width; x += tile * 2) ctx.fillRect(x, y, tile, tile);
  }
}

function frame(time) {
  const dt = Math.min((time - (previous ?? time)) / 1000, 0.05);
  previous = time;
  if (!victory.open) {
    move(dt);
    for (const item of dirt) {
      if (item.clean || item.type !== mode) continue;
      if (Math.hypot(robot.x - item.x * width, robot.y - item.y * height) > radius * 1.65) continue;
      item.clean = time;
      cleaned++;
      updateHud();
      if (cleaned === total) {
        target = pointer = lastTap = null;
        keys.clear();
        victory.showModal();
      }
    }
  }

  if (isKitchen()) drawKitchen(ctx, width, height);
  else drawWorkshop();
  for (const item of dirt) drawDirt(item, time);
  drawRobot(time);
  requestAnimationFrame(frame);
}

resize();
restart();
new ResizeObserver(resize).observe(board);
requestAnimationFrame(frame);
