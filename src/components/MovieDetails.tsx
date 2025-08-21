import { Star, Calendar, Clock, Users, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CastSection } from './CastSection';

interface MovieDetailsProps {
  onBookTickets: () => void;
}

export function MovieDetails({ onBookTickets }: MovieDetailsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-booking-light to-background">
      {/* Movie Poster & Header */}
      <div className="relative">
        <img 
          src="https://api.epixcinemas.com/uploads/moviesThumbnail/contentMinified/1750339280767-355x500.jpg"
          alt="WAR 2"
          className="w-full h-96 object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
        
        {/* Movie Poster */}
        <div className="absolute bottom-4 left-4">
          <img 
            src="https://m.media-amazon.com/images/M/MV5BNjY5OTg4NTYtZjVkZS00YTZmLWIwNDEtM2Y0ODQyMzM2NTJiXkEyXkFqcGc@._V1_.jpg"
            alt="WAR 2 Poster"
            className="object-cover rounded-lg shadow-lg"
            style={{ width: '210px', height: '300px' }}
          />
        </div>
        
        <div className="absolute bottom-4 left-60 right-4 text-white">
          <h1 className="text-3xl font-bold mb-2">WAR 2</h1>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-semibold">8/10</span>
            <span className="text-sm opacity-90">(135.2K Votes)</span>
          </div>
          
          {/* Story Section */}
          <div className="mt-3">
            <h3 className="text-sm font-semibold mb-2 text-white opacity-85">Story</h3>
            <p className="text-sm text-white opacity-85 leading-relaxed">
              Years ago Agent Kabir went rogue. Became India's greatest villain ever. But this time, as he descends...
              <span className="text-booking-primary cursor-pointer"> more</span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Movie Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-booking-primary" />
            <span className="text-sm">2h 53m</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-booking-primary" />
            <span className="text-sm">14 Aug, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-booking-primary" />
            <span className="text-sm">UA16+</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-booking-primary" />
            <span className="text-xs">Action, Thriller</span>
          </div>
        </div>

        {/* Languages */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-booking-dark">Languages</h3>
          <div style={{fontFamily: 'Inter, sans-serif', display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
            <span style={{
              background: '#f0ffe5',
              border: '1px solid #00c30733',
              padding: '8px 14px',
              borderRadius: '20px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}>
              🇮🇳 हिन्दी (Hindi)
            </span>
            <span style={{
              background: '#f0ffe5',
              border: '1px solid #00c30733',
              padding: '8px 14px',
              borderRadius: '20px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}>
              🇮🇳 తెలుగు (Telugu)
            </span>
            <span style={{
              background: '#f0ffe5',
              border: '1px solid #00c30733',
              padding: '8px 14px',
              borderRadius: '20px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}>
              🇬🇧 English
            </span>
          </div>
        </div>

        {/* Cast */}
        <CastSection />



        {/* Offers */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-booking-dark">Top offers for you</h3>
          <div className="space-y-3">
            <Card className="p-3 border-booking-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/437f1721-00e0-45dd-812c-1ac7aeac74b6.png" 
                    alt="Citi" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-booking-dark">YES Private Debit Card Offer</p>
                  <p className="text-xs text-gray-600">Tap to view details</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 border-booking-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/46630bcd-0d97-4dd2-a3d8-9d78417bc2c9.png" 
                    alt="Buy 1 Get 1 Free" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-booking-dark">Buy 1 get 1 movie</p>
                  <p className="text-xs text-gray-600">Tap to view details</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Book Tickets Button */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t shadow-lg">
          <Button 
            onClick={onBookTickets}
            className="w-full bg-booking-primary hover:bg-booking-primary/90 text-white min-h-[72px] py-4 text-lg font-semibold rounded-xl"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold">WAR 2</span>
                <div className="flex items-center gap-1 text-sm opacity-90">
                  <Clock className="w-4 h-4" />
                  <span>2h 53m</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>Book Tickets</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}