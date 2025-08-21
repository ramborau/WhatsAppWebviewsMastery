import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect, useRef } from 'react';

interface SeatSelectionProps {
	onBack: () => void;
	onContinue: (seats: string[], totalPrice: number) => void;
	requiredSeats: number;
	onSeatCountChange?: (count: number) => void;
}

interface Seat {
	id: string;
	row: string;
	number: number;
	type: 'prime' | 'classic-plus' | 'classic';
	status: 'available' | 'selected' | 'sold' | 'bestseller';
	price: number;
}

export function SeatSelection({ onBack, onContinue, requiredSeats, onSeatCountChange }: SeatSelectionProps) {
	const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
	const [showSeatCountPopup, setShowSeatCountPopup] = useState(true);
	const [selectedCount, setSelectedCount] = useState<number | null>(2);
	const [localRequiredSeats, setLocalRequiredSeats] = useState(requiredSeats);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const getVehicleImage = (count: number) => {
		if (count === 1) return '/lovable-uploads/f735d820-7a7d-4da6-a394-3a58a3b711ac.png'; // Bicycle
		if (count === 2) return '/lovable-uploads/919fd8ae-19e9-4fb4-a521-3b121a217d11.png'; // Bike
		if (count === 3) return '/lovable-uploads/8e6cb952-d216-4541-9d19-12aac5880cd7.png'; // Auto
		if (count === 4) return '/lovable-uploads/0a30106d-8c38-4713-b45a-b4406b263566.png'; // Car
		if (count === 5) return '/lovable-uploads/afdf1244-a3a1-4cf0-a250-1735cc7ee17c.png'; // SUV
		return '/lovable-uploads/ea091cba-701e-4dc1-a20f-20cffe619bfd.png'; // Bus for 6+
	};

	// Generate seat layout with proper pricing zones
	const generateSeats = (): Seat[] => {
		const seats: Seat[] = [];
		const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

		rows.forEach((row, rowIndex) => {
			// More realistic theater layout - scattered seats with gaps
			let seatPositions: number[] = [];

			if (rowIndex <= 4) {
				// Prime section (A to E) - fewer seats, premium layout
				seatPositions = [3, 4, 5, 6, 10, 11, 12, 13];
			} else if (rowIndex <= 7) {
				// Classic Plus (F, G, H) - medium layout
				seatPositions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
			} else {
				// Classic (I, J, K, L) - full row with gaps
				seatPositions = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16];
			}

			const seatType = rowIndex <= 4 ? 'prime' : rowIndex <= 7 ? 'classic-plus' : 'classic';
			const basePrice = seatType === 'prime' ? 270 : seatType === 'classic-plus' ? 220 : 200;

			seatPositions.forEach((pos) => {
				const seatId = `${row}${pos}`;
				const isSold = Math.random() > 0.85; // Random sold seats

				seats.push({
					id: seatId,
					row,
					number: pos,
					type: seatType,
					status: isSold ? 'sold' : 'available',
					price: basePrice,
				});
			});
		});

		return seats;
	};

	const [seats] = useState<Seat[]>(generateSeats());

	// Get zone information for styling
	const getZoneInfo = (row: string) => {
		const rowIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].indexOf(row);
		if (rowIndex <= 4) {
			return {
				type: 'prime',
				price: 270,
				background: '#F5F0FF', // Full opacity
				borderColor: '#894eff',
				textColor: '#894eff',
			};
		} else if (rowIndex <= 7) {
			return {
				type: 'classic-plus',
				price: 220,
				background: '#EAF5FF', // Full opacity
				borderColor: '#3c9ef8',
				textColor: '#3c9ef8',
			};
		} else {
			return {
				type: 'classic',
				price: 200,
				background: '#E9F8EF', // Full opacity
				borderColor: '#2acb6a',
				textColor: '#2acb6a',
			};
		}
	};

	// Center the scroll position on component mount
	useEffect(() => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current;
			const scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
			container.scrollLeft = scrollLeft;
		}
	}, []);

	const handleSeatClick = useCallback(
		(seatId: string) => {
			const seat = seats.find((s) => s.id === seatId);
			if (!seat || seat.status === 'sold') return;

			setSelectedSeats((prev) => {
				if (prev.includes(seatId)) {
					return prev.filter((id) => id !== seatId);
				}

				if (prev.length >= localRequiredSeats) {
					return prev;
				}

				const newSelected = [...prev, seatId];

				// Auto-select adjacent seats if possible
				if (newSelected.length < localRequiredSeats) {
					const adjacentSeats = findAdjacentSeats(seatId, localRequiredSeats - newSelected.length);
					return [...newSelected, ...adjacentSeats];
				}

				return newSelected;
			});
		},
		[seats, localRequiredSeats]
	);

	const findAdjacentSeats = (seatId: string, needed: number): string[] => {
		const seat = seats.find((s) => s.id === seatId);
		if (!seat) return [];

		const adjacent: string[] = [];
		const row = seat.row;
		const num = seat.number;

		// Try to find seats to the right
		for (let i = 1; i <= needed; i++) {
			const nextSeatId = `${row}${num + i}`;
			const nextSeat = seats.find((s) => s.id === nextSeatId);
			if (nextSeat && nextSeat.status !== 'sold' && !selectedSeats.includes(nextSeatId)) {
				adjacent.push(nextSeatId);
			} else {
				break;
			}
		}

		// If not enough seats to the right, try left
		if (adjacent.length < needed) {
			for (let i = 1; i <= needed - adjacent.length; i++) {
				const prevSeatId = `${row}${num - i}`;
				const prevSeat = seats.find((s) => s.id === prevSeatId);
				if (prevSeat && prevSeat.status !== 'sold' && !selectedSeats.includes(prevSeatId)) {
					adjacent.unshift(prevSeatId);
				} else {
					break;
				}
			}
		}

		return adjacent.slice(0, needed);
	};

	const getSeatColor = (seat: Seat) => {
		if (selectedSeats.includes(seat.id)) return 'text-white';
		if (seat.status === 'sold') return 'text-gray-400 cursor-not-allowed';
		if (seat.type === 'prime') return 'text-booking-primary';
		if (seat.type === 'classic-plus') return 'text-booking-primary/80';
		return 'text-booking-primary/60';
	};

	const getSeatSVG = (seat: Seat) => {
		const textColor = selectedSeats.includes(seat.id) ? '#ffffff' : seat.status === 'sold' ? '#aa0519' : '#075e54';

		// Based on text color, determine SVG styling
		if (textColor === '#aa0519') {
			// When text is #aa0519 - use sold seat styling
			return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" class="w-full h-full" transform="rotate(180)">
        <defs>
          <style>
            .st0 {
              fill: #f7d7d7;
              opacity: .28;
              stroke: #aa0519;
              stroke-miterlimit: 10;
              stroke-width: 21px;
            }
          </style>
        </defs>
        <path class="st0" d="M90.77,243.3c21.55-2.58,77.73-2.7,97.42,3.77,24.84,8.16,43.54,31.2,46.99,57.12,5.15,111.05-7.12,228.64-.17,338.93,2.72,43.15,23.03,67.71,67.24,70.95h462.2c34.66-2.54,60.11-20.08,65.24-55.92l-.05-344.48c6.54-76.47,81-75.9,141.12-70.87,37.17,3.11,65.08,27.79,69.22,65.19v458.13c-7.42,83.63-76.57,150.7-160.11,157.92l-689.35.1c-85.46-5.46-156-72.59-163.8-158.02l.28-461.64c5.84-33.05,30.15-57.16,63.76-61.18Z"/>
        <path class="st0" d="M762.93,647.29c-5.78,6.02-18.46,9.84-26.77,10.6h-405.59c-15.24-1.85-28.28-7.39-34.08-22.4l-1.64-347.21c5.61-42.64,40.59-77.52,83.9-80.56,101.1-7.1,210.48,5.45,312.44.1,42.53,5.42,76.19,39.53,80.68,82.11v335.56c-.19,7.26-3.96,16.6-8.94,21.79Z"/>
        <text x="530" y="630" text-anchor="middle" font-family="Arial, sans-serif" font-size="380" font-weight="bold" fill="${textColor}" transform="rotate(180 530 630)">${seat.number}</text>
      </svg>`;
		} else {
			// For all other text colors - use available/selected seat styling
			return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" class="w-full h-full" transform="rotate(180)">
        <defs>
          <style>
            .st0 {
              fill: #dcf8c6;
              stroke: #00c307;
              stroke-miterlimit: 10;
              stroke-width: 21px;
              opacity: 1;
            }
          </style>
        </defs>
        <path class="st0" d="M90.77,243.3c21.55-2.58,77.73-2.7,97.42,3.77,24.84,8.16,43.54,31.2,46.99,57.12,5.15,111.05-7.12,228.64-.17,338.93,2.72,43.15,23.03,67.71,67.24,70.95h462.2c34.66-2.54,60.11-20.08,65.24-55.92l-.05-344.48c6.54-76.47,81-75.9,141.12-70.87,37.17,3.11,65.08,27.79,69.22,65.19v458.13c-7.42,83.63-76.57,150.7-160.11,157.92l-689.35.1c-85.46-5.46-156-72.59-163.8-158.02l.28-461.64c5.84-33.05,30.15-57.16,63.76-61.18Z"/>
        <path class="st0" d="M762.93,647.29c-5.78,6.02-18.46,9.84-26.77,10.6h-405.59c-15.24-1.85-28.28-7.39-34.08-22.4l-1.64-347.21c5.61-42.64,40.59-77.52,83.9-80.56,101.1-7.1,210.48,5.45,312.44.1,42.53,5.42,76.19,39.53,80.68,82.11v335.56c-.19,7.26-3.96,16.6-8.94,21.79Z"/>
        <text x="530" y="630" text-anchor="middle" font-family="Arial, sans-serif" font-size="380" font-weight="bold" fill="${textColor}" transform="rotate(180 530 630)">${seat.number}</text>
      </svg>`;
		}
	};

	const totalPrice =
		selectedSeats.length > 0
			? selectedSeats.reduce((sum, seatId) => {
					const seat = seats.find((s) => s.id === seatId);
					return sum + (seat?.price || 0);
			  }, 0)
			: localRequiredSeats * 220; // Default price (classic-plus) when no seats selected

	const groupedSeats = seats.reduce((acc, seat) => {
		if (!acc[seat.row]) acc[seat.row] = [];
		acc[seat.row].push(seat);
		return acc;
	}, {} as Record<string, Seat[]>);

	return (
		<div className="min-h-screen bg-background pb-24">
			{/* Ticket Count Popup - Show first */}
			{showSeatCountPopup && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-end">
					<div className="w-full bg-white rounded-t-2xl animate-slide-up max-h-[80vh] overflow-hidden">
						<div className="p-6">
							{/* Header */}
							<div className="flex items-center gap-3 mb-6">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => {
										setShowSeatCountPopup(false);
										onBack();
									}}
								>
									<ArrowLeft className="w-5 h-5" />
								</Button>
								<img
									src="https://m.media-amazon.com/images/M/MV5BNjY5OTg4NTYtZjVkZS00YTZmLWIwNDEtM2Y0ODQyMzM2NTJiXkEyXkFqcGc@._V1_.jpg"
									alt="WAR 2"
									className="w-12 h-16 rounded-lg object-cover"
								/>
								<div>
									<h1 className="font-bold text-2xl text-booking-dark">WAR 2</h1>
									<p className="text-sm font-normal text-gray-600">Select your seats</p>
									<p className="text-xs text-gray-500">{selectedCount || 2} people</p>
								</div>
							</div>

							{/* Seat Count Selection */}
							<div className="text-center space-y-4 mb-6">
								<h2 className="text-2xl font-bold text-booking-dark">How many seats?</h2>

								{/* Vehicle Images */}
								<div className="flex justify-center">
									<div className="w-24 h-16">
										<img
											src={getVehicleImage(selectedCount || 2)}
											alt={`Vehicle for ${selectedCount || 2} person${
												(selectedCount || 2) > 1 ? 's' : ''
											}`}
											className="w-full h-full object-contain"
										/>
									</div>
								</div>

								{/* Number Selection */}
								<div className="flex justify-center gap-2">
									{[1, 2, 3, 4, 5, 6].map((num) => (
										<Button
											key={num}
											variant={selectedCount === num ? 'default' : 'outline'}
											className={`w-10 h-10 rounded-full text-lg font-semibold ${
												selectedCount === num
													? 'bg-booking-primary text-white'
													: 'border-2 border-gray-200 text-gray-600 hover:border-booking-primary'
											}`}
											onClick={() => setSelectedCount(num)}
										>
											{num}
										</Button>
									))}
								</div>
							</div>

							{/* Seat Categories - Compact */}
							<div className="space-y-2 mb-6">
								{[
									{ type: 'PRIME', price: '₹270', borderColor: '#a259f7', bgColor: '#f4eeff' },
									{
										type: 'CLASSIC PLUS',
										price: '₹220',
										borderColor: '#3dbaf8',
										bgColor: '#f3f9ff',
									},
									{ type: 'CLASSIC', price: '₹200', borderColor: '#36d882', bgColor: '#e4ffef' },
								].map((category) => (
									<div
										key={category.type}
										className="flex items-center justify-between py-2 px-3 rounded-lg border"
										style={{
											backgroundColor: category.bgColor,
											borderColor: category.borderColor,
										}}
									>
										<div className="flex items-center gap-2">
											<div
												className="flex items-center justify-center w-5 h-5 rounded-full"
												style={{ backgroundColor: category.borderColor }}
											>
												<svg
													className="w-3 h-3 text-white"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
											<div>
												<h3 className="font-semibold text-booking-dark text-sm">
													{category.type}
												</h3>
												<p className="text-xs text-gray-600 font-normal">AVAILABLE</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-bold text-booking-dark">{category.price}</p>
										</div>
									</div>
								))}
							</div>

							{/* Continue Button */}
							<Button
								onClick={() => {
									setShowSeatCountPopup(false);
									if (selectedCount) {
										setLocalRequiredSeats(selectedCount);
										if (onSeatCountChange) {
											onSeatCountChange(selectedCount);
										}
									}
								}}
								disabled={!selectedCount}
								className="w-full bg-booking-primary hover:bg-booking-primary/90 text-white min-h-[56px] py-3 text-lg font-semibold rounded-xl disabled:opacity-60"
							>
								<div className="flex justify-between items-center w-full">
									<div className="text-left">
										<div className="text-lg font-bold">{selectedCount || 2}</div>
										<div className="text-xs font-light">PEOPLE</div>
									</div>
									<div className="flex items-center gap-2">
										<span>Select Seats</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="w-5 h-5"
										>
											<path d="M5 12h14"></path>
											<path d="m12 5 7 7-7 7"></path>
										</svg>
									</div>
								</div>
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Show main seat selection content only when popup is not visible */}
			{!showSeatCountPopup && (
				<div>
				{/* Header */}
				<div className="sticky top-0 bg-white border-b shadow-sm z-[11111]">
					<div className="flex items-center gap-3 p-4">
						<Button variant="ghost" size="icon" onClick={onBack}>
							<ArrowLeft className="w-5 h-5" />
						</Button>
						<div className="flex-1">
							<h1 className="font-bold text-lg text-booking-dark">Select Seats</h1>
							<div className="flex items-center gap-2 mt-1">
								<div
									className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
										selectedSeats.length === localRequiredSeats
											? 'bg-green-500 text-white'
											: 'bg-red-500 text-white'
									}`}
								>
									{selectedSeats.length === localRequiredSeats ? (
										<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									) : (
										<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									<span>
										{selectedSeats.length}/{localRequiredSeats} seats selected
									</span>
								</div>
							</div>
						</div>

						{/* Legend */}
						<div className="flex flex-col gap-1 text-xs">
							<div className="flex items-center gap-1">
								<div className="w-3 h-3 bg-booking-light border-2 border-booking-primary rounded"></div>
								<span>Available</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="w-3 h-3 bg-booking-primary rounded"></div>
								<span>Selected</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="w-3 h-3 bg-gray-300 rounded"></div>
								<span>Sold</span>
							</div>
						</div>
					</div>
				</div>

				<div className="p-4">
					{/* Seat Map */}
					<div className="mb-8">
						<div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide scroll-smooth">
							<div className="min-w-max">
								<div className="px-4">
									{/* Prime Section */}
									<div className="mb-4">
										{/* Prime Header */}
										<div className="py-2 px-4 text-center">
											<span className="text-lg font-bold" style={{ color: '#894eff' }}>
												PRIME ₹270
											</span>
										</div>

										{/* Prime Rows (A to E) */}
										<div className="space-y-2 px-2 pb-4">
											{Object.entries(groupedSeats)
												.filter(([row]) => ['A', 'B', 'C', 'D', 'E'].includes(row))
												.map(([row, rowSeats]) => {
													const zoneInfo = getZoneInfo(row);
													return (
														<div key={row} className="flex items-center gap-2">
															<span
																className="w-8 h-8 text-center text-sm font-bold rounded sticky left-[7px] z-10 flex items-center justify-center"
																style={{
																	backgroundColor: zoneInfo.background,
																	border: `2px solid ${zoneInfo.borderColor}`,
																	color: zoneInfo.textColor,
																}}
															>
																{row}
															</span>
															<div className="flex gap-1 justify-center min-w-max">
																{Array.from({ length: 16 }, (_, index) => {
																	const seatNumber = index + 1;
																	const seat = rowSeats.find(
																		(s) => s.number === seatNumber
																	);

																	if (!seat) {
																		return (
																			<div
																				key={`${row}-${seatNumber}`}
																				className="w-10 h-10 flex-shrink-0"
																			/>
																		);
																	}

																	return (
																		<div
																			key={seat.id}
																			className={`w-10 h-10 flex-shrink-0 relative ${
																				seat.status === 'sold'
																					? 'cursor-not-allowed seat-sold'
																					: selectedSeats.includes(seat.id)
																					? 'cursor-pointer transition-all hover:scale-105 seat-selected'
																					: 'cursor-pointer transition-all hover:scale-105 seat-available'
																			}`}
																			onClick={() => handleSeatClick(seat.id)}
																			dangerouslySetInnerHTML={{
																				__html: getSeatSVG(seat),
																			}}
																		></div>
																	);
																})}
															</div>
														</div>
													);
												})}
										</div>
									</div>

									{/* Dotted separator */}
									<div className="border-t-2 border-dashed border-gray-300 my-4"></div>

									{/* Classic Plus Section */}
									<div className="mb-4">
										{/* Classic Plus Header */}
										<div className="py-2 px-4 text-center">
											<span className="text-lg font-bold" style={{ color: '#3c9ef8' }}>
												CLASSIC PLUS ₹220
											</span>
										</div>

										{/* Classic Plus Rows (F to H) */}
										<div className="space-y-2 px-2 pb-4">
											{Object.entries(groupedSeats)
												.filter(([row]) => ['F', 'G', 'H'].includes(row))
												.map(([row, rowSeats]) => {
													const zoneInfo = getZoneInfo(row);
													return (
														<div key={row} className="flex items-center gap-2">
															<span
																className="w-8 h-8 text-center text-sm font-bold rounded sticky left-[7px] z-10 flex items-center justify-center"
																style={{
																	backgroundColor: zoneInfo.background,
																	border: `2px solid ${zoneInfo.borderColor}`,
																	color: zoneInfo.textColor,
																}}
															>
																{row}
															</span>
															<div className="flex gap-1 justify-center min-w-max">
																{Array.from({ length: 16 }, (_, index) => {
																	const seatNumber = index + 1;
																	const seat = rowSeats.find(
																		(s) => s.number === seatNumber
																	);

																	if (!seat) {
																		return (
																			<div
																				key={`${row}-${seatNumber}`}
																				className="w-10 h-10 flex-shrink-0"
																			/>
																		);
																	}

																	return (
																		<div
																			key={seat.id}
																			className={`w-10 h-10 flex-shrink-0 relative ${
																				seat.status === 'sold'
																					? 'cursor-not-allowed seat-sold'
																					: selectedSeats.includes(seat.id)
																					? 'cursor-pointer transition-all hover:scale-105 seat-selected'
																					: 'cursor-pointer transition-all hover:scale-105 seat-available'
																			}`}
																			onClick={() => handleSeatClick(seat.id)}
																			dangerouslySetInnerHTML={{
																				__html: getSeatSVG(seat),
																			}}
																		></div>
																	);
																})}
															</div>
														</div>
													);
												})}
										</div>
									</div>

									{/* Dotted separator */}
									<div className="border-t-2 border-dashed border-gray-300 my-4"></div>

									{/* Classic Section */}
									<div className="mb-4">
										{/* Classic Header */}
										<div className="py-2 px-4 text-center">
											<span className="text-lg font-bold" style={{ color: '#2acb6a' }}>
												CLASSIC ₹200
											</span>
										</div>

										{/* Classic Rows (I to L) */}
										<div className="space-y-2 px-2 pb-4">
											{Object.entries(groupedSeats)
												.filter(([row]) => ['I', 'J', 'K', 'L'].includes(row))
												.map(([row, rowSeats]) => {
													const zoneInfo = getZoneInfo(row);
													return (
														<div key={row} className="flex items-center gap-2">
															<span
																className="w-8 h-8 text-center text-sm font-bold rounded sticky left-[7px] z-10 flex items-center justify-center"
																style={{
																	backgroundColor: zoneInfo.background,
																	border: `2px solid ${zoneInfo.borderColor}`,
																	color: zoneInfo.textColor,
																}}
															>
																{row}
															</span>
															<div className="flex gap-1 justify-center min-w-max">
																{Array.from({ length: 16 }, (_, index) => {
																	const seatNumber = index + 1;
																	const seat = rowSeats.find(
																		(s) => s.number === seatNumber
																	);

																	if (!seat) {
																		return (
																			<div
																				key={`${row}-${seatNumber}`}
																				className="w-10 h-10 flex-shrink-0"
																			/>
																		);
																	}

																	return (
																		<div
																			key={seat.id}
																			className={`w-10 h-10 flex-shrink-0 relative ${
																				seat.status === 'sold'
																					? 'cursor-not-allowed seat-sold'
																					: selectedSeats.includes(seat.id)
																					? 'cursor-pointer transition-all hover:scale-105 seat-selected'
																					: 'cursor-pointer transition-all hover:scale-105 seat-available'
																			}`}
																			onClick={() => handleSeatClick(seat.id)}
																			dangerouslySetInnerHTML={{
																				__html: getSeatSVG(seat),
																			}}
																		></div>
																	);
																})}
															</div>
														</div>
													);
												})}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Screen */}
						<div className="text-center mt-4 pt-2 border-t-2 border-booking-primary/20">
							<div className="bg-booking-light rounded-lg p-2 mx-8">
								<img
									src="/lovable-uploads/9e7bc54a-234e-438c-80fc-5e7a12a32546.png"
									alt="Cinema Screen"
									className="w-full h-8 object-contain"
								/>
								<p className="text-xs text-booking-dark font-medium">ALL EYES THIS WAY PLEASE</p>
							</div>
						</div>
					</div>

					{/* Bottom Cart - Matching FoodSelection style */}
					<div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-[99999]">
						<div className="p-3">
							{selectedSeats.length > 0 ? (
								<div className="flex items-center justify-between mb-3 text-sm">
									<span>Seats: {selectedSeats.join(', ')}</span>
									<span>
										Selected: {selectedSeats.length}/{localRequiredSeats}
									</span>
								</div>
							) : (
								<div className="flex items-center justify-center mb-3">
									<span className="text-booking-dark font-medium">
										Waiting for user to select tickets
									</span>
								</div>
							)}
							<Button
								onClick={() => onContinue(selectedSeats, totalPrice)}
								className="w-full bg-booking-primary hover:bg-booking-primary/90 text-white min-h-[72px] py-4 text-lg font-semibold rounded-xl"
							>
								<div className="flex justify-between items-center w-full">
									<div className="text-left">
										<div className="text-lg font-bold">07:30 PM</div>
										<div className="text-xs font-light">THU, 21 AUG</div>
									</div>
									<div className="flex items-center gap-2">
										<span>Order Snacks</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="w-5 h-5"
										>
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
			)}
		</div>
	);
}
