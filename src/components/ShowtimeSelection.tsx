import { ArrowLeft, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { LanguageFormatSelection } from './LanguageFormatSelection';

interface ShowtimeSelectionProps {
	onBack: () => void;
	onSelectTime: (time: string) => void;
}

export function ShowtimeSelection({ onBack, onSelectTime }: ShowtimeSelectionProps) {
	const [selectedDate, setSelectedDate] = useState('THU 21');
	const [showLanguagePopup, setShowLanguagePopup] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState('🇮🇳 हिन्दी (Hindi)');
	const [selectedFormat, setSelectedFormat] = useState('2D');
	const [selectedTime, setSelectedTime] = useState('');

	const dates = [
		{ day: 'THU', date: '21', month: 'AUG' },
		{ day: 'FRI', date: '22', month: 'AUG' },
		{ day: 'SAT', date: '23', month: 'AUG' },
		{ day: 'SUN', date: '24', month: 'AUG' },
		{ day: 'MON', date: '25', month: 'AUG' },
		{ day: 'TUE', date: '26', month: 'AUG' },
		{ day: 'WED', date: '27', month: 'AUG' },
	];

	const showtimes = [
		{ time: '07:30 PM', label: 'INSIGNIA' },
		{ time: '07:45 PM', label: '' },
		{ time: '08:15 PM', label: '' },
		{ time: '08:55 PM', label: '' },
		{ time: '09:25 PM', label: 'INSIGNIA' },
		{ time: '10:25 PM', label: '' },
		{ time: '10:55 PM', label: '' },
		{ time: '11:10 PM', label: 'INSIGNIA' },
		{ time: '11:25 PM', label: '' },
	];

	const priceFilters = ['₹0 - ₹100', '₹101 - ₹200', '₹201 - ₹300'];

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="sticky top-0 bg-white border-b shadow-sm z-10">
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<Button variant="ghost" size="icon" onClick={onBack}>
							<ArrowLeft className="w-5 h-5" />
						</Button>
						<img
							src="https://m.media-amazon.com/images/M/MV5BNjY5OTg4NTYtZjVkZS00YTZmLWIwNDEtM2Y0ODQyMzM2NTJiXkEyXkFqcGc@._V1_.jpg"
							alt="WAR 2"
							className="w-12 h-16 rounded-lg object-cover"
						/>
						<div>
							<h1 className="font-bold text-lg text-booking-dark">WAR 2</h1>
							<p className="text-xs text-gray-600">🇮🇳 हिन्दी (Hindi)</p>
						</div>
					</div>
				</div>

				{/* Date Selection */}
				<div className="px-4 pb-4">
					<div className="flex gap-3 overflow-x-auto scrollbar-hide">
						{dates.map((date) => (
							<Button
								key={`${date.day}-${date.date}`}
								variant={selectedDate === `${date.day} ${date.date}` ? 'default' : 'outline'}
								className={`min-w-[80px] min-h-[90px] px-6 py-4 rounded-lg ${
									selectedDate === `${date.day} ${date.date}`
										? 'bg-booking-primary text-white'
										: 'border-gray-200 text-gray-600'
								}`}
								onClick={() => setSelectedDate(`${date.day} ${date.date}`)}
							>
								<div className="text-center">
									<div className="text-sm font-medium">{date.day}</div>
									<div className="text-lg font-bold">{date.date}</div>
									<div className="text-xs">{date.month}</div>
								</div>
							</Button>
						))}
					</div>
				</div>

				{/* Language & Format */}
				<div className="px-4 pb-4 flex justify-center">
					<div className="flex items-center justify-between mb-3">
						<span className="text-sm font-medium text-booking-dark">🇮🇳 हिन्दी (Hindi) • 2D</span>
						<Button
							variant="ghost"
							className="text-booking-primary text-sm"
							onClick={() => setShowLanguagePopup(true)}
						>
							Change
						</Button>
					</div>
				</div>
			</div>

			{/* Showtimes */}
			<div className="p-4 pb-32">
				<Card className="p-4 shadow-card">
					<div className="mb-4">
						<h3 className="font-semibold text-booking-dark mb-1">Available Showtimes</h3>
						<p className="text-xs text-gray-600">Cancellation available</p>
					</div>

					<div className="grid grid-cols-3 gap-3">
						{showtimes.map((show, index) => (
							<Button
								key={index}
								variant="outline"
								className={`h-auto p-3 transition-colors ${
									selectedTime === show.time
										? 'bg-booking-primary text-white border-booking-primary'
										: 'border-booking-primary/30 hover:bg-booking-light hover:border-booking-primary'
								}`}
								onClick={() => setSelectedTime(show.time)}
							>
								<div className="text-center">
									<div
										className={`text-sm font-semibold ${
											selectedTime === show.time ? 'text-white' : 'text-booking-dark'
										}`}
									>
										{show.time}
									</div>
									{show.label && (
										<div
											className={`text-xs mt-1 ${
												selectedTime === show.time ? 'text-white/80' : 'text-gray-500'
											}`}
										>
											{show.label}
										</div>
									)}
								</div>
							</Button>
						))}
					</div>

					<div className="mt-4 text-center">
						<p className="text-xs text-gray-500">
							<span className="inline-block w-2 h-2 bg-booking-primary rounded mr-2"></span>
							indicates subtitle language, if subtitles are available
						</p>
					</div>
				</Card>
			</div>

			{/* Sticky Footer */}
			<div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
				<div className="p-4">
					<Button
						onClick={() => selectedTime && onSelectTime(selectedTime)}
						disabled={!selectedTime}
						className="w-full bg-booking-primary hover:bg-booking-primary/90 text-white min-h-[72px] py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<div className="flex justify-between items-center w-full">
							<div className="text-left">
								<div className="text-lg font-bold">{selectedTime || '07:30 PM'}</div>
								<div className="text-xs font-light">THU, 21 AUG</div>
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

			{/* Language & Format Selection Popup */}
			{showLanguagePopup && (
				<LanguageFormatSelection
					onContinue={(language, format) => {
						setSelectedLanguage(language);
						setSelectedFormat(format);
						setShowLanguagePopup(false);
					}}
					onClose={() => setShowLanguagePopup(false)}
				/>
			)}
		</div>
	);
}
