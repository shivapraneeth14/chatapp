import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ 
    cloud_name: process.env.CLODINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const fileUploader = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto" 
        });
        console.log(result.url);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default fileUploader;
