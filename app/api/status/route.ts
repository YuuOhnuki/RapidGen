import { NextResponse } from 'next/server';

/**
 * タスクステータス監視APIエンドポイント
 * タスクIDに基づいてPython APIから処理進捗を取得し、
 * クライアントに結果を返却
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
        return NextResponse.json(
            { error: 'Task ID is required.' },
            { status: 400 }
        );
    }

    // Python APIからタスクの進捗状況を取得
    const response = await fetch(`${process.env.API_URL}/tasks/${taskId}`);
    const pyData = await response.json();

    if (!response.ok) {
        // バックエンドのエラーをそのまま返す
        return NextResponse.json(
            { error: pyData.detail || 'Python API error' },
            { status: response.status }
        );
    }

    // タスクの状態と進捗をクライアントに返却
    return NextResponse.json(pyData, { status: 200 });
}
