/* Выполняется один раз при старте сервера Next.js.
   Сама настройка — в instrumentation-node.ts: Next собирает этот файл ещё и для
   edge-среды, где модулей Node нет, поэтому подключаем его только в Node. */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation-node');
  }
}
