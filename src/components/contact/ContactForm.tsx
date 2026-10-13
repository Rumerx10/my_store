'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const contactSchema = yup.object({
  name: yup.string().trim().required('Enter your name'),
  email: yup.string().trim().required('Enter your email').email('Enter a valid email address'),
  message: yup
    .string()
    .trim()
    .required('Write your message')
    .min(10, 'Add a little more detail so we can help'),
});

type ContactFormData = yup.InferType<typeof contactSchema>;

// There is no backend yet, so submitting only confirms and clears the form.
const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = () => {
    reset();
    toast.success('Message sent. We reply within one working day.');
  };

  const invalid = (name: keyof ContactFormData) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
  });

  const errorText = (name: keyof ContactFormData) =>
    errors[name] && (
      <p id={`contact-${name}-error`} className="text-sm text-red">
        {errors[name]?.message}
      </p>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" autoComplete="name" {...register('name')} {...invalid('name')} />
          {errorText('name')}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            {...register('email')}
            {...invalid('email')}
          />
          {errorText('email')}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={6} {...register('message')} {...invalid('message')} />
        {errorText('message')}
      </div>
      <button
        type="submit"
        className="h-11 w-full rounded-lg bg-brand px-6 text-sm font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98] sm:w-auto"
      >
        Send message
      </button>
    </form>
  );
};

export default ContactForm;
