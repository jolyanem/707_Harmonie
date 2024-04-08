import { PlusIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { UserDto } from 'backend-types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

const createProjectSchema = z.object({
  name: z.string().min(2).max(50),
  client: z.string().min(2).max(50),
});

const CreateUserDialog = () => {
/*   const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const createProjectMutation = useMutation({
    mutationKey: ['createProject'],
    mutationFn: (values: z.infer<typeof createProjectSchema>) =>
      axios.post<UserDto>(`/users`),
    onSuccess: (res) => {
      toast.success('Utilisateur créé avec succès');
      setOpen(false);
      navigate({
        to: `/users/$projectId`,
        params: {
          projectId: res.data.id.toString(),
        },
      });
    },
  });

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      client: '',
    },
  });

  function onSubmit(values: z.infer<typeof createProjectSchema>) {
    createProjectMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <PlusIcon size={20} />
          Nouvel utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du projet</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client du projet</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center flex items-center justify-center gap-4">
              <Button type="submit">Créer</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  ); */

};

export default CreateUserDialog;
