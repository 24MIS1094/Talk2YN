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
  appUrl?: string
}

const Email = ({ fullName, appUrl = 'https://talk2yn.lovable.app/auth' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Talk2YN access is approved</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={kicker}>TALK2YN</Text>
        <Heading style={h1}>You&apos;re in{fullName ? `, ${fullName}` : ''}</Heading>
        <Text style={text}>
          Your access request was approved. Sign in and let Aaruba build your resume
          just by talking.
        </Text>
        <Section style={{ marginTop: '24px' }}>
          <Button href={appUrl} style={cta}>Sign in to Talk2YN</Button>
        </Section>
        <Hr style={hr} />
        <Text style={muted}>Sent automatically by Talk2YN.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your Talk2YN access is approved',
  displayName: 'Access approved (user)',
  previewData: { fullName: 'Riya', appUrl: 'https://talk2yn.lovable.app/auth' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif', color: '#111111' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const kicker = { fontSize: '12px', letterSpacing: '0.18em', color: '#8a8a8a', margin: '0' }
const h1 = { fontSize: '24px', margin: '12px 0 8px' }
const text = { fontSize: '15px', lineHeight: '1.6', color: '#333333' }
const cta = {
  background: '#e2542c', color: '#ffffff', borderRadius: '10px',
  padding: '12px 22px', fontSize: '14px', fontWeight: 600,
}
const hr = { borderColor: '#eeeeee', margin: '28px 0 12px' }
const muted = { fontSize: '12px', color: '#999999' }
