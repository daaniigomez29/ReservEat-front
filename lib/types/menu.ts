export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    available: boolean;
}


export interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

export interface Menu {
    id: string;
    restaurantId: string;
    menuCategories: MenuCategory[];
}