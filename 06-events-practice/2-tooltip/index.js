class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  render(value) {
    this.element = document.createElement("div");
    this.element.classList.add("tooltip");
    this.element.textContent = value;

    document.body.append(this.element);
  }

  initialize() {
    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener("pointerover", this.onPointerOver);
    document.addEventListener("pointerout", this.onPointerOut);
  }

  onPointerOver = (event) => {
    const element = event.target.closest(`[data-tooltip]`);

    if (element) {
      this.render(element.dataset.tooltip);
      document.addEventListener("pointermove", this.onPointerMove);
    }
  };

  onPointerOut = () => {
    document.removeEventListener("pointermove", this.onPointerMove);
    this.remove();
  };

  onPointerMove = (event) => {
    const shift = 5;

    this.element.style.top = `${event.clientY + shift}px`;
    this.element.style.left = `${event.clientX + shift}px`;
  };

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    if (this.element) {
      this.remove();
      this.element = null;
      document.removeEventListener("pointerover", this.onPointerOver);
      document.removeEventListener("pointerout", this.onPointerOut);
      document.removeEventListener("pointermove", this.onPointerMove);
    }
  }
}

export default Tooltip;
