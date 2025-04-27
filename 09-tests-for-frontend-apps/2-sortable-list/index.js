export default class SortableList {
  element;
  placeholder;
  draggingItem;
  shiftX = 0;
  shiftY = 0;

  constructor({ items = [] } = {}) {
    this.items = items;
    this.element = this.createElement();
    this.placeholder = this.createPlaceholder();
    this.addEventListeners();
  }  

  createPlaceholder() {
    const placeholder = document.createElement('li');
    placeholder.classList.add('sortable-list__placeholder');
    placeholder.style.width = '100%';
    placeholder.style.height = '60px';
    return placeholder;
  }

  createElement() {
    const element = document.createElement('ul');
    element.classList.add('sortable-list');
    element.dataset.element = 'imageListContainer';
    
    this.items.forEach(item => {
      element.append(item);
    });
    
    return element;
  }

  addEventListeners() {
    const grabButtons = this.element.querySelectorAll("[data-grab-handle]");
    const deleteButtons = this.element.querySelectorAll("[data-delete-handle]");
  
    grabButtons.forEach(button => {
      button.addEventListener('pointerdown', this.handleGrabPointerDown);
    });

    deleteButtons.forEach(button => {
      button.addEventListener('pointerdown', this.handleDeletePointerDown);
    });

    document.addEventListener('pointerup', this.handlePointerUp);
  }

  moveAt(pageX, pageY) {
    this.draggingItem.style.left = pageX - this.shiftX + 'px';
    this.draggingItem.style.top = pageY - this.shiftY + 'px';
    
    this.checkPlaceholderPosition();
  }

  checkPlaceholderPosition() {
    const items = Array.from(this.element.children).filter(child => child !== this.draggingItem);
    const placeholderIndex = items.indexOf(this.placeholder);
    
    if (placeholderIndex === -1) return;
    
    const draggingRect = this.draggingItem.getBoundingClientRect();
    const draggingCenterY = draggingRect.top + draggingRect.height / 2;

    if (placeholderIndex > 0) {
      const prevItem = items[placeholderIndex - 1];
      const prevRect = prevItem.getBoundingClientRect();
      const prevCenterY = prevRect.top + prevRect.height / 2;
      
      if (draggingCenterY < prevCenterY) {
        prevItem.before(this.placeholder);
        return;
      }
    }
  
    if (placeholderIndex < items.length - 1) {
      const nextItem = items[placeholderIndex + 1];
      const nextRect = nextItem.getBoundingClientRect();
      const nextCenterY = nextRect.top + nextRect.height / 2;
      
      if (draggingCenterY > nextCenterY) {
        nextItem.after(this.placeholder);
        return;
      }
    }
  }

  onMouseMove = (event) => {
    this.moveAt(event.clientX, event.clientY);
  }
  
  handleGrabPointerDown = (event) => {
		event.preventDefault();
		console.log(this.element.children.length);
		
		const item = event.target.closest('li');
	
		if (!item) return;
		
		this.draggingItem = item;
	
		const rect = this.draggingItem.getBoundingClientRect();
		this.shiftX = event.clientX - rect.left;
		this.shiftY = event.clientY - rect.top;
				
		this.element.append(this.placeholder);
		this.draggingItem.replaceWith(this.placeholder);
		this.element.append(this.draggingItem);
		
		console.log(this.element.children.length);
		this.draggingItem.classList.add('sortable-list__item_dragging');
		this.moveAt(event.clientX, event.clientY);
	
		document.addEventListener('pointermove', this.onMouseMove);
	}
  handleDeletePointerDown = (event) => {
    event.preventDefault();
    const item = event.target.closest('li');
    if (item) {
      item.remove();
    }
  }
  
  handlePointerUp = () => {
    if (!this.draggingItem) return;
    document.removeEventListener('pointermove', this.onMouseMove);
    
    this.draggingItem.classList.remove('sortable-list__item_dragging');
    this.draggingItem.style.top = '';
    this.draggingItem.style.left = '';
    this.placeholder.replaceWith(this.draggingItem);
    this.draggingItem = null;
  }

  remove() {
    if (this.element && this.element.remove) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointerup', this.handlePointerUp);
    document.removeEventListener('pointermove', this.onMouseMove);
  }
}