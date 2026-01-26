import { Doctor } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sofia Herrera',
    specialty: 'Cardiólogo/a',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=facearea&w=400&h=400',
    category: 'Cardiology',
    bio: 'Especialista en prevención cardiovascular y diagnósticos avanzados.'
  },
  {
    id: 'd2',
    name: 'Dr. Mateo Ruiz',
    specialty: 'Dermatólogo/a',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=facearea&w=400&h=400',
    category: 'Dermatology',
    bio: 'Enfocado en dermatología clínica y procedimientos estéticos.'
  },
  {
    id: 'd3',
    name: 'Dr. Ana Torres',
    specialty: 'Pediatra',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=facearea&w=400&h=400',
    category: 'Pediatrics',
    bio: 'Atención centrada en la familia para niños y adolescentes.'
  }
];
