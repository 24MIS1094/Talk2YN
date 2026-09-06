import type { ComponentType } from 'react'
import { template as approvalRequest } from './approval-request'
import { template as accessApproved } from './access-approved'
import { template as accessDeclined } from './access-declined'
import { template as deliveryTest } from './delivery-test'
import { template as contactMessage } from './contact-message'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'approval-request': approvalRequest,
  'access-approved': accessApproved,
  'access-declined': accessDeclined,
  'delivery-test': deliveryTest,
  'contact-message': contactMessage,
}
