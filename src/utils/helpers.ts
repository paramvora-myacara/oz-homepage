export const toCamelCase = (slug: string): string => {
    const parts = slug.split('-');
    return parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const formatDate = (dateString: string): string => {
    if (!dateString) return 'Unknown date';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Invalid date';
    }
}

/**
 * Sanitizes a filename for safe storage in cloud storage systems
 * - Preserves file extension
 * - Replaces problematic characters (%, &, $, etc.) with underscores
 * - Replaces spaces with underscores
 * - Removes or replaces other special characters that can cause issues
 * @param fileName - The original filename
 * @returns A sanitized filename safe for storage APIs
 */
export const sanitizeFileName = (fileName: string): string => {
    if (!fileName) return 'file';

    // Split filename into name and extension
    const lastDotIndex = fileName.lastIndexOf('.');
    const hasExtension = lastDotIndex > 0 && lastDotIndex < fileName.length - 1;

    let baseName = hasExtension ? fileName.substring(0, lastDotIndex) : fileName;
    const extension = hasExtension ? fileName.substring(lastDotIndex) : '';

    // Replace problematic characters that cause issues with storage APIs
    // Replace spaces with underscores
    baseName = baseName.replace(/\s+/g, '_');

    // Replace problematic special characters with underscores
    // This includes: %, &, $, #, @, !, *, (, ), [, ], {, }, |, \, /, :, ;, ", ', <, >, ?, ~, `
    baseName = baseName.replace(/[%&$#@!*()[\]{}|\\/:;"'<>?~`]/g, '_');

    // Replace multiple consecutive underscores with a single underscore
    baseName = baseName.replace(/_+/g, '_');

    // Remove leading/trailing underscores
    baseName = baseName.replace(/^_+|_+$/g, '');

    // Ensure we have a valid base name
    if (!baseName) {
        baseName = 'file';
    }

    return baseName + extension;
}

