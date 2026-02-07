export const EmailIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill='none'
      height='27'
      viewBox='0 0 27 27'
      width='27'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <title>File archive icon</title>
      <g filter='url(#filter0_d_967_7266)'>
        <path
          d='M11.4412 12.8666C11.8972 13.2974 12.5004 13.5378 13.1276 13.5387C13.7549 13.5396 14.3588 13.301 14.816 12.8715L23.0806 5.10809C22.785 4.98533 22.4681 4.92205 22.1479 4.92188H4.10103C3.79764 4.92362 3.49722 4.98175 3.21509 5.09333L11.4412 12.8666Z'
          fill='#FF799A'
        />
        <path
          d='M15.9395 14.0676C15.1769 14.7821 14.1705 15.179 13.1255 15.1774C12.0804 15.1759 11.0752 14.7761 10.3146 14.0594L1.96875 6.17452C1.75605 6.54186 1.64294 6.95837 1.64062 7.38284V18.8672C1.64063 19.5199 1.8999 20.1459 2.36142 20.6074C2.82293 21.0689 3.44889 21.3282 4.10157 21.3282H22.1485C22.8012 21.3282 23.4271 21.0689 23.8886 20.6074C24.3502 20.1459 24.6094 19.5199 24.6094 18.8672V7.38284C24.6067 6.97333 24.5003 6.57119 24.3002 6.21389L15.9395 14.0676Z'
          fill='#FF799A'
        />
      </g>
      <defs>
        <filter
          color-interpolation-filters='sRGB'
          filterUnits='userSpaceOnUse'
          height='48.4063'
          id='filter0_d_967_7266'
          width='54.9688'
          x='-14.3594'
          y='-11.0781'
        >
          <feFlood flood-opacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            result='hardAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='8' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
          />
          <feBlend
            in2='BackgroundImageFix'
            mode='normal'
            result='effect1_dropShadow_967_7266'
          />
          <feBlend
            in='SourceGraphic'
            in2='effect1_dropShadow_967_7266'
            mode='normal'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  )
}
