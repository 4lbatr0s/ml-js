/**
 * Draws a path on the canvas context.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
 * @param {Array<number[]>} path - An array containing the coordinates of the path to be drawn.
 * Each element of the array should be an array containing two numbers representing the x and y coordinates, e.g., [x, y].
 * @param {string} [color="black"] - The color of the path. Defaults to "black".
 */
const draw = {};

draw.path = (ctx, path, color = "black") => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(...path[0]); // First array [x, y]
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(...path[i]);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
};

draw.paths = (ctx, paths) => {
  paths.forEach((path) => {
    draw.path(ctx, path);
  });
};

export default draw;
