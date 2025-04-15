export default class DoubleSlider {
  element;
  rightThumb;
  leftThumb;
  progressBar;
  leftPosition = 0;
  rightPosition = 0;
  currentThumb = null;

  constructor(props = {}) {
    const {
      min = 0,
      max = 100,
      formatValue = (value) => value,
      selected = {} 
    } = props;
    
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = {
      from: selected.from ?? min,
      to: selected.to ?? max
    };

    this.leftPosition = ((this.selected.from - this.min) / (this.max - this.min)) * 100;
    this.rightPosition = 100 - ((this.selected.to - this.min) / (this.max - this.min)) * 100;

    this.element = this.createElement();
    this.initElements();
    this.createEventListener();
  }

  createLeftThumbTemplate() {
    return `
      <span 
        class="range-slider__thumb-left" 
        style="left: ${this.leftPosition}%"
      ></span>
    `;
  }

  createRightThumbTemplate() {
    return `
      <span 
        class="range-slider__thumb-right" 
        style="right: ${this.rightPosition}%"
      ></span>
    `;
  }

  createSliderTemplate() {
    return `
      <div class="range-slider">
        <span class="range-slider__value-from" data-element="from">${this.formatValue(this.selected.from)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${this.leftPosition}%; right: ${this.rightPosition}%"></span>
          ${this.createLeftThumbTemplate()}
          ${this.createRightThumbTemplate()}
        </div>
        <span class="range-slider__value-to" data-element="to">${this.formatValue(this.selected.to)}</span>
      </div>
    `;
  }

  initElements() {
    this.leftThumb = this.element.querySelector('.range-slider__thumb-left');
    this.rightThumb = this.element.querySelector('.range-slider__thumb-right');
    this.progressBar = this.element.querySelector('.range-slider__progress');
    this.fromValue = this.element.querySelector('.range-slider__value-from');
    this.toValue = this.element.querySelector('.range-slider__value-to');
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createSliderTemplate();
    return element.firstElementChild;
  }

  updateValuesDisplay() {
    const from = this.min + (this.leftPosition / 100) * (this.max - this.min);
    const to = this.max - (this.rightPosition / 100) * (this.max - this.min);
  
    this.selected.from = Math.round(from);
    this.selected.to = Math.round(to);
  
    this.fromValue.textContent = this.formatValue(this.selected.from);
    this.toValue.textContent = this.formatValue(this.selected.to);
  }

  updateLeftPosition = (event) => {
    const slider = this.element.querySelector('.range-slider__inner');
    const rect = slider.getBoundingClientRect();
    const sliderWidth = rect.width;
  
    let newLeft = (event.clientX - rect.left) / sliderWidth * 100;
    newLeft = Math.max(0, Math.min(100 - this.rightPosition, newLeft));
  
    this.leftPosition = newLeft;
    this.leftThumb.style.left = `${newLeft}%`;
    this.progressBar.style.left = `${newLeft}%`;
    this.updateValuesDisplay();
  };

  updateRightPosition = (event) => {
    const slider = this.element.querySelector('.range-slider__inner');
    const rect = slider.getBoundingClientRect();
    const sliderWidth = rect.width;
  
    let newRight = (rect.right - event.clientX) / sliderWidth * 100;
    newRight = Math.max(0, Math.min(100 - this.leftPosition, newRight));
  
    this.rightPosition = newRight;
    this.rightThumb.style.right = `${newRight}%`;
    this.progressBar.style.right = `${newRight}%`;
    this.updateValuesDisplay();
  };

  dispatchRangeSelect() {
    const event = new CustomEvent('range-select', {
      detail: {
        from: this.selected.from,
        to: this.selected.to
      }
    });
    this.element.dispatchEvent(event);
  }

  handlePointerDown = (event) => {
    if (event.target.closest('.range-slider__thumb-left')) {
      this.currentThumb = 'left';
    }
		
		if (event.target.closest('.range-slider__thumb-right')) {
      this.currentThumb = 'right';
    }

    document.addEventListener('pointermove', this.handlePointerMove);
    document.addEventListener('pointerup', this.handlePointerUp, { once: true });
  };

  handlePointerMove = (event) => {
    if (this.currentThumb === 'left') {
      this.updateLeftPosition(event);
    } else if (this.currentThumb === 'right') {
      this.updateRightPosition(event);
    }
  };

  handlePointerUp = () => {
    document.removeEventListener('pointermove', this.handlePointerMove);
    this.currentThumb = null;
    this.dispatchRangeSelect();
  };

  createEventListener() {
    this.element.addEventListener('pointerdown', this.handlePointerDown);
  }

  removeEventListener() {
    this.element.removeEventListener('pointerdown', this.handlePointerDown);
    document.removeEventListener('pointermove', this.handlePointerMove);
  }

  remove() {
    this.removeEventListener();
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}