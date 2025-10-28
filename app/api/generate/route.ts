import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { image: base64Image, prompt: userPrompt } = await request.json();

        if (!base64Image || !userPrompt) {
            return NextResponse.json(
                { error: 'Image data and prompt are required.' },
                { status: 400 }
            );
        }

        // Python API の URL（Render / Railway のデプロイ先）
        const PY_API_URL = process.env.PY_API_URL;

        // 1. 画像生成タスク開始のエンドポイントを叩く
        const pyResponse = await fetch(PY_API_URL! + '/generate/', {
            // PY_API_URLは /generate/ を含まないベースURLを想定
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                init_image: base64Image,
                prompt: userPrompt,
            }),
        });

        const pyData = await pyResponse.json();

        if (!pyResponse.ok) {
            // エラーが発生した場合、Python APIからのエラーをそのまま返す
            return NextResponse.json(
                { error: pyData.detail || 'Python API error' },
                { status: pyResponse.status } // 適切なステータスコードを返す
            );
        }

        // 2. Python API から返された task_id をフロントエンドにそのまま返す
        // pyData: { task_id: string }
        return NextResponse.json({ taskId: pyData.task_id }, { status: 202 }); // 202 Accepted を使用
    } catch (error) {
        console.error('=== Error in Next.js API ===', error);
        return NextResponse.json(
            {
                error: 'Failed to generate image',
                details:
                    error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
