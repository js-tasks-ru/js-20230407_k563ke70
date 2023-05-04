import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50
  subElements = {}
  formatData = []
  data = {}

    constructor({
        url = '',
        range : { from = '', to = '' } = {},
        label = '',
        link = '',
        formatHeading = data => data
    } = {}) {
        this.url = url
        this.from = from
        this.to = to
        this.label = label
        this.link = link
        this.formatHeading = formatHeading

        this.render()
    }

    async render() {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = this.template

      this.element = wrapper.firstElementChild

      this.subElements = this.getSubElement()
      this.data = await this.getData()
      this.update(this.from, this.to)

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
        if (this.formatData.length) {
            return this.getValues().map(item => {
                return `<div style="--value: ${item.value}" data-tooltip="${item.persent}"></div>`
            }).join('')
        }
    }

    getValues() {
        if (this.formatData.length) {
            const maxValue = Math.max(...this.formatData)
            const scale = this.chartHeight / maxValue

            return this.formatData.map(item => {
                return {
                    value: String(Math.floor(item * scale)),
                    persent: (item / maxValue * 100).toFixed(0) + '%'
                }
            })
        }
    }

    async getData() {
      const url = `${BACKEND_URL}/${this.url}`
      return await fetchJson(url)
    }

    async update(from, to) {
      this.element.classList.add('column-chart_loading')
      const range = this.getRange(from, to)
      this.formatData = this.getFormatData(from, to)

      if (this.formatData.length) {
        this.showSum()
        this.subElements.body.innerHTML = this.getColumnBody()
        this.element.classList.remove('column-chart_loading')
      }

      return range
    }

    showSum() {
      const sum = this.formatData.reduce((acc, item) => acc + item, 0)
      const value = this.formatHeading(sum)
      this.subElements.header.textContent = value
    }

    getFormatData(from, to) {
      return Object.entries(this.data)
        .filter(item => new Date(item[0]) >= from && new Date(item[0]) <= to)
        .map(item => item[1])
    }

    getRange(from, to) {
      return Object.fromEntries(
        Object.entries(this.data)
        .filter(item => new Date(item[0]) >= from && new Date(item[0]) <= to)
      )
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
          this.subElements = null
        }
    }
}
