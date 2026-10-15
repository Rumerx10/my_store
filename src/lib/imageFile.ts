// Reads an image the admin picked and returns a data URL, downscaled so the catalog stays light.
// There is no upload backend yet, so images live in the store as data URLs.

const MAX_FILE_BYTES = 15 * 1024 * 1024;

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Couldn't read ${file.name}.`));
    reader.readAsDataURL(file);
  });

export const isImageFile = (file: File) => file.type.startsWith('image/');

export async function readImageFile(file: File, maxSize = 1600): Promise<string> {
  if (!isImageFile(file))
    throw new Error(`${file.name} isn't an image. Use JPG, PNG, WebP or GIF.`);
  if (file.size > MAX_FILE_BYTES) throw new Error(`${file.name} is larger than 15 MB.`);

  // Keep vector art and animations as they are.
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return readAsDataUrl(file);

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    return readAsDataUrl(file);
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  // WebP keeps transparency; browsers without a WebP encoder fall back to JPEG on white.
  let url = canvas.toDataURL('image/webp', 0.86);
  if (!url.startsWith('data:image/webp')) {
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    url = canvas.toDataURL('image/jpeg', 0.88);
  }
  bitmap.close();
  return url;
}
