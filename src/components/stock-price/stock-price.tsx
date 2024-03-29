import { Component, h, Prop, State } from '@stencil/core';

import { AV_API_KEY } from '../../Global/global';

@Component({
  tag: 'stock-price',
  styleUrl: 'stock-price.css',
  shadow: true,
})
export class StockPrice {
  @State() fetchedPrice = 0;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;
  @Prop() stockSymbol: string;

  onUserInput = (event: Event) => {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.stockInputValid = this.stockUserInput.trim() !== '' ? true : false;
  };

  componentDidLoad() {

  }
  onFetchStockPrice = (event: Event) => {
    event.preventDefault();

    const stockSymbol = this.stockUserInput;

    if (!this.stockInputValid) {
      return;
    }

    fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`
    )
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Invalid');
        }
        return res.json();
      })
      .then(parsedRes => {
        if (!parsedRes['Global Quote']['05. price']) {
          throw new Error('Invalid symbol!');
        }
        this.error = '';
        this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
      })
      .catch(err => {
        this.error = err.message;
      });
  };

  render() {
    let dataContent = <p>Please enter a symbol!</p>;

    if (this.error) {
      dataContent = <p>{this.error}</p>;
    } else if (this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>;
    }

    return [
      <form class="stock-form" onSubmit={this.onFetchStockPrice}>
        <input
          class="stock-form__symbol  stock-form__symbol--no-focus"
          type="text"
          value={this.stockUserInput}
          onInput={this.onUserInput}
        />
        <button
          class="stock-form__submit-btn stock-form__submit-btn--hover
          stock-form__submit-btn--no-focus
          stock-form__submit-btn--active"
          disabled={!this.stockInputValid}
          type="submit"
        >
          Fetch
        </button>
      </form>,
      <div>{dataContent}</div>,
    ];
  }
}
