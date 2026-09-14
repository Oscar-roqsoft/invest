// composables/useImageCompressor.js
import imageCompression from 'browser-image-compression';

/**
 * Image compression composable.
 * Automatically compresses images before upload.
 */
export const useImageCompressor = () => {
  /**
   * Compress a single image file.
   * @param {File} file
   * @param {Object} options
   * @returns {Promise<{success, file?, originalSize?, compressedSize?, savings?, message?}>}
   */
  const compressImage = async (file, options = {}) => {
    const {
      maxSizeMB = 1,               // Max file size after compression
      maxWidthOrHeight = 1920,     // Max dimensions
      initialQuality = 0.85,        // 0-1
      useWebWorker = true,         // Offload to worker (better UX)
      fileType = 'image/jpeg',     // Output format: jpeg, webp, png
      onProgress = null,
    } = options;

    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    // Only compress images
    if (!file.type.startsWith('image/')) {
      return {
        success: true,
        file, // Return as-is
        compressed: false,
        originalSize: file.size,
        compressedSize: file.size,
        savings: 0,
      };
    }

    // Skip compression for SVG (vector, already small)
    if (file.type === 'image/svg+xml') {
      return {
        success: true,
        file,
        compressed: false,
        originalSize: file.size,
        compressedSize: file.size,
        savings: 0,
      };
    }

    try {
      const compressionOptions = {
        maxSizeMB,
        maxWidthOrHeight,
        initialQuality,
        useWebWorker,
        fileType,
        onProgress: onProgress || undefined,
      };

      const compressedFile = await imageCompression(file, compressionOptions);

      const originalSize = file.size;
      const compressedSize = compressedFile.size;
      const savings = originalSize > 0
        ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
        : 0;

      // If compression made it bigger (rare), keep the original
      if (compressedSize >= originalSize) {
        return {
          success: true,
          file,
          compressed: false,
          originalSize,
          compressedSize: originalSize,
          savings: 0,
          message: 'Original kept (already optimal)',
        };
      }

      // Preserve original filename with new extension
      const newName = file.name.replace(/\.[^.]+$/, '') + getExtension(fileType);
      const finalFile = new File([compressedFile], newName, {
        type: fileType,
        lastModified: Date.now(),
      });

      return {
        success: true,
        file: finalFile,
        compressed: true,
        originalSize,
        compressedSize,
        savings,
        message: `Compressed from ${formatBytes(originalSize)} to ${formatBytes(compressedSize)} (${savings}% saved)`,
      };
    } catch (error) {
      console.error('Compression error:', error);
      // Fall back to original file if compression fails
      return {
        success: true,
        file,
        compressed: false,
        originalSize: file.size,
        compressedSize: file.size,
        savings: 0,
        message: 'Compression failed, using original',
      };
    }
  };

  /**
   * Compress multiple images.
   */
  const compressMultiple = async (files, options = {}) => {
    const results = [];
    for (const file of files) {
      const res = await compressImage(file, options);
      results.push(res);
    }
    return results;
  };

  return {
    compressImage,
    compressMultiple,
  };
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getExtension(mimeType) {
  const map = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  return map[mimeType] || '.jpg';
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}