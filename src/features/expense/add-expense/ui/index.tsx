import { useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { ResponsiveDialog } from '@/shared/ui/responsive-dialog';
import { useAddExpenseMutation } from '@/entities/expense/hooks/useAddExpenseMutation';
import { useProfileStore } from '@/entities/profile/store';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

// Define the Zod schema for your form data
const addExpenseFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  amount: z.number().min(0.01, { message: "Amount must be greater than 0" }),
  date: z.string().min(1, { message: "Date is required" }), // Basic date validation as string
  comment: z.string().optional(),
});

// Infer the type from the schema
type AddExpenseFormData = z.infer<typeof addExpenseFormSchema>;

export function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const profileId = useProfileStore(s => s.currentProfileId);
  const mutation = useAddExpenseMutation(profileId);

  // Use zodResolver with your schema
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<AddExpenseFormData>({
    resolver: zodResolver(addExpenseFormSchema),
  });

  const onSubmit = (data: AddExpenseFormData) => {
    if (!profileId) return; // Should not happen if Guard is in place, but good practice

    // Transform data for mutation
    const expenseData = {
      title: data.title,
      category: data.category,
      amount: data.amount, // amount is already number due to valueAsNumber in register
      date: new Date(data.date).toISOString(), // Convert date string to ISO string
      comment: data.comment || '', // Ensure comment is string
    };

    mutation.mutate(expenseData, {
      onSuccess: () => {
        reset(); // Reset form fields
        setOpen(false); // Close the dialog on success
      },
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset(); // Reset form when dialog is closed
        }
      }}
      trigger={<Button>Add expense</Button>}
      title="Add expense"
      description="Fill in the fields to add a new expense."
      footer={null}
    >
      {/* Use handleSubmit provided by react-hook-form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          {/* Register input with react-hook-form, validation handled by Zod */}
          <Input id="title" {...register('title')} />
          {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          {/* Use Controller for shadcn Select, validation handled by Zod */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          {/* Register input with react-hook-form, validation handled by Zod */}
          <Input id="amount" type="number" {...register('amount', { valueAsNumber: true })} />
          {errors.amount && <span className="text-red-500 text-xs">{errors.amount.message}</span>}
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          {/* Register input with react-hook-form, validation handled by Zod */}
          <Input id="date" type="date" {...register('date')} />
          {errors.date && <span className="text-red-500 text-xs">{errors.date.message}</span>}
        </div>
        <div>
          <Label htmlFor="comment">Comment</Label>
          <Input id="comment" {...register('comment')} />
          {/* No error message for comment as it's optional */}
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Adding...' : 'Add'}
        </Button>
      </form>
    </ResponsiveDialog>
  );
} 