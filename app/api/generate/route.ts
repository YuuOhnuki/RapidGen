import { NextResponse } from 'next/server';

/**
 * AI画像生成APIエンドポイント
 * クライアントから受信した画像とプロンプトをPython APIに転送し、
 * 生成タスクを開始してタスクIDを返却
 */
export async function POST(request: Request) {
    try {
        const { image: base64Image, prompt: userPrompt } = await request.json();

        if (!base64Image || !userPrompt) {
            return NextResponse.json(
                { error: 'Image data and prompt are required.' },
                { status: 400 }
            );
        }

        // 画像生成タスクを開始
        const response = await fetch(process.env.API_URL! + '/generate/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                init_image: base64Image,
                prompt: userPrompt,
                strength: 0.3, // 元画像を強く保持
                guidance_scale: 8, // プロンプトに忠実だが元画像も維持
                num_inference_steps: 100, // 高画質
                seed: null, // 毎回変化
            }),
        });

        const pyData = await response.json();

        if (!response.ok) {
            // エラーが発生した場合、Python APIからのエラーをそのまま返す
            return NextResponse.json(
                { error: pyData.detail || 'Python API error' },
                { status: response.status } // 適切なステータスコードを返す
            );
        }

        // Python APIから返されたタスクIDをクライアントに返却
        return NextResponse.json({ taskId: pyData.task_id }, { status: 202 }); // 202 Accepted を使用
    } catch (error) {
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
