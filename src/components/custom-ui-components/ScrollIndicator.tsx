export default function ScrollIndicator({ color }: { color: string }) {
  return (
    <div className="font-roboto m-0 p-0 text-base align-baseline bg-transparent no-underline absolute bottom-[0px] left-1/2  animate-bounce">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        <circle cx="20" cy="20" r="20" fill={color} />
        <path
          d="M19.4697 28.5303C19.7626 28.8232 20.2374 28.8232 20.5303 28.5303L25.3033 23.7574C25.5962 23.4645 25.5962 22.9896 25.3033 22.6967C25.0104 22.4038 24.5355 22.4038 24.2426 22.6967L20 26.9393L15.7574 22.6967C15.4645 22.4038 14.9896 22.4038 14.6967 22.6967C14.4038 22.9896 14.4038 23.4645 14.6967 23.7574L19.4697 28.5303ZM19.25 10L19.25 28L20.75 28L20.75 10L19.25 10Z"
          fill="white"
        />
      </svg>
    </div>
  );
}
