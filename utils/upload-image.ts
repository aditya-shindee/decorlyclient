import { supabase } from "@/lib/supabase";

export async function uploadImageToStorage(
  base64Image: string,
  fileName: string
): Promise<string> {
  try {
    // Convert base64 to blob
    const base64Data = base64Image.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    
    // Generate a unique file path
    const filePath = `${Date.now()}-${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('empty-room')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('empty-room')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploadisng image:', error);
    throw new Error('Failed to upload image');
  }
} 