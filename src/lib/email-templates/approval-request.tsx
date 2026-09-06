import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  fullName?: string
  username?: string
  email?: string
  mobile?: string
  approveUrl?: string
  rejectUrl?: string
}

const Email = ({
  fullName = 'A new user',
  username = '—',
  email = '—',
  mobile = '—',
  approveUrl = '#',
  rejectUrl = '#',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`Access request from ${fullName}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={kicker}>TALK2YN</Text>
        <Heading style={h1}>New access request</Heading>
        <Text style={text}>
          Someone asked to join Talk2YN. Review the details and approve or reject.
        </Text>
        <Section style={card}>
          <Text style={row}><strong>Name:</strong> {fullName}</Text>
          <Text style={row}><strong>Username:</strong> {username}</Text>
          <Text style={row}><strong>Email:</strong> {email}</Text>
          <Text style={row}><strong>Mobile:</strong> {mobile}</Text>
        </Section>
        <Section style={{ marginTop: '24px' }}>
          <Button href={approveUrl} style={approve}>Approve access</Button>
          <Button href={rejectUrl} style={reject}>Reject</Button>
        </Section>
        <Hr style={hr} />
        <Text style={muted}>Sent automatically by Talk2YN.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Access request: ${data?.fullName || 'new user'}`,
  displayName: 'Access request (owner)',
  previewData: {
    fullName: 'Riya Sharma',
    username: 'riya_s',
    email: 'riya@example.com',
    mobile: '+91 98765 43210',
    approveUrl: 'https://talk2yn.lovable.app/api/public/approve',
    rejectUrl: 'https://talk2yn.lovable.app/api/public/approve',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif', color: '#111111' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const kicker = { fontSize: '12px', letterSpacing: '0.18em', color: '#8a8a8a', margin: '0' }
const h1 = { fontSize: '22px', margin: '12px 0 8px' }
const text = { fontSize: '15px', lineHeight: '1.6', color: '#333333' }
const card = { background: '#faf8f5', borderRadius: '12px', padding: '16px 18px', marginTop: '16px' }
const row = { fontSize: '14px', margin: '4px 0', color: '#222222' }
const approve = {
  background: '#e2542c', color: '#ffffff', borderRadius: '10px',
  padding: '12px 20px', fontSize: '14px', fontWeight: 600, marginRight: '10px',
}
const reject = {
  background: '#f0eeea', color: '#333333', borderRadius: '10px',
  padding: '12px 20px', fontSize: '14px', fontWeight: 600,
}
const hr = { borderColor: '#eeeeee', margin: '28px 0 12px' }
const muted = { fontSize: '12px', color: '#999999' }
