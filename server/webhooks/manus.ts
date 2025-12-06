import type { Request, Response } from "express";
import { handleManusWebhook as handleManusWebhookPayload } from "../../packages/ai-providers/manus-api/webhook-handler";

export const handleManusWebhook = async (req: Request, res: Response) => {
  try {
    await handleManusWebhookPayload(req.body);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[ManusWebhook] failed", error);
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
};
