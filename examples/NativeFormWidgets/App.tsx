import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.html';
import './my-img.png';

// See The native form widgets https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/The_native_form_widgets

class Form extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    console.log('handleChange()');

    const input = e.currentTarget;
    this.validateField(input);
  }

  validateField(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    console.log('input:', input.value, input.validity, input.validationMessage);
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log('handleSubmit()', e);

    e.preventDefault();
  }

  handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    console.log('handleClick()', e);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Text input fields</h2>

        <h3>Single line text fields</h3>

        <h4>Text field</h4>
        <input type="text" name="comment" defaultValue="I'm a text field" onChange={this.handleChange} />

        <h4>E-mail address field</h4>
        <input type="email" name="email" multiple onChange={this.handleChange} />

        <h4>Password field</h4>
        <input type="password" name="pwd" onChange={this.handleChange} />

        <h4>Search field</h4>
        <input type="search" name="search" onChange={this.handleChange} />

        <h4>Phone number field</h4>
        <input type="tel" name="tel" onChange={this.handleChange} />

        <h4>URL field</h4>
        <input type="url" name="url" onChange={this.handleChange} />

        <h3>Multi-line text fields</h3>

        <textarea cols={30} rows={10} onChange={this.handleChange} />

        <h2>Drop-down content</h2>

        <h3>Select box</h3>
        <select name="simple" onChange={this.handleChange}>
          <option>Banana</option>
          <option>Cherry</option>
          <option>Lemon</option>
        </select>
        <p />

        <select name="groups" onChange={this.handleChange}>
          <optgroup label="fruits" defaultValue="Cherry">
            <option>Banana</option>
            <option>Cherry</option>
            <option>Lemon</option>
          </optgroup>
          <optgroup label="vegetables">
            <option>Carrot</option>
            <option>Eggplant</option>
            <option>Potato</option>
          </optgroup>
        </select>

        <h3>Multiple choice select box</h3>
        <select multiple name="multi" onChange={this.handleChange}>
          <option>Banana</option>
          <option>Cherry</option>
          <option>Lemon</option>
        </select>

        <h3>Autocomplete box</h3>
        <label htmlFor="myFruit">What's your favorite fruit?</label>{' '}
        <input type="text" id="myFruit" name="myFruit" list="mySuggestion" onChange={this.handleChange} />
        <datalist id="mySuggestion">
          <option>Apple</option>
          <option>Banana</option>
          <option>Blackberry</option>
          <option>Blueberry</option>
          <option>Lemon</option>
          <option>Lychee</option>
          <option>Peach</option>
          <option>Pear</option>
        </datalist>
        <p />

        <h4>Datalist support and fallbacks</h4>
        <label htmlFor="myFruit">What is your favorite fruit? (With fallback)</label>{' '}
        <input type="text" id="myFruit" name="fruit" list="fruitList" onChange={this.handleChange} />

        <datalist id="fruitList">
          <label htmlFor="suggestion">or pick a fruit</label>{' '}
          <select id="suggestion" name="altFruit">
            <option>Apple</option>
            <option>Banana</option>
            <option>Blackberry</option>
            <option>Blueberry</option>
            <option>Lemon</option>
            <option>Lychee</option>
            <option>Peach</option>
            <option>Pear</option>
          </select>
        </datalist>

        <h2>Checkable items</h2>

        <h3>Check box</h3>
        <input type="checkbox" checked name="carrots" value="carrots" onChange={this.handleChange} />

        <h3>Radio button</h3>
        <input type="radio" checked name="meal" onChange={this.handleChange} />
        <p />

        <fieldset>
          <legend>What is your favorite meal?</legend>
          <ul>
            <li>
              <label htmlFor="soup">Soup</label>
              <input type="radio" checked id="soup" name="meal" value="soup" onChange={this.handleChange} />
            </li>
            <li>
              <label htmlFor="curry">Curry</label>
              <input type="radio" id="curry" name="meal" value="curry" onChange={this.handleChange} />
            </li>
            <li>
              <label htmlFor="pizza">Pizza</label>
              <input type="radio" id="pizza" name="meal" value="pizza" onChange={this.handleChange} />
            </li>
          </ul>
        </fieldset>

        <h2>Buttons</h2>

        <h3>submit</h3>
        <button type="submit">
          This a <br /><strong>submit button</strong>
        </button>{' '}
        <input type="submit" value="This is a submit button" />

        <h3>reset</h3>
        <button type="reset" onClick={this.handleClick}>
            This a <br /><strong>reset button</strong>
        </button>{' '}
        <input type="reset" value="This is a reset button" onChange={this.handleChange} />

        <h3>anonymous</h3>
        <button type="button" onClick={this.handleClick}>
          This an <br /><strong>anonymous button</strong>
        </button>{' '}
        <input type="button" value="This is an anonymous button" onChange={this.handleChange} />

        <h2>Advanced form widgets</h2>

        <h3>Numbers</h3>
        <input type="number" name="age" min="1" max="10" step="2" onChange={this.handleChange} />

        <h3>Sliders</h3>
        <input type="range" name="beans" min="0" max="500" step="10" onChange={this.handleChange} />
        <p />

        <label htmlFor="beans">How many beans can you eat?</label>{' '}
        <input type="range" id="beans" name="beans" min="0" max="500" step="10" onChange={this.handleChange} />
        <span className="beancount" />

        <h3>Date and time picker</h3>

        <h4>date</h4>
        <input type="date" name="date" onChange={this.handleChange} />

        <h4>datetime-local</h4>
        <input type="datetime-local" name="datetime" onChange={this.handleChange} />

        <h4>month</h4>
        <input type="month" name="month" onChange={this.handleChange} />

        <h4>time</h4>
        <input type="time" name="time" onChange={this.handleChange} />

        <h4>week</h4>
        <input type="week" name="week" onChange={this.handleChange} />

        <h4>min and max attributes</h4>
        <label htmlFor="myDate">When are you available this summer?</label>{' '}
        <input type="date" id="myDate" name="myDate" min="2013-06-01" max="2013-08-31" onChange={this.handleChange} />

        <h3>Color picker</h3>
        <input type="color" name="color" onChange={this.handleChange} />

        <h2>Other widgets</h2>

        <h3>File picker</h3>
        <input type="file" name="file" accept="image/*" multiple onChange={this.handleChange} />

        <h3>Hidden content</h3>
        <input type="hidden" name="timestamp" value="1286705410" onChange={this.handleChange} />

        <h3>Image button</h3>
        <input type="image" alt="Click me!" src="my-img.png" width="80" height="30" onChange={this.handleChange} />

        <h3>Meters and progress bars</h3>

        <h4>Progress</h4>
        <progress max="100" value="75">75/100</progress>

        <h4>Meter</h4>
        <meter min="0" max="100" value="75" low={33} high={66} optimum={50}>75</meter>

      </form>
    );
  }
}

const App = () => (
  <div>
    Taken and adapted from <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/The_native_form_widgets">MDN - The native form widgets</a>
    <Form />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
