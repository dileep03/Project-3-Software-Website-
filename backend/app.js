const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://dileepdk:161203@cluster0.hrr7mr3.mongodb.net/collectdata', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a schema for your form data
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

// Create a model based on the schema
const FormData = mongoose.model('FormData', formDataSchema);

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend folder
app.use(express.static('../frontend'));

// Define route for form submission
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  // Create a new document with the form data
  const formData = new FormData({
    name,
    email,
    message
  });

  // Save the document to the database
  formData.save()
    .then(() => {
      console.log('Form data saved successfully');
      // Send a response with JavaScript code to trigger an alert
      res.send(`
        <script>
          alert('Your message has been received. We will contact you soon.');
          window.location.href = '/';
        </script>
      `);
    })
    .catch(err => {
      console.error('Error saving form data:', err);
      res.status(500).send('Error submitting form');
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
