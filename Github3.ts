import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";

interface iMessage {
  message: string;
  success: boolean;
  data: null | {}[] | [];
}

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "Application/JSON");
    let holder = "";
    let status = 404;

    const response: iMessage = {
      message: "Failed",
      success: false,
      data: null,
    };
    const { url, method } = req;

    req
      .on("data", (chunk) => {
        holder += chunk;
      })
      .on("end", async () => {
        if (url === "/" && method === "POST") {
          const input = JSON.parse(holder);
          const { username } = input;
          if (!input || !username) {
            res.write(JSON.stringify({ response, status }));
            res.end();
          }

          const URL = await axios.get(
            `https://api.github.com/users/${username}`
          );

          if (URL.status) {
            response.data = URL.data;
            res.write(JSON.stringify({ response, status }));
            res.end();
          } else {
            res.write(JSON.stringify({ response, status }));
            res.end();
          }
        } else {
          res.write(JSON.stringify({ response, status }));
          res.end();
        }
      });
  }
);

server.listen(4000, () => {
  console.log("🥱");
});
