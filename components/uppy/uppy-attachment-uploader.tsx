// src/components/uploaders/uppy-attachment-uploader.tsx
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/react/dashboard";
import AwsS3 from "@uppy/aws-s3";
import ImageEditor from "@uppy/image-editor";
import "@uppy/core/css/style.min.css";
import "@uppy/react/css/style.css";
import "@uppy/dashboard/css/style.min.css";
import "@uppy/image-editor/css/style.min.css";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { AttachmentSource } from "@/types";

export interface UppyAttachmentUploaderRef {
  clear: () => void;
}

export type AttachmentFileType = "images" | "pdf" | "both";

export interface UppyAttachmentUploaderProps {
  maxFiles?: number;
  fileTypes?: AttachmentFileType;
  onUploadComplete?: (data: {
    id: string;
    url: string;
    name: string;
    size: number;
    mime_type: string;
  }) => void;
  instantUpload?: boolean;
  allowCrop?: boolean;
  onRevertWithoutId?: () => void;
  onInitialRemove?: () => void;
  containerStyle?: string;
  maxSize?: number;
  initialFiles?: AttachmentSource[];
  disabled?: boolean;
  id?: string;
  theme?: "light" | "dark" | "auto";
  /** Custom crop width */
  cropWidth?: number;
  /** Custom crop height */
  cropHeight?: number;
  /** Make crop circular */
  rounded?: boolean;
}

const FILE_TYPE_CONFIG: Record<
  AttachmentFileType,
  { mimeTypes: string[]; label: string }
> = {
  images: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    label: "images (JPEG, PNG, WEBP)",
  },
  pdf: {
    mimeTypes: ["application/pdf"],
    label: "PDF files",
  },
  both: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
    label: "images and PDF files",
  },
};

const UppyAttachmentUploader = forwardRef<
  UppyAttachmentUploaderRef,
  UppyAttachmentUploaderProps
