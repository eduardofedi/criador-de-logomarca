export interface LogoGeneration {
    id: string;
    companyName: string;
    base64Image: string | null;
    briefingText: string | null;
    style: string | null;
    color: string | null;
    typography: string | null;
    artDirection: string | null;
    imagePrompt: string | null;
    paymentStatus: string;
    cost: number | null;
    createdAt: string | Date;
    updatedAt: string | Date;
}
