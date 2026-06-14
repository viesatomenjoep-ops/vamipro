export function cldUrl(publicId: string, opts: { w?: number; h?: number } = {}) {
  if (!publicId) return '';
  if (publicId.startsWith('http') || publicId.startsWith('/')) return publicId;
  const t = ['f_auto', 'q_auto', opts.w && `w_${opts.w}`, opts.h && `h_${opts.h}`, 'c_fill']
    .filter(Boolean).join(',');
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${t}/${publicId}`;
}
