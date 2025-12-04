// 第4章 サンプル: プロンプトテンプレート
// 再利用可能なプロンプトテンプレートを提供
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    GetPromptRequestSchema,
    ListPromptsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
    {
        name: 'prompt-templates-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            prompts: {},
        },
    }
);

// プロンプト一覧を提供
server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
        prompts: [
            {
                name: 'write_email',
                description: 'ビジネスメールを作成するためのプロンプト',
                arguments: [
                    {
                        name: 'recipient',
                        description: '宛先（例: 田中様）',
                        required: true,
                    },
                    {
                        name: 'subject',
                        description: 'メールの件名',
                        required: true,
                    },
                    {
                        name: 'tone',
                        description: '口調（formal/casual）',
                        required: false,
                    },
                ],
            },
            {
                name: 'code_review',
                description: 'コードレビューのコメントを生成するプロンプト',
                arguments: [
                    {
                        name: 'language',
                        description: 'プログラミング言語',
                        required: true,
                    },
                    {
                        name: 'focus',
                        description: 'レビューの焦点（例: セキュリティ、パフォーマンス）',
                        required: false,
                    },
                ],
            },
            {
                name: 'summarize_article',
                description: '記事を要約するプロンプト',
                arguments: [
                    {
                        name: 'length',
                        description: '要約の長さ（short/medium/long）',
                        required: false,
                    },
                ],
            },
        ],
    };
});

// プロンプトの内容を生成
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        case 'write_email': {
            const recipient = args?.recipient as string || '相手';
            const subject = args?.subject as string || '件名';
            const tone = args?.tone as string || 'formal';

            const toneInstructions = tone === 'formal'
                ? '丁寧な敬語を使用し、ビジネスマナーに沿った文章にしてください。'
                : 'カジュアルで親しみやすい口調で書いてください。';

            return {
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `${recipient}宛のビジネスメールを作成してください。\n\n` +
                                `件名: ${subject}\n\n` +
                                `要件:\n` +
                                `- ${toneInstructions}\n` +
                                `- 適切な挨拶と締めの言葉を含めてください\n` +
                                `- 箇条書きで要点を整理してください`,
                        },
                    },
                ],
            };
        }

        case 'code_review': {
            const language = args?.language as string || 'JavaScript';
            const focus = args?.focus as string || '一般的な品質';

            return {
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `以下の${language}コードをレビューしてください。\n\n` +
                                `レビューの焦点: ${focus}\n\n` +
                                `以下の観点で評価してください:\n` +
                                `1. コードの品質と可読性\n` +
                                `2. ${focus}に関する改善点\n` +
                                `3. ベストプラクティスへの準拠\n` +
                                `4. 具体的な改善提案\n\n` +
                                `建設的で優しいフィードバックを心がけてください。`,
                        },
                    },
                ],
            };
        }

        case 'summarize_article': {
            const length = args?.length as string || 'medium';

            const lengthInstructions: Record<string, string> = {
                short: '3-5文で簡潔に',
                medium: 'パラグラフ1-2個で',
                long: '詳細に段落を分けて',
            };

            return {
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `記事を要約してください。\n\n` +
                                `要約の長さ: ${lengthInstructions[length]}\n\n` +
                                `要件:\n` +
                                `- 主要なポイントを漏らさず含める\n` +
                                `- 分かりやすく構造化する\n` +
                                `- 重要なキーワードを保持する`,
                        },
                    },
                ],
            };
        }

        default:
            throw new Error(`不明なプロンプト: ${name}`);
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('💬 プロンプトテンプレートサーバーが起動しました');
}

main().catch(console.error);
