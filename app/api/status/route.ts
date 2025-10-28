import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    if (!taskId) {
        return NextResponse.json(
            { error: 'Task ID is required.' },
            { status: 400 }
        );
    }

    const PY_API_URL = process.env.PY_API_URL; // 例: https://my-render-app.onrender.com

    // バックエンドのポーリングエンドポイントを叩く
    const pyResponse = await fetch(`${PY_API_URL}/tasks/${taskId}`);
    const pyData = await pyResponse.json();

    if (!pyResponse.ok) {
        // バックエンドのエラーをそのまま返す
        return NextResponse.json(
            { error: pyData.detail || 'Python API error' },
            { status: pyResponse.status }
        );
    }

    // バックエンドからのステータス/結果をそのままフロントエンドに返す
    // { status: 'IN_PROGRESS' | 'COMPLETED', progress: number, dataUrl?: string }
    return NextResponse.json(pyData, { status: 200 });
}
