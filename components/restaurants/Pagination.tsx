import { PagedRestaurants, RestaurantSearchFilters } from "@/lib/types/restaurants";
import Link from "next/link";


interface PaginationProps {
    currentPage: number
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    filters: RestaurantSearchFilters
}

export default function PaginationComponent({ currentPage, size, totalElements, totalPages, first, last, filters }: PaginationProps) {

    function buildHref(targetPage: number) {
        const qs = new URLSearchParams();
        if (filters.name) qs.set("name", filters.name);
        if (filters.city) qs.set("city", filters.city);
        if (filters.province) qs.set("province", filters.province);
        if (filters.cuisineType) qs.set("cuisineType", filters.cuisineType);
        if (filters.dietaryOption) qs.set("dietaryOption", filters.dietaryOption);
        if (filters.maxPrice) qs.set("maxPrice", filters.maxPrice.toLocaleString());
        qs.set("page", String(targetPage));
        return `/restaurants/?${qs.toString()}`
    }

    return (
        <nav className="flex text-black gap-5">
            {first ? (
                <span className="cursor-not-allowed opacity-50">Anterior</span>
            ) : (
                <Link href={`${buildHref(currentPage - 1)}`} className={`${first ? "cursor-not-allowed opacity-50" : ""}`}>
                    Anterior
                </Link>
            )}

            <span>Página {currentPage + 1} de {totalPages}</span>

            {last ? (
                <span className="cursor-not-allowed opacity-50">Siguiente</span>

            ) : (
                <Link href={`${buildHref(currentPage + 1)}`} className={`${last ? "cursor-not-allowed opacity-50" : ""}`}>
                    Siguiente
                </Link>
            )}
        </nav>
    )
}