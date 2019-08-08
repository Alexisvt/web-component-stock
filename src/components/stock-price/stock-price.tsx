import { Component, Element, h, State } from '@stencil/core';

import { AV_API_KEY } from '../../Global/global';

@Component({
  tag: 'stock-price',
  styleUrl: 'stock-price.css',
  shadow: true,
})
export class StockPrice {
  stockInput: HTMLInputElement;

  @State() fetchedPrice = 0;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @Element() el: HTMLElement;

  onUserInput = (event: Event) => {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.stockInputValid = this.stockUserInput.trim() !== '' ? true : false;
  };

  onFetchStockPrice = (event: Event) => {
    event.preventDefault();
    // query selected approach
    // const stockSymbol = (this.el.shadowRoot.querySelector(
    //   '.stock-form__symbol'
    // ) as HTMLInputElement).value;

    // ref approach
    // const stockSymbol = this.stockInput.value;

    const stockSymbol = this.stockUserInput;

    if (!this.stockInputValid) {
      return;
    }

    fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`
    )
      .then(res => {
        return res.json();
      })
      .then(parsedRes => {
        console.log(parsedRes);
        this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
      })
      .catch(console.error);
  };

  render() {
    return [
      <form class="stock-form" onSubmit={this.onFetchStockPrice}>
        <input
          class="stock-form__symbol  stock-form__symbol--no-focus"
          type="text"
          ref={el => (this.stockInput = el)}
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
      <div>
        <p>Price: ${this.fetchedPrice}</p>
      </div>,
    ];
  }
}
