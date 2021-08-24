import { CircularProgress } from '@material-ui/core';

const LoadingSpinner = () => (
  <div style={
      {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
  >
    <CircularProgress size={100} />
  </div>
);

export default LoadingSpinner;
