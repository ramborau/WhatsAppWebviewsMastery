import { useEffect } from 'react';

interface TermsConditionsProps {
  onAccept: () => void;
  onCancel: () => void;
}

export function TermsConditions({ onAccept, onCancel }: TermsConditionsProps) {
  // Auto-accept terms immediately
  useEffect(() => {
    onAccept();
  }, [onAccept]);

  return null; // Don't render anything
}