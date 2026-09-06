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
  sentAt?: string
  senderDomain?: string
}

const Email = ({ sentAt, senderDomain }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Talk2YN email deliverability test</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={kicker}>TALK2YN</Text>
        <Heading style={h1}>Delivery test passed</Heading>
        <Text style={text}>
          If you are reading this, DNS and sending are working. Approval emails for
          new access requests will reach this inbox.
        </Text>
        <Hr style={hr} />
        <Text style={muted}>Sender domain: {senderDomain ?? 'unknown'}</Text>
        <Text style={muted}>Sent at: {sentAt ?? new Date().toISOString()}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Talk2YN — email deliverability test',
  displayName: 'Deliverability test',
  previewData: { sentAt: new Date().toISOString(), senderDomain: 'notify.example.com' },
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
const h1 = { fontSize: '26px', color: '#151310', margin: '0 0 12px' }
const text = { fontSize: '15px', lineHeight: '24px', color: '#3d3a34' }
const hr = { borderColor: '#e7e3da', margin: '24px 0' }
const muted = { fontSize: '12px', color: '#8a8578', margin: '4px 0' }
