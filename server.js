import express from "express";

const app = express();
const PORT = 4000;

const handleListening = () => {
  console.log(`Server is listening http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
