import { ArrowLeft, Edit, CreditCard } from 'lucide-react';
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

interface PaymentBreakdownProps {
	onBack: () => void;
	onProceedPayment: (amount: number) => void;
	seats: string[];
	ticketPrice: number;
	foodItems: { item: FoodItem; quantity: number }[];
	foodTotal: number;
}

export function PaymentBreakdown({
	onBack,
	onProceedPayment,
	seats,
	ticketPrice,
	foodItems,
	foodTotal,
}: PaymentBreakdownProps) {
	const [couponApplied, setCouponApplied] = useState(false);
	const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
	const [countdown, setCountdown] = useState(7);
	const [showTicketGST, setShowTicketGST] = useState(false);
	const [showConvenienceGST, setShowConvenienceGST] = useState(false);
	const [showFoodGST, setShowFoodGST] = useState(false);

	// Ticket pricing with GST
	const ticketSubtotal = ticketPrice;
	const ticketBase = Math.round(ticketSubtotal / 1.18); // Remove 18% GST to get base
	const ticketGST = ticketSubtotal - ticketBase;
	const ticketCGST = Math.round(ticketGST / 2);
	const ticketSGST = ticketGST - ticketCGST;
	
	// Convenience fees with GST
	const convenienceFeeBase = 54;
	const convenienceCGST = 5;
	const convenienceSGST = 5;
	const convenienceFees = convenienceFeeBase + convenienceCGST + convenienceSGST;

	// Food GST calculation (5%)
	const foodSubtotal = foodTotal;
	const foodGST = foodTotal > 0 ? Math.round(foodTotal * 0.05) : 0;
	const foodCGST = Math.round(foodGST / 2);
	const foodSGST = foodGST - foodCGST;
	const foodTotalWithGST = foodSubtotal + foodGST;

	const originalTotal = ticketSubtotal + convenienceFees + foodTotalWithGST;
	const grandTotal = couponApplied ? 1 : originalTotal; // PAY 1 ONLY coupon
	const discount = couponApplied ? originalTotal - 1 : 0;

	const handleApplyCoupon = () => {
		setCouponApplied(true);
	};

	const handleRemoveCoupon = () => {
		setCouponApplied(false);
	};

	const handleOnlinePayment = () => {
		// Directly proceed with Razorpay payment
		onProceedPayment(grandTotal);
	};

	const handleWhatsAppPayment = () => {
		setShowWhatsAppPopup(true);
		setCountdown(7);
	};

	const processWhatsAppPayment = async () => {
		// Extract URL parameters for user info
		const urlParams = new URLSearchParams(window.location.search);
		const userName = urlParams.get('name') || 'User';
		const userMobile = urlParams.get('mobile') || '';
		const userEmail = urlParams.get('email') || '';

		// Send payment info to WhatsApp webhook
		try {
			const response = await fetch('https://webhooks.botpe.in/webhook/68a7256781128cc4046d9999', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					bookingId: 'BK' + Date.now().toString().slice(-8),
					amount: grandTotal,
					seats: seats,
					ticketPrice: ticketPrice,
					foodItems: foodItems,
					foodTotal: foodTotal,
					timestamp: new Date().toISOString(),
					movieName: 'WAR 2',
					theater: 'INOX Megaplex: Phoenix Mall',
					showtime: 'Today, 7:30 PM',
					paymentMethod: 'WhatsApp',
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

			console.log('WhatsApp webhook call successful');
		} catch (error) {
			console.error('Webhook error:', error);
		}

		// Redirect to WhatsApp
		window.location.href = 'https://wa.me/918390974974';
	};

	// Countdown effect for WhatsApp popup
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (showWhatsAppPopup && countdown > 0) {
			interval = setInterval(() => {
				setCountdown(prev => prev - 1);
			}, 1000);
		} else if (showWhatsAppPopup && countdown === 0) {
			processWhatsAppPayment();
		}
		return () => clearInterval(interval);
	}, [showWhatsAppPopup, countdown]);

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="sticky top-0 bg-white border-b shadow-sm z-10">
				<div className="flex items-center gap-3 p-4">
					<Button variant="ghost" size="icon" onClick={onBack}>
						<ArrowLeft className="w-5 h-5" />
					</Button>
					<h1 className="font-bold text-lg text-booking-dark">Confirm booking</h1>
				</div>
			</div>

			<div className="p-4 space-y-6 pb-48">
				{/* Movie Details */}
				<Card className="p-4 bg-booking-light border-booking-primary/20">
					<div className="flex gap-4 items-start mb-2">
						<div className="w-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0" style={{ height: '250px' }}>
							<img
								src="https://m.media-amazon.com/images/M/MV5BNjY5OTg4NTYtZjVkZS00YTZmLWIwNDEtM2Y0ODQyMzM2NTJiXkEyXkFqcGc@._V1_.jpg"
								alt="WAR 2"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex-1">
							<h2 className="font-bold text-lg text-booking-dark mb-1">WAR 2</h2>
							<p className="text-sm text-booking-primary font-medium mb-1">🇮🇳 हिन्दी (Hindi) (IMAX 2D)</p>
							<p className="text-sm text-gray-600 mb-1">2h 35m</p>
							<p className="text-sm text-gray-600 mb-2">Thu, 21 Aug, 2025 | 02:35 PM</p>
							<p className="text-sm text-gray-600">INOX Megaplex: Phoenix Mall (IMAX 7)</p>
						</div>
						<div className="text-right">
							<span className="text-2xl font-bold text-booking-primary">{seats.length}</span>
							<p className="text-xs text-booking-primary">M-Ticket</p>
						</div>
					</div>
				</Card>

				{/* Detailed Pricing Breakdown */}
				<Card className="p-4">
					<h3 className="font-semibold text-booking-dark mb-4">Price Breakdown</h3>
					<div className="space-y-3">
						{/* Ticket Section */}
						<div>
							<div className="flex justify-between font-medium mb-2">
								<div className="flex items-center gap-2">
									<svg className="w-4 h-4 text-booking-primary" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"/>
									</svg>
									<span>Ticket Price</span>
								</div>
								<div className="flex items-center gap-2">
									<span>₹{ticketSubtotal.toFixed(2)}</span>
									<button 
										onClick={() => setShowTicketGST(!showTicketGST)}
										className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
									>
										<svg className={`w-3 h-3 transition-transform ${showTicketGST ? 'rotate-45' : ''}`} fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
										</svg>
									</button>
								</div>
							</div>
							{showTicketGST && (
								<div className="ml-4 space-y-1 text-sm text-gray-600 mb-2">
									<div className="flex items-center justify-between">
										<span>Base Amount</span>
										<div className="flex-1 mx-3 border-b border-dotted border-gray-300"></div>
										<span>₹{ticketBase.toFixed(2)}</span>
									</div>
									<div className="flex items-center justify-between">
										<span>Central GST (CGST) @ 9%</span>
										<div className="flex-1 mx-3 border-b border-dotted border-gray-300"></div>
										<span>₹{ticketCGST.toFixed(2)}</span>
									</div>
									<div className="flex items-center justify-between">
										<span>State GST (SGST) @ 9%</span>
										<div className="flex-1 mx-3 border-b border-dotted border-gray-300"></div>
										<span>₹{ticketSGST.toFixed(2)}</span>
									</div>
								</div>
							)}
						</div>
						
						{/* Convenience Fee Section */}
						<div>
							<div className="flex justify-between font-medium mb-2">
								<div className="flex items-center gap-2">
									<svg className="w-4 h-4 text-booking-primary" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
									</svg>
									<span>Convenience fees</span>
								</div>
								<div className="flex items-center gap-2">
									<span>₹{convenienceFees.toFixed(2)}</span>
									<button 
										onClick={() => setShowConvenienceGST(!showConvenienceGST)}
										className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
									>
										<svg className={`w-3 h-3 transition-transform ${showConvenienceGST ? 'rotate-45' : ''}`} fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
										</svg>
									</button>
								</div>
							</div>
							{showConvenienceGST && (
								<div className="ml-4 space-y-1 text-sm text-gray-600 mb-2">
									<div className="flex items-center justify-between">
										<span>Base Amount</span>
										<div className="flex-1 mx-3 border-b border-dotted border-gray-300"></div>
										<span>₹{convenienceFeeBase.toFixed(2)}</span>
									</div>
									<div className="flex items-center justify-between">
										<span>Central GST (CGST) @ 9%</span>
										<div className="flex-1 mx-3 border-b border-dotted border-gray-300"></div>
										<span>₹{convenienceCGST.toFixed(2)}</span>
									</div>
									<div className="flex items-center justify-between">
										<span>State GST (SGST) @ 9%</span>
										<div className="flex-1 mx-3 border-b border-dotted border-gray-300"></div>
										<span>₹{convenienceSGST.toFixed(2)}</span>
									</div>
								</div>
							)}
						</div>

						{/* Food Section */}
						{foodItems.length > 0 && (
							<div>
								<div className="flex justify-between font-medium mb-2">
									<div className="flex items-center gap-2">
										<svg className="w-4 h-4 text-booking-primary" fill="currentColor" viewBox="0 0 20 20">
											<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
										</svg>
										<span>Food & Beverages</span>
									</div>
									<div className="flex items-center gap-2">
										<span>₹{foodTotalWithGST.toFixed(2)}</span>
										<button 
											onClick={() => setShowFoodGST(!showFoodGST)}
											className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
										>
											<svg className={`w-3 h-3 transition-transform ${showFoodGST ? 'rotate-45' : ''}`} fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
											</svg>
										</button>
									</div>
								</div>
								<div className="ml-4 space-y-2 mb-3">
									{foodItems.filter(({ item }) => !item.id.includes('combo')).map(({ item, quantity }) => (
										<div key={`billing-${item.id}`} className="flex items-center gap-2 text-sm text-gray-600">
											<div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
												<img
													src={item.image}
													alt={item.name}
													className="w-full h-full object-cover"
												/>
											</div>
											<span className="flex-1">{item.name} × {quantity}</span>
											<span className="font-medium">₹{(item.price * quantity).toFixed(2)}</span>
										</div>
									))}
								</div>
								{showFoodGST && (
									<div className="ml-4 space-y-1 text-sm text-gray-600 mb-2">
										<div className="flex items-center justify-between">
											<span>Base Amount</span>
											<div className="flex-1 mx-3 border-b border-dotted border-gray-300"></div>
											<span>₹{foodSubtotal.toFixed(2)}</span>
										</div>
										<div className="flex items-center justify-between">
											<span>Central GST (CGST) @ 2.5%</span>
											<div className="flex-1 mx-3 border-b border-dotted border-gray-300"></div>
											<span>₹{foodCGST.toFixed(2)}</span>
										</div>
										<div className="flex items-center justify-between">
											<span>State GST (SGST) @ 2.5%</span>
											<div className="flex-1 mx-3 border-b border-dotted border-gray-300"></div>
											<span>₹{foodSGST.toFixed(2)}</span>
										</div>
									</div>
								)}
							</div>
						)}
						
						{/* Discount if applied */}
						{couponApplied && (
							<div className="flex justify-between font-medium text-green-600">
								<span>Discount Applied</span>
								<span>-₹{discount.toFixed(2)}</span>
							</div>
						)}
						
						{/* Total */}
						<div className="border-t pt-3 flex justify-between font-bold text-lg">
							<span>Total Amount</span>
							<span className="text-booking-primary">₹{grandTotal.toFixed(2)}</span>
						</div>
					</div>
				</Card>

				{/* Apply Coupon */}
				<Card className="p-4 cursor-pointer hover:bg-booking-light transition-colors">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<span className="text-2xl">🎫</span>
							<span className="font-medium text-booking-dark">Apply Coupon</span>
						</div>
						<span className="text-gray-400">›</span>
					</div>

					{/* Special Coupon */}
					<div
						className={`bg-gradient-to-r rounded-lg p-4 border-dashed ${
							couponApplied
								? 'from-blue-50 to-blue-100 border-2 border-blue-300'
								: 'from-green-50 to-green-100 border-2 border-green-300'
						}`}
					>
						<div className="flex items-center justify-between">
							<div>
								<div
									className={`font-bold text-lg ${
										couponApplied ? 'text-blue-800' : 'text-green-800'
									}`}
								>
									PAY 1 ONLY
								</div>
								<div className={`text-sm ${couponApplied ? 'text-blue-600' : 'text-green-600'}`}>
									{couponApplied ? 'Coupon Applied Successfully!' : 'Special Offer - Pay just ₹1'}
								</div>
								{couponApplied && (
									<div className="text-xs text-blue-500">You saved ₹{discount.toFixed(0)}</div>
								)}
								{!couponApplied && (
									<div className="text-xs text-green-500">Save ₹{(originalTotal - 1).toFixed(0)}</div>
								)}
							</div>
							{!couponApplied ? (
								<Button
									variant="outline"
									size="sm"
									onClick={handleApplyCoupon}
									className="border-green-500 text-green-700 hover:bg-green-500 hover:text-white"
								>
									Apply
								</Button>
							) : (
								<Button
									variant="outline"
									size="sm"
									onClick={handleRemoveCoupon}
									className="border-red-500 text-red-700 hover:bg-red-500 hover:text-white"
								>
									Remove
								</Button>
							)}
						</div>
					</div>
				</Card>

				{/* Terms */}
				<div className="text-xs text-gray-600 leading-relaxed">
					By proceeding, I express my consent to complete this Reservation...
				</div>
			</div>

			{/* Bottom Payment Buttons */}
			<div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
				<div className="p-3 space-y-3">
					
					<Button
						onClick={handleOnlinePayment}
						className="w-full text-white min-h-[72px] py-4 text-lg font-semibold rounded-xl"
						style={{ backgroundColor: '#075e54' }}
					>
						<div className="flex items-center justify-center gap-3">
							<CreditCard className="w-6 h-6" />
							<span>PAY ₹{grandTotal.toFixed(0)} ONLINE</span>
						</div>
					</Button>
					
					<Button
						onClick={handleWhatsAppPayment}
						className="w-full bg-booking-primary hover:bg-booking-primary/90 text-white min-h-[72px] py-4 text-lg font-semibold rounded-xl"
					>
						<div className="flex items-center justify-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
								<path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"></path>
							</svg>
							<span>PAY ₹{grandTotal.toFixed(0)} WhatsApp</span>
						</div>
					</Button>
					<p className="text-xs text-green-600 text-center font-medium">
						Get ₹50 Cashback with WhatsApp payment
					</p>
				</div>
			</div>

			{/* WhatsApp Payment Popup */}
			{showWhatsAppPopup && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-end">
					<div className="w-full bg-white rounded-t-2xl animate-slide-up">
						<div className="p-6 text-center">
							{/* WhatsApp Icon */}
							<div className="mb-4 flex justify-center">
								<div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-whatsapp" viewBox="0 0 16 16">
										<path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"></path>
									</svg>
								</div>
							</div>

							{/* Heading */}
							<h2 className="text-2xl font-bold text-booking-dark mb-2">Redirecting to WhatsApp</h2>
							<p className="text-gray-600 mb-6">
								Closing tab in <span className="font-bold text-green-600">{countdown}</span> seconds
							</p>

							{/* Countdown Circle */}
							<div className="mb-6 flex justify-center">
								<div className="relative w-20 h-20">
									<svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
										<circle
											cx="50"
											cy="50"
											r="45"
											stroke="currentColor"
											strokeWidth="6"
											fill="transparent"
											className="text-gray-200"
										/>
										<circle
											cx="50"
											cy="50"
											r="45"
											stroke="currentColor"
											strokeWidth="6"
											fill="transparent"
											strokeDasharray={`${2 * Math.PI * 45}`}
											strokeDashoffset={`${2 * Math.PI * 45 * (1 - countdown / 7)}`}
											className="text-green-500 transition-all duration-1000 ease-linear"
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="text-2xl font-bold text-green-600">{countdown}</span>
									</div>
								</div>
							</div>

							{/* Continue Button */}
							<Button
								onClick={processWhatsAppPayment}
								className="w-full bg-green-500 hover:bg-green-600 text-white min-h-[56px] py-3 text-lg font-semibold rounded-xl mb-4"
							>
								<div className="flex items-center justify-center gap-2">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
										<path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"></path>
									</svg>
									Continue Over WhatsApp
								</div>
							</Button>

							{/* Cancel Button */}
							<Button
								onClick={() => setShowWhatsAppPopup(false)}
								variant="outline"
								className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 min-h-[48px] py-2 rounded-xl"
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			)}

		</div>
	);
}
