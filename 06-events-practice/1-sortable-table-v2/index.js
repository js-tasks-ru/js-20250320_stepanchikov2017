import SortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js'

export default class SortableTablev2 extends SortableTable {
  ArrowElement;
  
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data)
    this.data = data;
    this.sorted = sorted;

    this.ArrowElement = this.createArrowElement();
    this.createListeners();
    this.sortTable();
  }

  createArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  createArrowElement() {
    const ArrowElement = document.createElement('div');
    ArrowElement.innerHTML = this.createArrowTemplate();
    return ArrowElement.firstElementChild;
  }

  clearCellOrder() {
    const cells = this.element.querySelectorAll('.sortable-table__header .sortable-table__cell');
    cells.forEach(cell => {
      cell.setAttribute('data-order', '');
    });
  }

  updateCell(field, order) {
    const sortableCell = this.element.querySelector(`[data-id="${field}"]`);
    sortableCell.setAttribute('data-order', order);
    sortableCell.append(this.ArrowElement);
  }

  sortTable() {
    this.sort(this.sorted.id, this.sorted.order);
    this.updateCell(this.sorted.id, this.sorted.order);
  }

  handlerHeaderClick(e) {
    const currentCell = e.target.closest('.sortable-table__cell');

    if (!currentCell || currentCell.dataset.sortable === 'false') return;

    const field = currentCell.dataset.id;
    const currentOrder = currentCell.dataset.order;

    let newOrder;
    if (currentOrder === '' || currentOrder === undefined) {
      newOrder = 'desc';
    } else {
      newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    }

    this.sort(field, newOrder);
    this.updateCell(field, newOrder);
  }

  createListeners() {
    this.subElements.header.addEventListener('click', (event) => this.handlerHeaderClick(event));
  }

  removeListeners() {
    this.subElements.header.removeEventListener('click', (event) => this.handlerHeaderClick(event));
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}