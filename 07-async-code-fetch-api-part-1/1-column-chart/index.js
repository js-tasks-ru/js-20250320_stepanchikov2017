import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartv2 extends ColumnChart {
  constructor(props = {}) {
    const {data = [], url = '', range = {}, ...rest } = props;
		super(rest);
		this.url = `${BACKEND_URL}/${url}`;
    this.range = range;
    this.loaderClass = 'column-chart_loading';
		if(!data && data.length === 0){
			this.element.classList.add(this.loaderClass);
		}

    if (range.from && range.to) {
      this.update(range.from, range.to);
    }
  }

  async update(from, to) {
    try {
      this.element.classList.add(this.loaderClass);
      const data = await this.fetchData(from, to);
			super.update(Object.values(data))
      this.element.classList.remove(this.loaderClass);
			return data
    } catch (error) {
      this.element.classList.remove(this.loaderClass);
      throw error;
    }
  }

  async fetchData(from, to) {
    const url = new URL(this.url);
    url.searchParams.set('from', from.toISOString());
    url.searchParams.set('to', to.toISOString());
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  }
}