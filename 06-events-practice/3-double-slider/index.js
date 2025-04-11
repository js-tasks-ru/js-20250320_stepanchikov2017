export default class DoubleSlider {
	element;
	rightThumb;
	leftThumb;
	progressBar;
	leftPosition = 0;
	rightPosition = 0;

	constructor(props = {}) {
		const {
			min = 0,
      max = 100,
			formatValue = (value) => value,
      selected = {} 
		} = props
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

		this.leftThumb = this.element.querySelector('.range-slider__thumb-left');
		this.rightThumb = this.element.querySelector('.range-slider__thumb-right');
		this.progressBar = this.element.querySelector('.range-slider__progress');
		this.fromValue = this.element.querySelector('.range-slider__value-from');
		this.toValue = this.element.querySelector('.range-slider__value-to');

		this.boundHandleMouseDown = this.handleMouseDown.bind(this);
  	this.boundRemoveHandleMouseDown = this.removeHandleMouseDown.bind(this);
		this.createEventListener();
		this.isDragging = false;
	}

	createLeftThumbTemplate() {
		return `
			<span 
				class="range-slider__thumb-left" 
				style="left: ${this.leftPosition}"
			>
			</span>
		`
	}

	createRightThumbTemplate() {
		return `
			<span 
				class="range-slider__thumb-right" 
				style="right: ${this.rightPosition}"
			>
			</span>
		`
	}

	createSliderTemplate() {
		return `
			<div class="range-slider">
				<span class="range-slider__value-from" data-element="from">${this.formatValue(this.selected.from)}</span>
				<div class="range-slider__inner">
					<span class="range-slider__progress" style="left: ${this.leftPosition}; right: ${this.rightPosition}"></span>
					${this.createLeftThumbTemplate()}
					${this.createRightThumbTemplate()}
				</div>
				<span class="range-slider__value-to" data-element="to">${this.formatValue(this.selected.to)}</span>
			</div>
		`
	}	

	updateValuesDisplay() {
		const from = this.min + (this.leftPosition / 100) * (this.max - this.min);
		const to = this.max - (this.rightPosition / 100) * (this.max - this.min);
	
		this.selected.from = Math.round(from);
		this.selected.to = Math.round(to);
	
		this.fromValue.textContent = this.formatValue(this.selected.from);
		this.toValue.textContent = this.formatValue(this.selected.to);
	}

	createElement() {
		const element = document.createElement('div');
		element.innerHTML = this.createSliderTemplate();
		return element.firstElementChild;
	}

	updateLeftPosition = (event) => {
		this.isDragging = true;
		const slider = this.element.querySelector('.range-slider__inner');
		const rect = slider.getBoundingClientRect();
		const sliderWidth = rect.width;
	
		let newLeft = (event.clientX - rect.left) / sliderWidth * 100;
		newLeft = Math.max(0, Math.min(100, newLeft));
	
		if (newLeft + this.rightPosition >= 100) {
			newLeft = 100 - this.rightPosition;
		}
	
		this.leftPosition = newLeft;
		this.leftThumb.style.left = `${newLeft}%`;
		this.progressBar.style.left = `${newLeft}%`;
		this.updateValuesDisplay();
		this.dispatchRangeSelect();
	}	

	updateRightPosition = (event) => {
		this.isDragging = true;
		const slider = this.element.querySelector('.range-slider__inner');
		const rect = slider.getBoundingClientRect();
		const sliderWidth = rect.width;
	
		let newRight = (rect.right - event.clientX) / sliderWidth * 100;
		newRight = Math.max(0, Math.min(100, newRight));

		if (newRight + this.leftPosition >= 100) {
			newRight = 100 - this.leftPosition;
		}
	
		this.rightPosition = newRight;
		this.rightThumb.style.right = `${newRight}%`;
		this.progressBar.style.right = `${newRight}%`;
		this.updateValuesDisplay();
		this.dispatchRangeSelect();
	}	

	dispatchRangeSelect() {
		const event = new CustomEvent('range-select', {
			detail: {
				from: this.selected.from,
				to: this.selected.to
			}
		});
	
		this.element.dispatchEvent(event);
	}

	handleMouseDown = event => {
		const rightThumbEvent = event.target.closest('.range-slider__thumb-right');
		const leftThumbEvent = event.target.closest('.range-slider__thumb-left');
		
		if(rightThumbEvent) {
			document.addEventListener('pointermove', this.updateRightPosition)
		}
		if(leftThumbEvent) {
			document.addEventListener('pointermove', this.updateLeftPosition)
		}
	}

	removeHandleMouseDown = () => {
		document.removeEventListener('pointermove', this.updateRightPosition);
		document.removeEventListener('pointermove', this.updateLeftPosition);
	};
	
	createEventListener() {
		document.addEventListener('pointerdown', this.boundHandleMouseDown);
  	document.addEventListener('pointerup', this.boundRemoveHandleMouseDown);
	}

	removeEventListener() {
		document.removeEventListener('pointerdown', this.boundHandleMouseDown);
  	document.removeEventListener('pointerup', this.boundRemoveHandleMouseDown);
	}

	remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
