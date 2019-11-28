import React, { Component } from 'react'
import { URL, filters, userName } from './../constants'

class Shop extends Component {
  constructor() {
    super();

    this.state = {
      goods: [],
      oders: [],
      filter: filters[0],
      bookedId: undefined,
      isOredersTab: false
    }
  }

  componentDidMount() {
    fetch(`${URL}goods/`)
      .then(response => response.json())
      .then(goods => this.setState({ goods: [...goods.map(g => ({ ...g, opened: false }))] }))
      .catch(console.error)

    this.fetchOrders();
  }

  fetchOrders = () => {
    fetch(`${URL}orders/`)
      .then(response => response.json())
      .then(orders => this.setState({ orders: orders.filter(({ id_customer: { name } }) => name === userName).reverse() }))
      .catch(console.error)
  }

  buyGood = async (name) => {
    const endpoint = `${URL}shop/${userName}/${name}`;
    const options = {
      method: 'POST',
    }
    try {
      const response = await fetch(endpoint, options);
      const result = await response.text();

      this.fetchOrders();
      alert(result)
    } catch (err) {
      console.error(err)
    } finally {
      this.setState({ bookedId: undefined })
    }
  }

  renderBookModal = () => {
    const { name, price, category, fabricator } = this.state.goods.find(({ id }) => id === this.state.bookedId)
    return (
      <div className="bg-gray-200 flex items-center justify-center h-screen">
        <div className="flex items-center justify-center border-solid border-4 border-gray-600 p-8">
          <div
            className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
            onClick={() => this.setState({ bookedId: undefined })}
          >
            <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
            <span className="text-sm">(Esc)</span>
          </div>
          <div>
            <div>
              {name}
            </div>
            <div>
              {price}
            </div>
            <div>
              {category}
            </div>
            <div>
              {fabricator}
            </div>
            <button onClick={() => this.buyGood(name)} className="float-right bg-green-700">
              confirm
          </button>
          </div>
        </div>
      </div>
    );
  }

  toggleDetail = toggleId => {
    const goods = this.state.goods.map(good => good.id === toggleId ? { ...good, opened: !good.opened } : good)
    this.setState({ goods })
  }

  renderGoods = () => {
    return this.state.goods
      .filter(g => this.state.filter !== '' ? g.category === `${this.state.filter} clothes` : true)
      .map(({ id, name, price, category, fabricator, opened }) => {
        return (
          <div key={id} className="m-6 border-solid border-4 border-gray-600 mr-64">
            <div onClick={() => this.toggleDetail(id)}>
              <div className="">{name}</div>
              <div className="text-sm">{price}</div>
            </div>
            {
              opened && (
                <div>
                  <div>
                    {category}
                  </div>
                  <div>
                    {fabricator}
                  </div>
                </div>
              )
            }
            <button
              className="bg-gray-400"
              onClick={() => this.setState({ bookedId: id })}
            >
              buy
            </button>
          </div>
        )
      })
  }

  renderOrders = () => {
    return (
      <>
        <div>Orders</div>
        {
          this.state.orders.map(({ id, id_good: { name, fabricator }, date }) => (
            <div key={id} className="m-6 border-solid border-4 border-gray-600 mr-64">
              <div>{name}</div>
              <div>{fabricator}</div>
              <div>{date.slice(0, 10)}</div>
            </div>
          ))
        }
      </>
    )
  }

  render() {
    return this.state.bookedId ? this.renderBookModal() : (
      <div>
        <div>{userName}</div>
        <button
          onClick={() => this.setState({ isOredersTab: !this.state.isOredersTab })}
          className="m-4 bg-red-300"
        >
          {this.state.isOredersTab ? 'Make purchases' : 'Watch orders'}
        </button>
        {
          this.state.isOredersTab ? this.renderOrders() : (
            <>
              <div className="flex">
                <div className="mr-8">Filter</div>
                <select
                  className="max-w-sm block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  onChange={e => this.setState({ filter: e.target.value })}
                  value={this.state.filter}
                >
                  {filters.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                {this.renderGoods()}
              </div>
            </>
          )
        }
      </div>
    )
  }
}

export default Shop
