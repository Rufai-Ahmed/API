import axios from "axios";
import http, { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs, { existsSync } from "fs";
import { error } from "console";

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
        // When I hit a route
        // if (method === "GET") {
        //   const iniUrl: any = url?.split("/")[1];
        //   const usefulUrl = parseInt(iniUrl);

        //   const fakeStoreApi = await axios.get(
        //     "http://fakestoreapi.com/products"
        //   );

        //   if (fakeStoreApi.status) {
        //     let fakeStoreData = fakeStoreApi.data;
        //     let Data = fakeStoreData.filter((el) => {
        //       return el.id === usefulUrl;
        //     });
        //     status = 200;
        //     response.message = "Product details gotten";
        //     response.success = true;
        //     response.data = Data;
        //     res.write(JSON.stringify({ status, response }));
        //     res.end();
        //   } else {
        //     res.write(JSON.stringify({ status, response }));
        //     res.end();
        //   }
        // } else {
        //   response.message = "Wrong Route, try again";
        //   response.data = null;
        //   response.success = false;
        //   res.write(JSON.stringify({ status, response }));
        //   res.end();
        // }

        //All titles should be saved in a .txt file
        // if (method === "GET" && url === "/getTitles") {
        //   const fakeStoreApi = await axios.get(
        //     "http://fakestoreapi.com/products"
        //   );
        //   if (fakeStoreApi.status) {
        //     const fakeStoreDataTitle = fakeStoreApi.data.map((el) => el.title);
        //     const TitleFolder = path.join(__dirname, "Titles");

        //     if (!fs.existsSync) {
        //       fs.mkdir(TitleFolder, (error) => error);
        //     }

        //     fs.writeFile(
        //       path.join(__dirname, "Titles", "Titles.txt"),
        //       fakeStoreDataTitle
        //         .toString()
        //         .split(",")
        //         .flatMap((el) => "\n" + el)
        //         .toString(),
        //       (error) => {
        //         console.log(error);
        //       }
        //     );

        //     response.message = "Successful";
        //     response.success = true;
        //     response.data = fakeStoreDataTitle;
        //     status = 200;
        //     res.write(JSON.stringify({ status, response }));
        //     res.end();
        //   } else {
        //     res.write(JSON.stringify({ response, status }));
        //     res.end();
        //   }
        // } else {
        //   res.write(JSON.stringify({ response, status }));
        //   res.end;
        // }

        // if (method === "GET") {
        //   const iniUrl = url?.split("/")[1];
        //   const urlForUse = iniUrl?.toString();

        //   const fakeStore = await axios.get("http://fakestoreapi.com/products");

        //   const fakeStoreData = fakeStore.data;

        //   let check = fakeStoreData.some((el) => el.category === urlForUse);
        //   if (check === true) {
        //     const Category = fakeStoreData.filter(
        //       (el) => el.category === urlForUse
        //     );

        //     response.success = true;
        //     response.data = Category;
        //     response.message = "Category needed gotten";
        //     res.write(JSON.stringify({ response, status }));
        //     res.end();
        //   } else {
        //     res.write(JSON.stringify({ response, status }));
        //     res.end();
        //   }
        // }

        //Download all image
        if (method === "GET" && url === "/") {
          const fakeStore = await axios.get("http://fakestoreapi.com/products");

          var count1 = 1;
          if (fakeStore.status) {
            for (let i = 1; i < fakeStore.data.length; i++) {
              const Images = await axios.get(`${fakeStore.data[i].image}`, {
                responseType: "stream",
              });
              Images.data.pipe(
                fs.createWriteStream(
                  path.join(__dirname, "./fakeStoreImages", `${count1++}.jpg`)
                )
              );
            }
          }
          response.message = "Images downloaded";
          res.write(JSON.stringify({ response }));
          res.end();
        }
      });
  }
);

server.listen(port, () => {
  console.log("Server active");
});
