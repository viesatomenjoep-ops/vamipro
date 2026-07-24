export function cldUrl(publicId: string, opts: { w?: number; h?: number } = {}) {
  if (!publicId) return '';
  if (publicId.startsWith('/')) return publicId; // lokaal bestand — niet transformeerbaar

  // Bij zowel breedte als hoogte: bijsnijden naar exact formaat met slim onderwerp-behoud.
  const crop = opts.w && opts.h ? ['c_fill', 'g_auto'] : ['c_fill'];
  const t = ['f_auto', 'q_auto', opts.w && `w_${opts.w}`, opts.h && `h_${opts.h}`, ...crop]
    .filter(Boolean).join(',');

  // Volledige Cloudinary-URL: transformaties injecteren na /upload/
  if (publicId.startsWith('http')) {
    if (publicId.includes('res.cloudinary.com') && publicId.includes('/upload/')) {
      return publicId.replace('/upload/', `/upload/${t}/`);
    }
    return publicId; // externe URL — ongewijzigd laten
  }

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${t}/${publicId}`;
}
