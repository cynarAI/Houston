import webpush from 'web-push';

// VAPID keys for Web Push (should be in env, but we'll generate them here for now)
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:support@houston.ai';

// Initialize web-push with VAPID keys
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

/**
 * Send push notification to a subscription
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      console.warn('[Push] VAPID keys not configured, skipping push notification');
      return false;
    }

    await webpush.sendNotification(
      subscription as any,
      JSON.stringify(payload)
    );

    console.log('[Push] Notification sent successfully');
    return true;
  } catch (error) {
    console.error('[Push] Failed to send notification:', error);
    return false;
  }
}

/**
 * Send goal deadline reminder notification
 */
export async function sendGoalDeadlineNotification(
  subscription: PushSubscription,
  goalTitle: string,
  daysLeft: number
): Promise<boolean> {
  const payload: NotificationPayload = {
    title: '🎯 Goal Deadline Reminder',
    body: `"${goalTitle}" ist in ${daysLeft} Tag${daysLeft !== 1 ? 'en' : ''} fällig!`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: '/app/goals',
      type: 'goal_deadline'
    },
    actions: [
      { action: 'view', title: 'Ziel ansehen' },
      { action: 'dismiss', title: 'Später' }
    ]
  };

  return sendPushNotification(subscription, payload);
}

/**
 * Send low credit warning notification
 */
export async function sendLowCreditNotification(
  subscription: PushSubscription,
  creditsLeft: number
): Promise<boolean> {
  const payload: NotificationPayload = {
    title: '⚠️ Credits werden knapp',
    body: `Du hast nur noch ${creditsLeft} Credits übrig. Kaufe jetzt nach!`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: '/app/credits',
      type: 'low_credits'
    },
    actions: [
      { action: 'buy', title: 'Credits kaufen' },
      { action: 'dismiss', title: 'Später' }
    ]
  };

  return sendPushNotification(subscription, payload);
}

/**
 * Send referral reward notification
 */
export async function sendReferralRewardNotification(
  subscription: PushSubscription,
  referralName: string,
  creditsEarned: number
): Promise<boolean> {
  const payload: NotificationPayload = {
    title: '🎉 Referral Belohnung erhalten!',
    body: `${referralName} hat sich angemeldet! Du hast ${creditsEarned} Bonus-Credits erhalten.`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: '/app/referrals',
      type: 'referral_reward'
    },
    actions: [
      { action: 'view', title: 'Ansehen' },
      { action: 'dismiss', title: 'OK' }
    ]
  };

  return sendPushNotification(subscription, payload);
}

/**
 * Generate VAPID keys (for initial setup)
 */
export function generateVapidKeys() {
  return webpush.generateVAPIDKeys();
}

/**
 * Get public VAPID key for client
 */
export function getPublicVapidKey(): string {
  return VAPID_PUBLIC_KEY;
}
