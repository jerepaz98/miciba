export type MockCategory = {
  id: string;
  label: string;
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
};

export const mockCategories: MockCategory[] = [
  { id: 'all', label: 'Todas', icon: 'grid', iconFamily: 'Ionicons' },
  { id: 'Cardiologia', label: 'Cardiologia', icon: 'heart-pulse', iconFamily: 'MaterialCommunityIcons' },
  { id: 'Dermatologia', label: 'Dermatologia', icon: 'flower-outline', iconFamily: 'MaterialCommunityIcons' },
  { id: 'Pediatria', label: 'Pediatria', icon: 'baby-face-outline', iconFamily: 'MaterialCommunityIcons' },
  { id: 'Ginecologia', label: 'Ginecologia', icon: 'human-female', iconFamily: 'MaterialCommunityIcons' },
  { id: 'Traumatologia', label: 'Traumatologia', icon: 'bone', iconFamily: 'MaterialCommunityIcons' },
  { id: 'Neurologia', label: 'Neurologia', icon: 'brain', iconFamily: 'MaterialCommunityIcons' },
  { id: 'Psicologia', label: 'Psicologia', icon: 'head-heart-outline', iconFamily: 'MaterialCommunityIcons' },
  { id: 'Odontologia', label: 'Odontologia', icon: 'tooth-outline', iconFamily: 'MaterialCommunityIcons' },
  { id: 'Oftalmologia', label: 'Oftalmologia', icon: 'eye-outline', iconFamily: 'Ionicons' },
  { id: 'Endocrinologia', label: 'Endocrinologia', icon: 'molecule', iconFamily: 'MaterialCommunityIcons' },
  { id: 'Kinesiologia', label: 'Kinesiologia', icon: 'run', iconFamily: 'MaterialCommunityIcons' }
];
