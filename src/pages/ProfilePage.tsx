import { useEffect, useState } from 'react';
import { useProfileStore } from '@/entities/profile/store';
import { useProfilesQuery } from '@/entities/profile/hooks/useProfilesQuery';
import { useCreateProfileMutation } from '@/entities/profile/hooks/useCreateProfileMutation';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export default function ProfilePage() {
  const currentProfileId = useProfileStore(s => s.currentProfileId);
  const setCurrentProfileId = useProfileStore(s => s.setCurrentProfileId);
  const { data: profiles = [] } = useProfilesQuery();
  const createProfileMutation = useCreateProfileMutation();
  const [newName, setNewName] = useState('');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName) return;
    createProfileMutation.mutate(newName, {
      onSuccess: (profile) => {
        setCurrentProfileId(profile.id);
        setNewName('');
      },
    });
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <div className="mb-2">Current profile:</div>
        {profiles.find(p => p.id === currentProfileId) ? (
          <div className="font-semibold">
            {profiles.find(p => p.id === currentProfileId)?.name}
          </div>
        ) : (
          <div className="text-muted-foreground">No profile selected</div>
        )}
      </div>
      <div className="mb-4">
        <div className="mb-2">Switch profile:</div>
        <div className="flex gap-2 flex-wrap">
          {profiles.map(p => (
            <Button
              key={p.id}
              variant={p.id === currentProfileId ? 'default' : 'outline'}
              onClick={() => setCurrentProfileId(p.id)}
            >
              {p.name}
            </Button>
          ))}
        </div>
      </div>
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          placeholder="New profile name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
