export default function MessageWarning({ message }) {
  if (!message) {
    return null;
  }

  return (
    <>
      <div className="error-message">{message}</div>

      <style>{`
        .error-message {
          padding: 10px 12px;
          border-radius: 8px;

          background: rgba(255, 187, 0, 0.08);
          border: 1px solid rgba(255, 187, 0, 0.08);

          color: #fffa6b;
          font-size: 13px;
          text-align: center;

          backdrop-filter: blur(8px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
