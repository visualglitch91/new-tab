import { h, css } from "../utils.mjs";

css(`
  .component__switch {
    display: inline-block;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .component__switch i {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 26px;
    vertical-align: text-bottom;
    transition: all 0.3s linear;
  }

  .component__switch i::before {
    content: "";
    position: absolute;
    left: 0;
    width: 42px;
    height: 14px;
    background-color: #20293c;
    border-radius: 11px;
    transform: translate3d(2px, 2px, 0) scale3d(1, 1, 1);
    transition: all 0.25s linear;
    top: 4.5px;
  }

  .component__switch i::after {
    content: "";
    position: absolute;
    left: 0;
    width: 22px;
    height: 22px;
    background-color: #70889e;
    border-radius: 11px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24);
    transform: translate3d(2px, 2px, 0);
    transition: all 0.2s ease-in-out;
  }
  
  .component__switch:active i::after {
    width: 28px;
    transform: translate3d(2px, 2px, 0);
  }

  .component__switch:active input:checked + i::after {
    transform: translate3d(16px, 2px, 0);
  }

  .component__switch input {
    display: none;
  }

  .component__switch input:checked + i::after {
    background-color: #dc456c;
  }

  .component__switch input:checked + i::after {
    transform: translate3d(22px, 2px, 0);
  }
`);

export default function Switch({ checked, onInput }) {
  return h`
    <label class="component__switch">
      <input
        type="checkbox"
        checked=${checked}
        onInput=${onInput}
      />
      <i />
    </label>
  `;
}
