export default class ColumnChart {
    chartHeight = 50

    constructor(data) {
        this.data = data
        this.render()
    }

    render() {
        this.element = document.createElement('div')
        this.element.classList.add('column-chart')
        this.element.style = `--chart-height: ${this.chartHeight}`

        if (!this.data) {
            this.element.classList.add('column-chart_loading')
            return
        }

        if (!this.data.data?.length) {
            this.element.classList.add('column-chart_loading')
        }

        const getLink = () => {
            if (this.data.link) {
                return 'View all'
            }
            return ''
        }

        const getFormat = () => {
            return  this.data.formatHeading 
                        ? this.data.formatHeading(this.data.value) 
                        : this.data.value
        }

        const getValue = () => {
            const data = this.data.data

            if (data.length) {
                const maxValue = Math.max(...data)
                const scale = this.chartHeight / maxValue
            
                return data.map(item => {
                    return {
                        value: String(Math.floor(item * scale)),
                        persent: (item / maxValue * 100).toFixed(0) + '%'
                    }
                })
            }
        }

        const getBody = () => {
            if (this.data.data?.length) {
                const data = getValue()

                return data.map(item => {
                        const element = document.createElement('div')
                        element.style = `--value: ${item.value}`
                        element.dataset.tooltip = `${item.persent}`
                        return element.outerHTML
                    }).join('')
            }
        }

        this.element.innerHTML = `
            <div class="column-chart__title">Total
                ${this.data.label}
                <a class="column-chart__link" 
                    href="${this.data.link}">
                    ${getLink()}
                </a>
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">
                    ${getFormat()}
                </div>
                <div data-element="body" class="column-chart__chart">
                    ${getBody()}
                </div>
            </div>
        `
    }

    update(array) {
        if (this.data) {
            this.data.data = array
            this.render()
        }
    }

    destroy() {
        for (const key in this) {
            delete this[key]
        }
    }

    remove() {
        this.element.remove()
    }
}
