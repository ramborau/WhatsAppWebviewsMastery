import { CheckCircle, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FoodItem {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	category: string;
}

interface BookingSuccessProps {
	seats: string[];
	ticketPrice: number;
	foodItems: { item: FoodItem; quantity: number }[];
	foodTotal: number;
	onNewBooking: () => void;
}

export function BookingSuccess({ seats, ticketPrice, foodItems, foodTotal, onNewBooking }: BookingSuccessProps) {
	const convenienceFee = Math.round(ticketPrice * 0.118);
	const grandTotal = ticketPrice + foodTotal + convenienceFee;

	const bookingId = 'BK' + Date.now().toString().slice(-8);
	const bookingDate = new Date().toLocaleDateString('en-IN');
	const bookingTime = new Date().toLocaleTimeString('en-IN', {
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<div className="min-h-screen bg-background p-4">
			<div className="max-w-md mx-auto space-y-6">
				{/* Success Header */}
				<div className="text-center py-8">
					<div className="flex justify-center mb-4">
						<CheckCircle className="w-20 h-20 text-booking-primary animate-scale-in" />
					</div>
					<h1 className="text-2xl font-bold text-booking-dark mb-2">Booking Confirmed!</h1>
					<p className="text-gray-600">Your tickets have been booked successfully</p>
				</div>

				{/* Ticket Card */}
				<Card className="p-6 bg-white border border-booking-primary/20 rounded-xl">
					<div className="space-y-4">
						{/* Movie Info */}
						<div className="text-center pb-4 border-b border-gray-200">
							<h2 className="text-lg font-bold text-booking-dark">WAR 2</h2>
							<p className="text-sm text-gray-600">INOX Megaplex: Phoenix Mall</p>
							<p className="text-sm text-gray-600">Today, 7:30 PM</p>
						</div>

						{/* Booking Details */}
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-sm text-gray-600">Booking ID</span>
								<span className="font-medium text-booking-dark">{bookingId}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-gray-600">Date & Time</span>
								<span className="font-medium text-booking-dark">
									{bookingDate}, {bookingTime}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-gray-600">Seats</span>
								<span className="font-medium text-booking-primary">{seats.join(', ')}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-gray-600">Tickets</span>
								<span className="font-medium text-booking-dark">
									{seats.length} ticket{seats.length > 1 ? 's' : ''}
								</span>
							</div>
						</div>

						{/* QR Code */}
						<div className="text-center py-4 border-t border-gray-200">
							<img
								src="/lovable-uploads/e5aec886-35aa-4b14-9fc7-1ba9582e8361.png"
								alt="Booking QR Code"
								className="w-32 h-32 mx-auto mb-2"
							/>
							<p className="text-xs text-gray-500">Show this QR code at the cinema</p>
						</div>

						{/* Payment Summary */}
						<div className="space-y-2 pt-4 border-t border-gray-200">
							<div className="flex justify-between text-sm">
								<span>Tickets ({seats.length})</span>
								<span>₹{ticketPrice}</span>
							</div>
							{foodItems.length > 0 && (
								<div className="flex justify-between text-sm">
									<span>Food & Beverages</span>
									<span>₹{foodTotal}</span>
								</div>
							)}
							<div className="flex justify-between text-sm">
								<span>Convenience Fee</span>
								<span>₹{convenienceFee}</span>
							</div>
							<div className="flex justify-between font-semibold text-booking-primary border-t pt-2">
								<span>Total Paid</span>
								<span>₹{grandTotal}</span>
							</div>
						</div>
					</div>
				</Card>

				{/* Action Buttons */}
				<div className="space-y-3">
					<Button
						variant="outline"
						className="w-full border-booking-primary text-booking-primary hover:bg-booking-primary hover:text-white py-4 rounded-xl"
					>
						<Download className="w-4 h-4 mr-2" />
						Download Ticket
					</Button>

					<Button
						variant="outline"
						className="w-full border-booking-primary text-booking-primary hover:bg-booking-primary hover:text-white py-4 rounded-xl"
					>
						<Share2 className="w-4 h-4 mr-2" />
						Share Booking
					</Button>

					<Button
						onClick={onNewBooking}
						className="w-full bg-booking-primary hover:bg-booking-primary/90 text-white py-8 text-lg font-semibold rounded-xl"
					>
						Book Another Movie
					</Button>
				</div>

				{/* Footer Note */}
				<div className="text-center py-4">
					<p className="text-xs text-gray-500">
						Please arrive 30 minutes before showtime. Tickets are non-refundable and non-transferable.
					</p>
				</div>
			</div>
		</div>
	);
}
