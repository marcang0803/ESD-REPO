import Icon from './Icon.jsx'

export default function StarRating({ count }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Icon key={index} name="star" size={10} color="#e29578" />
      ))}
    </div>
  );
}