>(
  (
    {
      maxFiles = 5,
      fileTypes = "both",
      onUploadComplete,
      onRevertWithoutId,
      maxSize = 10,
      disabled = false,
      instantUpload = false,
      allowCrop = false,
      theme = "auto",
      cropWidth,
      cropHeight,
      rounded = false,
    },
    ref,
  ) => {
    const { resolvedTheme } = useTheme();
    const onUploadCompleteRef = useRef(onUploadComplete);
    const onRevertWithoutIdRef = useRef(onRevertWithoutId);

    useEffect(() => {
      onUploadCompleteRef.current = onUploadComplete;
    }, [onUploadComplete]);

    useEffect(() => {
      onRevertWithoutIdRef.current = onRevertWithoutId;
    }, [onRevertWithoutId]);

    // Determine Uppy theme based on app theme
    const uppyTheme = theme === "auto" ? resolvedTheme || "light" : theme;

    const cropThenUpload = instantUpload && allowCrop;
    const hasCustomDimensions = cropWidth && cropHeight;
    const { mimeTypes, label } = FILE_TYPE_CONFIG[fileTypes];

    const [uppy] = useState(() => {
      const instance = new Uppy({
        restrictions: {
          maxNumberOfFiles: maxFiles,
          allowedFileTypes: mimeTypes,
          maxFileSize: maxSize * 1024 * 1024,
        },
        autoProceed: cropThenUpload ? false : instantUpload,
        debug: false,
      })
        .use(ImageEditor, {
          quality: 0.8,
          cropperOptions: {
            aspectRatio: hasCustomDimensions
              ? rounded
                ? 1
                : cropWidth! / cropHeight!
              : NaN,
            viewMode: 1,
            background: false,
            autoCropArea: 1,
            responsive: true,
            preview: `.uppy-ImageEditor-preview`,
          },
          actions: {
            revert: true,
            rotate: true,
            flip: true,
            zoomIn: true,
            zoomOut: true,
          },
        })
        .use(AwsS3, {
          shouldUseMultipart: () => false,
          getUploadParameters: async (file) => {
            try {
              const response = await apiFetch.post<{
                url: string;
                key: string;
              }>("/uploads/presigned-url/customer", {
                contentType: file.type,
                filename: file.name,
                size: file.size,
              });

              instance.setFileMeta(file.id, { key: response.key });

              return {
                method: "PUT" as const,
                url: response.url,
                fields: {},
                headers: { "Content-Type": file.type },
              };
            } catch (error: any) {
              toast.error("Upload failed", {
                description: error.message || "Failed to get upload URL",
              });
              throw error;
            }
          },
          createMultipartUpload: async (): Promise<{
            uploadId: string;
            key: string;
          }> => {
            throw new Error("Multipart not supported");
          },
          listParts: async (): Promise<
            { PartNumber: number; ETag: string }[]
          > => {
            throw new Error("Multipart not supported");
          },
          abortMultipartUpload: async (): Promise<void> => {
            throw new Error("Multipart not supported");
          },
          completeMultipartUpload: async (): Promise<{
            location?: string;
          }> => {
            throw new Error("Multipart not supported");
          },
          signPart: async (): Promise<{ url: string }> => {
            throw new Error("Multipart not supported");
          },
          retryDelays: [0, 1000, 3000, 5000],
        })
        .on("upload-success", async (file, _response) => {
          if (!file) return;
          const key = file.meta?.key as string;
          if (!key) return;

          try {
            const confirmed = await apiFetch.post<{
              id: string;
              url: string;
              filename: string;
              mime_type: string;
              size: number;
            }>("/uploads/confirm/customer", {
              key,
              filename: file.name,
              mimeType: file.type,
              size: file.size,
            });

            onUploadCompleteRef.current?.({
              id: confirmed.id,
              url: confirmed.url,
              name: file.name ?? "",
              size: file.size ?? 0,
              mime_type: file.type ?? "",
            });
          } catch (error: any) {
            toast.error("Confirmation failed", {
              description: error.message || "Failed to confirm upload",
            });
          }
        })
        .on("file-removed", (_file) => {
          onRevertWithoutIdRef.current?.();
        })
        .on("upload-error", (_file, error) => {
          toast.error("Upload failed", {
            description: error?.message || "Failed to upload file",
          });
        });

      if (cropThenUpload) {
        instance.on("file-editor:complete", () => {
          instance.upload();
        });
        instance.on("file-editor:cancel", (file) => {
          if (file) instance.removeFile(file.id);
        });
      }

      return instance;
    });

    useImperativeHandle(ref, () => ({
      clear: () => uppy?.clear(),
    }));

    // Inject cropper styles for custom dimensions or rounded crop
    useEffect(() => {
      if (!hasCustomDimensions && !rounded) return;

      const styleId = "uppy-attachment-crop-style";
      let style = document.getElementById(styleId);

      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }

      if (rounded && hasCustomDimensions) {
        style.textContent = `
          .cropper-view-box,
          .cropper-face {
            border-radius: 50% !important;
          }
          .cropper-view-box {
            outline: 9999px solid rgba(0,0,0,.5);
          }
          .uppy-ImageEditor-preview {
            width: ${Math.min(cropWidth!, cropHeight!)}px !important;
            height: ${Math.min(cropWidth!, cropHeight!)}px !important;
            border-radius: 50% !important;
            overflow: hidden !important;
          }
          .uppy-ImageEditor-preview img {
            border-radius: 50% !important;
          }
        `;
      } else if (rounded) {
        style.textContent = `
          .cropper-view-box,
          .cropper-face {
            border-radius: 50% !important;
          }
          .cropper-view-box {
            outline: 9999px solid rgba(0,0,0,.5);
          }
          .uppy-ImageEditor-preview {
            border-radius: 50% !important;
            overflow: hidden !important;
          }
          .uppy-ImageEditor-preview img {
            border-radius: 50% !important;
          }
        `;
      } else if (hasCustomDimensions) {
        style.textContent = `
          .cropper-view-box {
            outline: 9999px solid rgba(0,0,0,.5);
          }
          .uppy-ImageEditor-preview {
            width: ${cropWidth}px !important;
            height: ${cropHeight}px !important;
            overflow: hidden !important;
          }
        `;
      }

      return () => {
        const existingStyle = document.getElementById(styleId);
        if (existingStyle && document.head.contains(existingStyle)) {
          document.head.removeChild(existingStyle);
        }
      };
    }, [cropWidth, cropHeight, rounded, hasCustomDimensions]);

    const note = `Allows ${label} up to ${maxSize}MB${
      hasCustomDimensions ? ` | Preferred size: ${cropWidth}×${cropHeight}` : ""
    }`;

    return (
      <div
        className="flex w-full justify-center"
        style={{ pointerEvents: disabled ? "none" : "auto" }}
      >
        <Dashboard
          className="w-full mx-auto"
          uppy={uppy}
          theme={uppyTheme === "dark" ? "dark" : "light"}
          proudlyDisplayPoweredByUppy={false}
          note={note}
          plugins={["ImageEditor"]}
          height={600}
          autoOpen={cropThenUpload ? "imageEditor" : null}
          hideUploadButton={cropThenUpload}
        />
      </div>
    );
  },
);

UppyAttachmentUploader.displayName = "UppyAttachmentUploader";
export default UppyAttachmentUploader;
