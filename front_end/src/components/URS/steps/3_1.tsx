import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import axios from 'axios';
import type { URSDto } from 'backend-types';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { type StepProps } from '~/components/URS/steps/all';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

type Props = StepProps & {
  operationalProcessLinks: URSDto['operationalProcessLinks'];
};

const step3_1Schema = z.object({
  status: z.string(),
  operationalProcessLinks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      link: z.string(),
    })
  ),
});

const addLinkResponseSchema = z.object({
  name: z.string(),
  link: z.string(),
});

const Step3_1 = ({
  ursId,
  step,
  readonly,
  setReadonly,
  operationalProcessLinks,
}: Props) => {
  const router = useRouter();
  const updateStepMutation = useMutation({
    mutationKey: ['updateStep', ursId, '3_1'],
    mutationFn: (values: z.infer<typeof step3_1Schema>) =>
      axios.put<URSDto>(`/urs/${ursId}/step/3_1`, values),
    onSuccess: () => {
      toast.success('Étape 3.1 mise à jour avec succès');
      setReadonly(true);
      router.invalidate();
    },
  });

  const [addLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
  const addLinkResponseForm = useForm<z.infer<typeof addLinkResponseSchema>>({
    resolver: zodResolver(addLinkResponseSchema),
    defaultValues: {
      name: '',
      link: '',
    },
    disabled: readonly,
  });

  const form = useForm<z.infer<typeof step3_1Schema>>({
    resolver: zodResolver(step3_1Schema),
    defaultValues: {
      ...step,
      operationalProcessLinks,
    },
    disabled: readonly,
  });
  const operationalProcessLinksFieldArray = useFieldArray({
    control: form.control,
    name: 'operationalProcessLinks',
  });

  const cancel = () => {
    form.reset(step);
    setReadonly(true);
  };

  function onSubmit(values: z.infer<typeof step3_1Schema>) {
    updateStepMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 bg-white rounded-lg p-4 gap-4 mt-2"
      >
        {operationalProcessLinksFieldArray.fields.length === 0 ? (
          <div className="text-gray-400">Aucun</div>
        ) : (
          <div className="col-span-2 flex items-center gap-4">
            {operationalProcessLinksFieldArray.fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`operationalProcessLinks.${index}.link`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch(`operationalProcessLinks.${index}.name`)}
                    </FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        )}
        {!readonly && (
          <div className="flex items-center mb-4 gap-2 justify-center w-full col-span-2 mt-4">
            {operationalProcessLinksFieldArray.fields.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="destructive" size="sm">
                    Supprimer un lien
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {operationalProcessLinksFieldArray.fields.map(
                    (field, index) => (
                      <DropdownMenuItem
                        key={field.id}
                        onClick={() => {
                          operationalProcessLinksFieldArray.remove(index);
                        }}
                        className="flex items-center justify-between group"
                      >
                        {field.name}
                        <TrashIcon
                          size="16"
                          className="hidden group-hover:block text-red-500"
                        />
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Dialog
              open={addLinkDialogOpen}
              onOpenChange={setAddLinkDialogOpen}
            >
              <DialogTrigger asChild>
                <Button type="button" variant="secondary" size="sm">
                  Ajouter un lien
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajout d'un lien</DialogTitle>
                </DialogHeader>
                <FormField
                  control={addLinkResponseForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <Input {...field} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addLinkResponseForm.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lien</FormLabel>
                      <Input {...field} />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    className="mt-2"
                    onClick={addLinkResponseForm.handleSubmit(
                      async (values) => {
                        operationalProcessLinksFieldArray.append({
                          ...values,
                          id: uuid(),
                        });
                        addLinkResponseForm.reset();
                        setAddLinkDialogOpen(false);
                      }
                    )}
                  >
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {!readonly && (
          <div className="col-span-2 text-center flex items-center justify-center gap-4">
            <Button type="button" variant="secondary" onClick={cancel}>
              Annuler
            </Button>
            <Button type="submit">Valider</Button>
          </div>
        )}
        {step.updatedAt && (
          <div className="text-gray-300 uppercase col-span-2 text-sm">
            MAJ le {new Date(step.updatedAt).toLocaleDateString()} par{' '}
            {step.updatedBy}
          </div>
        )}
      </form>
    </Form>
  );
};

export default Step3_1;
