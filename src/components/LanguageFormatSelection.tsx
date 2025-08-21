import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LanguageFormatSelectionProps {
  onContinue: (language: string, format: string) => void;
  onClose: () => void;
}

export function LanguageFormatSelection({ onContinue, onClose }: LanguageFormatSelectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');

  const languages = [
    {
      name: 'HINDI',
      display: '🇮🇳 हिन्दी (Hindi)',
      formats: ['2D', 'DOLBY CINEMA 2D', 'ICE', 'IMAX 2D', '4DX']
    },
    {
      name: 'TELUGU', 
      display: '🇮🇳 తెలుగు (Telugu)',
      formats: ['2D']
    },
    {
      name: 'ENGLISH',
      display: '🇬🇧 English',
      formats: ['2D', 'IMAX 2D']
    }
  ];

  const handleFormatSelect = (language: string, format: string) => {
    setSelectedLanguage(language);
    setSelectedFormat(format);
  };

  const handleContinue = () => {
    if (selectedLanguage && selectedFormat) {
      onContinue(selectedLanguage, selectedFormat);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://m.media-amazon.com/images/M/MV5BNjY5OTg4NTYtZjVkZS00YTZmLWIwNDEtM2Y0ODQyMzM2NTJiXkEyXkFqcGc@._V1_.jpg"
              alt="WAR 2"
              className="w-12 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-booking-dark">WAR 2</h2>
              <h3 className="text-sm font-normal text-gray-600">Select language and format</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 pb-24">
          {languages.map((language) => (
            <div key={language.name} className="space-y-3">
              <h4 className="text-sm font-semibold text-booking-dark tracking-wide">
                {language.display}
              </h4>
              <div className="flex flex-wrap gap-2">
                {language.formats.map((format) => (
                  <button
                    key={`${language.name}-${format}`}
                    onClick={() => handleFormatSelect(language.name, format)}
                    className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                      selectedLanguage === language.name && selectedFormat === format
                        ? 'bg-booking-primary text-white border-booking-primary'
                        : ''
                    }`}
                    style={
                      selectedLanguage === language.name && selectedFormat === format
                        ? {}
                        : {
                            background: '#f0ffe5',
                            border: '1px solid #03c42633',
                            color: '#065f46'
                          }
                    }
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t shadow-lg">
          <div className="p-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedLanguage || !selectedFormat}
              className="w-full bg-booking-primary hover:bg-booking-primary/90 text-white min-h-[72px] py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex justify-between items-center w-full">
                <div className="text-left">
                  <div className="text-lg font-bold">
                    {selectedLanguage ? languages.find(l => l.name === selectedLanguage)?.display || 'Language' : 'Language'}
                  </div>
                  <div className="text-xs font-light">
                    {selectedFormat || 'FORMAT'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>Continue</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}