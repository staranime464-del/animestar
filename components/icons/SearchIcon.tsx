 export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <div className="relative">
    <div className="absolute -inset-2 bg-[#60CC3F]/10 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
      className={`relative text-[#60CC3F] group-hover:text-white group-hover:scale-105 transition-all duration-300 ${props.className || ''}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
);