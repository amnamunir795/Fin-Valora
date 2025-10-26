export default function Avatar({ user, size = "w-8 h-8" }) {
  if (!user || !user.avatar) {
    // Fallback to initials with default colors
    const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : '??';
    return (
      <div className={`${size} rounded-full bg-[#B5BFC8] flex items-center justify-center`}>
        <span className="text-white font-semibold text-sm">{initials}</span>
      </div>
    );
  }

  const { backgroundColor, textColor, style } = user.avatar;
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

  if (style === "initials") {
    return (
      <div 
        className={`${size} rounded-full flex items-center justify-center font-bold text-sm`}
        style={{ backgroundColor, color: textColor }}
      >
        {initials}
      </div>
    );
  } else if (style === "geometric") {
    return (
      <div 
        className={`${size} rounded-full flex items-center justify-center relative overflow-hidden`}
        style={{ backgroundColor }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rotate-45 border-2" style={{ borderColor: textColor }}></div>
          <div className="w-2 h-2 rounded-full absolute" style={{ backgroundColor: textColor }}></div>
        </div>
      </div>
    );
  } else {
    return (
      <div 
        className={`${size} rounded-full flex items-center justify-center relative overflow-hidden`}
        style={{ backgroundColor }}
      >
        <div className="absolute inset-0">
          <div className="w-2 h-2 rounded-full absolute top-1 left-1" style={{ backgroundColor: textColor, opacity: 0.7 }}></div>
          <div className="w-1.5 h-1.5 rounded-full absolute bottom-1 right-1" style={{ backgroundColor: textColor, opacity: 0.5 }}></div>
          <div className="w-1 h-1 rounded-full absolute top-1/2 right-1/3" style={{ backgroundColor: textColor, opacity: 0.8 }}></div>
        </div>
      </div>
    );
  }
}