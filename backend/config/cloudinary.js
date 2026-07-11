import { v2 as cloudinary } from 'cloudinary';

const uploadOnCloudinary = async (file) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
        if (!file) {
            return null;
        }

        // Support string paths as fallback
        if (typeof file === "string") {
            const uploadResult = await cloudinary.uploader.upload(file);
            return uploadResult.secure_url;
        }

        // Convert the in-memory file buffer to a base64 data URI
        const base64Format = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        const uploadResult = await cloudinary.uploader.upload(base64Format);
        return uploadResult.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
}

export default uploadOnCloudinary
    
