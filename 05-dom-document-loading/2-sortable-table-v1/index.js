export default class SortableTable {
  element;
  
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement();

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return Array.from(elements).reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  createTable() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.createTableHeader()}
        </div>

        <div data-element="body" class="sortable-table__body">
        ${this.createTableBody(this.data)}
        </div>

        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    `
  }

  createTableHeader() {
    return this.headerConfig.map(cell => {
      const order = cell.id === this.field ? this.order : '';
      return `
      <div 
        class="sortable-table__cell" 
        data-id="${cell.id}" 
        data-sortable="${cell.sortable}" 
        data-order="${order}"
      >
        <span>${cell.title}</span>
      </div>
    `}).join('');
  }

  sortData(field, order, data = []) {
    if(field && order){
      const type = this.headerConfig.find(val => val.id === field)?.sortType;

      return [...data].sort((a, b) => {
        if (type === 'number') {
          if(order === 'asc') {
            return a[field] - b[field]
          } else {
            return  b[field] - a[field] 
          }
        } else {
          if(order === 'asc') {
            return a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: "upper" })
          } else {
            return b[field].localeCompare(a[field], ['ru', 'en'], { caseFirst: "upper" })
          }
        }
      })
    } else {
      return data
    }
  }

  createTableBody(bodyData) {
    return bodyData.map(item => {
      const cells = this.headerConfig.map(column => {
        if (column.template) {
          return column.template(item[column.id]);
        } else {
          return `<div class="sortable-table__cell">${item[column.id]}</div>`;
        }
      }).join('');
  
      return `<a href="/products/${item.id}" class="sortable-table__row">${cells}</a>`;
    }).join('');
  }
  

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTable();
    return element.firstElementChild
  }

  sort(field, order) {
    this.field = field;
    this.order = order;
  
    const sortedData = this.sortData(field, order, this.data);
    const bodyElement = this.element.querySelector('[data-element="body"]');
  
    bodyElement.innerHTML = this.createTableBody(sortedData);
  }
  

  remove() {
		this.element.remove();
	}

	destroy() {
		this.remove();
	}
}

