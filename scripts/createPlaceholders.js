const fs = require('fs');
const path = require('path');

const components = [
  'StudentAssignments',
  'TrainerAssignments',
  'TrainerMaterials',
  'TrainerReports',
  'TrainerMessages',
  'TrainerNotifications',
  'TrainerSettings',
  'AdminUsers',
  'AdminSpoc',
  'AdminCourses',
  'AdminCategories',
  'AdminScheduling',
  'AdminAssignments',
  'AdminAttendance',
  'AdminCertificates',
  'AdminReports',
  'AdminNotifications',
  'AdminSystem',
  'AdminDocuments',
  'AdminAudit',
  'AdminProfile'
];

components.forEach(name => {
  const content = `import React from 'react';
import { PremiumPage, PageHeader, GlassCard, EmptyState, P } from '../../components/PremiumDesignSystem';
import { Bot } from 'lucide-react';

export default function ${name}() {
  return (
    <PremiumPage>
      <PageHeader 
        title="${name.replace(/([A-Z])/g, ' $1').trim()}" 
        subtitle="This section is currently under construction."
        emoji="🚧"
      />
      <GlassCard>
        <EmptyState 
          icon={<Bot size={64} color={P.primary} />}
          title="Coming Soon"
          subtitle="We are working hard to bring you this feature. Stay tuned!"
        />
      </GlassCard>
    </PremiumPage>
  );
}`;
  fs.writeFileSync(path.join('c:/lms1/frontend/src/pages/dashboards', name + '.jsx'), content);
});
console.log('Created ' + components.length + ' components.');
