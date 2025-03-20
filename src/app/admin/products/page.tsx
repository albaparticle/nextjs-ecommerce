import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";
import { db } from "@/db/db";

export default function AdminProductsPage() {
    return (
        <>
            <div className="flex justify-between items-center gap-4">
                <PageHeader>Products</PageHeader>
                <Button asChild>
                    <Link href="/admin/products/new">Add Product</Link>
                </Button>
            </div>
            <ProductsTable />
        </>
    )
}

async function ProductsTable() {
    const products = await db.product.findMany({
        select: {
            id: true,
            name: true,
            priceInCents: true,
            isAvailableForPurchase: true,
            _count: {
                select: {
                    orders: true
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    })

    if (products.length === 0) return <p>No products found</p>

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-0">
                    <span className="sr-only">Available for Purchase</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.map(product => (
                <TableRow key={product.id}>
                    <TableCell>{product.isAvailableForPurchase ? (<><CheckCircle2 /></>) : (<><XCircle /></>)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}