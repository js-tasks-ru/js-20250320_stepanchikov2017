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
    this.subElements.header.addEventListener('pointerdown', this.handlerHeaderClick);
  }

  removeListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handlerHeaderClick);
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
    const cellElement = event.target.closest('[data-sortable="true"]');

    if (!cellElement) {
      return;
    }

    const fieldName = cellElement.dataset.id;
    const fieldOrder = cellElement.dataset.order === 'desc' ? 'asc' : 'desc';

    this.clearCellOrder();
    this.sort(fieldName, fieldOrder);
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}