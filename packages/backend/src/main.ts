const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

function createTodo(id) {
  return {
    id,
    title: `Todo-${id}`,
  };
}

const todos = {};

app.get('/todos', (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({error: 'id is required'});
    return;
  }
  
  setTimeout(() => {
    const todosArr = todos[id] || [];
    if (todosArr.length === 0) {
      todos[id] = [createTodo(1)];
    }
    res.json(todos[id]);
  }, 1000);
});

app.post('/todos', (req, res) => {
  const { id } = req.query;
  if(!id) {
    res.status(400).json({error: 'id is required'});
    return;
  }
  
  setTimeout(() => {
    const todosArr = todos[id] || [];
    if (todosArr.length === 0) {
      todos[id] = [createTodo(1)];
    }
    todos[id].push(createTodo(todos[id].length + 1));
    res.json({ success: true });
  }, 1000);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
