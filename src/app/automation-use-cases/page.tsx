import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"

export default function UseCasesPage() {
  return (
    <div className="flex flex-col">
      <Section className="bg-secondary/30 pt-16 md:pt-24 lg:pt-32 pb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">Automation Use Cases</h1>
            <p className="text-xl text-muted-foreground">
              Real-world examples of how automation can transform your business operations.
            </p>
          </div>
        </Container>
      </Section>
      
      <Section>
        <Container>
          <div className="grid gap-12 md:grid-cols-2">
             <div id="sales">
               <h3 className="text-2xl font-bold mb-4">Sales & Marketing</h3>
               <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                 <li>Lead capture and enrichment</li>
                 <li>Automated email follow-up sequences</li>
                 <li>CRM data synchronization</li>
                 <li>Meeting scheduling and reminders</li>
               </ul>
             </div>
             <div id="operations">
               <h3 className="text-2xl font-bold mb-4">Operations & HR</h3>
               <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                 <li>Employee onboarding workflows</li>
                 <li>Contract generation and signing</li>
                 <li>Invoice processing and approvals</li>
                 <li>Project management task creation</li>
               </ul>
             </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
