import { useProfileStore } from '@/entities/profile/store';
import { useProfilesQuery } from '@/entities/profile/hooks/useProfilesQuery';
import { CreateProfile, SwitchProfile } from '@/features/profile';
import { GenerateExpensesButton } from '@/features/expense/generate-expenses';

export default function ProfilePage() {
  const currentProfileId = useProfileStore(s => s.currentProfileId);
  const { data: profiles = [] } = useProfilesQuery();

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
        <SwitchProfile />
      </div>
      <div>
        <div className="mb-2">Create new profile:</div>
        <CreateProfile />
      </div>
      <div>
        <div className="mb-2">Danger Zone:</div>
        <GenerateExpensesButton />
      </div>
    </div>
  );
}
