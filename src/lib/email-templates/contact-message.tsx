import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  fullName?: string
  email?: string
  subject?: string
  category?: string
  message?: string
}

const Email = ({ fullName, email, subject, category, message }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New Talk2YN contact message</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={kicker}>TALK2YN — CONTACT ADMIN</Text>
        <Heading style={h1}>{subject ?? 'New message'}</Heading>
        <Text style={muted}>Category: {category ?? 'Other'}</Text>
        <Text style={muted}>
          From: {fullName ?? 'Unknown'} ({email ?? 'no email'})
        </Text>
        <Hr style={hr} />
        <Text style={text}>{message}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Talk2YN contact — ${data.category ?? 'Message'}: ${data.subject ?? ''}`.trim(),
  displayName: 'Contact admin message',
  previewData: {
    fullName: 'Asha R',
    email: 'asha@example.com',
    subject: 'ATS score question',
    category: 'Resume Question',
    message: 'How do I improve my ATS score for product roles?',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, Times, serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const kicker = {
  fontSize: '11px',
  letterSpacing: '0.18em',
  color: '#8a8578',
  margin: '0 0 8px',
  fontFamily: 'Helvetica, Arial, sans-serif',
}
const h1 = { fontSize: '24px', color: '#151310', margin: '0 0 12px' }
const text = { fontSize: '15px', lineHeight: '24px', color: '#3d3a34', whiteSpace: 'pre-wrap' as const }
const hr = { borderColor: '#e7e3da', margin: '24px 0' }
const muted = { fontSize: '12px', color: '#8a8578', margin: '4px 0' }
