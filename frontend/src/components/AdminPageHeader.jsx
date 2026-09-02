function AdminPageHeader({ eyebrow = 'E-Commerce Management', title, actions }) {
  return (
    <header className="h-[76px] border-b border-white/10 bg-[#080b12]/90 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-20">
      <div>
        <p className="text-xs text-gray-500">{eyebrow}</p>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}

export default AdminPageHeader;
