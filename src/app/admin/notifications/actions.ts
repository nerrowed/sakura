'use server';

import {
  generateNotificationText,
  GenerateNotificationTextInput,
  GenerateNotificationTextOutput,
} from '@/ai/flows/notification-text-generator';

export async function generateNotificationAction(
  input: GenerateNotificationTextInput
): Promise<{
  success: boolean;
  data?: GenerateNotificationTextOutput;
  error?: string;
}> {
  try {
    const result = await generateNotificationText(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Gagal menghasilkan teks notifikasi. Silakan coba lagi.',
    };
  }
}
