import PdfDropzone from '@/components/PdfDropzone';

export default function Home() {
  return (
    <main className="w-full max-w-3xl flex flex-col items-center gap-10">
      <h1 className="text-3xl font-semibold">What can I help with?</h1>
      <PdfDropzone />
    </main>
  );
}
