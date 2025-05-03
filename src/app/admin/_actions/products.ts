"use server";

import { z } from "zod";
import fs from "fs/promises";
import { db } from "@/db/db";
import { notFound, redirect } from "next/navigation";


const fileSchema = z.instanceof(File, { message: "File is required" });
const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"));

const addSchema = z.object({
    name: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    description: z.string().min(1),
    file: fileSchema.refine(file => file.size > 0, "Required"),
    image: imageSchema.refine(file => file.size > 0, "Required")
});

export async function addProduct(prevState: unknown, formData: FormData) {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if (!result.success) {
        return result.error.formErrors.fieldErrors
    }

    const { name, priceInCents, description, file, image } = result.data;

    await fs.mkdir("products", { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${file.name}`;
    await fs.writeFile(filePath, new Uint8Array(await file.arrayBuffer()));

    await fs.mkdir("public/products", { recursive: true });
    const imagePath = `/products/${crypto.randomUUID()}-${image.name}`;
    await fs.writeFile(`public${imagePath}`, new Uint8Array(await image.arrayBuffer()));

    await db.product.create({
        data: {
            isAvailableForPurchase: false,
            name,
            priceInCents,
            description,
            filePath,
            imagePath
        }
    });

    redirect("/admin/products");
}

const editSChema = addSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional()
})

export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
    const result = editSChema.safeParse(Object.fromEntries(formData.entries()))
    if (!result.success) {
        return result.error.formErrors.fieldErrors
    }

    const { name, priceInCents, description, file, image } = result.data;
    const product = await db.product.findUnique({ where: { id } });

    if (product == null) notFound();

    let filePath = product.filePath;
    if (file != null && file.size > 0) {
        await fs.unlink(product.filePath);
        filePath = `products/${crypto.randomUUID()}-${file.name}`;
        await fs.writeFile(filePath, new Uint8Array(await file.arrayBuffer()));
    }

    let imagePath = product.imagePath;
    if (image != null && image.size > 0) {
        await fs.unlink(`public${product.imagePath}`);
        imagePath = `/products/${crypto.randomUUID()}-${image.name}`;
        await fs.writeFile(`public${imagePath}`, new Uint8Array(await image.arrayBuffer()));
    }

    await db.product.update({
        where: { id },
        data: {
            name,
            priceInCents,
            description,
            filePath,
            imagePath
        }
    });

    redirect("/admin/products");
}

export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
    await db.product.update({
        where: { id },
        data: { isAvailableForPurchase }
    });
}

export async function deleteProduct(id: string) {
    const product = await db.product.delete({
        where: { id }
    });

    if (product ==  null) {
        return notFound();
    }

    await fs.unlink(product.filePath);
    await fs.unlink(`public${product.imagePath}`);
}  