import React, { Component } from 'react';
import { filters, URL } from './../constants';

const initialGood = {
  name: '',
  price: 0,
  category: filters[0],
  fabricator: '',
}

class AdminComponent extends Component {
  constructor() {
    super();

    this.state = {
      goods: [],
      good: { ...initialGood },
      goodIdToEdit: false
    }
  }

  componentDidMount() {
    this.fetchGoods();
  }

  fetchGoods = () => {
    fetch(`${URL}goods/`)
      .then(response => response.json())
      .then(goods => this.setState({ goods: [...goods.map(g => ({ ...g, opened: false }))] }))
      .catch(console.error)
  }

  resetGood = () => {
    this.setState({ good: { ...initialGood } })
  }

  setEdited = idToEdit => {
    const good = this.state.goods.find(({ id }) => id === idToEdit)
    this.setState({ goodIdToEdit: idToEdit, good: { ...good } })
  }

  deleteById = async (id) => {
    const options = {
      method: 'DELETE',
    }
    try {
      const response = await fetch(`${URL}goods/${id}`, options);
      const result = await response.json();

      alert(result);
    } catch (err) {
      console.error(err);
    } finally {
      this.fetchGoods();
    }
  }

  onSubmit = async () => {
    const { good: { name, price, category, fabricator }, goodIdToEdit } = this.state;
    if (name === '' || price < 1 || category === '' || fabricator === '') return alert('input all fields!')

    if (goodIdToEdit) {
      const body = {
        id: goodIdToEdit,
        name,
        price,
        category,
        fabricator
      }
      const options = {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(`${URL}/goods/${goodIdToEdit}`, options);
        const result = await response.json();

        if (result) alert('success')
      } catch (err) {
        console.error(err)
      }
      this.setState({ goodIdToEdit: undefined })
    } else {
      const body = {
        name,
        price,
        category,
        fabricator
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(`${URL}/goods/`, options);
        const result = await response.json();

        if (result) alert('success')
      } catch (err) {
        console.error(err)
      }
    }
    this.resetGood();
    this.fetchGoods();
  }

  renderGoods = () => {
    return this.state.goods.map(({ id, name }) => (
      <div key={id} className="m-6 border-solid border-4 border-gray-600 mr-64">
        <div onClick={() => this.toggleDetail(id)}>
          <div className="">{name}</div>
        </div>
        <button
          className="bg-green-400"
          onClick={() => this.setEdited(id)}
        >
          edit
            </button>
        <button
          className="bg-red-600"
          onClick={() => this.deleteById(id)}
        >
          delete
            </button>
      </div>
    ))
  }

  render() {
    return (
      <div>
        Admin
        {this.renderGoods()}
        <div className="flex justidy-content">
          <div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="good_name">
                  name
              </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="good_name"
                  type="text"
                  value={this.state.good.name}
                  onChange={e => this.setState({ good: { ...this.state.good, name: e.target.value } })} />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="good_price">
                  Price
              </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="good_price"
                  type="number"
                  pattern="[0-9]"
                  value={this.state.good.price}
                  onInput={e => this.setState({ good: { ...this.state.good, price: e.target.value } })}
                  onChange={e => e}
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="good_category">
                  Category
              </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="good_category"
                  type="text"
                  value={this.state.good.category}
                  onChange={e => this.setState({ good: { ...this.state.good, category: e.target.value } })} />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="good_fabricator">
                  Fabricator
              </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="good_fabricator"
                  type="text"
                  value={this.state.good.fabricator}
                  onChange={e => this.setState({ good: { ...this.state.good, fabricator: e.target.value } })} />
              </div>
            </div>
            <button onClick={this.onSubmit} className="float-right bg-green-500">
              Submit
          </button>
          </div>
        </div>
      </div>
    )
  }
}

export default AdminComponent