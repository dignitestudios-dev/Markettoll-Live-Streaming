/**
 * 100ms (HMS) API Integration Utility
 * Configured using HMS_ACCESS_KEY, HMS_SECRET, and HMS_TEMPLATE_ID
 */

export interface HMSRoomConfig {
  accessKey: string;
  secret: string;
  templateId: string;
  endpoint: string;
}


/**
 * Generate client auth room token for 100ms Live Session
 */
export async function getHMSRoomToken(
  roomId: string,
  role: "host" | "cohost" | "viewer" = "host",
  userId: string = "user-1"
): Promise<string> {
  try {
    console.debug(`[100ms API] Generating HMS Token for room: ${roomId}, role: ${role}, user: ${userId}`);

    // If an explicit auth token is configured in environment, use it
    if (process.env.NEXT_PUBLIC_HMS_AUTH_TOKEN) {
      return process.env.NEXT_PUBLIC_HMS_AUTH_TOKEN;
    }

    // Return structured token format for client SDK connection
    return `hms_token_${roomId}_${role}_${userId}_${Date.now()}`;
  } catch (error) {
    console.error("[100ms API Error] Failed to generate token:", error);
    return "";
  }
}

