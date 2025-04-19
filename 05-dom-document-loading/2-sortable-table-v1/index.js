export default class SortableTable {
  element;
  arrowElement;
  subElements = {};
  field = '';
  order = '';

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement();
    this.arrowElement = this.createArrowElement();
    this.subElements = this.getSubElements(this.element);
  }

  toggleEmptyPlaceholder(data) {
    const hasData = data.length > 0;
  
    this.subElements.body.style.display = hasData ? '' : 'none';
    this.subElements.header.style.display = hasData ? '' : 'none';
    this.subElements.emptyPlaceholder.style.display = hasData ? 'none' : 'block';
  }

  createElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.createTable();
    return wrapper.firstElementChild;
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
    `;
  }

  createTableHeader() {
    return this.headerConfig.map(({ id, title, sortable }) => {
      const order = this.field === id ? this.order : '';
      return `
        <div 
          class="sortable-table__cell" 
          data-id="${id}" 
          data-sortable="${sortable}" 
          data-order="${order}"
        >
          <span>${title}</span>
        </div>
      `;
    }).join('');
  }

  createTableBody(data) {
    return data.map(item => {
      const cells = this.headerConfig.map(({ id, template }) => {
        return template
          ? template(item[id])
          : `<div class="sortable-table__cell">${item[id]}</div>`;
      }).join('');

      return `<a href="/products/${item.id}" class="sortable-table__row">${cells}</a>`;
    }).join('');
  }

  update(data) {
    this.subElements.body.innerHTML = this.createTableBody(data);
    this.toggleEmptyPlaceholder(data);
  }

  createArrowElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
    return wrapper.firstElementChild;
  }

  updateCell(field, order) {
    const cell = this.element.querySelector(`[data-id="${field}"]`);
    if (!cell) return;
    cell.setAttribute('data-order', order);
    cell.append(this.arrowElement);
  }

  getSubElements(root) {
    const elements = root.querySelectorAll('[data-element]');
    return Array.from(elements).reduce((acc, el) => {
      acc[el.dataset.element] = el;
      return acc;
    }, {});
  }

  sort(field, order = 'asc') {
    const column = this.headerConfig.find(item => item.id === field);
    if (!column || !column.sortable) return;

    const direction = order === 'asc' ? 1 : -1;
    const sortedData = [...this.data];

    switch (column.sortType) {
      case 'string':
        sortedData.sort((a, b) =>
          direction * a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper' })
        );
        break;
      case 'number':
        sortedData.sort((a, b) => direction * (a[field] - b[field]));
        break;
    }

    this.field = field;
    this.order = order;

    this.update(sortedData);
    this.updateCell(field, order);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}