const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());


app.post('/add', (req, res) => {
    let newTask = req.body.task;
    if (!newTask) {
        res.status(400).send("no task sent")
        return
    }

    if (!fs.existsSync('todo.json')) {
        res.status(404).send("No tasks found.");
        return;
    }

    let rawdata = fs.readFileSync('todo.json');
    let todos = JSON.parse(rawdata);

    let id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);

    todos.push({ "id": id, "task": newTask, "done": false });

    let data = JSON.stringify(todos);
    fs.writeFileSync('todo.json', data);

    res.send('Task added successfully');
});

app.get('/view', (req, res) => {
    if (!fs.existsSync('todo.json')) {
        res.status(404).send("No tasks found.");
        return;
    }

    let rawdata = fs.readFileSync('todo.json');
    let todos = JSON.parse(rawdata);

    res.json(todos);
});

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(404).send("no id provided")
        return
    }

    const newTask = req.body;
    if (!newTask || !newTask.task || newTask.done === undefined) {
        res.status(400).send("task data not sent")
        return
    }

    if (!fs.existsSync('todo.json')) {
        res.status(404).send("No tasks found.");
        return;
    }

    let rawdata = fs.readFileSync('todo.json');
    let todos = JSON.parse(rawdata);

    let taskIndex = todos.findIndex(todo => todo.id === id);

    if (taskIndex === -1) {
        res.status(404).send("Task not found.");
        return;
    }

    todos[taskIndex].task = newTask.task;
    todos[taskIndex].done = newTask.done;

    let data = JSON.stringify(todos);
    fs.writeFileSync('todo.json', data);

    res.send('Task updated successfully');
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(404).send("no id provided");
        return;
    }

    if (!fs.existsSync('todo.json')) {
        res.status(404).send("No tasks found.");
        return;
    }

    let rawdata = fs.readFileSync('todo.json');
    let todos = JSON.parse(rawdata);

    let updatedTodos = todos.filter(todo => todo.id !== id);

    if (todos.length === updatedTodos.length) {
        res.status(404).send("Task not found.");
        return;
    }

    let data = JSON.stringify(updatedTodos);
    fs.writeFileSync('todo.json', data);

    res.send('Task deleted successfully');
});

const port = 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));