import { Queue, Worker } from "bullmq";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export function createRedisConnection() {
  const url = new URL(REDIS_URL);
  const isTLS = url.protocol === "rediss:";
  return {
    host: url.hostname,
    port: parseInt(url.port, 10) || (isTLS ? 6380 : 6379),
    password: url.password ? decodeURIComponent(url.password) : undefined,
    username: url.username ? decodeURIComponent(url.username) : undefined,
    tls: isTLS ? {} : undefined,
  };
}

export function createQueue(name: string) {
  return new Queue(name, { connection: createRedisConnection() });
}

export function createWorker<T, R = unknown>(
  name: string,
  processor: (job: { id?: string; data: T }) => Promise<R>,
) {
  return new Worker<T, R>(name, processor, { connection: createRedisConnection() });
}
