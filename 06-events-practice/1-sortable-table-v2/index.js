export default class SortableTable {
  subElements = {}
  subHeaderElements = {}

  sortable = (event) => {
      const element = event.target.closest('.sortable-table__cell')
      const field = element.dataset.id
      const order = element.dataset.order
      
      const orders = {
        asc: 'desc',
        desc: 'asc'
      }

      const newOrder =  order ? orders[order] : 'asc'
    
      this.sort(field, newOrder)
  }

  constructor(headerConfig = [], {
    data = [],
    sorted = {}
  } = {},
  isSortLocally = true) {
    this.data = data
    this.headerConfig = headerConfig
    this.sorted = sorted
    this.isSortLocally = isSortLocally

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

    this.subElements = this.getSubElements(this.element, 'element')
    this.subHeaderElements = this.getSubElements(this.subElements.header, 'id')

    this.subElements.header.addEventListener('pointerdown', this.sortable)
    this.sort(this.sorted.id, this.sorted.order)
  }

  getSubElements(node, value) {
    const result = {}
    const elements = node.querySelectorAll(`[data-${value}]`)

    for (const elem of elements) {
      result[elem.dataset[value]] = elem
    }

    return result
  }

  sort(field, order) {
    if (this.isSortLocally) {
      this.sortOnClient(field, order)
    } else {
      this.sortOnServer(field, order)
    }
  }

  sortOnClient(field, order) {
    const itemOnSort = this.headerConfig.find(item => item.id === field)
    
    if(itemOnSort.sortable) {
      
      for (const value of Object.values(this.subHeaderElements)) {
        value.dataset.order = ''
      }

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

  sortOnServer(field, order) {

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
