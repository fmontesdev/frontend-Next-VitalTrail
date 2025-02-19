'use client';

import Image from "next/image";
import { IAvatar } from "@/shared/interfaces/components/avatar.interface";

export default function Avatar({ src, name, surname }: IAvatar) {
    return (
        <div className="w-14 h-14 rounded-full overflow-hidden bg-stone-100 flex items-center justify-center">
            {src ? (
                <Image
                    src={`/avatar/${src}`}
                    alt={name + surname}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="text-xl font-black text-teal-700">
                    {name?.slice(0, 1).toUpperCase()}
                    {surname?.slice(0, 1).toUpperCase()}
                </span>
            )}
        </div>
    );
}
