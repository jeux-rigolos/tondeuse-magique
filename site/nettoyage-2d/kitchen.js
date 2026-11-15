"use strict";

const kitchenSpots = [
  [0, 0.16, 0.26], [3, 0.39, 0.23], [2, 0.63, 0.28], [1, 0.85, 0.22],
  [2, 0.12, 0.42], [4, 0.36, 0.36], [1, 0.59, 0.39], [0, 0.83, 0.38],
  [3, 0.18, 0.54], [1, 0.34, 0.54], [4, 0.68, 0.52], [3, 0.88, 0.56],
  [4, 0.12, 0.69], [2, 0.40, 0.68], [0, 0.63, 0.65], [4, 0.79, 0.71],
  [1, 0.17, 0.84], [0, 0.36, 0.81], [3, 0.58, 0.82], [2, 0.86, 0.86]
];

function kitchenDirt() {
  const counts = Array(5).fill(0);
  return kitchenSpots.map(([type, x, y]) => ({ type, x, y, variant: counts[type]++, clean: false }));
}

const kitchenFloor = document.createElement("canvas");
const kitchenSprites = new Map();

function drawKitchen(ctx, width, height) {
  const pixelWidth = ctx.canvas.width;
  const pixelHeight = ctx.canvas.height;
  if (kitchenFloor.width !== pixelWidth || kitchenFloor.height !== pixelHeight) {
    kitchenFloor.width = pixelWidth;
    kitchenFloor.height = pixelHeight;
    const floor = kitchenFloor.getContext("2d");
    floor.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
    paintKitchenFloor(floor, width, height);
  }
  ctx.drawImage(kitchenFloor, 0, 0, width, height);
}

function kitchenCounterHeight(height) {
  return Math.min(height * 0.12, 65);
}

function paintKitchenFloor(ctx, width, height) {
  const woods = ["#bd8a59", "#c69464", "#d0a071", "#b88355", "#ca9867"];
  const plankHeight = Math.max(24, height / 11);
  const plankWidth = Math.max(120, width / 3.5);
  for (let row = 0; row * plankHeight < height; row++) {
    const top = row * plankHeight;
    for (let col = 0, left = -(row % 3) * plankWidth / 3; left < width; col++, left += plankWidth) {
      ctx.fillStyle = woods[(row * 7 + col * 3) % woods.length];
      ctx.fillRect(left, top, plankWidth, plankHeight);
      ctx.fillStyle = "#63432955";
      ctx.fillRect(left, top, plankWidth, 1);
      ctx.fillRect(left, top, 1, plankHeight);
      ctx.fillStyle = "#ffe3ae35";
      ctx.fillRect(left + 1, top + 1, plankWidth - 1, 1);
      for (let i = 0; i < 6; i++) {
        const x = left + 5 + (row * 29 + col * 19 + i * 41) % (plankWidth * 0.57);
        const y = top + plankHeight * (i + 1) / 7;
        const len = Math.min(plankWidth * (0.18 + i * 0.033), left + plankWidth - x - 2);
        ctx.strokeStyle = i % 2 ? "#fce0aa55" : "#68422a33";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x + len * 0.3, y - 3, x + len * 0.66, y + 2, x + len, y);
        ctx.stroke();
      }
    }
  }

  const daylight = ctx.createRadialGradient(width * 0.72, height * 0.25, 0, width * 0.6, height * 0.36, Math.max(width, height) * 0.72);
  daylight.addColorStop(0, "#fff2be59");
  daylight.addColorStop(0.55, "#fff2be08");
  daylight.addColorStop(1, "#4928133d");
  ctx.fillStyle = daylight;
  ctx.fillRect(0, 0, width, height);

  const counter = kitchenCounterHeight(height);
  const shadow = ctx.createLinearGradient(0, counter, 0, counter + 17);
  shadow.addColorStop(0, "#39261788");
  shadow.addColorStop(1, "#39261700");
  ctx.fillStyle = shadow;
  ctx.fillRect(0, counter, width, 17);
  ctx.fillStyle = "#263d3d";
  ctx.fillRect(0, 0, width, counter);
  ctx.fillStyle = "#42635c";
  ctx.fillRect(0, 0, width, counter - 4);
  const cabinetWidth = width / Math.ceil(width / 132);
  for (let x = 0; x < width - 1; x += cabinetWidth) {
    ctx.strokeStyle = "#243b36";
    ctx.strokeRect(x + 2, 2, cabinetWidth - 4, Math.max(3, counter - 10));
    ctx.fillStyle = "#d7ba80";
    ctx.fillRect(x + cabinetWidth / 2 - 9, Math.max(2, counter - 13), 18, 2);
  }
  ctx.fillStyle = "#5c412c";
  ctx.fillRect(0, height - 5, width, 5);
}

