import { resolveImageUrl } from '../utils/api';

function ProductThumb({ imageUrl, name, className = '' }) {
  const src = resolveImageUrl(imageUrl);

  if (src) {
    return <img src={src} alt={name} className={`object-cover ${className}`} />;
  }

  return (
    <div className={`bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 flex items-center justify-center ${className}`}>
      <span className="font-black text-blue-400/60 text-3xl">{name?.charAt(0).toUpperCase()}</span>
    </div>
  );
}

export default ProductThumb;