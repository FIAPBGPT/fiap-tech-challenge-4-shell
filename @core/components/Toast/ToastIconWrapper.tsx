import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoIosWarning,
  IoIosInformationCircle
} from 'react-icons/io';

const ToastIconWrapper = ({ iconName }: { iconName: string }) => {
  switch(iconName) {
    case 'success':
      return <IoIosCheckmarkCircle color='#3DBD00' data-testid='toast-success-icon' />;
    case 'error':
      return <IoIosCloseCircle color='#FF0000' data-testid='toast-error-icon' />;
    case 'warning':
      return <IoIosWarning color='#DDAA00' data-testid='toast-warning-icon' />;
    case 'info':
      return <IoIosInformationCircle color='#00AAFF' data-testid='toast-info-icon' />;
    default:
      return <></>;
  }
};

ToastIconWrapper.displayName = 'ToastIconWrapper';

export default ToastIconWrapper;
