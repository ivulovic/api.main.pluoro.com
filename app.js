const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { dbDev } = require("./server/config");
const limiterMiddleware = require("./server/middlewares/limiter.middleware").middleware;

const app = express();
const mongoose = require("mongoose");

const port = process.env.PORT || 5001;


mongoose.Promise = global.Promise;
mongoose
  .connect(app.get("env") === "development" ? dbDev : process.env.DB_STRING, { useNewUrlParser: true })
  .then(function (res) {
    console.log("Pluoro API app, connected successfully.");
  })
  .catch(function () {
    console.log("Pluoro API app, connecting failed.");
  });

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// 1 point = 1 IP address
// This limits user to make 10 request per second. 
app.use(limiterMiddleware.rateLimiterMiddleware);

// app.use(limiters.loginAttemptLimiterMiddleware);

// Routes
const accountRoutes = require("./server/routes/account.routes");
const wishRoutes = require("./server/routes/wishlist.routes");
const directoryRoutes = require("./server/routes/notes/directory.routes");
const noteRoutes = require("./server/routes/notes/note.routes");
const subjectRoutes = require("./server/routes/classroom/subject.routes");
const topicRoutes = require("./server/routes/classroom/topic.routes");

app.use("/api/account", accountRoutes);
app.use("/api/wishlist", wishRoutes);
app.use("/api/notes/directories", directoryRoutes);
app.use("/api/notes/notes", noteRoutes);
app.use("/api/classroom/subjects", subjectRoutes);
app.use("/api/classroom/topics", topicRoutes);

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})  