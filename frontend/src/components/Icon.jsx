export default function Icon({ src, clickHandler, tooltip }) {
  return (
    <div className="relative group flex flex-col items-center">
      <img
        src={src}
        alt={tooltip + " Icon"}
        onClick={() => clickHandler(tooltip)}
        style={{ flexShrink: 0 }}
        className="w-5 h-5 cursor-pointer hover:opacity-80 transition"
      />
      <span className="absolute bottom-[-1.5rem] text-xs text-gray-600 bg-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none">
        {tooltip}
      </span>
    </div>
  );
}