function drawKitchenDirt(ctx, item, x, y, radius) {
  const key = item.type * 4 + item.variant;
  if (!kitchenSprites.has(key)) kitchenSprites.set(key, paintKitchenSprite(item.type, item.variant));
  const size = radius * 3.1;
  ctx.drawImage(kitchenSprites.get(key), x - size / 2, y - size / 2, size, size);
}

function paintKitchenSprite(type, variant) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 112;
  const ctx = canvas.getContext("2d");
  ctx.translate(56, 56);
  ctx.scale(36, 36);
  ctx.rotate([-0.24, 0.38, -0.62, 0.12][variant]);
  ctx.lineJoin = "round";
  switch (type) {
    case 0: paintStain(ctx, variant); break;
    case 1: paintDust(ctx, variant); break;
    case 2: paintSpill(ctx, variant); break;
    case 3: paintPaper(ctx, variant); break;
    case 4: paintLitter(ctx, variant); break;
  }
  return canvas;
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function polygon(ctx, color, points, edge) {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (edge) {
    ctx.lineWidth = 0.045;
    ctx.strokeStyle = edge;
    ctx.stroke();
  }
}

function paintStain(ctx, variant) {
  const colors = ["#763728", "#8f4c23", "#5a3326", "#895427"];
  const color = colors[variant];
  if (variant === 1) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 0.68, 0.55, 0, 0.05, Math.PI * 1.94);
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.15;
    ctx.stroke();
    ellipse(ctx, 0.7, 0.36, 0.15, 0.09, color);
    return;
  }
  ctx.scale(1.03, variant === 3 ? 0.59 : 0.78);
  polygon(ctx, color, [[-1,-0.08],[-0.58,-0.29],[-0.66,-0.58],[-0.22,-0.44],[0.1,-0.68],[0.32,-0.35],[0.85,-0.29],[0.64,-0.04],[0.95,0.26],[0.42,0.39],[0.17,0.62],[-0.19,0.38],[-0.72,0.46],[-0.58,0.15]]);
  ellipse(ctx, -0.16, -0.12, 0.42, 0.19, "#fca36135");
  ellipse(ctx, 0.94, -0.45, 0.11, 0.07, color);
  ellipse(ctx, -0.89, 0.39, 0.08, 0.07, color);
}

function paintDust(ctx, variant) {
  const flecks = ["#453633", "#65575d", "#8d8087", "#c8b5ae"];
  for (let i = 0; i < 21; i++) {
    const angle = i * 2.4 + variant;
    const spread = 0.16 + ((i * 7) % 20) / 24;
    const x = Math.cos(angle) * spread;
    const y = Math.sin(angle) * spread * (variant === 2 ? 0.45 : 0.72);
    const grain = 0.09 + i % 4 * 0.037;
    ellipse(ctx, x, y, grain * 1.25, grain, flecks[i % flecks.length]);
  }
  ctx.strokeStyle = "#51424a";
  ctx.lineWidth = 0.038;
  ctx.beginPath();
  ctx.moveTo(-0.48, 0.37);
  ctx.bezierCurveTo(0.32, 0.68, 0.18, -0.62, 0.73, -0.23);
  ctx.stroke();
}

function paintSpill(ctx, variant) {
  ctx.scale(1, variant === 1 ? 0.7 : 1);
  const water = ctx.createLinearGradient(-0.6, -0.7, 0.5, 0.67);
  water.addColorStop(0, variant === 2 ? "#faede0" : "#d9f7f6");
  water.addColorStop(0.48, variant === 2 ? "#ecd2a5" : "#7fc4c9");
  water.addColorStop(1, variant === 2 ? "#b19262" : "#4e8e9a");
  ctx.beginPath();
  ctx.moveTo(-0.97, 0.15);
  ctx.bezierCurveTo(-1.04,-0.37,-0.45,-0.32,-0.34,-0.55);
  ctx.bezierCurveTo(-0.24,-0.81,0.55,-0.64,0.5,-0.37);
  ctx.bezierCurveTo(0.48,-0.17,1.19,-0.27,1.05,0.19);
  ctx.bezierCurveTo(0.88,0.66,0.42,0.33,0.04,0.61);
  ctx.bezierCurveTo(-0.34,0.92,-0.91,0.47,-0.97,0.15);
  ctx.fillStyle = water;
  ctx.fill();
  ctx.strokeStyle = variant === 2 ? "#977750" : "#326779";
  ctx.lineWidth = 0.05;
  ctx.stroke();
  ellipse(ctx, 0.98, -0.49, 0.16, 0.1, "#b8e0de");
  ellipse(ctx, -0.4, 0.22, 0.33, 0.07, "#ffffff85");
  ellipse(ctx, -0.03, -0.41, 0.18, 0.045, "#ffffffad");
}

