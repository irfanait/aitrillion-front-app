export default function Button({ children, onClick, type = 'button' }) {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
