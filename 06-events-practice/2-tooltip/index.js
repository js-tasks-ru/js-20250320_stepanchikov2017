class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;

    this.onPointerOver = this.onPointerOver.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
  }

  initialize() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  onPointerOver(event) {
    const tooltipTarget = event.target.closest('[data-tooltip]');
    if (!tooltipTarget) return;

    this.render(tooltipTarget.dataset.tooltip);
    document.addEventListener('pointermove', this.onPointerMove);
  }

  onPointerOut(event) {
    const related = event.relatedTarget;
    if (this.element && (!related || !related.closest('[data-tooltip]'))) {
      this.remove();
      document.removeEventListener('pointermove', this.onPointerMove);
    }
  }

  onPointerMove(event) {
    const offset = 10;
    this.element.style.left = `${event.clientX + offset}px`;
    this.element.style.top = `${event.clientY + offset}px`;
  }

  createTooltipTemplate(text = '') {
    return `<div class="tooltip">${text}</div>`;
  }

  createElement(text) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.createTooltipTemplate(text);
    return wrapper.firstElementChild;
  }

  render(text) {
    this.remove();
    this.element = this.createElement(text);
    document.body.append(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
  }
}

export default Tooltip;
