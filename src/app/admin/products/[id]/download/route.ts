import { db } from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await db.product.findUnique({
        where: { id },
        select: {
            filePath: true,
            name: true
        }
    });

    if (product == null) return notFound();

    const {size} = await fs.stat(product.filePath);
    const file = new Uint8Array(await fs.readFile(product.filePath));
    const extension = product.filePath.split(".").pop();

    return new NextResponse(file, {headers: {
        "Content-Type": `application/${extension}`,
        "Content-Length": size.toString(),
        "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    }})
}