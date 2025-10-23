"use client";

import dynamic from 'next/dynamic';

const ImageUploadArea = dynamic(() => import('../components/ImageUploadArea'), { ssr: false });

export default function Home() {
    return <ImageUploadArea />;
}
