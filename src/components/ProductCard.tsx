import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ id, name, priceInCents, description, imagePath }: {
    id: string,
    name: string,
    priceInCents: number,
    description: string,
    imagePath: string
}) {
    return (
        <Card>
            <div className="relative w-full h-auto aspect-video">
                <Image src={imagePath} alt={name} fill />
            </div>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="line-CLamp-4">{description}</p>
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full">
                    <Link href={`products/${id}/purchase`}>Purchase</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}