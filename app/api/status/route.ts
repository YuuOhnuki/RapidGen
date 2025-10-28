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

    // バックエンドのポーリングエンドポイントを叩く
    const response = await fetch(`${process.env.API_URL}/tasks/${taskId}`);
    const pyData = await response.json();

    if (!response.ok) {
        // バックエンドのエラーをそのまま返す
        return NextResponse.json(
            { error: pyData.detail || 'Python API error' },
            { status: response.status }
        );
    }

    // バックエンドからのステータス/結果をそのままフロントエンドに返す
    // { status: 'IN_PROGRESS' | 'COMPLETED', progress: number, dataUrl?: string }
    return NextResponse.json(pyData, { status: 200 });
}
