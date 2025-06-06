import { Button } from '@/shared/ui/button';
import { useProfileStore } from '@/entities/profile/store';
import { generateRandomExpenses } from '../lib';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner'; // Import toast from sonner

export function GenerateExpensesButton() {
  const profileId = useProfileStore(s => s.currentProfileId);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => generateRandomExpenses(profileId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', profileId] });
      toast("Expenses generated", {
        description: "Random expenses for the last 2 years have been added.",
      });
    },
    onError: (error) => {
      toast("Generation failed", {
        description: `Failed to generate expenses: ${error.message}`,
        // Sonner doesn't have 'variant', you might need to customize styles or messages based on error type
      });
    },
  });

  const handleClick = async () => {
    if (!profileId) {
      toast("No profile selected", {
        description: "Please select or create a profile first.",
        // Sonner doesn't have 'variant'
      });
      return;
    }
    mutation.mutate();
  };

  return (
    <Button onClick={handleClick} disabled={mutation.isPending || !profileId}> {/* Use isPending instead of isLoading */}
      {mutation.isPending ? 'Generating...' : 'Generate 2 Years of Expenses'}
    </Button>
  );
} 