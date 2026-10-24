'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import PageHeading from '../PageHeading';

const MAX_MESSAGE = 1000;

const FEEDBACK_TYPES = [
  { value: 'general', label: 'General feedback', description: 'Tell us what you think' },
  { value: 'bug', label: 'Something is broken', description: 'A page or button not working' },
  { value: 'feature', label: 'Feature idea', description: 'Something you wish we had' },
  { value: 'complaint', label: 'Complaint', description: 'A problem with an order or service' },
];

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactMe, setContactMe] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});

  const resetForm = () => {
    setFeedbackType('general');
    setSubject('');
    setMessage('');
    setContactMe(false);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!subject.trim()) nextErrors.subject = 'Add a short subject';
    if (message.trim().length < 10)
      nextErrors.message = 'Tell us a little more (at least 10 characters)';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <PageHeading title="Feedback" />
        <div className="rounded-xl glass px-6 py-12 text-center">
          <CheckCircle2 className="mx-auto size-12 text-green" aria-hidden="true" />
          <h2 className="mt-4 text-xl text-gray-900 dark:text-slate-100">
            Thanks for the feedback
          </h2>
          <p className="mt-2 text-gray-600 dark:text-slate-400">
            {contactMe
              ? 'Our team will get back to you within 2 working days.'
              : 'Our team reads every message and uses it to improve the store.'}
          </p>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setSubmitted(false);
            }}
            className="mt-6 h-11 rounded-lg border border-gray-300 dark:border-white/15 px-5 font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Send more feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeading
        title="Feedback"
        desc="Tell us what's working and what isn't. Need help with an order? Contact support instead."
      />

      <form onSubmit={handleSubmit} noValidate className="rounded-xl glass p-5 md:p-6">
        <fieldset>
          <legend className="text-sm font-medium text-gray-900 dark:text-slate-100">
            What is it about?
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {FEEDBACK_TYPES.map((type) => (
              <label
                key={type.value}
                className={cn(
                  'flex cursor-pointer rounded-lg border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
                  feedbackType === type.value
                    ? 'border-brand bg-brand-soft/60'
                    : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5',
                )}
              >
                <input
                  type="radio"
                  name="feedbackType"
                  value={type.value}
                  checked={feedbackType === type.value}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="sr-only"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {type.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-600 dark:text-slate-400">
                    {type.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <Label
            htmlFor="subject"
            className="text-sm font-medium text-gray-900 dark:text-slate-100"
          >
            Subject
          </Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="A short summary"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            className="mt-1.5 h-11"
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1.5 text-xs text-red">
              {errors.subject}
            </p>
          )}
        </div>

        <div className="mt-5">
          <Label
            htmlFor="message"
            className="text-sm font-medium text-gray-900 dark:text-slate-100"
          >
            Message
          </Label>
          <Textarea
            id="message"
            value={message}
            maxLength={MAX_MESSAGE}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What happened, and what did you expect?"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error message-count' : 'message-count'}
            className="mt-1.5 min-h-40"
          />
          <div className="mt-1.5 flex justify-between gap-4 text-xs">
            <span id="message-error" className="text-red">
              {errors.message}
            </span>
            <span id="message-count" className="tabular-nums text-gray-500 dark:text-slate-400">
              {message.length}/{MAX_MESSAGE}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Checkbox
            id="contact-me"
            checked={contactMe}
            onCheckedChange={(checked) => setContactMe(checked === true)}
            className="data-[state=checked]:border-brand data-[state=checked]:bg-brand"
          />
          <Label
            htmlFor="contact-me"
            className="cursor-pointer text-sm font-normal text-gray-700 dark:text-slate-300"
          >
            Contact me about this feedback
          </Label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-5 font-medium text-white transition-colors hover:bg-brand-hover"
          >
            <Send className="size-4" aria-hidden="true" />
            Send feedback
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="h-11 rounded-lg border border-gray-300 dark:border-white/15 px-5 font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Clear
          </button>
        </div>
      </form>

      <p className="mt-4 text-sm text-gray-600 dark:text-slate-400">
        Have a question instead? Read the{' '}
        <Link href="/faq" className="rounded font-medium text-brand hover:text-brand-hover">
          FAQ
        </Link>{' '}
        or{' '}
        <Link href="/contact" className="rounded font-medium text-brand hover:text-brand-hover">
          contact support
        </Link>
        .
      </p>
    </div>
  );
};

export default Feedback;
