import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import axios from 'axios';
import type { RiskDto, URSDto } from 'backend-types';
import { Control, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { StepProps } from '~/components/URS/steps/all';
import { Button } from '~/components/ui/button';
import { v4 as uuid } from 'uuid';
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
import { Separator } from '~/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { TrashIcon } from 'lucide-react';
import { Checkbox } from '~/components/ui/checkbox';

type Props = StepProps & {
  risks: Array<RiskDto>;
};

const step6_7Schema = z.object({
  status: z.string(),
  risks: z.array(
    z.object({
      id: z.string(),
      impact: z.number().min(1).max(3),
      comment: z.string(),
      consequence: z.string(),
      deficiencyDescription: z.string(),
      riskClass: z.string(),
      riskResidueLevel: z.string(),
      actionPlan: z.object({
        id: z.string(),
        qp: z.boolean(),
        datamigration: z.boolean(),
        revueConfig: z.boolean(),
        documentation: z.boolean(),
        qiqo: z.boolean(),
      }),
      causes: z.array(
        z.object({
          id: z.string(),
          probability: z.number().min(1).max(3),
          type: z.string(),
        })
      ),
    })
  ),
});

const Step6_7 = ({ ursId, step, readonly, setReadonly, risks }: Props) => {
  const router = useRouter();
  const updateStepMutation = useMutation({
    mutationKey: ['updateStep', ursId, '6_7'],
    mutationFn: (values: z.infer<typeof step6_7Schema>) =>
      axios.put<URSDto>(`/urs/${ursId}/step/6_7`, values),
    onSuccess: () => {
      toast.success('Étape 6.7 mise à jour avec succès');
      setReadonly(true);
      router.invalidate();
    },
  });

  const form = useForm<z.infer<typeof step6_7Schema>>({
    resolver: zodResolver(step6_7Schema),
    defaultValues: { ...step, risks },
    disabled: readonly,
  });
  const risksFieldArray = useFieldArray({
    control: form.control,
    name: 'risks',
  });

  const cancel = () => {
    form.reset(step);
    setReadonly(true);
  };

  function onSubmit(values: z.infer<typeof step6_7Schema>) {
    updateStepMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid bg-white rounded-lg p-4 gap-4 mt-2"
      >
        {risksFieldArray.fields.length === 0 ? (
          <div className="text-gray-400">Aucun</div>
        ) : (
          risksFieldArray.fields.map((field, index) => (
            <div key={field.id} className="w-full">
              <Separator className="my-4" />
              <h3 className="font-semibold text-lg uppercase text-slate-500">
                Risque {index + 1}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name={`risks.${index}.deficiencyDescription`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description de la défaillance</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`risks.${index}.riskClass`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe de risque</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={field.disabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Bas</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="high">Haut</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`risks.${index}.consequence`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Conséquence</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`risks.${index}.impact`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          min={1}
                          max={3}
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
                  name={`risks.${index}.comment`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Commentaire</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`risks.${index}.riskResidueLevel`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau de risque résiduel</FormLabel>
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
                          <SelectItem value="low">Bas</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="high">Haut</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormLabel className="col-span-3">Plan d'action</FormLabel>
                <FormField
                  control={form.control}
                  name={`risks.${index}.actionPlan.qiqo`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormLabel>QI / QO</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`risks.${index}.actionPlan.documentation`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormLabel>Documentation</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`risks.${index}.actionPlan.datamigration`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormLabel>Data Migration</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`risks.${index}.actionPlan.revueConfig`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormLabel>Revue de configuration</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`risks.${index}.actionPlan.qp`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormLabel>QP</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Causes
                riskIndex={index}
                control={form.control}
                readonly={readonly}
              />
            </div>
          ))
        )}

        {!readonly && (
          <div className="mx-auto flex gap-2 items-center">
            {risksFieldArray.fields.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="destructive" size="sm">
                    Supprimer un risque
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {risksFieldArray.fields.map((field, index) => (
                    <DropdownMenuItem
                      key={field.id}
                      onClick={() => {
                        risksFieldArray.remove(index);
                      }}
                      className="flex items-center justify-between group"
                    >
                      Risque {index + 1}
                      <TrashIcon
                        size="16"
                        className="hidden group-hover:block text-red-500"
                      />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              type="button"
              onClick={() =>
                risksFieldArray.append({
                  id: uuid(),
                  deficiencyDescription: '',
                  riskClass: '',
                  consequence: '',
                  impact: 0,
                  comment: '',
                  riskResidueLevel: '',
                  actionPlan: {
                    id: uuid(),
                    qp: false,
                    datamigration: false,
                    revueConfig: false,
                    documentation: false,
                    qiqo: false,
                  },
                  causes: [],
                })
              }
              variant="secondary"
            >
              Ajouter un risque
            </Button>
          </div>
        )}

        {!readonly && (
          <div className="text-center flex items-center justify-center gap-4">
            <Button type="button" variant="secondary" onClick={cancel}>
              Annuler
            </Button>
            <Button type="submit">Valider</Button>
          </div>
        )}
        {step.updatedAt && (
          <div className="text-gray-300 uppercase text-sm">
            MAJ le {new Date(step.updatedAt).toLocaleDateString()} par{' '}
            {step.updatedBy}
          </div>
        )}
      </form>
    </Form>
  );
};

const Causes = ({
  riskIndex,
  control,
  readonly,
}: {
  riskIndex: number;
  control: Control<z.infer<typeof step6_7Schema>>;
  readonly?: boolean;
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `risks.${riskIndex}.causes`,
  });
  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-3 gap-2 px-4 mt-2">
          <div className="flex items-center col-span-3 gap-2 mt-2">
            <h5 className="col-span-3 text-slate-500 whitespace-nowrap">
              Cause {index + 1}
            </h5>
            <Separator className="my-4 w-10/12 mx-auto" />
            {!readonly && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                <TrashIcon size="16" />
              </Button>
            )}
          </div>
          <FormField
            control={control}
            name={`risks.${riskIndex}.causes.${index}.type`}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`risks.${riskIndex}.causes.${index}.probability`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probabilité</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    min={1}
                    max={3}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
      {!readonly && (
        <div className="text-center flex items-center justify-center gap-4 mt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ id: uuid(), type: '', probability: 1 })}
          >
            Ajouter une cause
          </Button>
        </div>
      )}
    </>
  );
};

export default Step6_7;
