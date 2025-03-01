export enum ItemRarity {
    ThreeStar = 3,
    FourStar = 4,
    FiveStar = 5,
}

export enum ItemType {
    Character = 'character',
    Weapon = 'weapon',
}

export interface WishItem {
    id: string;
    name: string;
    type: ItemType;
    rarity: ItemRarity;
    imageUrl: string;
    element?: string; // For characters
    weaponType?: string; // For characters
}

export interface Banner {
    id: string;
    name: string;
    featuredItems: WishItem[];
    backgroundImage: string;
}

export type WishResult = WishItem & {
    isNew: boolean;
}