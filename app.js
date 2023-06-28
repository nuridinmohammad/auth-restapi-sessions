import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import SequelizeStore from "connect-session-sequelize";

import UserRoute from "./app/routes/UserRoute.js";
import ProductRoute from "./app/routes/ProductRoute.js";
import AuthRoute from "./app/routes/AuthRoute.js";
import db from "./app/config/Database.js";

/* 
(async () => {
  await db.sync();
})();
*/
  
dotenv.config();
const app = express();
const sessionStore = SequelizeStore(session.Store);
const storeSession = new sessionStore({
  db: db,
});
// storeSession.sync()

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: true, 
    store:storeSession,
    cookie: {
      secure: "auto",
    },
  })
);

//api route
app.use("/api", UserRoute);
app.use("/api", ProductRoute);
app.use("/api", AuthRoute);
app.listen(process.env.APP_PORT, () =>
  console.log(`Server up and Running at PORT : ${process.env.APP_PORT}`)
);
