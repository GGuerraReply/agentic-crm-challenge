import { useState } from 'react';
import { Clock, Target, Workflow } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Content } from '../../layout/components/content';
import ContactList from './contact-list';
import { PageHeader } from './page-header';

export default function ContactsPage() {
  const [refreshToken, setRefreshToken] = useState(0);
  const handleCreated = () => setRefreshToken((v) => v + 1);
  return (
    <>
      <PageHeader onCreated={handleCreated} />
      <Content className="py-0">
        <div className="flex grow">
          <Tabs defaultValue="today" className="grow text-sm">
            <TabsList
              variant="line"
              className="px-5 gap-6 bg-transparent [&_button]:border-b [&_button_svg]:size-4 [&_button]:text-secondary-foreground"
            >
              <TabsTrigger value="today">
                <Target /> Leads
              </TabsTrigger>
              <TabsTrigger value="week">
                <Clock /> Follow-ups
              </TabsTrigger>
              <TabsTrigger value="completed">
                <Workflow />
                Pipeline
              </TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="today">
                <ContactList filter="today" refreshToken={refreshToken} />
              </TabsContent>
              <TabsContent value="week">
                <ContactList filter="week" refreshToken={refreshToken} />
              </TabsContent>
              <TabsContent value="completed">
                <ContactList filter="completed" refreshToken={refreshToken} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Content>
    </>
  );
}
