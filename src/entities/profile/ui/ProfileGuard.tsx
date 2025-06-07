import { useEffect, useState } from 'react';
import { useProfileStore } from '../store';
import { getProfiles, createProfile } from '../api';
import { ResponsiveDialog } from '@/shared/ui/responsive-dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function ProfileGuard({ children }: { children: React.ReactNode }) {
  const currentProfileId = useProfileStore(s => s.currentProfileId);
  const setCurrentProfileId = useProfileStore(s => s.setCurrentProfileId);
  const [showDialog, setShowDialog] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    getProfiles().then(profs => {
      if (!currentProfileId) {
        if (profs.length > 0) {
          setCurrentProfileId(profs[0].id);
        } else {
          setShowDialog(true);
        }
      }
    });
    // eslint-disable-next-line
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName) return;
    const profile = await createProfile(newName);
    setCurrentProfileId(profile.id);
    setShowDialog(false);
    setNewName('');
  }

  return (
    <>
      <ResponsiveDialog
        open={showDialog}
        onOpenChange={() => { }}
        title="Create profile"
        description="You need to create a profile to use the app."
        trigger={null}
        footer={null}
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            placeholder="Profile name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
          />
          <Button type="submit" className="w-full">Create</Button>
        </form>
      </ResponsiveDialog>
      {(!showDialog && currentProfileId) ? children : null}
    </>
  );
} 