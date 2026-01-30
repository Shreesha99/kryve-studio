'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PdfUploadFormProps {
  onSuccess: (data: { title: string; content: string }) => void;
  onCancel: () => void;
}

export function PdfUploadForm({ onSuccess, onCancel }: PdfUploadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ pdf: FileList }>();
  const { toast } = useToast();

  const handlePdfSubmit = async (data: { pdf: FileList }) => {
    const file = data.pdf[0];
    if (!file) return;

    setIsLoading(true);

    // Simulate PDF parsing
    await new Promise(res => setTimeout(res, 1500));

    const title = file.name.replace(/\.pdf$/i, '');
    const content = `<p>Content extracted from ${file.name}.</p><p>This is a placeholder. In a real implementation, a library like PDF.js would be used to parse the PDF file content and convert it into HTML.</p>`;

    toast({
      variant: 'success',
      title: 'PDF Processed',
      description: 'The post form has been pre-filled with the PDF content.',
    });

    onSuccess({ title, content });
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(handlePdfSubmit)}
      className="grid gap-4 py-4"
    >
      <div className="space-y-2">
        <Label htmlFor="pdf-upload">Select a PDF file</Label>
        <Input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          {...register('pdf', { required: 'Please select a PDF file.' })}
        />
        {errors.pdf && (
          <p className="mt-1 text-sm text-destructive">{errors.pdf.message}</p>
        )}
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileUp className="mr-2 h-4 w-4" />
          )}
          Create Post
        </Button>
      </div>
    </form>
  );
}
