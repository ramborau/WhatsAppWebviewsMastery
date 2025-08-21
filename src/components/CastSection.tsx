import { useEffect, useState } from 'react';

interface CastMember {
  id: string;
  name: string;
  image: string;
}

const castMembers: CastMember[] = [
  {
    id: '1',
    name: 'Hrithik Roshan',
    image: '/lovable-uploads/762bc44e-febb-4b97-bc2f-eb557f97a87a.png'
  },
  {
    id: '2',
    name: 'Kiara Advani',
    image: '/lovable-uploads/4289ac9e-e57a-4921-ac7e-38e6a10f94e5.png'
  },
  {
    id: '3',
    name: 'Jr. NTR',
    image: '/lovable-uploads/d31543da-bd2c-42b0-a27c-26658444cce3.png'
  },
  {
    id: '4',
    name: 'Shabir Ahluwalia',
    image: '/lovable-uploads/c6573cf1-c08f-479c-8f38-b669089f97c1.png'
  },
  {
    id: '5',
    name: 'Tiger Shroff',
    image: '/lovable-uploads/016970ac-57bc-4e43-a430-177f6857b784.png'
  }
];

export function CastSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Create enough duplicates for seamless infinite scroll
  const extendedCast = [...castMembers, ...castMembers, ...castMembers];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Reset position when we've scrolled through one complete set
  useEffect(() => {
    if (currentIndex >= castMembers.length) {
      setTimeout(() => {
        setCurrentIndex(0);
      }, 1000); // Wait for transition to complete
    }
  }, [currentIndex]);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3 text-booking-dark">Cast</h3>
      <div className="relative overflow-hidden h-20">
        <div 
          className="flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 20}%)`,
            width: `${extendedCast.length * 20}%`
          }}
        >
          {extendedCast.map((actor, index) => (
            <div
              key={`${actor.id}-${Math.floor(index / castMembers.length)}`}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: `${100 / extendedCast.length}%` }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-booking-primary shadow-md">
                <img
                  src={actor.image}
                  alt={actor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}