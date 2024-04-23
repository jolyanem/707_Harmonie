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
import { Separator } from '~/components/ui/separator';
import { Textarea } from '~/components/ui/textarea';
import { useState } from 'react';

type Props = StepProps & {
  risks: Array<RiskDto>;
};

const step8_2Schema = z.object({
  status: z.string(),
  risks: z.array(
    z.object({
      id: z.string(),
      tests: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          documentation: z.string(),
          comments: z.string(),
        })
      ),
    })
  ),
});

const Step8_2 = ({ ursId, step, readonly, setReadonly, risks }: Props) => {
  const router = useRouter();
  const updateStepMutation = useMutation({
    mutationKey: ['updateStep', ursId, '8_2'],
    mutationFn: (values: z.infer<typeof step8_2Schema>) =>
      axios.put<URSDto>(`/urs/${ursId}/step/8_2`, values),
    onSuccess: () => {
      toast.success('Étape 8.2 mise à jour avec succès');
      setReadonly(true);
      router.invalidate();
    },
  });

  const form = useForm<z.infer<typeof step8_2Schema>>({
    resolver: zodResolver(step8_2Schema),
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

  function onSubmit(values: z.infer<typeof step8_2Schema>) {
    updateStepMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 bg-white rounded-lg p-4 gap-4 mt-2"
      >
        {risksFieldArray.fields.length === 0 ? (
          <div className="text-gray-400">Aucun</div>
        ) : (
          risksFieldArray.fields.map((field, index) => (
            <div key={field.id} className="w-full col-span-2">
              <Separator className="my-4" />
              <h3 className="font-semibold text-lg uppercase text-slate-500">
                Risque {index + 1}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <FormItem className="col-span-2">
                  <FormLabel>Description de la défaillance</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      value={risks[index]?.deficiencyDescription}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormItem className="col-span-2">
                  <FormLabel>Conséquence</FormLabel>
                  <FormControl>
                    <Input disabled value={risks[index].consequence} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              <Tests
                riskIndex={index}
                control={form.control}
                readonly={readonly}
              />
            </div>
          ))
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

const Tests = ({
  riskIndex,
  control,
  readonly,
}: {
  riskIndex: number;
  control: Control<z.infer<typeof step8_2Schema>>;
  readonly?: boolean;
}) => {
  const [newTestName, setNewTestName] = useState('');
  const [isEditTestDialog, setIsEditTestDialog] = useState(-1);
  const [isAddTestDialogOpen, setIsAddTestDialogOpen] = useState(false);
  const { fields, remove, append } = useFieldArray({
    control,
    name: `risks.${riskIndex}.tests`,
  });
  return (
    <>
      <h5 className="col-span-3 text-slate-500 mt-4">Tests correspondants</h5>
      {fields.length === 0 && (
        <div className="opacity-50 italic">Aucun tests pour ce risque</div>
      )}
      <div className="flex items-center justify-start gap-2">
        {fields.map((field, index) => (
          <div key={field.id}>
            <Dialog
              open={isEditTestDialog === index}
              onOpenChange={(v) =>
                v ? setIsEditTestDialog(index) : setIsEditTestDialog(-1)
              }
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="text-xs bg-slate-900 rounded-md"
                >
                  {field.name}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {readonly ? '' : 'Edition : '}
                    {field.name}
                  </DialogTitle>
                </DialogHeader>
                <FormField
                  control={control}
                  name={`risks.${riskIndex}.tests.${index}.documentation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documentation</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`risks.${riskIndex}.tests.${index}.comments`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commentaires</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {readonly ? (
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditTestDialog(-1)}
                    >
                      Fermer
                    </Button>
                  </DialogFooter>
                ) : (
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setIsEditTestDialog(-1);
                        remove(index);
                      }}
                    >
                      Supprimer
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditTestDialog(-1)}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setIsEditTestDialog(-1)}
                    >
                      Valider
                    </Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
      {!readonly && (
        <div className="w-full flex justify-center">
          <Dialog
            open={isAddTestDialogOpen}
            onOpenChange={setIsAddTestDialogOpen}
          >
            <DialogTrigger asChild>
              <Button type="button" variant="secondary" size="sm">
                Ajouter un test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un test</DialogTitle>
              </DialogHeader>
              <FormItem>
                <FormLabel>Nom du test</FormLabel>
                <FormControl>
                  <Input
                    value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddTestDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    append({
                      id: uuid(),
                      name: newTestName,
                      documentation: '',
                      comments: '',
                    });
                    setNewTestName('');
                    setIsAddTestDialogOpen(false);
                  }}
                >
                  Valider
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default Step8_2;
