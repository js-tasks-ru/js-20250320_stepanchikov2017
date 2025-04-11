import SortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTablev2 extends SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);
    this.sorted = sorted;

    this.createListeners();
    this.sortTable();
  }

  createListeners() {
    this.subElements.header.addEventListener('click', this.handlerHeaderClick);
  }

  removeListeners() {
    this.subElements.header.removeEventListener('click', this.handlerHeaderClick);
  }

  sortTable() {
    if (this.sorted?.id && this.sorted?.order) {
      this.clearCellOrder();
      this.sort(this.sorted.id, this.sorted.order);
    }
  }

  clearCellOrder() {
    const cells = this.element.querySelectorAll('.sortable-table__header .sortable-table__cell');
    for (const cell of cells) {
      cell.setAttribute('data-order', '');
    }
  }

  handlerHeaderClick = event => {
    const cell = event.target.closest('.sortable-table__cell');
    if (!cell || cell.dataset.sortable === 'false') return;

    const field = cell.dataset.id;
    const currentOrder = cell.dataset.order;
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

    this.clearCellOrder();
    this.sort(field, newOrder);
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}