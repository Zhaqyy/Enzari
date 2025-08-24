
export const Icon = ({ name, color, size }) => {
    Icon.defaultProps = {
        name: `site`,
        color: "hsl(0, 0%, 0%)",
        size: "50",
      }
    return (
      <svg width={size} viewBox="0 0 1000 500" fill={color}>
        <use href={`/Font/contSprite.svg#${name}`} />
      </svg>
    )
   }