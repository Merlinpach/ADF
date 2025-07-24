import React from 'react';
import { ShieldIcon, UsersIcon, FireIcon, StarIcon, SunIcon, MoonIcon, UtensilsIcon, PhoneIcon, ScissorsIcon, ShoppingCartIcon, ShirtIcon, DumbbellIcon, StethoscopeIcon, MapIcon, WifiIcon } from './components/Icons';

interface SectionConfig {
  id: string;
  icon: React.ReactNode;
}

export const SECTION_CONFIG: SectionConfig[] = [
  {
    id: 'shiluv-raui',
    icon: <UsersIcon />,
  },
  {
    id: 'bitachon-meida',
    icon: <ShieldIcon />,
  },
  {
    id: 'betichut',
    icon: <FireIcon />,
  },
  {
    id: 'sherutey-hadat',
    icon: <StarIcon />,
  },
  {
    id: 'shabatot-vehagim',
    icon: <MoonIcon />,
  },
  {
    id: 'tzomot',
    icon: <SunIcon />,
  },
  {
    id: 'hadar-ochel',
    icon: <UtensilsIcon />,
  },
  {
    id: 'moked-merkazi',
    icon: <PhoneIcon />,
  },
  {
    id: 'mispara',
    icon: <ScissorsIcon />,
  },
  {
    id: 'merkaz-mischari',
    icon: <ShoppingCartIcon />,
  },
  {
    id: 'apsanaut',
    icon: <ShirtIcon />,
  },
  {
    id: 'sherutey-sport',
    icon: <DumbbellIcon />,
  },
  {
    id: 'maarach-harefua',
    icon: <StethoscopeIcon />,
  },
  {
    id: 'info-services',
    icon: <WifiIcon />,
  },
  {
    id: 'mapa',
    icon: <MapIcon />,
  },
];