import { Link } from 'react-router-dom';
import InlineLoader from '../InlineLoader.jsx';

const variantClass = (variant) => {
  switch (variant) {
    case 'primary':
      return 'btn btn-primary';
    case 'secondary':
      return 'btn btn-secondary';
    case 'danger':
      return 'btn btn-danger';
    case 'ghost':
    default:
      return 'btn btn-ghost';
  }
};

const Button = ({ 
  to, 
  as = 'button', 
  variant = 'primary', 
  className = '', 
  loading = false,
  children, 
  ...rest 
}) => {
  const classes = `${variantClass(variant)} ${className}`.trim();
  
  const content = loading ? (
    <span className="inline-flex items-center gap-2">
      <InlineLoader size="small" />
      {children}
    </span>
  ) : children;
  
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  const Comp = as;
  return (
    <Comp className={classes} {...rest}>
      {content}
    </Comp>
  );
};

export default Button;
