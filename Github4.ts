import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("Content-type", "Application/JSON");

    let holder: string = "";
    let status = 404;

    const response = {
      message: "Failed",
      success: false,
      data: null,
    };

    const { method, url } = req;
    req
      .on("data", (chunk) => {
        holder += chunk;
      })
      .on("end", async () => {
        if (method === "POST" && url === "/") {
          const input = JSON.parse(holder);
          const { username } = input;
          if (!input && !username) {
            res.write(JSON.stringify({ response }));
            res.end();
          }

          const URL = await axios.get(
            `https://api.github.com/users/${username}`
          );
          if (URL.status) {
            response.data = URL.data;
            res.write(JSON.stringify({ response }));
            res.end();
          }
        }
      });
  }
);

server.listen(4000, () => {
  console.log("😊");
});
