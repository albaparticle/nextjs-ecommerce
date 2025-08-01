import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { db } from "@/db/db";
import { cache } from "@/lib/caches";
import { Suspense } from "react";

const getProducts = cache( () => {
    return db.product.findMany({
        where: {
            isAvailableForPurchase: true
        },
        orderBy: {
            name: 'asc'
        },
    })
}, ["/products", "getProducts"])

export default function ProductsPage() {
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text-3xl font-bold">Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Suspense fallback={
                    <>
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </>
                }>
                    <ProductsSuspense />
                </Suspense>
            </div>
        </div>
    );
}

async function ProductsSuspense() {
    const products = await getProducts();
    return products.map(product => (
        <ProductCard key={product.id} {...product} />
    ));
}