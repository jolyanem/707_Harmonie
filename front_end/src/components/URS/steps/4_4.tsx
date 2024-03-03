import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { URSDto } from 'backend-types';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { StepProps } from '~/components/URS/steps/all';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { v4 as uuid } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
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
import { Separator } from '~/components/ui/separator';
import { TrashIcon } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

type Props = StepProps & {
  supplierResponses: URSDto['supplierResponses'];
};

const step4_4Schema = z.object({
  status: z.string(),
  supplierResponses: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      statut: z.boolean(),
      answer: z.string(),
      type: z.string(), // Custom or Standard
      customTmpsDev: z.number().optional(),
      customCost: z.number().optional(),
      customApprouved: z.boolean().optional(),
    })
  ),
});

const addSupplierResponseSchema = z.object({
  name: z.string(),
});

const Step4_4 = ({
  ursId,
  step,
  readonly,
  setReadonly,
  supplierResponses,
}: Props) => {
  const router = useRouter();
  const updateStepMutation = useMutation({
    mutationKey: ['updateStep', ursId, '4_4'],
    mutationFn: (values: z.infer<typeof step4_4Schema>) =>
      axios.put<URSDto>(`/urs/${ursId}/step/4_4`, values),
    onSuccess: () => {
      toast.success('Étape 4.4 mise à jour avec succès');
      setReadonly(true);
      router.invalidate();
    },
  });

  const [addSupplierDialogOpen, setAddSupplierDialogOpen] = useState(false);
  useState(false);
  const addSupplierResponseForm = useForm<
    z.infer<typeof addSupplierResponseSchema>
  >({
    resolver: zodResolver(addSupplierResponseSchema),
    defaultValues: {
      name: '',
    },
    disabled: readonly,
  });

  const form = useForm<z.infer<typeof step4_4Schema>>({
    resolver: zodResolver(step4_4Schema),
    defaultValues: {
      ...step,
      supplierResponses,
    },
    disabled: readonly,
  });
  const supplierResponsesFieldArray = useFieldArray({
    control: form.control,
    name: 'supplierResponses',
  });

  const cancel = () => {
    form.reset({
      ...step,
      supplierResponses,
    });
    setReadonly(true);
  };

  function onSubmit(values: z.infer<typeof step4_4Schema>) {
    updateStepMutation.mutate(values);
  }

  return (
    <div>
      <h2 className="font-semibold text-lg uppercase">
        ÉTAPE 4.4 | RÉPONSES FOURNISSEURS POINT PAR POINT AVEC PREUVE
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 bg-white rounded-lg p-4 gap-4 mt-2"
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="col-span-2 max-w-[30ch]">
                <FormLabel>Status d'avancement</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={field.disabled}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="na">Sans objet</SelectItem>
                    <SelectItem value="todo">A réaliser</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="finished">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {supplierResponsesFieldArray.fields.map((field, index) => (
            <div key={field.id} className="col-span-2 gap-2">
              <Separator className="my-4" />
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-500">{field.name}</span>
                <FormField
                  control={form.control}
                  name={`supplierResponses.${index}.statut`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormLabel>Répondu</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <FormField
                  control={form.control}
                  name={`supplierResponses.${index}.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Réponse complete</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`supplierResponses.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standard ou customisé</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={field.disabled}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.watch(`supplierResponses.${index}.type`) === 'custom' && (
                <div className="grid grid-cols-3 items-center gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name={`supplierResponses.${index}.customTmpsDev`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temps de développement</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`supplierResponses.${index}.customCost`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coût</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`supplierResponses.${index}.customApprouved`}
                    render={({ field }) => (
                      <FormItem className="flex space-y-0 space-x-2 pl-4 pt-7">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={field.disabled}
                          />
                        </FormControl>
                        <FormLabel>Approuvé</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          ))}
          {!readonly && (
            <div className="flex items-center mb-4 gap-2 justify-center w-full col-span-2 mt-4">
              {supplierResponsesFieldArray.fields.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="destructive" size="sm">
                      Supprimer une réponse fournisseur
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {supplierResponsesFieldArray.fields.map((field, index) => (
                      <DropdownMenuItem
                        key={field.id}
                        onClick={() => {
                          supplierResponsesFieldArray.remove(index);
                        }}
                        className="flex items-center justify-between group"
                      >
                        {field.name}
                        <TrashIcon
                          size="16"
                          className="hidden group-hover:block text-red-500"
                        />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Dialog
                open={addSupplierDialogOpen}
                onOpenChange={setAddSupplierDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="secondary" size="sm">
                    Ajouter une réponse fournisseur
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajout réponse fournisseur</DialogTitle>
                  </DialogHeader>
                  <FormField
                    control={addSupplierResponseForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <Input {...field} />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      className="mt-2"
                      onClick={addSupplierResponseForm.handleSubmit(
                        async (values) => {
                          supplierResponsesFieldArray.append({
                            ...values,
                            id: uuid(),
                            statut: false,
                            answer: '',
                            type: 'standard',
                            customTmpsDev: 0,
                            customCost: 0,
                            customApprouved: false,
                          });
                          addSupplierResponseForm.reset();
                          setAddSupplierDialogOpen(false);
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
    </div>
  );
};

export default Step4_4;
