
const Loader = () => {
  // Demo purposes - showing different color
  const loaderColor = "#3B82F6"; // Changed to blue color
  
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50 bg-gray-100">
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="loader h-[20vh] w-[20vh] max-h-96 min-w-96"
      >
        <defs>
          <path
            id="move-path"
            d="M102.546 83.5C109.859 70.8333 128.141 70.8333 135.454 83.5L157.971 122.5C165.284 135.167 156.143 151 141.517 151H96.4833C81.8571 151 72.7158 135.167 80.0289 122.5L102.546 83.5Z"
            fill={loaderColor}
          ></path>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -32"
            ></feColorMatrix>
          </filter>
        </defs>
        <g filter="url(#goo)">
          <circle cx="119" cy="74" r="20" stroke={loaderColor} strokeWidth="8"></circle>
          <circle cx="79" cy="141" r="20" stroke={loaderColor} strokeWidth="8"></circle>
          <circle cx="157" cy="141" r="20" stroke={loaderColor} strokeWidth="8"></circle>
          <circle cx="0" cy="0" r="14" fill={loaderColor}>
            <animateMotion
              path="M102.546 83.5C109.859 70.8333 128.141 70.8333 135.454 83.5L157.971 122.5C165.284 135.167 156.143 151 141.517 151H96.4833C81.8571 151 72.7158 135.167 80.0289 122.5L102.546 83.5Z"
              dur="2s"
              repeatCount="indefinite"
            ></animateMotion>
          </circle>
        </g>
      </svg>
    </div>
  );
};

export default Loader;