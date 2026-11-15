"use strict";

function createGameViewport(canvas, worldWidth, worldHeight) {
  const screen = canvas.closest(".layout");
  const fullscreen = screen.querySelector("#fullscreen");
  const fullscreenNote = screen.querySelector("#fullscreen-note");

  fullscreen.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement === screen) await document.exitFullscreen();
      else await screen.requestFullscreen();
      fullscreenNote.hidden = true;
    } catch {
      fullscreenNote.hidden = false;
    }
  });

  document.addEventListener("fullscreenchange", () => {
    const active = document.fullscreenElement === screen;
    const label = active ? "Quitter le plein écran" : "Activer le plein écran";
    fullscreen.setAttribute("aria-label", label);
    fullscreen.title = label;
    fullscreen.setAttribute("aria-pressed", String(active));
  });

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  function scale(zoom) {
    return Math.max(canvas.width / worldWidth, canvas.height / worldHeight) * zoom;
  }

  return {
    follow(ctx, camera, vehicle, zoom, blend) {
      const viewScale = scale(zoom);
      const halfWidth = canvas.width / (2 * viewScale);
      const halfHeight = canvas.height / (2 * viewScale);
      const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
      const x = clamp(vehicle.x, halfWidth, worldWidth - halfWidth);
      const y = clamp(vehicle.y, halfHeight, worldHeight - halfHeight);
      camera.x = clamp(camera.x + (x - camera.x) * blend, halfWidth, worldWidth - halfWidth);
      camera.y = clamp(camera.y + (y - camera.y) * blend, halfHeight, worldHeight - halfHeight);
      ctx.setTransform(viewScale, 0, 0, viewScale,
        canvas.width / 2 - camera.x * viewScale, canvas.height / 2 - camera.y * viewScale);
    },

    toWorld(event, camera, zoom) {
      const rect = canvas.getBoundingClientRect();
      const viewScale = scale(zoom);
      return {
        x: camera.x + ((event.clientX - rect.left) / rect.width - 0.5) * canvas.width / viewScale,
        y: camera.y + ((event.clientY - rect.top) / rect.height - 0.5) * canvas.height / viewScale
      };
    }
  };
}
