 export const UpArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-[#60CC3F]/10 rounded-full group-hover:bg-[#60CC3F]/20 transition-all duration-300" />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
      className={`relative text-[#60CC3F] group-hover:text-white group-hover:-translate-y-1 transition-all duration-300 ${props.className || ''}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      />
    </svg>
  </div>
);