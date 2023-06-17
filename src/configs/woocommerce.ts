import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import dotenv from "dotenv";

dotenv.config();

const wooCommerceApi = new WooCommerceRestApi({
  url: process.env.STORE_URL!,
  consumerKey: process.env.CUSTOMER_KEY!,
  consumerSecret: process.env.CUSTOMER_SECRET!,
  version: "wc/v3"
});

export default wooCommerceApi