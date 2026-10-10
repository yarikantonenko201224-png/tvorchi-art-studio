import { NextResponse } from 'next/server';

/* Временная диагностика сети отключена: настройка завершена.
   Файл можно удалить вместе с папкой app/api/admin/diag. */
export function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
