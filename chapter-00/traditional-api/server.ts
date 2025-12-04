// 従来のREST APIサーバーの例
// タスク管理システムをREST APIで実装
import express from 'express';

const app = express();
app.use(express.json());

// インメモリストレージ
interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    createdAt: string;
}

let tasks: Task[] = [
    {
        id: '1',
        title: 'MCPについて学ぶ',
        description: 'Model Context Protocolの基礎を理解する',
        status: 'in-progress',
        createdAt: new Date().toISOString()
    }
];

// GET /tasks - タスク一覧を取得
app.get('/tasks', (req, res) => {
    res.json({ tasks });
});

// GET /tasks/:id - 特定のタスクを取得
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'タスクが見つかりません' });
    }
    res.json({ task });
});

// POST /tasks - 新しいタスクを作成
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'タイトルは必須です' });
    }

    const newTask: Task = {
        id: String(tasks.length + 1),
        title,
        description: description || '',
        status: 'todo',
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    res.status(201).json({ task: newTask });
});

// PUT /tasks/:id - タスクを更新
app.put('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'タスクが見つかりません' });
    }

    const { title, description, status } = req.body;
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status })
    };

    res.json({ task: tasks[taskIndex] });
});

// DELETE /tasks/:id - タスクを削除
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'タスクが見つかりません' });
    }

    tasks.splice(taskIndex, 1);
    res.json({ message: '削除しました' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 REST APIサーバーが起動しました: http://localhost:${PORT}`);
    console.log('\n利用可能なエンドポイント:');
    console.log('  GET    /tasks      - タスク一覧取得');
    console.log('  GET    /tasks/:id  - タスク詳細取得');
    console.log('  POST   /tasks      - タスク作成');
    console.log('  PUT    /tasks/:id  - タスク更新');
    console.log('  DELETE /tasks/:id  - タスク削除');
});
