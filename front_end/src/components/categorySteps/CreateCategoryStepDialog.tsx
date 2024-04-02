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
import type {
  CategoryStepCreateDto,
  CategoryStepDto,
  ProjectDto,
} from 'backend-types';
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

const createCategoryStepSchema = z.object({
  name: z.string().min(2).max(50),
});

type Props = {
  projectId: ProjectDto['id'];
  parentId?: CategoryStepDto['id'];
};

const CreateCategoryStepDialog = ({ projectId, parentId }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const createCategoryStepMutation = useMutation({
    mutationKey: ['createUrs'],
    mutationFn: (values: z.infer<typeof createCategoryStepSchema>) =>
      axios.post<CategoryStepDto>(`/projects/${projectId}/step`, {
        ...values,
        projectId,
        parentId,
      } satisfies CategoryStepCreateDto),
    onSuccess: (res) => {
      toast.success('CategoryStep créée avec succès');
      setOpen(false);
      navigate({
        to: `/projects/$projectId/steps/$stepId`,
        params: {
          projectId: projectId.toString(),
          stepId: res.data.id,
        },
      });
    },
  });

  const form = useForm<z.infer<typeof createCategoryStepSchema>>({
    resolver: zodResolver(createCategoryStepSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: z.infer<typeof createCategoryStepSchema>) {
    createCategoryStepMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <PlusIcon size={20} /> Nouveau process step
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau process step</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nom du process step</FormLabel>
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

export default CreateCategoryStepDialog;
