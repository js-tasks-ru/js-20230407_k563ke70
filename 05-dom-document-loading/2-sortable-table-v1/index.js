export default class SortableTable {
  subElements = {}
  subHeader = {}

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig
    this.data = data

    this.render()
  }

  getHeader() {
    return this.headerConfig.map(item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order>
          <span>${item.title}</span>
        </div>`
    }).join('')
  }

  getArrow(item) {
    return `
        <span>${item.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
    `
  }

  getBody(data = this.data) {
    return data.map(item => {
      return `
        <a href="#" class="sortable-table__row">
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="#">
          </div>
          <div class="sortable-table__cell">${item.title}</div>

          <div class="sortable-table__cell">${item.quantity}</div>
          <div class="sortable-table__cell">${item.price}</div>
          <div class="sortable-table__cell">${item.sales}</div>
        </a>
      `
    }).join('')
  }

  get template() {
    return `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeader()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.getBody()}
        </div>
      </div
    </div
    `
  }

  getSubElement() {
    const result = {}
    const elements = this.element.querySelectorAll(`[data-element]`)

    for (const node of elements) {
      result[node.dataset.element] = node
    }

    return result
  }

  getSubHeader() {
    const result = {}
    const elements = this.subElements.header.querySelectorAll(`[data-id]`)

    for (const node of elements) {
      result[node.dataset.id] = node
    }

    return result
  }

  render() {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = this.template
    this.element = wrapper.firstElementChild

    this.subElements = this.getSubElement()
    this.subHeader = this.getSubHeader()
    
  }

  sort(fieldValue, orderValue) {
    const item = this.headerConfig.find(item => item.id === fieldValue)
    const arrow = this.getArrow(item)

    this.subElements.header.innerHTML = this.getHeader()
    this.subHeader = this.getSubHeader()
    
    this.subHeader[fieldValue].innerHTML = arrow
    this.subHeader[fieldValue].dataset.order = orderValue
    this.subElements = this.getSubElement()

    const descriptions = {
      asc: 1,
      desc: -1
    }

    const description = descriptions[orderValue]
    
    if(item.sortable) {
      const data = this.data.map(item => ({...item})).sort((item1, item2) => {

        if(typeof item1[fieldValue] === 'string' && typeof item2[fieldValue] === 'string') {
          return description * item1[fieldValue].localeCompare(item2[fieldValue], ['ru', 'en'], { numeric: true, sensitivity: 'base', caseFirst: 'upper'})
        }

        if(typeof item1[fieldValue] === 'number' && typeof item2[fieldValue] === 'number') {
          return description * (item1[fieldValue] - item2[fieldValue])
        }
      })

      this.subElements.body.innerHTML = this.getBody(data)
    }

  }

  remove() {
    if (this.element) {
      this.element.remove()
    }
  }

  destroy() {
    this.remove()
    this.element = null
    this.subElements = null
    this.subHeader = null
  }
}

