export default function SectionHeading({
  eyebrow,
  title,
  accent,
  text,
  center = false,
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p className="mb-3 text-xs font-bold tracking-[4px] text-blue-400">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        {title}
        {accent && (
          <span className="block bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            {accent}
          </span>
        )}
      </h2>

      {text && (
        <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
          {text}
        </p>
      )}
    </div>
  );
}
