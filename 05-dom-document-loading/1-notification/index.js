export default class NotificationMessage {
	static lastShownComponent;
	element;

	constructor (string = '', props = {}) {
		this.string = string;
		const {
			duration = null,
			type = ''
		} = props;
		this.duration = duration;
		this.type = type;

		this.element = this.createElement()
	}

	createNotificationTemplate(){
		return `
		<div 
		class="notification ${this.type}" 
		style="--value:${this.duration / 1000}s">
			<div class="timer"></div>
			<div class="inner-wrapper">
				<div class="notification-header">${this.type}</div>
				<div class="notification-body">
					${this.string}
				</div>
			</div>
		</div>
		`
	}

	createElement() {
		const element = document.createElement('div');
		element.innerHTML = this.createNotificationTemplate();
		return element.firstElementChild
	}

	show(parent = document.body) {
		if (NotificationMessage.lastShownComponent) {
			NotificationMessage.lastShownComponent.hide();
		}
		NotificationMessage.lastShownComponent = this;
	
		parent.append(this.element);
	
		this.timerId = setTimeout(() => {
			this.hide();
		}, this.duration);
	}
	

	remove() {
		this.element.remove();
	}
	
	hide() {
		this.remove();
	}

	destroy() {
		clearTimeout(this.timerId);
		this.remove();
	}
}
