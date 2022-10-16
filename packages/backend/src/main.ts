import * as express from 'express';
import * as cors from 'cors';

const app = express();
app.use(cors());

let id = 0;

function createTodo() {
  const newId = id++;
  return {
    id: newId,
    title: `Todo-${newId}`,
  };
}

const todos = [createTodo()];

app.get('/todos', (req, res) => {
  setTimeout(() => {
    res.json(todos);
  }, 1000);
});

app.post('/todos', (req, res) => {
  setTimeout(() => {
    todos.push(createTodo());
    res.json({ success: true });
  }, 1000);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
