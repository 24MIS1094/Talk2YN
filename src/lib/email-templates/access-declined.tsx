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
}

const Email = ({ fullName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Update on your Talk2YN access request</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={kicker}>TALK2YN</Text>
        <Heading style={h1}>Access request update</Heading>
        <Text style={text}>
          Hi{fullName ? ` ${fullName}` : ' there'}, your Talk2YN access request was not
          approved this time.
        </Text>
        <Hr style={hr} />
        <Text style={muted}>Sent automatically by Talk2YN.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your Talk2YN access request',
  displayName: 'Access declined (user)',
  previewData: { fullName: 'Riya' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif', color: '#111111' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const kicker = { fontSize: '12px', letterSpacing: '0.18em', color: '#8a8a8a', margin: '0' }
const h1 = { fontSize: '22px', margin: '12px 0 8px' }
const text = { fontSize: '15px', lineHeight: '1.6', color: '#333333' }
const hr = { borderColor: '#eeeeee', margin: '28px 0 12px' }
const muted = { fontSize: '12px', color: '#999999' }
