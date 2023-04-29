export default class SortableTable {
  subElements = {}
  subHeaderElements = {}

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig
    this.data = data

    this.render()
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

  getHeader() {
    return this.headerConfig.map(item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order>
          <span>${item.title}</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
        </div>`
    }).join('')
  }

  getBody(data = this.data) {  
    return data.map(product => {
      return `
        <a href="#" class="sortable-table__row">
          ${this.getDescriptionProduct(product)}
        </a>
    `
    }).join('')
  }

  getDescriptionProduct(product) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {id, template}
    })

    return cells.map(({id, template}) => {
      return template
        ? template(product[id])
        : `<div class="sortable-table__cell">${product[id]}</div>`
    }).join('')
  }

  render() {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = this.template
    this.element = wrapper.firstElementChild

    this.subElements = this.getSubElement()
    this.subHeaderElements = this.getSubHeaderElements()
  }

  getSubElement() {
    const result = {}
    const elements = this.element.querySelectorAll(`[data-element]`)

    for (const node of elements) {
      result[node.dataset.element] = node
    }

    return result
  }

  getSubHeaderElements() {
    const result = {}
    const elements = this.subElements.header.querySelectorAll(`[data-id]`)

    for (const node of elements) {
      result[node.dataset.id] = node
    }

    return result
  }

  sort(field, order) {
    const itemOnSort = this.headerConfig.find(item => item.id === field)

    for (const value of Object.values(this.subHeaderElements)) {
      value.dataset.order = ''
    }
      
    if(itemOnSort.sortable) {

      this.subHeaderElements[field].dataset.order = order

      const descriptions = {
        asc: 1,
        desc: -1
      }

      const description = descriptions[order]
      
      const data = this.data
        .map(product => ({...product}))
        .sort((item1, item2) => {
          
          if (itemOnSort.sortType === 'string') {
            return description * item1[field].localeCompare(item2[field], ['ru', 'en'])
          }

          if(itemOnSort.sortType === 'number') {
            return description * (item1[field] - item2[field])
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
    this.subHeaderElements = null
  }
}

