import { useState } from 'react';
import { SessionTimer } from './SessionTimer';
import { MovieDetails } from './MovieDetails';
import { LanguageFormatSelection } from './LanguageFormatSelection';
import { ShowtimeSelection } from './ShowtimeSelection';
import { SeatSelection } from './SeatSelection';
import { FoodSelection } from './FoodSelection';
import { TermsConditions } from './TermsConditions';
import { PaymentBreakdown } from './PaymentBreakdown';
import { PaymentProcessing } from './PaymentProcessing';
import { BookingSuccess } from './BookingSuccess';
import { useToast } from '@/hooks/use-toast';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

type BookingStep = 
  | 'movie-details' 
  | 'showtime'
  | 'seat-selection' 
  | 'food' 
  | 'terms' 
  | 'payment-breakdown' 
  | 'payment-processing'
  | 'booking-success'
  | 'session-expired';

interface BookingState {
  selectedLanguage: string;
  selectedFormat: string;
  selectedTime: string;
  seatCount: number;
  selectedSeats: string[];
  ticketPrice: number;
  foodItems: { item: FoodItem; quantity: number }[];
  foodTotal: number;
  paymentAmount: number;
}

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('movie-details');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const { toast } = useToast();
  
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedLanguage: '',
    selectedFormat: '',
    selectedTime: '',
    seatCount: 1,
    selectedSeats: [],
    ticketPrice: 0,
    foodItems: [],
    foodTotal: 0,
    paymentAmount: 0,
  });

  const handleSessionExpired = () => {
    setSessionExpired(true);
    setCurrentStep('session-expired');
    toast({
      title: "Session Expired",
      description: "Your booking session has expired. Please start again.",
      variant: "destructive",
    });
  };

  const resetBooking = () => {
    setCurrentStep('movie-details');
    setSessionExpired(false);
    setShowTerms(false);
    setShowLanguageSelection(false);
    setBookingState({
      selectedLanguage: '',
      selectedFormat: '',
      selectedTime: '',
      seatCount: 1,
      selectedSeats: [],
      ticketPrice: 0,
      foodItems: [],
      foodTotal: 0,
      paymentAmount: 0,
    });
  };

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-booking-dark">Session Expired</h2>
          <p className="text-gray-600">Your booking session has expired. Please start your booking again.</p>
          <button
            onClick={resetBooking}
            className="bg-booking-primary text-white px-6 py-3 rounded-xl font-semibold"
          >
            Start New Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Session Timer - shown after movie details */}
      {currentStep !== 'movie-details' && currentStep !== 'session-expired' && !sessionExpired && (
        <SessionTimer 
          onExpired={handleSessionExpired} 
          currentStep={
            currentStep === 'seat-selection' ? 'seats' :
            currentStep === 'food' ? 'food' :
            currentStep === 'payment-breakdown' || currentStep === 'payment-processing' ? 'payment' :
            'seats'
          }
        />
      )}

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <TermsConditions
          onAccept={() => {
            setShowTerms(false);
            setCurrentStep('payment-breakdown');
          }}
          onCancel={() => setShowTerms(false)}
        />
      )}

      {/* Main Flow */}
      {currentStep === 'movie-details' && (
        <>
          <MovieDetails
            onBookTickets={() => setShowLanguageSelection(true)}
          />
          
          {/* Language Format Selection Popup */}
          {showLanguageSelection && (
            <LanguageFormatSelection
              onContinue={(language, format) => {
                setBookingState(prev => ({ 
                  ...prev, 
                  selectedLanguage: language,
                  selectedFormat: format 
                }));
                setShowLanguageSelection(false);
                setCurrentStep('showtime');
              }}
              onClose={() => setShowLanguageSelection(false)}
            />
          )}
        </>
      )}

      {currentStep === 'showtime' && (
        <ShowtimeSelection
          onBack={() => setCurrentStep('movie-details')}
          onSelectTime={(time) => {
            setBookingState(prev => ({ ...prev, selectedTime: time }));
            setCurrentStep('seat-selection');
          }}
        />
      )}

      {currentStep === 'seat-selection' && (
        <SeatSelection
          onBack={() => setCurrentStep('showtime')}
          onContinue={(seats, totalPrice) => {
            setBookingState(prev => ({ 
              ...prev, 
              selectedSeats: seats,
              ticketPrice: totalPrice 
            }));
            setCurrentStep('food');
          }}
          requiredSeats={bookingState.seatCount}
          onSeatCountChange={(count) => {
            setBookingState(prev => ({ ...prev, seatCount: count }));
          }}
        />
      )}

      {currentStep === 'food' && (
        <FoodSelection
          onBack={() => setCurrentStep('seat-selection')}
          onContinue={(foodItems, total) => {
            setBookingState(prev => ({ 
              ...prev, 
              foodItems,
              foodTotal: total 
            }));
            setShowTerms(true);
          }}
        />
      )}

      {currentStep === 'payment-breakdown' && (
        <PaymentBreakdown
          onBack={() => setCurrentStep('food')}
          onProceedPayment={(amount) => {
            setBookingState(prev => ({ ...prev, paymentAmount: amount }));
            setCurrentStep('payment-processing');
          }}
          seats={bookingState.selectedSeats}
          ticketPrice={bookingState.ticketPrice}
          foodItems={bookingState.foodItems}
          foodTotal={bookingState.foodTotal}
        />
      )}

      {currentStep === 'payment-processing' && (
        <PaymentProcessing
          amount={bookingState.paymentAmount}
          seats={bookingState.selectedSeats}
          ticketPrice={bookingState.ticketPrice}
          foodItems={bookingState.foodItems}
          foodTotal={bookingState.foodTotal}
          onSuccess={() => {
            toast({
              title: "Booking Confirmed!",
              description: "Your tickets have been booked successfully.",
            });
            setCurrentStep('booking-success');
          }}
          onFailure={() => {
            toast({
              title: "Payment Failed",
              description: "Please try again or use a different payment method.",
              variant: "destructive",
            });
          }}
          onRetry={() => {
            // Reset to payment processing
            setCurrentStep('payment-processing');
          }}
        />
      )}

      {currentStep === 'booking-success' && (
        <BookingSuccess
          seats={bookingState.selectedSeats}
          ticketPrice={bookingState.ticketPrice}
          foodItems={bookingState.foodItems}
          foodTotal={bookingState.foodTotal}
          onNewBooking={resetBooking}
        />
      )}
    </div>
  );
}