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
import type { URSCreateDto, URSDto } from 'backend-types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

const createURSSchema = z.object({
  name: z.string().min(2).max(50),
  type: z.string(),
  description: z.string().max(400),
  code: z.string(),
  processType: z.string(),
});

type Props = {
  projectId: string;
};

const CreateURSDialog = ({ projectId }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const createURSMutation = useMutation({
    mutationKey: ['createUrs'],
    mutationFn: (values: z.infer<typeof createURSSchema>) =>
      axios.post<URSDto>(`/urs`, {
        ...values,
        projectId: parseInt(projectId),
      } satisfies URSCreateDto),
    onSuccess: (res) => {
      toast.success('URS créée avec succès');
      setOpen(false);
      navigate({
        to: `/projects/$projectId/urs/$id`,
        params: {
          projectId,
          id: res.data.id,
        },
      });
    },
  });

  const form = useForm<z.infer<typeof createURSSchema>>({
    resolver: zodResolver(createURSSchema),
    defaultValues: {
      name: '',
      type: 'macro',
      description: '',
      code: '',
      processType: '',
    },
  });

  function onSubmit(values: z.infer<typeof createURSSchema>) {
    createURSMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <PlusIcon size={20} /> Nouvelle URS
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle URS</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-3"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code de l'URS</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de besoin</FormLabel>
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
                      <SelectItem value="macro">Macro</SelectItem>
                      <SelectItem value="detailed">Détaillé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nom de l'URS</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description de l'URS</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr className="col-span-2" />
            <FormField
              control={form.control}
              name="processType"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Process type</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 text-center flex items-center justify-center gap-4">
              <Button type="submit">Valider</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateURSDialog;