function paintPaper(ctx, variant) {
  ellipse(ctx, 0.06, 0.37, 0.82, 0.35, "#3e291e59");
  const edge = "#766949";
  if (variant === 1) {
    polygon(ctx, "#f6eed8", [[-0.67,-0.26],[-0.47,-0.63],[-0.13,-0.53],[0.12,-0.68],[0.48,-0.45],[0.68,0.1],[0.45,0.48],[-0.03,0.54],[-0.49,0.42]], edge);
    polygon(ctx, "#cec2a5", [[-0.55,-0.26],[-0.13,-0.53],[0.27,-0.12],[0.48,-0.45],[0.57,0.12],[0.06,0.24]]);
    polygon(ctx, "#fffdf0", [[-0.45,0.34],[-0.19,0.02],[0.27,-0.12],[0.06,0.24],[0.42,0.46]]);
    return;
  }
  ctx.scale(variant === 2 ? 0.63 : 1, 1);
  polygon(ctx, variant === 3 ? "#fff3b8" : "#f7f3df", [[-0.57,-0.72],[0.47,-0.65],[0.62,0.41],[0.27,0.66],[-0.44,0.6]], edge);
  polygon(ctx, "#cec2a5", [[0.62,0.41],[0.27,0.66],[0.24,0.34]]);
  ctx.fillStyle = "#6f8198";
  for (let row = 0; row < 3; row++) ctx.fillRect(-0.35, -0.35 + row * 0.19, 0.61 - row * 0.08, 0.035);
}

function paintLitter(ctx, variant) {
  ellipse(ctx, 0.07, 0.36, 0.87, 0.28, "#3e291e61");
  switch (variant) {
    case 0:
      // Bouchon cranté.
      ellipse(ctx, 0, 0.08, 0.55, 0.53, "#244844");
      for (let tooth = 0; tooth < 12; tooth++) {
        const angle = tooth * Math.PI / 6;
        ellipse(ctx, Math.cos(angle) * 0.51, Math.sin(angle) * 0.51 + 0.07, 0.08, 0.075, "#244844");
      }
      ellipse(ctx, 0, -0.06, 0.46, 0.43, "#41877e");
      ellipse(ctx, -0.08, -0.18, 0.29, 0.1, "#a1cbb9");
      break;
    case 1:
      // Emballage torsadé.
      polygon(ctx, "#2b7863", [[-0.91,-0.41],[-0.5,-0.19],[-0.33,-0.32],[0.43,-0.31],[0.53,-0.14],[0.92,-0.32],[0.84,0.35],[0.54,0.2],[0.36,0.36],[-0.39,0.36],[-0.54,0.2],[-0.81,0.34]], "#1e4b41");
      polygon(ctx, "#a9d2b4", [[-0.36,-0.23],[0.43,-0.21],[0.37,0.04],[-0.3,0.1]]);
      break;
    case 2:
      // Canette couchée.
      polygon(ctx, "#367a73", [[-0.74,-0.35],[0.54,-0.36],[0.75,-0.19],[0.75,0.23],[0.54,0.39],[-0.7,0.35]], "#234b48");
      polygon(ctx, "#e1e2bc", [[-0.39,-0.34],[-0.05,-0.35],[0.23,0.38],[-0.12,0.37]]);
      ellipse(ctx, 0.58, 0.01, 0.18, 0.34, "#aab5b0");
      ellipse(ctx, 0.59, -0.03, 0.08, 0.13, "#546867");
      break;
    case 3:
      // Épluchure.
      polygon(ctx, "#567537", [[-0.86,0.27],[-0.62,-0.36],[-0.17,-0.52],[0.63,-0.36],[0.87,-0.06],[0.2,0.01],[-0.24,0.21],[-0.36,0.49]], "#3f5227");
      polygon(ctx, "#b0b960", [[-0.77,0.21],[-0.55,-0.31],[-0.13,-0.44],[0.63,-0.29],[0.74,-0.14],[0.13,-0.23],[-0.34,-0.04],[-0.52,0.3]]);
      break;
  }
}
