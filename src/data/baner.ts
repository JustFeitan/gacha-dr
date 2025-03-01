import { Banner } from '../types/types';

// In Vite, we need to import images explicitly or use URL constructors
// Default placeholder images for development
export const standardBanner: Banner = {
    id: 'wanderlust_invocation',
    name: 'Wanderlust Invocation',
    featuredItems: [
        // We'll set these directly instead of filtering from allItems for now
        {
            id: 'diluc',
            name: 'Diluc',
            type: 'character',
            rarity: 5,
            imageUrl: '/placeholder-character.jpg',
            element: 'Pyro',
            weaponType: 'Claymore',
        },
        {
            id: 'bennett',
            name: 'Bennett',
            type: 'character',
            rarity: 4,
            imageUrl: '/placeholder-character.jpg',
            element: 'Pyro',
            weaponType: 'Sword',
        }
    ],
    backgroundImage: '/placeholder-banner.jpg', // Default placeholder image
};

export const characterEventBanner: Banner = {
    id: 'adrift_in_the_harbor',
    name: 'Adrift in the Harbor',
    featuredItems: [
        {
            id: 'ganyu',
            name: 'Ganyu',
            type: 'character',
            rarity: 5,
            imageUrl: '/placeholder-character.jpg',
            element: 'Cryo',
            weaponType: 'Bow',
        }
    ],
    backgroundImage: '/placeholder-banner.jpg',
};

export const weaponBanner: Banner = {
    id: 'epitome_invocation',
    name: 'Epitome Invocation',
    featuredItems: [
        {
            id: 'wgs',
            name: 'Wolf\'s Gravestone',
            type: 'weapon',
            rarity: 5,
            imageUrl: '/placeholder-weapon.png',
        }
    ],
    backgroundImage: '/placeholder-banner.jpg',
};