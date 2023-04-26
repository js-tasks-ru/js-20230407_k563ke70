export default class ColumnChart {
    chartHeight = 50
    subElement = {}

    constructor({
        data = [],
        label = '',
        link = '',
        value = 0,
        formatHeading = data => data
    } = {}) {
        this.data = data
        this.label = label
        this.link = link
        this.value = formatHeading(value)

        this.render()
    }

    render() {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = this.template

        this.element = wrapper.firstElementChild

        if (this.data.length) {
            this.element.classList.remove('column-chart_loading')
        }

        this.subElement = this.getSubElement()
    }

    get template() {
        return `
            <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">
                    Total ${this.label}
                    ${this.getLink()}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">
                        ${this.value}
                    </div>
                    <div data-element="body" class="column-chart__chart">
                        ${this.getColumnBody()}
                    </div>
                </div>
            </div>
        `
    }

    getSubElement() {
        const result = {}
        const elements = this.element.querySelectorAll(`[data-element]`)

        for (const subElement of elements) {
            const name = subElement.dataset.element

            result[name] = subElement
        }

        return result
    }

    getLink() {
        return this.link
            ? `<a class="column-chart__link" href="${this.link}">View all</a>`
            : ''
    }

    getColumnBody() {
        if (this.data.length) {
            return this.getValues().map(item => {
                return `<div style="--value: ${item.value}" data-tooltip="${item.persent}"></div>`
            }).join('')
        }
    }

    getValues() {
        if (this.data.length) {
            const maxValue = Math.max(...this.data)
            const scale = this.chartHeight / maxValue
    
            return this.data.map(item => {
                return {
                    value: String(Math.floor(item * scale)),
                    persent: (item / maxValue * 100).toFixed(0) + '%'
                }
            })
        }
    }

    update(data = []) {
        if (!this.data) {
            this.element.classList.add('column-chart_loading')
        }

        this.data = data

        this.subElement.body.innerHTML = this.getColumnBody()
    }

    remove() {
        if (this.element) {
            this.element.remove()
        }
    }

    destroy() {
        this.remove()
        this.element = {}
        this.subElement = {}
    }
}
