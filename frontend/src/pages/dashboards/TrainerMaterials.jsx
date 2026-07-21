import React from 'react';
import { PremiumPage, PageHeader, GlassCard, EmptyState, P } from '../../components/PremiumDesignSystem';
import { Bot } from 'lucide-react';

export default function TrainerMaterials() {
  return (
    <PremiumPage>
      <PageHeader 
        title="Trainer Materials" 
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
}