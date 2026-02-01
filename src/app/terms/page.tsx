import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Web Automate",
  description: "Terms of Service for Web Automate services and website.",
}

export default function TermsOfService() {
  return (
    <div className="flex flex-col">
      <Section className="pt-24 pb-12 border-b border-border bg-secondary/30">
        <Container>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-3xl prose prose-lg prose-gray prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            <h3>1. Agreement to Terms</h3>
            <p>
              By accessing our website or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>

            <h3>2. Intellectual Property</h3>
            <p>
              The materials on Web Automate's website are owned by or licensed to us and are protected by copyright and trademark law. 
              You may not modify, copy, reproduce, republish, upload, post, transmit, or distribute any material without our prior written consent.
            </p>

            <h3>3. User Responsibilities</h3>
            <p>
              When using our services or client portal, you agree to:
            </p>
            <ul>
              <li>Provide accurate and complete information.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Not use the services for any illegal or unauthorized purpose.</li>
              <li>Not interfere with or disrupt the integrity or performance of the services.</li>
            </ul>

            <h3>4. Service Terms</h3>
            <p>
              Our services are provided "as is". Web Automate makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, 
              including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>

            <h3>5. Payment Terms</h3>
            <p>
              For paid services, you agree to provide valid payment information. Fees are non-refundable unless otherwise stated in a specific service agreement.
            </p>

            <h3>6. Limitation of Liability</h3>
            <p>
              In no event shall Web Automate or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use the materials on Web Automate's website.
            </p>

            <h3>7. Governing Law</h3>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which we operate and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>

            <h3>8. Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us via our contact form.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  )
}
