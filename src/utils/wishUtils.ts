import { WishItem, ItemRarity, Banner, WishResult, ItemType } from '../types/types';

// Define drop rates similar to Genshin Impact
const DROP_RATES = {
    // Base rates
    [ItemRarity.ThreeStar]: 0.943,
    [ItemRarity.FourStar]: 0.051,
    [ItemRarity.FiveStar]: 0.006,
};

// Sample fallback items when we don't have a full database
const fallbackItems = {
    [ItemRarity.ThreeStar]: [
        { id: 'debate_club', name: 'Debate Club', type: ItemType.Weapon, rarity: ItemRarity.ThreeStar, imageUrl: '/placeholder-weapon.png' },
        { id: 'black_tassel', name: 'Black Tassel', type: ItemType.Weapon, rarity: ItemRarity.ThreeStar, imageUrl: '/placeholder-weapon.png' },
        { id: 'thrilling_tales', name: 'Thrilling Tales', type: ItemType.Weapon, rarity: ItemRarity.ThreeStar, imageUrl: '/placeholder-weapon.png' },
    ],
    [ItemRarity.FourStar]: [
        { id: 'bennett', name: 'Bennett', type: ItemType.Character, rarity: ItemRarity.FourStar, imageUrl: '/placeholder-character.jpg' },
        { id: 'xingqiu', name: 'Xingqiu', type: ItemType.Character, rarity: ItemRarity.FourStar, imageUrl: '/placeholder-character.jpg' },
        { id: 'stringless', name: 'The Stringless', type: ItemType.Weapon, rarity: ItemRarity.FourStar, imageUrl: '/placeholder-weapon.png' },
    ],
    [ItemRarity.FiveStar]: [
        { id: 'diluc', name: 'Diluc', type: ItemType.Character, rarity: ItemRarity.FiveStar, imageUrl: '/placeholder-character.jpg' },
        { id: 'ganyu', name: 'Ganyu', type: ItemType.Character, rarity: ItemRarity.FiveStar, imageUrl: '/placeholder-character.jpg' },
        { id: 'wgs', name: 'Wolf\'s Gravestone', type: ItemType.Weapon, rarity: ItemRarity.FiveStar, imageUrl: '/placeholder-weapon.png' },
    ]
};

// Simulates pulling items based on banner and Genshin Impact's gacha system
export function generateWishResults(count: number, banner: Banner): WishResult[] {
    const results: WishResult[] = [];

    for (let i = 0; i < count; i++) {
        const rand = Math.random();
        let rarity: ItemRarity;

        // Determine rarity based on probability
        if (rand <= DROP_RATES[ItemRarity.FiveStar]) {
            rarity = ItemRarity.FiveStar;
        } else if (rand <= DROP_RATES[ItemRarity.FiveStar] + DROP_RATES[ItemRarity.FourStar]) {
            rarity = ItemRarity.FourStar;
        } else {
            rarity = ItemRarity.ThreeStar;
        }

        // Get pool of items for this rarity
        const itemPool = fallbackItems[rarity];

        // Check if we should get a featured item (50% chance for 5-star, higher for 4-star)
        const isFeatured = Math.random() < (rarity === ItemRarity.FiveStar ? 0.5 : 0.7);

        let selectedItem: WishItem;

        if (isFeatured && rarity >= ItemRarity.FourStar) {
            const featuredPool = banner.featuredItems.filter(item => item.rarity === rarity);
            if (featuredPool.length > 0) {
                selectedItem = featuredPool[Math.floor(Math.random() * featuredPool.length)];
            } else {
                selectedItem = itemPool[Math.floor(Math.random() * itemPool.length)];
            }
        } else {
            selectedItem = itemPool[Math.floor(Math.random() * itemPool.length)];
        }

        // Simulate if the item is new for the player (random for demo)
        const isNew = Math.random() < 0.3;

        results.push({
            ...selectedItem,
            isNew
        });
    }

    // Sort by rarity (highest first)
    return results.sort((a, b) => b.rarity - a.rarity);
}