var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const PORT = process.env.PORT || 5050;
var startPage = 'index.html';

// ==============================
// Lab 11: Monitoring & Logging
// ==============================
const statusMonitor = require('express-status-monitor');
const logger = require('./logger');

// Enable real-time monitoring
app.use(statusMonitor());

// ==============================
// Middleware
// ==============================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ==============================
// Import backend handlers
// ==============================
const { viewEvents } = require('./utils/ViewEventUtil');
const { deleteEvent } = require('./utils/MikealLeowUtil');
const { addEvent } = require('./utils/MalcolmNgUtil');
const { editEvent } = require('./utils/HugoYeeUtil');

// ==============================
// API Routes
// ==============================

// View Events
app.get('/view-events', viewEvents);

// Add Event
app.post('/add-event', addEvent);

// Edit Event
app.put('/edit-event/:id', async (req, res) => {
  try {
    const result = await editEvent(req, res);
    if (res.headersSent) return;

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`Edit event error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error while updating event."
    });
  }
});

// Delete Event
app.delete('/delete-event/:id', async (req, res) => {
  const id = req.params.id;
  const result = await deleteEvent(id);

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json(result);
  }
});

// ==============================
// Frontend
// ==============================
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/' + startPage);
});

// ==============================
// Start Server
// ==============================
const server = app.listen(PORT, function () {
  const address = server.address();
  const baseUrl = `http://${address.address === '::' ? 'localhost' : address.address}:${address.port}`;

  // Lab 11 required logs
  logger.info(`Demo project at: ${baseUrl}!`);
  logger.error(`Example of error log`);
});

module.exports = { app, server };
