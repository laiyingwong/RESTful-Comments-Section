// receiving and handling post requests in Express
const express = require("express");
const app = express();
const path = require("path");
// uuid generates unique identifiers
// destructure and single out v4 out of `uuid` module and rename it to `uuid`
const { v4: uuid } = require("uuid");

// To parse form data in POST request body as url encoded data:
app.use(express.urlencoded({ extended: true }));

// To override default method (run `npm i method-override`):
const methodOverride = require("method-override");
// To 'fake' put/patch/delete requests:
app.use(methodOverride("_method"));

// Views folder and EJS setup:
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Fake database:
let comments = [
  {
    id: uuid(),
    username: "User1",
    comment: "C-Create.",
  },
  {
    id: uuid(),
    username: "User2",
    comment: "R-Read.",
  },
  {
    id: uuid(),
    username: "User3",
    comment: "U-Update.",
  },
  {
    id: uuid(),
    username: "User4",
    comment: "D-Delete/Destroy.",
  },
];

// **********************************
// INDEX - renders multiple comments
// **********************************
app.get("/comments", (req, res) => {
  res.render("comments/index", { comments });
});

// **********************************
// NEW - renders a form
// **********************************
app.get("/comments/new", (req, res) => {
  res.render("comments/new");
});

// **********************************
// CREATE - creates a new comment
// **********************************
app.post("/comments", (req, res) => {
  const { username, comment } = req.body;
  // when we make a new comment, set the id to be a new result of calling `uuid`
  comments.push({ id: uuid(), username, comment });
  // the response generated by res.redirect will include a redirect status code (by default is 302) and the path under the `location header`, which the browser will then use to automatically make a new request to the path (`/comment` in this case)
  res.redirect("/comments");
});

// *******************************************
// SHOW - details about one particular comment
// *******************************************
app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  res.render("comments/show", { comment });
});

// *******************************************
// EDIT - renders a form to edit a comment
// *******************************************
app.get("/comments/:id/edit", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  res.render("comments/edit", { comment });
});

// *******************************************
// UPDATE - updates a particular comment
// *******************************************
app.patch("/comments/:id", (req, res) => {
  const { id } = req.params;
  const initialComment = comments.find((c) => c.id === id);

  //get new text from req.body
  const newComment = req.body.comment;
  //update the comment with the data from req.body:
  initialComment.comment = newComment;
  //redirect back to index (or wherever you want)
  res.redirect("/comments");
});

// *******************************************
// DELETE/DESTROY- removes a single comment
// *******************************************
app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;
  comments = comments.filter((c) => c.id !== id);
  res.redirect("/comments");
});

// ******
// SERVER
// ******
app.listen(3000, () => {
  console.log("On port 3000");
});
