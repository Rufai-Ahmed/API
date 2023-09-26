import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs";

interface iMessage {
  message: string;
  success: boolean;
  data: null | {}[] | [] | {};
}

const port: number = 3000;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.setHeader("content-type", "Application/JSON");

    let response: iMessage = {
      message: "Failed to get request made",
      success: false,
      data: null,
    };
    let status = 404;
    let holder = "";

    req
      .on("data", (chunk) => {
        holder += chunk;
      })
      .on("end", async () => {
        const { method, url } = req;
        //When I hit a route
        if (method === "GET") {
          const iniUrl: any = url?.split("/")[1];
          const usefulUrl = parseInt(iniUrl);

          const fakeStoreApi = await axios.get(
            "http://fakestoreapi.com/products"
          );

          if (fakeStoreApi.status) {
            let fakeStoreData = fakeStoreApi.data;
            let Data = fakeStoreData.filter((el) => {
              return el.id === usefulUrl;
            });
            status = 200;
            response.message = "Product details gotten";
            response.success = true;
            response.data = Data;
            res.write(JSON.stringify({ status, response }));
            res.end();
          } else {
            res.write(JSON.stringify({ status, response }));
            res.end();
          }
        } else {
          response.message = "Wrong Route, try again";
          response.data = null;
          response.success = false;
          res.write(JSON.stringify({ status, response }));
          res.end();
        }
        //All titles should be saved in a .txt file
        if (method === "GET" && url === "/getTitles") {
          const fakeStoreApi = await axios.get(
            "http://fakestoreapi.com/products"
          );
          if (fakeStoreApi.status) {
            const fakeStoreDataTitle = fakeStoreApi.data;
            const TitleFolder = path.join(
              __dirname,
              "Titles",
              `FakeStoreTitles.txt`
            );

            // fakeStoreDataTitle?.pipe(fs.createWriteStream(TitleFolder));
            response.message = "Successful";
            response.success = true;
            response.data = fakeStoreDataTitle;
            status = 200;
            res.write(JSON.stringify({ status, response }));
            res.end();
          }
        } else {
          res.write(JSON.stringify({ response, status }));
          res.end;
        }
      });
  }
);

server.listen(port, () => {
  console.log("Server active");
});