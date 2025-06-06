import { useProfileStore } from '@/entities/profile/store';
import { useCreateProfileMutation } from '@/entities/profile/hooks/useCreateProfileMutation';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the Zod schema for your form data
const createProfileFormSchema = z.object({
  name: z.string().min(1, { message: "Profile name is required" }),
});

// Infer the type from the schema
type CreateProfileFormData = z.infer<typeof createProfileFormSchema>;

export function CreateProfile() {
  const setCurrentProfileId = useProfileStore(s => s.setCurrentProfileId);
  const createProfileMutation = useCreateProfileMutation();

  // Use zodResolver with your schema
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProfileFormData>({
    resolver: zodResolver(createProfileFormSchema),
  });

  const onSubmit = (data: CreateProfileFormData) => {
    // No need for a manual check if using Zod resolver
    createProfileMutation.mutate(data.name, {
      onSuccess: (profile) => {
        setCurrentProfileId(profile.id);
        reset(); // Reset form fields on success
      },
    });
  };

  return (
    // Use handleSubmit provided by react-hook-form
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      {/* Register input with react-hook-form, validation handled by Zod */}
      <Input
        placeholder="New profile name"
        {...register('name')}
      />
      <Button type="submit" disabled={createProfileMutation.isPending}>
        {createProfileMutation.isPending ? 'Creating...' : 'Create'}
      </Button>
      {/* Display error message from Zod */}
      {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
    </form>
  );
} 