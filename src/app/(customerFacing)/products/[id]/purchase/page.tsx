import { db } from "@/db/db";
import { notFound } from "next/navigation";

const stripe = new Stripe

export default async function PurchasePage({
    params: { id },
}: { params: { id: string } }) {
    const product = await db.product.findUnique({ where: { id } });
    if (product == null) return notFound();

    return <h1>Hi!</h1>
}