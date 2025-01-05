const { Event, validate } = require("../models/event");
const { User } = require("../models/user");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

// Middleware for error handling
router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .send({ message: `Validation error: ${err.message}` });
  }
  console.error(err);
  res.status(500).send({ message: "Internal server error" });
});

router.use(bodyParser.urlencoded({ extended: true }));

// Create a new event
router.post("/", async (req, res) => {
  console.log(req.body);

  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send("Invalid event data: " + error.details[0].message);

  try {
    const findAuthor = await User.findById(req.body.author._id);

    if (!findAuthor)
      return res.status(404).send("Author with the given ID was not found.");

    let event = new Event({
      title: req.body.title,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description,
      category: req.body.category,
      author: {
        _id: req.body.author._id,
        name: `${findAuthor.firstName} ${findAuthor.lastName}`,
      },
    });
    event = await event.save();

    res.status(201).send(event);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Something went wrong. Please try again.");
  }
});

// Get all events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.send(events);
});

// Render a form for creating events (HTML response)
router.get("/post", async (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Event</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        form {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
        }
        label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
        input, textarea, button, fieldset {
            width: 100%;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #007BFF;
        }
        textarea {
            resize: vertical;
        }
        fieldset {
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 4px;
        }
        legend {
            font-size: 16px;
            font-weight: bold;
        }
        button {
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <form action="http://localhost:5000/api/events" method="POST">
        <h1>Create a New Event</h1>
        <!-- Title -->
        <label for="title">Title:</label>
        <input type="text" id="title" name="title" minlength="3" required>

        <!-- Location -->
        <label for="location">Location:</label>
        <input type="text" id="location" name="location" minlength="3" required>

        <!-- Description -->
        <label for="description">Description:</label>
        <textarea id="description" name="description" minlength="10" required></textarea>

        <!-- Author -->
        <fieldset>
            <legend>Author:</legend>

            <label for="author_id">Author ID:</label>
            <input type="text" id="author_id" name="author[_id]" required>
        </fieldset>

        <!-- Submit Button -->
        <button type="submit">Submit</button>
    </form>
</body>
</html>
`);
});

// Get a specific event by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const event = await Event.findOne({ _id: id });

  if (!event) return res.status(404).send("Event not found.");

  res.send(event);
});

// Update an existing event
router.put("/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .send("Invalid event data: " + error.details[0].message);
    }

    const updateData = {
      title: req.body.title,
      date: req.body.date,
      location: req.body.location,
      description: req.body.description,
    };

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!event) {
      return res.status(404).send("Event not found.");
    }

    res.status(200).send(event);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).send("Something went wrong. Please try again.");
  }
});

module.exports = router;
