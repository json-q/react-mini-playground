interface LazyLoadingProps {
  text?: string;
}

export default function LazyLoading(props: LazyLoadingProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent-foreground border-t-transparent" />
      {props.text && <p className="mt-4 text-center text-foreground">{props.text}</p>}
    </div>
  );
}
