const pdfParse = require('pdf-parse');
const sharp = require('sharp');

class FileProcessor {
    async processFile(buffer, mimeType) {
        try {
            if (mimeType === 'application/pdf') {
                return await this.processPDF(buffer);
            } else if (mimeType.startsWith('image/')) {
                return await this.processImage(buffer, mimeType);
            } else {
                throw new Error(`Unsupported file type: ${mimeType}`);
            }
        } catch (error) {
            console.error('File processing error:', error);
            throw new Error(`Failed to process file: ${error.message}`);
        }
    }

    async processPDF(buffer) {
        try {
            const data = await pdfParse(buffer);
            return { 
                buffer: Buffer.from(data.text, 'utf8'), 
                isText: true,
                content: data.text 
            };
        } catch (error) {
            throw new Error(`PDF processing failed: ${error.message}`);
        }
    }

    async processImage(buffer, mimeType) {
        try {
            // Optimize image for AI processing
            const processedBuffer = await sharp(buffer)
                .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 90 })
                .toBuffer();
            
            return { 
                buffer: processedBuffer, 
                isText: false,
                mimeType: 'image/jpeg'
            };
        } catch (error) {
            throw new Error(`Image processing failed: ${error.message}`);
        }
    }

    validateFileType(mimeType) {
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png'
        ];
        
        return allowedTypes.includes(mimeType);
    }

    getFileSize(buffer) {
        return (buffer.length / 1024 / 1024).toFixed(2); // MB
    }
}

module.exports = FileProcessor;
