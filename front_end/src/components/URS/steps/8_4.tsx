import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import axios from 'axios';
import type { AuditTrailDto, URSDto } from 'backend-types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { StepProps } from '~/components/URS/steps/all';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';

type Props = StepProps & {
  auditTrail: AuditTrailDto;
};

const step8_4Schema = z.object({
  status: z.string(),
  auditTrail: z.object({
    id: z.string(),
    consultation: z.boolean(),
    consultationComment: z.string(),
    revue: z.boolean(),
    revueComment: z.string(),
  }),
});

const Step8_4 = ({ ursId, step, readonly, setReadonly, auditTrail }: Props) => {
  const router = useRouter();
  const updateStepMutation = useMutation({
    mutationKey: ['updateStep', ursId, '8_4'],
    mutationFn: (values: z.infer<typeof step8_4Schema>) =>
      axios.put<URSDto>(`/urs/${ursId}/step/8_4`, values),
    onSuccess: () => {
      toast.success('Étape 8.4 mise à jour avec succès');
      setReadonly(true);
      router.invalidate();
    },
  });

  const form = useForm<z.infer<typeof step8_4Schema>>({
    resolver: zodResolver(step8_4Schema),
    defaultValues: { ...step, auditTrail },
    disabled: readonly,
  });

  const cancel = () => {
    form.reset(step);
    setReadonly(true);
  };

  function onSubmit(values: z.infer<typeof step8_4Schema>) {
    updateStepMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 bg-white rounded-lg p-4 gap-4 mt-2"
      >
        <FormField
          control={form.control}
          name="auditTrail.consultation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consultation de l’Audit Trail</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'true')}
                defaultValue={field.value ? 'true' : 'false'}
                disabled={field.disabled}
                value={field.value ? 'true' : 'false'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="false">Non</SelectItem>
                  <SelectItem value="true">Oui</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="auditTrail.revue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Revue de l’Audit Trail</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'true')}
                defaultValue={field.value ? 'true' : 'false'}
                disabled={field.disabled}
                value={field.value ? 'true' : 'false'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="false">Non</SelectItem>
                  <SelectItem value="true">Oui</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="auditTrail.consultationComment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Consultation de l’Audit Trail | Commentaires
              </FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="auditTrail.revueComment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Revue de l’Audit Trail | Commentaires</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

export default Step8_4;
