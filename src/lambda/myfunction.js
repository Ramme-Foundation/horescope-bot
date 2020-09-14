import dotenv from "dotenv";
import { WebClient } from "@slack/web-api";
import querystring from "querystring";
dotenv.config();

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const params = querystring.parse(event.body);

  console.log("DEBUG PARAMS", params);

  const channel_id = params.channel_id;
  return await web.chat.postMessage({
    channel: channel_id,
    text: "My test function!"
  });
};
