export default class NotificationMessage {
    static current = 1
    static previous = {}

    constructor(message = '', {duration = 0, type = ''} = {}) {
        this.message = message
        this.duration = duration
        this.type = type

        this.render()
    }

    render() {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = this.template
        this.element = wrapper.firstElementChild
    }

    get template() {
        return `
            <div class="notification ${this.type}" style="--value: ${this.getValue()}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                </div>
            </div>
        `
    }

    getValue() {
        return this.duration / 1000
    }

    show(node = this.element) {
        this.element = node
        
        if (NotificationMessage.current > 1) {
            NotificationMessage.previous.remove()
        }
        
        NotificationMessage.previous = this.element
        NotificationMessage.current++

        document.body.append(this.element)
        
        setTimeout(() => {
            NotificationMessage.current--
            this.destroy()
        }, this.duration)
    }

    remove() {
        if (this.element) {
            this.element.remove()
        }
    }

    destroy() {
        if (this.element) {
            this.remove()
            this.element = null
            this.previous = null
        }
    }
}
