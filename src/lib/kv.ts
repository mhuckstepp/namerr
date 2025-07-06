import { kv } from "@vercel/kv";

export async function saveName(userId: string, name: string) {
  try {
    await kv.sadd(`user:${userId}:savedNames`, name);
    return { success: true };
  } catch (error) {
    console.error("Error saving name:", error);
    return { success: false, error };
  }
}

export async function getSavedNames(userId: string): Promise<string[]> {
  try {
    const savedNames = await kv.smembers(`user:${userId}:savedNames`);
    return savedNames || [];
  } catch (error) {
    console.error("Error getting saved names:", error);
    return [];
  }
}

export async function removeName(userId: string, name: string) {
  try {
    await kv.srem(`user:${userId}:savedNames`, name);
    return { success: true };
  } catch (error) {
    console.error("Error removing name:", error);
    return { success: false, error };
  }
}
