'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateNotificationText, GenerateNotificationTextInput, GenerateNotificationTextOutput } from '@/ai/flows/notification-text-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Clipboard, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  notificationType: z.string().min(1, 'Tipe notifikasi harus dipilih.'),
  additionalContext: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

async function generateAction(input: GenerateNotificationTextInput): Promise<{ success: boolean; data?: GenerateNotificationTextOutput, error?: string }> {
  'use server';
  try {
    const result = await generateNotificationText(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Gagal menghasilkan teks notifikasi. Silakan coba lagi.' };
  }
}

export default function NotificationGenerator() {
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationType: '',
      additionalContext: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedText('');
    const result = await generateAction(values);
    setIsLoading(false);

    if (result.success && result.data) {
      setGeneratedText(result.data.notificationText);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Input Data</CardTitle>
          <CardDescription>Pilih tipe notifikasi dan berikan konteks tambahan jika perlu.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notificationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Notifikasi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe notifikasi..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pickup scheduled">Penjemputan Dijadwalkan</SelectItem>
                        <SelectItem value="pickup completed">Penjemputan Selesai</SelectItem>
                        <SelectItem value="account created">Akun Dibuat</SelectItem>
                        <SelectItem value="savings updated">Saldo Bertambah</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konteks Tambahan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Jadwal diundur karena hujan, bonus poin untuk nasabah baru, dll."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="mr-2 h-4 w-4" />
                )}
                Hasilkan Teks
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Hasil Teks Notifikasi</CardTitle>
          <CardDescription>Teks yang dihasilkan oleh AI akan muncul di sini.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="relative h-full min-h-[200px] w-full rounded-md border bg-muted/50 p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <p className="text-sm">{generatedText || '...'}</p>
            )}
            {generatedText && (
               <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Periksa kembali teks sebelum digunakan.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
