'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    {
      value: 'general',
      label: 'General Feedback',
      description: 'Share your thoughts about our platform',
    },
    { value: 'bug', label: 'Report a Bug', description: 'Report technical issues' },
    { value: 'feature', label: 'Feature Request', description: 'Suggest a new feature' },
    { value: 'complaint', label: 'Complaint', description: 'Report a service issue' },
    { value: 'suggestion', label: 'Suggestion', description: 'Help us improve' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[v0] Feedback submitted:', { feedbackType, subject, message });
    setSubmitted(true);
    setTimeout(() => {
      setFeedbackType('general');
      setSubject('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-28 pb-12">
        <div className="container mx-auto px-4 flex flex-col">
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Send Us Your Feedback</h1>
              <p className="text-gray-600 mt-2">
                We value your feedback and use it to improve our service
              </p>
            </div>

            {submitted ? (
              // Success Message
              <div className="bg-white rounded-lg border border-green-200 p-8 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle size={48} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-4">
                  We appreciate your feedback. Our team will review it shortly.
                </p>
                <p className="text-sm text-gray-500">Redirecting to feedback page...</p>
              </div>
            ) : (
              // Feedback Form
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg border border-gray-200 p-8"
              >
                {/* Feedback Type Selection */}
                <div className="mb-8">
                  <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                    Feedback Type
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {feedbackTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          feedbackType === type.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="feedbackType"
                          value={type.value}
                          checked={feedbackType === type.value}
                          onChange={(e) => setFeedbackType(e.target.value)}
                          className="sr-only"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{type.label}</h3>
                          <p className="text-gray-600 text-xs mt-1">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-6">
                  <Label htmlFor="subject" className="text-gray-900 font-semibold">
                    Subject
                  </Label>
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Briefly describe your feedback"
                    required
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Message */}
                <div className="mb-6">
                  <Label htmlFor="message" className="text-gray-900 font-semibold">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your feedback in detail..."
                    required
                    className="w-full mt-2 min-h-40"
                  />
                  <p className="text-gray-500 text-xs mt-2">{message.length}/1000 characters</p>
                </div>

                {/* Contact Option */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm text-gray-700">
                      I&apos;d like to be contacted regarding my feedback
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2">
                    <MessageSquare size={18} />
                    Send Feedback
                  </Button>
                  <Button type="reset" variant="outline" className="flex-1 bg-transparent">
                    Clear
                  </Button>
                </div>
              </form>
            )}

            {/* FAQ Section */}
            <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How long does it take to receive a response?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I track my feedback submission?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    If you provide contact information, we&apos;ll keep you updated on your feedback
                    status.
                  </p>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is my feedback kept confidential?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes, all feedback is treated confidentially and reviewed by our dedicated team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
