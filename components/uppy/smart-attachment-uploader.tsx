import { useState, useRef, useEffect } from "react";
import UppyAttachmentUploader, {
  type UppyAttachmentUploaderRef,
} from "./uppy-attachment-uploader";
import { Button } from "@/components/ui/button";
import { X, Pencil, FileText } from "lucide-react";
import { getCdnUrl } from "@/lib/utils";
import { toast } from "sonner";

interface AttachmentSource {
  id: string;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
}

interface SmartAttachmentUploaderProps {
  currentFile?: AttachmentSource;
  selectedFromGallery?: AttachmentSource;
  onUploadComplete?: (data: {
    id: string;
    url: string;
    name: string;
    size: number;
    mime_type: string;
  }) => void;
  onRemove?: () => void;
  onRevertWithoutId?: () => void;
  onGalleryOpen?: () => void;
  maxFiles?: number;
  maxSize?: number;
  instantUpload?: boolean;
  allowCrop?: boolean;
  disabled?: boolean;
  fileTypes?: "images" | "pdf" | "both";
  cropWidth?: number;
  cropHeight?: number;
  rounded?: boolean;
}

const isImage = (mimeType?: string) => !!mimeType?.startsWith("image/");

export default function SmartAttachmentUploader({
  currentFile,
  selectedFromGallery,
  onUploadComplete,
  onRemove,
  onRevertWithoutId,
  onGalleryOpen,
  maxFiles = 1,
  maxSize = 10,
  instantUpload = true,
  allowCrop = false,
  disabled = false,
  fileTypes = "both",
  cropWidth,
  cropHeight,
  rounded = false,
}: SmartAttachmentUploaderProps) {
  const [replacing, setReplacing] = useState(false);
  const uploaderRef = useRef<UppyAttachmentUploaderRef>(null);

  const previewFile = selectedFromGallery ?? currentFile;

  useEffect(() => {
    if (selectedFromGallery) {
      uploaderRef.current?.clear();
      setReplacing(false);
    }
  }, [selectedFromGallery]);

  const handleCancelReplace = () => {
    uploaderRef.current?.clear();
    setReplacing(false);
  };

  const handleUploadComplete: typeof onUploadComplete = (data) => {
    onUploadComplete?.(data);
    setReplacing(false);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      toast.error("Remove Failed", {
        description: "Remove handler not provided",
      });
    }
  };

  const uploaderNode = (
    <UppyAttachmentUploader
      ref={uploaderRef}
      maxFiles={maxFiles}
      maxSize={maxSize}
      fileTypes={fileTypes}
      instantUpload={instantUpload}
      allowCrop={allowCrop}
      disabled={disabled}
      onUploadComplete={handleUploadComplete}
      onRevertWithoutId={onRevertWithoutId}
      cropWidth={cropWidth}
      cropHeight={cropHeight}
      rounded={rounded}
    />
  );

  if (!previewFile && !replacing) {
    return (
      <div className="flex flex-col gap-2">
        {uploaderNode}
        {onGalleryOpen && (
          <Button
            type="button"
            className="w-max"
            onClick={onGalleryOpen}
            disabled={disabled}
          >
            Add from Gallery
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {previewFile && !replacing && (
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          {isImage(previewFile.mime_type) ? (
            <div className="w-full h-56 bg-muted flex items-center justify-center">
              <img
                src={
                  previewFile.url.startsWith("http")
                    ? previewFile.url
                    : getCdnUrl() + "/" + previewFile.url
                }
                alt={previewFile.filename}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-24 bg-muted flex items-center justify-center gap-3 px-4">
              <FileText className="w-10 h-10 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {previewFile.filename}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border bg-muted/50">
            <span className="text-xs text-muted-foreground truncate">
              {previewFile.filename} —{" "}
              {(previewFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
            <div className="flex gap-1 shrink-0">
              <Button
                type="button"
                className="h-7 px-2 gap-1 text-xs"
                onClick={() => setReplacing(true)}
                disabled={disabled}
              >
                <Pencil className="w-3 h-3" />
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="h-7 px-2 gap-1 text-xs"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="w-3 h-3" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {replacing && (
        <div className="flex flex-col gap-2">
          {uploaderNode}
          {onGalleryOpen && (
            <Button
              type="button"
              className="w-max"
              onClick={onGalleryOpen}
              disabled={disabled}
            >
              Add from Gallery
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-max p-2"
            onClick={handleCancelReplace}
          >
            Cancel Replacement
          </Button>
        </div>
      )}
    </div>
  );
}
