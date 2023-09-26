import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "Application/JSON");

    const { method, url } = req;
    let status = 404;

    let response = {
      message: "Failed",
      data: null,
      success: false,
    };

    let holder = "";
    req
      .on("data", (chunk) => {
        holder += chunk;
      })
      .on("end", async () => {
        if (method === "POST" && url === "/") {
          const input = JSON.parse(holder);
          const { username } = input;
          if (!username && !input) {
            res.write(JSON.stringify({ response }));
            res.end();
          }
          const Git = await axios.get(
            `https://api.github.com/users/${username}`
          );
          if (Git.status) {
            response.data = Git.data;
            res.write(JSON.stringify({ response }));
            res.end();
          }
        }
      });
  }
);

server.listen(4000, () => {
  console.log("😯");
});
