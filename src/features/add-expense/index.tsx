import { useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { ResponsiveDialog } from '@/shared/ui/responsive-dialog';
import { useAddExpenseMutation } from '@/entities/expense/hooks/useAddExpenseMutation';
import { useProfileStore } from '@/entities/profile/store';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

export function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [comment, setComment] = useState('');
  const profileId = useProfileStore(s => s.currentProfileId);
  const mutation = useAddExpenseMutation(profileId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !category || !amount || !date) return;
    mutation.mutate({
      title,
      category,
      amount: Number(amount),
      date: new Date(date).toISOString(),
      comment,
    }, {
      onSuccess: () => {
        setOpen(false);
        setTitle('');
        setCategory('');
        setAmount('');
        setDate(new Date().toISOString().slice(0, 10));
        setComment('');
      }
    });
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Add expense</Button>}
      title="Add expense"
      description="Fill in the fields to add a new expense."
      footer={null}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="comment">Comment</Label>
          <Input id="comment" value={comment} onChange={e => setComment(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">Add</Button>
      </form>
    </ResponsiveDialog>
  );
} 