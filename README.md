# Chat applicaiton in Node.js

This is a simple chat application build in Node.js. The idea is to provide a dead-simple platform which will connect people who would like to practice another language, but having some troubles trying to find a partner in a quick manner.

## Tech

The application uses `socket.io` to provide real-time communication, with very thin layer of code on top of it to connect people who are willing to use same language. There is no storage on the server, so all data is passed immediately to the recepients.