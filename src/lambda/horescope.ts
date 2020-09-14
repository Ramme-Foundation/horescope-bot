import "regenerator-runtime/runtime.js";

import { Context } from "aws-lambda";
import fetch from "node-fetch";
import querystring from "querystring";

const BASE_URL = `http://horoscope-api.herokuapp.com/horoscope`;

const commandToSign = (command: string) => {
  switch (command.toLowerCase()) {
    case "vädur":
    case "aries":
      return "aries";
    case "oxen":
    case "taurus":
      return "taurus";
    case "tvillingarna":
    case "tvilling":
    case "gemini":
      return "gemini";
    case "cancer":
    case "kräfta":
    case "kräftan":
      return "cancer";
    case "leo":
    case "lejon":
    case "lejonet":
      return "leo";
    case "jungfru":
    case "jungfrun":
    case "virgo":
      return "virgo";
    case "våg":
    case "vågen":
    case "libra":
      return "libra";
    case "skorpion":
    case "skorpionen":
    case "scorpio":
      return "scorpio";
    case "skytt":
    case "skytten":
    case "sagittarius":
      return "sagittarius";
    case "stenbock":
    case "stenbocken":
    case "capricorn":
      return "capricorn";
    case "vattuman":
    case "vattumannen":
    case "aquarius":
      return "aquarius";
    case "fisk":
    case "fiskarna":
    case "pisces":
      return "pisces";
    default:
      return null;
  }
};

export async function handler(event: any, context: Context) {
  try {
    const params: any = querystring.parse(event.body);
    console.log(params);
    const command = params.text.split(" ");
    if (command.length <= 0 || !commandToSign(command[0])) {
      return {
        statusCode: 200,
        body: "Unknown sign",
      };
    }
    const sign = commandToSign(command[0]);
    let period = "today";
    if (command.length >= 2) {
      const c = command[1];
      if (c !== "today" || c !== "week" || c !== "month" || c !== "year") {
        return {
          statusCode: 200,
          body: "Wrong period, choose 'today', 'week', 'month' or 'year'",
        };
      }
      period = command[1];
    }

    const response = await fetch(`${BASE_URL}/${period}/${sign}`);
    console.log(response.status);
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();
    fetch(params.response_url, {
      method: "POST",
      body: JSON.stringify({
        response_type: "in_channel",
        text: `*${sign}*\n ${data.horoscope}`,
      }),
    });
    return {
      statusCode: 200,
      body: "",
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}
