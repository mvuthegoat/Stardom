import React, { useState } from "react";

// Define the feedback structure
export interface Feedback {
  useCase: string;
  createFunRating: string;
  haveFunRating: string;
  improvements: string;
  email?: string; // Email is optional
}

// Props for the FeedbackForm component
interface FeedbackFormProps {
  onSubmit: (feedback: Feedback) => Promise<void>; // Expects a Feedback object
  onClose: () => void; // Function to handle closing the form
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  onClose,
}) => {
  // Initialize state with the Feedback type
  const [feedback, setFeedback] = useState<Feedback>({
    useCase: "",
    createFunRating: "",
    haveFunRating: "",
    improvements: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Track submission state

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(feedback); // Pass the feedback object
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4 text-gray-900">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Get 1 More Free Generation!
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Share your feedback to help us improve and get an additional free
          generation.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Use Case Input */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              What would you use this for?
            </label>
            <textarea
              className="w-full border rounded p-2 text-gray-900"
              placeholder="Create memes, explore memes, trade memes, for the vibes, etc"
              value={feedback.useCase}
              onChange={(e) =>
                setFeedback({ ...feedback, useCase: e.target.value })
              }
              required
            />
          </div>

          {/* Create Fun Rating */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              How easy was it to create memes using Create Fun?
            </label>
            <select
              className="w-full border rounded p-2 text-gray-900"
              value={feedback.createFunRating}
              onChange={(e) =>
                setFeedback({ ...feedback, createFunRating: e.target.value })
              }
              required
            >
              <option value="">Select...</option>
              <option value="very">Very useful</option>
              <option value="somewhat">Somewhat useful</option>
              <option value="not">Not useful</option>
              <option value="didn't use">Didn&#39;t use it</option>
            </select>
          </div>

          {/* Have Fun Rating */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              How satisfied are you with the discovery feed (Have Fun page)?
            </label>
            <select
              className="w-full border rounded p-2 text-gray-900"
              value={feedback.haveFunRating}
              onChange={(e) =>
                setFeedback({ ...feedback, haveFunRating: e.target.value })
              }
              required
            >
              <option value="">Select...</option>
              <option value="very">Very satisfied</option>
              <option value="somewhat">Somewhat satisfied</option>
              <option value="not">Not satisfied</option>
              <option value="didn't use">Didn&#39;t use it</option>
            </select>
          </div>

          {/* Improvements */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              What improvements would you like to see? What&#39;s not working well?
              😤
            </label>
            <textarea
              className="w-full border rounded p-2 text-gray-900"
              value={feedback.improvements}
              onChange={(e) =>
                setFeedback({ ...feedback, improvements: e.target.value })
              }
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900">
              Want early access to new features? 🎁 (optional)
            </label>
            <input
              type="email"
              placeholder="Your email"
              className="w-full border rounded p-2 text-gray-900"
              value={feedback.email}
              onChange={(e) =>
                setFeedback({ ...feedback, email: e.target.value })
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit & Get Generation"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border rounded px-4 hover:bg-gray-100 text-gray-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
