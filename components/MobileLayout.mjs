import { h, useState } from "../utils/preact.mjs";
import { clsx, css } from "../utils/general.mjs";
import Stack from "./Stack.mjs";

const tabHeight = 55;

css(`
  .components__mobile-layout__header {
    height: ${tabHeight}px;
    backdrop-filter: blur(10px);
    background: rgb(37 51 82 / 83%);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    row-gap: 14px;
    color: white;
    padding: 0 14px;
    z-index: 2;
    justify-content: center;
  }

  .components__mobile-layout__tab {
    height: 100%;
    margin: 0;
    padding: 6px 14px 4px 14px;
    border: none;
    border-top: 2px solid transparent;
    outline: none;
    background: transparent;
    font-size: 14px;
    color:inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 100ms linear;
    text-transform: uppercase;
  }

  .components__mobile-layout__tab:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .components__mobile-layout__tab--active {
    font-weight: bolder;
    border-color: #dc456c;
  }

  .components__mobile-layout__content {
    margin-bottom: ${tabHeight}px;
  }
`);

function Tab({ active, title, onClick }) {
  return h`
    <button
      type="button"
      class=${clsx(
        "components__mobile-layout__tab",
        active && "components__mobile-layout__tab--active"
      )}
      onClick=${onClick}
    >
      ${title}
    </button>`;
}

export default function MobileLayout({ tabs }) {
  const [active, setActive] = useState(0);
  const content = tabs[active].content;

  return h`
    <div class="components__mobile-layout__header">
      ${tabs.map(
        (tab, index) =>
          h`
          <${Tab}
            active=${active === index}
            title=${tab.title}
            onClick=${() => setActive(index)}
          />`
      )}
    </div>
    <${Stack} class="components__mobile-layout__content">
      ${content}
    </${Stack}>
  `;
}
