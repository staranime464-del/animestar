 export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <div className="relative">
    <div className="absolute inset-0 bg-[#60CC3F]/20 rounded-full group-hover:animate-ping group-hover:opacity-30 transition-all duration-300" />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
      className={`relative text-[#60CC3F] group-hover:text-white group-hover:scale-110 transition-all duration-300 ${props.className || ''}`}
    >
      <path
        fillRule="evenodd"
        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);