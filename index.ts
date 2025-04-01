import express from 'express';

const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Ensure to install dependencies using npm:
// Run: npm init -y
// Run: npm install express @types/express ts-node typescript
