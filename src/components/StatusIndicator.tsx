
interface StatusIndicatorProps {
  status: string;
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'emergency':
        return {
          color: 'bg-red-500',
          animation: 'animate-pulse',
          shadow: 'shadow-red-500/50'
        };
      case 'warning':
        return {
          color: 'bg-yellow-500',
          animation: '',
          shadow: 'shadow-yellow-500/50'
        };
      case 'normal':
        return {
          color: 'bg-green-500',
          animation: '',
          shadow: 'shadow-green-500/50'
        };
      default:
        return {
          color: 'bg-gray-500',
          animation: '',
          shadow: 'shadow-gray-500/50'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="relative">
      <div 
        className={`
          w-4 h-4 rounded-full ${config.color} ${config.animation}
          shadow-lg ${config.shadow}
        `}
      />
      {status === 'emergency' && (
        <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-500 animate-ping opacity-75" />
      )}
    </div>
  );
};

export default StatusIndicator;
