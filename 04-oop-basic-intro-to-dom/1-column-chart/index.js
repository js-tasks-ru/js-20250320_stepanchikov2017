export default class ColumnChart {
	element;
	chartHeight = 50;

	constructor (props = {}) {
		const { 
			data = [], 
			label = '', 
			value = 0, 
			link = '',
			formatHeading = (value) => value 
		} = props;

		this.data = data;
		this.label = label;
		this.value = value;
		this.link = link;
		this.formatHeading = formatHeading;

		this.element = this.createElement();	
	}

	getSubElements(element) {
		const elements = element.querySelectorAll('[data-element]');
		return [...elements].reduce((accum, subElement) => {
			const name = subElement.dataset.element;
			accum[name] = subElement;
			return accum;
		}, {});
	}

	createLinkTemplate() {
		if (this.link) {
			return `<a href="${this.link}" class="column-chart__link">View all</a>`
		}
		return ''
	}

	getColumnProps(data) {
		const maxValue = Math.max(...data);
		const scale = 50 / maxValue;
	
		return data.map(item => {
			return {
				percent: (item / maxValue * 100).toFixed(0) + '%',
				value: String(Math.floor(item * scale))
			};
		});
	}

	createChartTemplate() {
		return this.getColumnProps(this.data).map(({value, percent}) => {
			return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
		}).join('')
	}

	createTemplate() {
		return `<div class="column-chart" style="--chart-height: 50">
      <div class="column-chart__title">
        ${this.label}
        ${this.createLinkTemplate()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
					${this.formatHeading(this.value)}
				</div>
        <div data-element="body" class="column-chart__chart">
					${this.createChartTemplate()}
        </div>
      </div>
    </div>`
	}

	createElement() {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = this.createTemplate();
		const chartElement = wrapper.firstElementChild;
		chartElement.classList.add('column-chart_loading');
		this.subElements = this.getSubElements(chartElement);
		return chartElement;
	}

	update(newData) {
		this.data = newData;
		const newHeader = this.formatHeading(
			this.data.reduce((sum, item) => sum + item, 0)
		);
		this.subElements.header.innerHTML = newHeader;
		this.subElements.body.innerHTML = this.createChartTemplate();
	}

	remove() {
		this.element.remove();
	}

	destroy() {
		this.remove();
	}
}
