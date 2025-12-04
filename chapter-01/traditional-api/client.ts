// 従来のREST APIクライアントの例
// fetchを使ってAPIを呼び出す

const API_BASE = 'http://localhost:3000';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    createdAt: string;
}

// タスク一覧を取得
async function getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/tasks`);
    if (!response.ok) {
        throw new Error('タスクの取得に失敗しました');
    }
    const data = await response.json();
    return data.tasks;
}

// タスクを作成
async function createTask(title: string, description: string): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
        throw new Error('タスクの作成に失敗しました');
    }

    const data = await response.json();
    return data.task;
}

// タスクを更新
async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error('タスクの更新に失敗しました');
    }

    const data = await response.json();
    return data.task;
}

// デモ実行
async function demo() {
    console.log('🔧 REST APIクライアント デモ\n');

    try {
        // 1. タスク一覧を取得
        console.log('1️⃣ タスク一覧を取得...');
        const tasks = await getTasks();
        console.log(`   取得したタスク: ${tasks.length}件`);
        tasks.forEach(task => {
            console.log(`   - [${task.status}] ${task.title}`);
        });

        // 2. 新しいタスクを作成
        console.log('\n2️⃣ 新しいタスクを作成...');
        const newTask = await createTask(
            '第1章を読む',
            'MCPの基礎概念を理解する'
        );
        console.log(`   作成したタスク: ${newTask.title} (ID: ${newTask.id})`);

        // 3. タスクを更新
        console.log('\n3️⃣ タスクを更新...');
        const updatedTask = await updateTask(newTask.id, { status: 'in-progress' });
        console.log(`   更新したタスク: ${updatedTask.title} -> ${updatedTask.status}`);

        console.log('\n✅ デモ完了');
    } catch (error) {
        console.error('❌ エラー:', error);
    }
}

// サーバーが起動するまで少し待ってから実行
setTimeout(demo, 1000);
