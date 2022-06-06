import { h } from "../utils/preact.mjs";
import { clsx, css } from "../utils/general.mjs";
import Paper from "./Paper.mjs";

css(`
  .component__title-card {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    column-gap: 8px;
  }

  .component__title-card h2 {
    margin: 0;
    font-size: 18px;
    line-height: 32px;
  }
`);

export default function TitleCard({ class: className, title, action }) {
  return h`
    <${Paper} class=${clsx("component__title-card", className)}>
      <h2>${title}</h2>
      ${action}
    </${Paper}>
  `;
}
