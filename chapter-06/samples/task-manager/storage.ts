// 第6章: タスク管理システム - ストレージ層
// JSONファイルベースのデータ永続化
import { promises as fs } from 'fs';
import path from 'path';
import { Task, TaskCreateInput, TaskUpdateInput, TaskFilter } from './types.js';

const DATA_FILE = path.join(process.cwd(), 'tasks.json');

export class TaskStorage {
    private tasks: Task[] = [];

    async load(): Promise<void> {
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            this.tasks = JSON.parse(data);
        } catch (error) {
            // ファイルが存在しない場合は空配列で初期化
            this.tasks = [];
        }
    }

    async save(): Promise<void> {
        await fs.writeFile(DATA_FILE, JSON.stringify(this.tasks, null, 2));
    }

    async getAll(): Promise<Task[]> {
        return [...this.tasks];
    }

    async getById(id: string): Promise<Task | undefined> {
        return this.tasks.find(task => task.id === id);
    }

    async create(input: TaskCreateInput): Promise<Task> {
        const now = new Date().toISOString();
        const newTask: Task = {
            id: this.generateId(),
            title: input.title,
            description: input.description || '',
            status: 'todo',
            priority: input.priority || 'medium',
            dueDate: input.dueDate,
            createdAt: now,
            updatedAt: now,
            tags: input.tags || [],
        };

        this.tasks.push(newTask);
        await this.save();
        return newTask;
    }

    async update(input: TaskUpdateInput): Promise<Task> {
        const index = this.tasks.findIndex(task => task.id === input.id);
        if (index === -1) {
            throw new Error(`タスクが見つかりません: ${input.id}`);
        }

        const updatedTask: Task = {
            ...this.tasks[index],
            ...input,
            updatedAt: new Date().toISOString(),
        };

        this.tasks[index] = updatedTask;
        await this.save();
        return updatedTask;
    }

    async delete(id: string): Promise<void> {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index === -1) {
            throw new Error(`タスクが見つかりません: ${id}`);
        }

        this.tasks.splice(index, 1);
        await this.save();
    }

    async search(filter: TaskFilter): Promise<Task[]> {
        let results = [...this.tasks];

        if (filter.status) {
            results = results.filter(task => task.status === filter.status);
        }

        if (filter.priority) {
            results = results.filter(task => task.priority === filter.priority);
        }

        if (filter.tag) {
            results = results.filter(task => task.tags.includes(filter.tag));
        }

        if (filter.searchText) {
            const searchLower = filter.searchText.toLowerCase();
            results = results.filter(task =>
                task.title.toLowerCase().includes(searchLower) ||
                task.description.toLowerCase().includes(searchLower)
            );
        }

        return results;
    }

    private generateId(): string {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
