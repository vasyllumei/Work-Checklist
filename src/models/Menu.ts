import mongoose, { Document, Schema } from 'mongoose';

export type MenuDocumentType = Document & {
    name: string;
    link: string;
    order: number;
    children: {
        name: string;
        link: string;
        order: number;
    }[]
};

const MenuSchema = new Schema<MenuDocumentType>(
    {
        name: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            required: true,
        },
        children: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    link: {
                        type: String,
                        required: true,
                    },
                    order: {
                        type: Number,
                        required: true,
                    }
                }
            ],
        }
    },
    { timestamps: true },
);

export default mongoose.models.Menu || mongoose.model<MenuDocumentType>('Menu', MenuSchema);
