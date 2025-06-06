import { useProfileStore } from '@/entities/profile/store';
import { useProfilesQuery } from '@/entities/profile/hooks/useProfilesQuery';
import { Button } from '@/shared/ui/button';
import type { Profile } from '@/entities/profile/model';

export function SwitchProfile() {
  const currentProfileId = useProfileStore(s => s.currentProfileId);
  const setCurrentProfileId = useProfileStore(s => s.setCurrentProfileId);
  const { data: profiles = [] } = useProfilesQuery();

  return (
    <div className="flex gap-2 flex-wrap">
      {profiles.map((p: Profile) => (
        <Button
          key={p.id}
          variant={p.id === currentProfileId ? 'default' : 'outline'}
          onClick={() => setCurrentProfileId(p.id)}
        >
          {p.name}
        </Button>
      ))}
    </div>
  );
} 