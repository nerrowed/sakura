import NotificationGenerator from './notification-generator';

export default function NotificationGeneratorPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline">Generator Teks Notifikasi</h1>
        <p className="text-muted-foreground">Buat teks notifikasi untuk pengguna dengan bantuan AI.</p>
      </header>
      <NotificationGenerator />
    </div>
  );
}
