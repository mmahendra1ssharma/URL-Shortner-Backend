import { prisma } from "../config/prisma.connect.js"; 
import { generateUniqueShortURL } from "../config/generateShortURL.js";  

const validateURL = (url) => {
    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return urlRegex.test(url);
};

export const shortenURL = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: "User unauthorized", status: 400 });
        }
        
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ message: "Bad Request: Missing URL", status: 400 });
        }

        if (!validateURL(originalUrl)) {
            return res.status(400).json({ message: "Invalid URL format", status: 400 });
        }

        const existingURL = await prisma.url.findFirst({
            where: { originalUrl, userId },
        });

        if (existingURL) {
            return res.status(200).json({
                message: "URL already shortened",
                shortUrl: existingURL.shortUrl,
                status: 200,
            });
        }
 
        let shortUrl;
        shortUrl = generateUniqueShortURL(); // Correctly call the function

        const newURL = await prisma.url.create({
            data: {
                originalUrl,
                shortUrl,
                userId,
            },
        });

        return res.status(201).json({
            message: "URL shortened successfully",
            shortUrl: newURL.shortUrl,
            id: newURL.id,
            status: 201,
        });
    } catch (error) {
        console.error("Error in shortenURL:", error);
        return res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
};  

export const updateOriginalURLtoShorten = async (req, res) => {
    try {
        const id = req.params.id;
        const { newOriginalUrl } = req.body;

        if (!id || !newOriginalUrl) {
            return res.status(400).json({
                message: "Bad Request: Missing ID or URL"
            });
        }

        const existingURL = await prisma.url.findUnique({
            where: { id }
        });

        if (!existingURL) {
            return res.status(404).json({
                message: "URL not found in database"
            });
        }

        const shortUrl = generateUniqueShortURL();

        // Update the URL
        const updatedURL = await prisma.url.update({
            where: { id },
            data: { 
                originalUrl: newOriginalUrl,
                shortUrl,  // Regenerate the short URL
            }
        });

        return res.status(200).json({
            message: "Original URL updated successfully",
            updatedOriginalUrl: updatedURL.originalUrl,
            updatedShortUrl: updatedURL.shortUrl
        });

    } catch (error) {
        console.error("Error in updateOriginalURL:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


export const deleteURL = async(req,res) => {
    try {
        const id = req.params.id;
        const {originalUrl} = req.body;

        if(!originalUrl || !id){
            return res.status(400).json({
                message: "Bad Request"
            })
        }

        const existingURL = await prisma.url.findFirst({
            where: originalUrl
        })

        if(!existingURL){
            return res.status(404).json({
                error: "URL doesnt exists"
            })
        }
        const deleteurl = await prisma.url.delete({
            where: {
                existingURL
            }
        })

        return res.status(201).json({
            message: "URL deleted successfully",
            deleteurl
        })
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}