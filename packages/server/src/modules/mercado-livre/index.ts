import axios from "axios";
import * as cheerio from "cheerio";
import { createAppModule } from "../../utils";
import { config } from "../../../../../config";

const { cookie } = config.mercado_livre;

export default createAppModule("mercado-livre", (instance, logger) => {
  instance.get("/purchases", async (req) => {
    const res = await axios.get(
      `https://myaccount.mercadolivre.com.br/my_purchases/list`,
      { headers: { cookie } }
    );

    const $ = cheerio.load(res.data);

    return $(".list-item__product")
      .filter((_, el) => !!$(el).find("a"))
      .map((index, el) => {
        const $el = $(el);
        const product = $el.find("a").text();
        const status = $el
          .find('.list-item__title [data-js="rich-text"]')
          .text();

        return {
          index,
          product,
          status,
        };
      })
      .get();
  });
});
