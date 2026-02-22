import React from 'react'

type CardProps = {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card = ({ title, right, children, className = "" }: CardProps) => {
  return (
    <section className={["bg-white rounded-2xl border border-slate-200 shadow-md", className].join(" ")}>
      {(title || right) && (
        <div className="flex items-center justify-between px-6 pt-5">
          {title? <h3 className="text-sm font-semibold text-slate-900">{title}</h3> : <div />}
          {right}
        </div>
      )}
      <div className="px-6 pb-6 pt-4">{children}</div>
    </section>
  );
}

export default Card;