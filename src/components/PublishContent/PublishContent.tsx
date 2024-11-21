import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";

interface PublishContentProps {
  videoObjectKey: string | null;
  imageObjectKey: string | null;
  description: string | undefined;
  isDisabled: boolean;
}

interface FormData {
  title: string;
  meme_origin: string;
  crypto_address: string;
  dex_chart: string;
}

interface FormErrors {
  title?: string;
  meme_origin?: string;
  crypto_address?: string;
}

const PublishContent: React.FC<PublishContentProps> = ({
  videoObjectKey,
  imageObjectKey,
  description,
  isDisabled,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    title: "",
    meme_origin: "",
    crypto_address: "",
    dex_chart: "",
  });

  const getOrCreateUID = (): string => {
    let uid = localStorage.getItem("userUID");
    if (!uid) {
      uid = crypto.randomUUID();
      localStorage.setItem("userUID", uid);
    }
    return uid;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being edited
    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!formData.meme_origin.trim()) {
      errors.meme_origin = "Meme origin is required";
      isValid = false;
    }

    // if (!formData.crypto_address.trim()) {
    //   errors.crypto_address = "Crypto address is required";
    //   isValid = false;
    // }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const creator_id = getOrCreateUID();

      const videoData = {
        ...formData,
        video_key: videoObjectKey,
        original_image_key: imageObjectKey,
        description: description,
        creator_id,
        likes: 0,
      };

      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to publish video");
      }

      setIsSuccess(true);

      setTimeout(() => {
        setIsOpen(false);
        router.push("/have-fun");
      }, 2000);
    } catch (error) {
      console.error("Error uploading video:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload video"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isDisabled}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Publish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl">
        {isSuccess ? (
          <div className="p-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-600">
                Your video has been published successfully. Redirecting to home
                page...
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Share Your Creation
              </DialogTitle>
            </DialogHeader>

            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 mt-4">
              <div>
                <Input
                  name="title"
                  placeholder="Give your video a catchy title *"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.title ? "border-red-500" : "border-gray-200"
                  }`}
                  value={formData.title}
                  onChange={handleInputChange}
                />
                {formErrors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div>
                <Input
                  name="meme_origin"
                  placeholder="Meme origin (ticker: DOGE, etc) *"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.meme_origin
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  value={formData.meme_origin}
                  onChange={handleInputChange}
                />
                {formErrors.meme_origin && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.meme_origin}
                  </p>
                )}
              </div>

              <div>
                <Input
                  name="crypto_address"
                  placeholder="Crypto Address"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.crypto_address
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  value={formData.crypto_address}
                  onChange={handleInputChange}
                />
                {/* {formErrors.crypto_address && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.crypto_address}
                  </p>
                )} */}
              </div>

              <div>
                <Input
                  name="dex_chart"
                  placeholder="DEX chart URL (optional)"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.dex_chart}
                  onChange={handleInputChange}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Publishing..." : "Publish Video"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PublishContent;
