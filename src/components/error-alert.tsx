import { AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

interface ErrorAlertProps {
  errMsg?: string;
  className?: string;
}

export default function ErrorAlert(props: ErrorAlertProps) {
  const { errMsg, className } = props;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, [errMsg]);

  if (!visible) return null;

  const closeError = () => {
    setVisible(false);
  };

  return (
    <Alert variant="destructive" className={cn('max-h-1/3 w-auto overflow-auto', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="relative flex justify-between">
        <span className="font-bold">Error</span>
        <Button variant="ghost" className="absolute top-0 right-0 h-4 w-4" onClick={closeError}>
          <X />
        </Button>
      </AlertTitle>
      <AlertDescription>{errMsg}</AlertDescription>
    </Alert>
  );
}
