import { useRef } from "react";
import { Button } from "../ui/button";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGeminiFileUpload } from "../../actions/gemini";
import { useToken } from "../../lib/useClerkToken";

const ReceiptScanner = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { token } = useToken();
  const geminiUpload = useGeminiFileUpload(token as string);

  const handleReceiptScan = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    if (file) {
      geminiUpload.mutate(file, {
        onSuccess: (res) => {
          console.log("Uploaded successfully:", res);
        },
        onError: (err) => {
          console.error("Upload failed:", err);
        },
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full cursor-pointer h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={geminiUpload.isPending}
      >
        {geminiUpload.isPending ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ReceiptScanner;
