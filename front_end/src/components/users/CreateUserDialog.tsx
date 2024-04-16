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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useRouter } from '@tanstack/react-router';

const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  surname: z.string().min(2).max(50),
  employerName: z.string().min(2).max(50),
  employerPhone: z.string(),
  email: z.string().email(),
  role: z.string(),
});

type Props = {
  oldUser?: Pick<
    UserDto,
    | 'id'
    | 'name'
    | 'surname'
    | 'email'
    | 'employerName'
    | 'employerPhone'
    | 'role'
  >;
};

const CreateUserDialog = ({ oldUser }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const createUserMutation = useMutation({
    mutationKey: ['createProject'],
    mutationFn: (values: z.infer<typeof createUserSchema>) =>
      axios.post<UserDto>('/users', values),
    onSuccess: () => {
      toast.success('Utilisateur créé avec succès');
      router.invalidate();
      setOpen(false);
      resetForm();
    },
  });
  const updateUserMutation = useMutation({
    mutationKey: ['updateProject'],
    mutationFn: (values: z.infer<typeof createUserSchema>) =>
      axios.put<UserDto>(`/users/${oldUser?.id}`, values),
    onSuccess: (d) => {
      toast.success('Utilisateur modifié avec succès');
      router.invalidate();
      setOpen(false);
      resetForm(d.data);
    },
  });

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: oldUser?.name ?? '',
      surname: oldUser?.surname ?? '',
      email: oldUser?.email ?? '',
      employerName: oldUser?.employerName ?? '',
      employerPhone: oldUser?.employerPhone ?? '',
      role: oldUser?.role ?? '',
    },
  });

  function onSubmit(values: z.infer<typeof createUserSchema>) {
    if (oldUser) {
      updateUserMutation.mutate(values);
    } else {
      createUserMutation.mutate(values);
    }
  }

  const resetForm = (newUser?: Props['oldUser']) => {
    form.reset({
      name: newUser?.name ?? '',
      surname: newUser?.surname ?? '',
      email: newUser?.email ?? '',
      employerName: newUser?.employerName ?? '',
      employerPhone: newUser?.employerPhone ?? '',
      role: newUser?.role ?? '',
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          resetForm();
        }
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        {oldUser ? (
          <Button variant="secondary" size="sm" className="gap-2">
            Modifier
          </Button>
        ) : (
          <Button variant="secondary" className="gap-2">
            <PlusIcon size={20} />
            Nouvel utilisateur
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {oldUser ? 'Modifier l’utilisateur' : 'Créer un utilisateur'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'employeur</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone de l'employeur</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Collaborateur">
                        Collaborateur
                      </SelectItem>
                      <SelectItem value="Client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center flex items-center justify-center gap-4">
              <Button type="submit">{oldUser ? 'Modifier' : 'Créer'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
