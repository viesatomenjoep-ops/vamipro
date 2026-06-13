'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

export default function CloudinaryUpload({ 
  value = [], 
  onChange, 
  multiple = false 
}: { 
  value: string[]; 
  onChange: (urls: string[]) => void;
  multiple?: boolean;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'vamipro' })
      });
      const { signature, timestamp, apiKey, cloudName, folder } = await res.json();

      const newUrls = [...value];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await uploadRes.json();
        if (data.secure_url) {
          // Bewaar public_id in de state, want we bouwen later de URL met next-cloudinary
          // Of we bewaren gwn direct de secure_url als de database dat toelaat.
          // De schema zegt: cloudinary_images text[] (public_ids). Dus we bewaren data.public_id!
          newUrls.push(data.public_id);
        }
      }

      onChange(multiple ? newUrls : [newUrls[newUrls.length - 1]]);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Uploaden mislukt');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idToRemove: string) => {
    onChange(value.filter(id => id !== idToRemove));
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((id) => (
            <div key={id} className="relative h-24 w-24 overflow-hidden rounded border border-white/10">
              <img src={`https://res.cloudinary.com/dxcohla4k/image/upload/c_fill,w_100,h_100/${id}`} alt="Preview" className="h-full w-full object-cover" />
              <button type="button" onClick={() => removeImage(id)} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-white/20 bg-white/5 p-4 text-sm text-fg-muted hover:bg-white/10 transition-colors">
        {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
        <span>{uploading ? 'Aan het uploaden...' : 'Upload foto'}</span>
        <input type="file" multiple={multiple} className="hidden" accept="image/*,video/*" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}
