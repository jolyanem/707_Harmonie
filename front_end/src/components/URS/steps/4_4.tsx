import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { ProjectDto, URSDto } from 'backend-types';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { type StepProps } from '~/components/URS/steps/all';
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
import { InfoIcon, TrashIcon } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

type Props = StepProps & {
  supplierResponses: URSDto['supplierResponses'];
  ursTypeNeed: URSDto['type'];
  projectMacroSuppliers: ProjectDto['providersMacro'];
  projectDetailedSuppliers: ProjectDto['providersDetailed'];
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
  ursTypeNeed,
  projectMacroSuppliers,
  projectDetailedSuppliers,
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
    updateStepMutation.mutate({
      ...values,
      supplierResponses: values.supplierResponses.map((s) => ({
        ...s,
        statut: s.answer !== '',
      })),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 bg-white rounded-lg p-4 gap-4 mt-2"
      >
        {supplierResponsesFieldArray.fields.length === 0 ? (
          <div className="text-gray-400">Aucun</div>
        ) : (
          supplierResponsesFieldArray.fields.map((field, index) => (
            <div key={field.id} className="col-span-2 gap-2">
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-500">{field.name}</span>
                <FormField
                  control={form.control}
                  name={`supplierResponses.${index}.statut`}
                  render={() => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={
                            form.watch(`supplierResponses.${index}.answer`) !==
                            ''
                          }
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
                      <FormLabel>
                        Standard, paramétré ou développement spécifique
                      </FormLabel>
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
                          <SelectItem value="parametrized">
                            Paramétré
                          </SelectItem>
                          <SelectItem value="specific">
                            Développement spécifique
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {['parametrized', 'specific'].includes(
                form.watch(`supplierResponses.${index}.type`)
              ) && (
                <div className="grid grid-cols-3 items-center gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name={`supplierResponses.${index}.customTmpsDev`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Temps de développement
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <InfoIcon size={16} />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>3h=0,5j et 1h=0,125j</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
                              onChange={(event) =>
                                field.onChange(+event.target.value)
                              }
                            />
                            <div className="absolute top-1/2 -translate-y-1/2 right-3 text-xs text-slate-500">
                              en jour
                            </div>
                          </div>
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
                        <FormLabel>réponse validée par AMOA</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          ))
        )}
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
                        {(ursTypeNeed === 'MACRO'
                          ? projectMacroSuppliers
                          : projectDetailedSuppliers
                        ).map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
  );
};

export default Step4_4;
