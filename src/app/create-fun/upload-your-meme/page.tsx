"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Image,
  Film,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { uploadFileToTemporaryS3 } from "@/utils/s3Utils";

interface FileWithPreview {
  file: File;
  preview: string;
  type: "image" | "video";
  objectKey?: string; // S3 object key after upload
}

const IMAGE_MAX_SIZE = 20 * 1024 * 1024; // 20MB
const VIDEO_MAX_SIZE = 200 * 1024 * 1024; // 200MB

export default function UploadMemePage() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<FileWithPreview | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meme_origin: "",
    crypto_address: "",
    dex_url: "",
  });
  const [formErrors, setFormErrors] = useState<
    Record<string, string | undefined>
  >({});

  const getOrCreateUID = (): string => {
    let uid = localStorage.getItem("userUID");
    if (!uid) {
      uid = crypto.randomUUID();
      localStorage.setItem("userUID", uid);
    }
    return uid;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const fileType = file.type.startsWith("image/") ? "image" : "video";

    if (fileType === "image" && file.size > IMAGE_MAX_SIZE) {
      setError("Image files must be less than 20MB");
      return;
    }
    if (fileType === "video" && file.size > VIDEO_MAX_SIZE) {
      setError("Video files must be less than 200MB");
      return;
    }

    const preview = URL.createObjectURL(file);

    try {
      // Upload to temporary S3 bucket
      const tempData = await uploadFileToTemporaryS3(file);

      setUploadedFile({
        file,
        preview,
        type: fileType,
        objectKey: tempData.objectKey,
      });
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error uploading to S3:", err);
      setError("Failed to upload file. Please try again.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/gif": [".gif"],
        "image/webp": [".webp"],
        "video/mp4": [".mp4"],
      },
      maxFiles: 1,
      maxSize: VIDEO_MAX_SIZE, // Set to larger size, we'll handle specific validations in onDrop
      validator: (file) => {
        if (file.type.startsWith("image/") && file.size > IMAGE_MAX_SIZE) {
          return {
            code: "size-too-large",
            message: "Image size must be less than 20MB",
          };
        }
        if (file.type.startsWith("video/") && file.size > VIDEO_MAX_SIZE) {
          return {
            code: "size-too-large",
            message: "Video size must be less than 200MB",
          };
        }
        return null;
      },
    });

  const renderFileSpecs = () => {
    return (
      <div className="mt-2 text-sm text-gray-500">
        <p className="font-medium">Accepted files:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Images (.jpg, .png, .gif, .webp) - Up to 20MB</li>
          <li>Videos (.mp4) - Up to 200MB</li>
        </ul>
      </div>
    );
  };

  const removeFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.preview);
      setUploadedFile(null);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.meme_origin.trim())
      errors.meme_origin = "Meme origin is required";
    if (!uploadedFile?.objectKey) errors.file = "Please upload a file";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm() || !uploadedFile?.objectKey) return;

    setIsLoading(true);
    setError("");

    try {
      const creator_id = getOrCreateUID();

      const publishData = {
        title: formData.title,
        description: formData.description,
        meme_origin: formData.meme_origin,
        crypto_address: formData.crypto_address || "",
        dex_chart: formData.dex_url || "",
        creator_id,
        likes: 0,
        // Set the appropriate keys based on file type
        video_key:
          uploadedFile.type === "video" ? uploadedFile.objectKey : null,
        original_image_key:
          uploadedFile.type === "image" ? uploadedFile.objectKey : null,
      };

      console.log(publishData);

      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publishData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to publish content");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/have-fun");
      }, 2000);
    } catch (err) {
      console.error("Error publishing:", err);
      setError(
        err instanceof Error ? err.message : "Failed to publish content"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="flex gap-8 p-6 max-w-7xl mx-auto">
        {/* Left side - Upload box */}
        <div className="w-1/2">
          <div
            {...getRootProps()}
            className={`
              relative h-[500px] border-2 border-dashed rounded-lg
              flex flex-col items-center justify-center
              cursor-pointer transition-all overflow-hidden
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
              ${uploadedFile ? "p-4" : "p-8"}
            `}
          >
            <input {...getInputProps()} />

            {uploadedFile ? (
              <div className="relative w-full h-full group">
                {uploadedFile.type === "image" ? (
                  <img
                    src={uploadedFile.preview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <video
                    src={uploadedFile.preview}
                    className="w-full h-full object-contain rounded"
                    controls
                  />
                )}

                {/* Overlay with remove button */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-center space-x-4 mb-4">
                  <Image className="h-8 w-8 text-gray-400" />
                  <Film className="h-8 w-8 text-gray-400" />
                </div>
                <p className="mt-4 text-lg font-semibold">
                  {isDragActive
                    ? "Drop to upload"
                    : "Drag and drop or click to upload"}
                </p>
                {renderFileSpecs()}
              </div>
            )}
          </div>
          {/* Error display */}
          {(error || fileRejections.length > 0) && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || fileRejections[0]?.errors[0]?.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right side - Form */}
        <div className="w-1/2 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-600">
                Your content has been uploaded successfully. Redirecting...
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Input
              name="title"
              placeholder="Add a title *"
              value={formData.title}
              onChange={handleInputChange}
              className={formErrors.title ? "border-red-500" : ""}
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
            )}
          </div>

          <div>
            <Textarea
              name="description"
              placeholder="Add a detailed description *"
              value={formData.description}
              onChange={handleInputChange}
              className={`min-h-[100px] ${
                formErrors.description ? "border-red-500" : ""
              }`}
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.description}
              </p>
            )}
          </div>

          <div>
            <Input
              name="meme_origin"
              placeholder="Meme origin (ticker: DOGE, etc) *"
              value={formData.meme_origin}
              onChange={handleInputChange}
              className={formErrors.meme_origin ? "border-red-500" : ""}
            />
            {formErrors.meme_origin && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.meme_origin}
              </p>
            )}
          </div>

          <Input
            name="crypto_address"
            placeholder="Crypto Address"
            value={formData.crypto_address}
            onChange={handleInputChange}
          />

          <Input
            name="dex_url"
            placeholder="DEX URL"
            value={formData.dex_url}
            onChange={handleInputChange}
          />

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </main>
  );
}
