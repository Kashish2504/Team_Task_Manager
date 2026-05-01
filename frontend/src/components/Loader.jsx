export default function Loader({ fullScreen = false }) {
  const spinner = (
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
  );
  if (fullScreen) {
    return <div className="flex items-center justify-center min-h-[60vh]">{spinner}</div>;
  }
  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}