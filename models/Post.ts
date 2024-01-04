import mongoose, { Document, Schema } from 'mongoose';

interface Post extends Document {
    post_type: number,
    user: mongoose.Types.ObjectId,
    description: string,
    location: string,
    img: string,
    video: string,
    created_at: Date,
    modified_at: Date,
}

const postSchema = new Schema<Post>({
    post_type: { type: Number, default: 1 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    location: { type: String },
    img: { type: String },
    video: { type: String },
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now }
});

export default mongoose.model<Post>('Post', postSchema);
