import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

const loginFormSchema = z.object({
  email: z.string().email(),
});

const LoginPage = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
    },
  });
  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (values: z.infer<typeof loginFormSchema>) =>
      axios.post<z.infer<typeof loginFormSchema>>('/auth/login', values),
    onSuccess: () => {
      toast.success(
        'Un lien magique, vous permettant de vous connecter, a été envoyé à votre adresse email.'
      );
    },
    onError: (error) => {
      console.log(error);
      if (
        'response' in error &&
        (error.response as { data: { status: number } })?.data?.status === 404
      ) {
        toast.error("Vous n'êtes pas enregistré dans notre base de données.");
        return;
      }
      toast.error('Une erreur est survenue.');
    },
  });

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    loginMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white rounded-lg gap-4 max-w-lg w-full p-4 border grid"
      >
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
        <Button type="submit" className="mt-2 ml-auto">
          Se connecter
        </Button>
      </form>
    </Form>
  );
};

export default LoginPage;
