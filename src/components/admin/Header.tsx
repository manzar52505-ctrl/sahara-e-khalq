import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-10">
      <h1 className="text-2xl font-bold text-primary">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-primary">Welcome, Admin</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent font-bold">
          {user?.email?.[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
