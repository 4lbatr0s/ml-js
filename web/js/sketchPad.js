"use strict";

/**
 * Represents a SketchPad for drawing.
 * @class
 */
class SketchPad {
  /**
   * Creates a new SketchPad instance.
   * @constructor
   * @param {HTMLElement} container - The container element to append the SketchPad to.
   * @param {number} [size=400] - The size of the SketchPad canvas (both width and height).
   */
  constructor(container, size = 400) {
    /**
     * The canvas element representing the SketchPad.
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.createElement("canvas");

    /**
     * The 2D rendering context of the canvas.
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = this.canvas.getContext("2d");

    /**
     * The width of the SketchPad canvas.
     * @type {number}
     */
    this.canvas.width = size;

    /**
     * The height of the SketchPad canvas.
     * @type {number}
     */
    this.canvas.height = size;

    // Applying styles to the canvas
    this.canvas.style = `
              background-color:white;
              box-shadow: 0px 0px 10px 2px black;
          `;

    // Appending the canvas to the container element
    container.appendChild(this.canvas);

    const lineBreak = document.createElement("br");
    container.appendChild(lineBreak);
    this.undoBtn = document.createElement("button");
    this.undoBtn.innerHTML = "UNDO";
    container.appendChild(this.undoBtn);
    /**
     * Array to store the coordinates of the drawing path.
     * @type {Array<number[]>}
     */
    this.paths = [];

    /**
     * Indicates whether the SketchPad is currently in drawing mode.
     * @type {boolean}
     */
    this.isDrawing = false;
    this.#redraw();

    // Private method to add event listeners for mouse actions
    this.#addEventListeners();
  }

  reset() {
    this.paths=[];
    this.isDrawing=false;
    this.#redraw();
  }

  /**
   * Redraws the SketchPad canvas based on the stored drawing path.
   * @private
   */
  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);
    if (this.paths.length>0) {
      this.undoBtn.disabled = false;
    } else {
      this.undoBtn.disabled = true;
    }
  }

  /**
   * Adds event listeners for mouse actions on the SketchPad canvas.
   * @private
   */
  #addEventListeners() {
    // Event listener for mouse down action
    this.canvas.onmousedown = (evt) => {
      let mouse = this.#getMouse(evt);
      this.paths.push([mouse]);  
      this.isDrawing = true;
      console.log(this.path);
    };

    // Event listener for mouse move action
    this.canvas.onmousemove = (evt) => {
      if (this.isDrawing) {
        let mouse = this.#getMouse(evt);
        const lastPath = this.paths[this.paths.length - 1];
        lastPath.push(mouse);
        this.#redraw();
      }
    };

    // Event listener for mouse up action
    document.onmouseup = () => {
      this.isDrawing = false;
    };

    //for touch events
    this.canvas.ontouchstart = (evt) => {
      const loc = evt.touches[0]; //we get it from first touch, because multi touches is possible.
      this.canvas.onmousedown(loc);
    };
    this.canvas.ontouchmove = (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousemove(loc);
    };
    document.ontouchend = () => {
      document.onmouseup();
    };
    this.undoBtn.onclick = () => {
      this.paths.pop(); //remove the last line.
      this.#redraw();
    };
  }

  /**
   * Retrieves mouse coordinates relative to the SketchPad canvas.
   * @param {MouseEvent} evt - The mouse event.
   * @returns {number[]} Array containing the x and y coordinates of the mouse.
   * @private
   */
  #getMouse(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return [
      Math.round(evt.clientX - rect.left), //rect.left=0
      Math.round(evt.clientY - rect.top), //rect.top=0
    ];
  }
}
