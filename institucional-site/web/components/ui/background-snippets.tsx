export const Component = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(180deg,var(--bg-top)_0%,var(--bg-mid)_45%,var(--bg-bottom)_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:6rem_4rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_900px_at_8%_18%,var(--radial-1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_760px_at_88%_12%,var(--radial-2),transparent_56%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_820px_at_55%_105%,var(--radial-3),transparent_58%)]" />
    </div>
  );
};
