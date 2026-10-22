import { z } from 'zod';

export const adminPassword = z.string().min(12, 'Use at least 12 characters.')
  .refine(value => Buffer.byteLength(value, 'utf8') <= 72, 'Use at most 72 UTF-8 bytes.');

export const passwordChangeInput = z.object({
  currentPassword: z.string().min(1).max(1024),
  newPassword: adminPassword,
  confirmPassword: z.string(),
}).refine(value => value.newPassword === value.confirmPassword, {
  message: 'New passwords do not match.', path: ['confirmPassword'],
});

export const resetRequestInput = z.object({
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
});

export const resetPasswordInput = resetRequestInput.extend({
  code: z.string().regex(/^\d{6}$/, 'Enter the six-digit email code.'),
  newPassword: adminPassword,
  confirmPassword: z.string(),
}).refine(value => value.newPassword === value.confirmPassword, {
  message: 'New passwords do not match.', path: ['confirmPassword'],
});
