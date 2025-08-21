import { CheckCircle, XCircle, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface FoodItem {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	category: string;
}

interface PaymentProcessingProps {
	amount: number;
	seats: string[];
	ticketPrice: number;
	foodItems: { item: FoodItem; quantity: number }[];
	foodTotal: number;
	onSuccess: () => void;
	onFailure: () => void;
}

type PaymentStatus = 'method-selection' | 'processing' | 'success' | 'failed' | 'whatsapp-redirect';

export function PaymentProcessing({
	amount,
	seats,
	ticketPrice,
	foodItems,
	foodTotal,
	onSuccess,
	onFailure,
}: PaymentProcessingProps) {
	const [status, setStatus] = useState<PaymentStatus>('processing');

	// Auto-start payment process
	useEffect(() => {
		handleOnlinePayment();
	}, []);

	const handleOnlinePayment = () => {
		setStatus('processing');

		// Check if Razorpay is loaded
		if (typeof (window as unknown as { Razorpay?: unknown }).Razorpay === 'undefined') {
			// Load Razorpay script dynamically
			const script = document.createElement('script');
			script.src = 'https://checkout.razorpay.com/v1/checkout.js';
			script.onload = () => initializeRazorpay();
			script.onerror = () => {
				setStatus('failed');
				setTimeout(() => onFailure(), 1000);
			};
			document.body.appendChild(script);
		} else {
			initializeRazorpay();
		}
	};

	const initializeRazorpay = () => {
		const options = {
			key: 'rzp_live_IOQJ4vgIsAi7GM', // Live Razorpay key
			amount: amount * 100, // Amount in paise
			currency: 'INR',
			name: 'BotPe AI Bots',
			description: 'Movie Ticket Booking',
			image: 'https://botpe.in/shakun/bp.png',
			handler: function (response: unknown) {
				console.log('Payment successful:', response);
				// Send success webhook
				sendPaymentWebhook('success', response);
				setStatus('success');
				setTimeout(() => onSuccess(), 2000);
			},
			prefill: {
				name: 'Movie Lover',
				email: 'user@example.com',
				contact: '9999999999',
			},
			theme: {
				color: '#00c307',
			},
			modal: {
				ondismiss: function () {
					// Send failure webhook
					sendPaymentWebhook('failed', null);
					setStatus('failed');
					setTimeout(() => onFailure(), 1000);
				},
			},
		};

		const razorpay = new (window as unknown as { Razorpay: new (options: unknown) => { open: () => void } }).Razorpay(options);
		razorpay.open();
	};

	const sendPaymentWebhook = async (status: 'success' | 'failed', paymentResponse: unknown) => {
		// Extract URL parameters for user info
		const urlParams = new URLSearchParams(window.location.search);
		const userName = urlParams.get('name') || 'User';
		const userMobile = urlParams.get('mobile') || '';
		const userEmail = urlParams.get('email') || '';

		try {
			const response = await fetch('https://webhooks.botpe.in/webhook/68a6f2a581128cc4046d5fbb', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					bookingId: 'BK' + Date.now().toString().slice(-8),
					amount: amount,
					seats: seats,
					ticketPrice: ticketPrice,
					foodItems: foodItems,
					foodTotal: foodTotal,
					timestamp: new Date().toISOString(),
					movieName: 'WAR 2',
					theater: 'INOX Megaplex: Phoenix Mall',
					showtime: 'Today, 7:30 PM',
					paymentMethod: 'Razorpay',
					paymentStatus: status,
					paymentResponse: paymentResponse,
					userInfo: {
						name: userName,
						mobile: userMobile,
						email: userEmail,
					},
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			console.log('Payment webhook call successful');
		} catch (error) {
			console.error('Payment webhook error:', error);
		}
	};

	// handleWhatsAppPayment removed as payment selection is now in PaymentBreakdown
	const handleRetryPayment = () => {
		setStatus('processing');
		// Restart the payment process
		handleOnlinePayment();
	};


	return (
		<div className="fixed inset-0 bg-white flex items-center justify-center z-50">
			<div className="p-8 text-center space-y-6 max-w-sm w-full mx-4">
				{status === 'processing' && (
					<>
						<div className="flex justify-center">
							<Loader2 className="w-16 h-16 text-booking-primary animate-spin" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-booking-dark mb-2">Processing Payment</h2>
							<p className="text-gray-600">
								Please wait while we process your payment of ₹{amount.toFixed(2)}
							</p>
						</div>
						<div className="bg-booking-light rounded-lg p-4">
							<p className="text-sm text-gray-600">Do not press back or refresh the page</p>
						</div>
					</>
				)}

				{status === 'success' && (
					<>
						<div className="flex justify-center">
							<CheckCircle className="w-16 h-16 text-green-500" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h2>
							<p className="text-gray-600">Your booking has been confirmed</p>
						</div>
						<Card className="p-4 bg-green-50 border-green-200">
							<p className="text-sm text-green-800">
								A confirmation will be sent to your registered email and mobile number
							</p>
						</Card>
					</>
				)}

				{status === 'whatsapp-redirect' && (
					<>
						<div className="flex justify-center">
							<MessageSquare className="w-16 h-16 text-green-500" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-green-600 mb-2">Redirecting to WhatsApp</h2>
							<p className="text-gray-600">
								Your payment request has been sent. This window will close automatically.
							</p>
						</div>
						<Card className="p-4 bg-green-50 border-green-200">
							<p className="text-sm text-green-800">
								Complete your payment through WhatsApp to confirm your booking
							</p>
						</Card>
					</>
				)}

				{status === 'failed' && (
					<>
						<div className="flex justify-center">
							<XCircle className="w-16 h-16 text-red-500" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-red-600 mb-2">Payment Failed</h2>
							<p className="text-gray-600">Something went wrong with your payment</p>
						</div>
						<Card className="p-4 bg-red-50 border-red-200">
							<p className="text-sm text-red-800">
								Your money is safe. If amount was deducted, it will be refunded within 5-7 business
								days.
							</p>
						</Card>
						<Button
							onClick={handleRetryPayment}
							className="w-full bg-booking-primary hover:bg-booking-primary/90 text-white py-8 text-lg font-semibold rounded-xl"
						>
							Retry Payment
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
